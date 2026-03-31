import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {

  // Global Game State
  const [currentScenario, setCurrentScenario] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    impact: 0,
    budget: 0,
    risk: 0,
    trust: 0,
  });

  // Flow State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [delayedEffectsQueue, setDelayedEffectsQueue] = useState([]);
  
  // ─── ADVANCED STATE ────────────────────────────────────────────────
  const [confidenceLog, setConfidenceLog] = useState([]);
  const [currentCrisis, setCurrentCrisis] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [lastReactions, setLastReactions] = useState(null);
  // ──────────────────────────────────────────────────────────────────

  // Game Status: 'setup', 'generating', 'playing', 'analyzing_feedback', 'success', 'failure'
  const [gameStatus, setGameStatus] = useState("setup");
  const [failureReason, setFailureReason] = useState("");
  
  // Keep track of the absolute starting budget to recalculate percentages
  const [initialBudget, setInitialBudget] = useState(0);

  // UI State
  const [activeMessage, setActiveMessage] = useState(null);
  const [postGameFeedback, setPostGameFeedback] = useState(null);

  // ─── BACKTRACKING STATE ────────────────────────────────────────────
  const MAX_REWINDS = 2;
  const [rewindsLeft, setRewindsLeft] = useState(MAX_REWINDS);
  // Stack of snapshots: each entry is { stepIndex, stats, decisions, delayedEffectsQueue, confidenceLog }
  const [snapshotHistory, setSnapshotHistory] = useState([]);
  // ──────────────────────────────────────────────────────────────────

  // Initialization
  const startSimulation = async (missionText, selectedStakeholders, startingBudget) => {
    setGameStatus("generating");
    setInitialBudget(startingBudget);

    try {
      const response = await fetch("http://localhost:8080/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText,
          stakeholders: selectedStakeholders,
          budget: startingBudget
        })
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "Failed to generate mission via AI API.");
      }

      const generatedScenario = await response.json();
      
      setCurrentScenario(generatedScenario);
      setStakeholders(selectedStakeholders);
      
      setStats({
        ...generatedScenario.startingStats,
        budget: startingBudget
      });
      
      setCurrentStepIndex(0);
      setDecisions([]);
      setConfidenceLog([]);
      setDelayedEffectsQueue([]);
      setGameStatus("playing");
      setFailureReason("");
      setActiveMessage(null);
      setPostGameFeedback(null);
      setRewindsLeft(MAX_REWINDS);
      setSnapshotHistory([]);
      setCurrentCrisis(null);
      setShowReactions(false);
      setLastReactions(null);

    } catch (error) {
      console.error(error);
      alert(`AI Engine Disabled: ${error.message}`);
      setGameStatus("setup");
    }
  };

  // ─── REPLAY an old run directly from Dashboard ─────────────────────
  const replaySimulation = (savedScenario, startingBudget, navigate) => {
    setCurrentScenario(savedScenario);
    setInitialBudget(startingBudget);
    setStats({
      ...savedScenario.startingStats,
      budget: startingBudget
    });
    setCurrentStepIndex(0);
    setDecisions([]);
    setConfidenceLog([]);
    setDelayedEffectsQueue([]);
    setGameStatus("playing");
    setFailureReason("");
    setActiveMessage(null);
    setPostGameFeedback(null);
    setRewindsLeft(MAX_REWINDS);
    setSnapshotHistory([]);
    setCurrentCrisis(null);
    setShowReactions(false);
    setLastReactions(null);
    navigate("/simulation");
  };
  // ──────────────────────────────────────────────────────────────────

  // ─── BACKTRACK: Undo last decision ────────────────────────────────
  const backtrack = () => {
    if (rewindsLeft <= 0 || snapshotHistory.length === 0) return;

    const lastSnapshot = snapshotHistory[snapshotHistory.length - 1];
    setCurrentStepIndex(lastSnapshot.stepIndex);
    setStats(lastSnapshot.stats);
    setDecisions(lastSnapshot.decisions);
    setConfidenceLog(lastSnapshot.confidenceLog || []);
    setDelayedEffectsQueue(lastSnapshot.delayedEffectsQueue);
    setSnapshotHistory(prev => prev.slice(0, -1));
    setRewindsLeft(prev => prev - 1);
    setActiveMessage(null);
    setShowReactions(false);
    setLastReactions(null);
  };
  // ──────────────────────────────────────────────────────────────────

  // Calculate robust score
  const calculateScore = (finalStats, isSuccess) => {
    let score = (finalStats.impact * 10) + (finalStats.trust * 5) - (finalStats.risk * 5) + (finalStats.budget / 10000);
    if (!isSuccess) score /= 2;
    return Math.max(0, Math.round(score));
  };

  const saveRunToFirebase = async (isSuccess, finalReason, finalStats, finalDecisions, finalConfidence) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const finalScore = calculateScore(finalStats, isSuccess);

      await addDoc(collection(db, "runs"), {
        uid: user.uid,
        playerName: user.displayName || "Unknown Entrepreneur",
        playerEmail: user.email || null,
        mission: currentScenario?.title || "Custom Mission",
        scenarioSnapshot: currentScenario || null,
        initialBudget: initialBudget || 0,
        decisionLog: (finalDecisions || []).map(d => ({ step: d.step, text: d.option?.text || d.text || "" })),
        confidenceLog: finalConfidence || [],
        score: finalScore,
        impact: finalStats.impact,
        risk: Math.round(finalStats.risk),
        trust: Math.round(finalStats.trust),
        budget: Math.round(finalStats.budget),
        isSuccess,
        failureReason: finalReason || null,
        timestamp: serverTimestamp()
      });
      console.log("Run saved to Global Leaderboard!");
    } catch (err) {
      console.error("Failed to save run to Firebase:", err);
    }
  };

  // Checking Failure Conditions
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (stats.budget < 0) {
      failSimulation("You ran out of budget! Without funds, your initiative collapsed.");
    } else if (stats.risk >= 100) {
      failSimulation("The risks became too high! The administration forcefully shut down your operation.");
    } else if (stats.trust <= 0) {
      failSimulation("You lost all trust from your stakeholders. No one supports your initiative anymore.");
    }
  }, [stats, gameStatus]);

  const failSimulation = (reason) => {
    finishSimulation(false, reason);
  };

  const finishSimulation = async (isSuccess, finalReason) => {
    const snapStats = { ...stats };
    const snapDecisions = [...decisions];
    const snapConfidence = [...confidenceLog];

    setGameStatus("analyzing_feedback");
    setFailureReason(finalReason || "");

    try {
      const response = await fetch("http://localhost:8080/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText: currentScenario?.title || "Custom Mission",
          decisions: snapDecisions.map(d => ({ step: d.step, text: d.option?.text || "" })),
          confidenceLog: snapConfidence,
          finalStats: snapStats,
          isSuccess
        })
      });

      if (response.ok) {
        const feedbackData = await response.json();
        setPostGameFeedback(feedbackData);
      } else {
        console.warn("Feedback generation failed passively.");
      }
    } catch (err) {
      console.error("Feedback fetch exception:", err);
    }

    setGameStatus(isSuccess ? "success" : "failure");
    saveRunToFirebase(isSuccess, finalReason, snapStats, snapDecisions, snapConfidence);
  };

  // ─── THE CORE DECISION LOOP ─────────────────────────────────────────

  // Phase 1: Capture Decision (immediate stats, show reactions)
  const makeDecision = (option, confidence) => {
    // 1. Snapshot for backtrack
    setSnapshotHistory(prev => [
      ...prev,
      {
        stepIndex: currentStepIndex,
        stats: { ...stats },
        decisions: [...decisions],
        confidenceLog: [...confidenceLog],
        delayedEffectsQueue: [...delayedEffectsQueue],
      }
    ]);

    // 2. Record Decision & Confidence
    setDecisions(prev => [...prev, { 
      step: currentStepIndex, 
      option,
      actionText: option.text,
      allOptions: currentScenario.steps[currentStepIndex].options, // for WhatIfExplorer
      statsAtTime: { ...stats } // for charts
    }]);

    if (confidence) {
      setConfidenceLog(prev => [...prev, { step: currentStepIndex, level: confidence }]);
    }

    // 3. Apply Immediate Effects
    setStats((prev) => {
      let budgetMod = option.effects.budgetPercentage 
        ? (initialBudget * (option.effects.budgetPercentage / 100))
        : (option.effects.budget || 0);

      return {
        impact: Math.max(0, prev.impact + (option.effects.impact || 0)),
        budget: prev.budget + budgetMod,
        risk: Math.max(0, prev.risk + (option.effects.risk || 0)),
        trust: Math.max(0, Math.min(100, prev.trust + (option.effects.trust || 0)))
      };
    });

    // 4. Queue Delayed Effects if any
    if (option.delayedEffect) {
      setDelayedEffectsQueue(prev => [...prev, option.delayedEffect]);
    }

    // 5. Show Reactions Phase
    setLastReactions(option.stakeholderReactions || null);
    setShowReactions(true);
  };

  // Phase 2: Confirm Transition to next step
  const confirmReaction = () => {
    setShowReactions(false);
    advanceStep();
  };

  const advanceStep = () => {
    const nextIndex = currentStepIndex + 1;
    
    // Check if end of simulation
    if (nextIndex >= currentScenario.steps.length) {
      finishSimulation(true, null);
      return;
    }

    // Move to next step
    setCurrentStepIndex(nextIndex);

    // Check for Crisis Injection in the incoming step root
    const incomingStep = currentScenario.steps[nextIndex];
    if (incomingStep.crisisEvent) {
       setCurrentCrisis(incomingStep.crisisEvent);
       
       // Apply Crisis Effects immediately
       const ce = incomingStep.crisisEvent;
       setStats(prev => {
         let budgetMod = ce.effects.budgetPercentage 
           ? (initialBudget * (ce.effects.budgetPercentage / 100))
           : (ce.effects.budget || 0);

         return {
           impact: Math.max(0, prev.impact + (ce.effects.impact || 0)),
           budget: prev.budget + budgetMod,
           risk: Math.max(0, prev.risk + (ce.effects.risk || 0)),
           trust: Math.max(0, Math.min(100, prev.trust + (ce.effects.trust || 0)))
         };
       });
    }

    // Process Delayed Effects
    const triggeredEffects = delayedEffectsQueue.filter(
      (effect) => effect.stepToTriggerOn === nextIndex
    );
    
    if (triggeredEffects.length > 0) {
      let impactMod = 0;
      let budgetMod = 0;
      let riskMod = 0;
      let trustMod = 0;
      let messages = [];

      triggeredEffects.forEach((eff) => {
        impactMod += eff.effect.impact || 0;
        
        if (eff.effect.budgetPercentage) {
           budgetMod += (initialBudget * (eff.effect.budgetPercentage / 100));
        } else if (eff.effect.budget) {
           budgetMod += eff.effect.budget;
        }

        riskMod += eff.effect.risk || 0;
        trustMod += eff.effect.trust || 0;
        if (eff.effect.message) messages.push(eff.effect.message);
      });

      setStats((prev) => ({
         impact: Math.max(0, prev.impact + impactMod),
         budget: prev.budget + budgetMod,
         risk: Math.max(0, prev.risk + riskMod),
         trust: Math.max(0, Math.min(100, prev.trust + trustMod))
      }));

      setActiveMessage(messages.join(" "));

      setDelayedEffectsQueue(prev =>
        prev.filter(eff => eff.stepToTriggerOn !== nextIndex)
      );
    }
  };

  // ─── CUSTOM ACTION HANDLER ──────────────────────────────────────────
  const executeCustomAction = async (customText, currentQuestion) => {
    setActiveMessage("The AI Game Master is currently calculating the mathematical impact of your custom decision...");
    
    try {
      const response = await fetch("http://localhost:8080/api/judge-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText: currentScenario.title || "Custom Mission",
          currentQuestion,
          userAction: customText
        })
      });

      if (!response.ok) {
        throw new Error("AI Judging failed.");
      }

      const generatedOption = await response.json();
      setActiveMessage(null);
      // Custom actions use "Medium" confidence by default
      makeDecision(generatedOption, "Medium");

    } catch (error) {
      console.error(error);
      alert(`AI Judge Disabled: ${error.message}`);
      setActiveMessage(null);
    }
  };

  const dismissCrisis = () => {
    if (currentCrisis) {
      setStats(prev => {
         let budgetMod = currentCrisis.effects.budgetPercentage 
           ? (initialBudget * (currentCrisis.effects.budgetPercentage / 100))
           : (currentCrisis.effects.budget || 0);

         return {
            impact: Math.max(0, prev.impact + (currentCrisis.effects.impact || 0)),
            budget: prev.budget + budgetMod,
            risk: Math.max(0, prev.risk + (currentCrisis.effects.risk || 0)),
            trust: Math.max(0, Math.min(100, prev.trust + (currentCrisis.effects.trust || 0)))
         };
      });
      setCurrentCrisis(null);
    }
  };

  const dismissMessage = () => setActiveMessage(null);

  const restart = () => {
    setGameStatus("setup");
    setSnapshotHistory([]);
    setRewindsLeft(MAX_REWINDS);
    setCurrentCrisis(null);
    setShowReactions(false);
  };

  return (
    <SimulationContext.Provider
      value={{
        currentScenario,
        initialBudget,
        stakeholders,
        stats,
        currentStepIndex,
        decisions,
        confidenceLog,
        gameStatus,
        failureReason,
        activeMessage,
        postGameFeedback,
        rewindsLeft,
        snapshotHistory,
        currentCrisis,
        showReactions,
        lastReactions,
        backtrack,
        replaySimulation,
        executeCustomAction,
        startSimulation,
        makeDecision,
        confirmReaction,
        dismissCrisis,
        dismissMessage,
        restart,
        restartSimulation: restart
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

