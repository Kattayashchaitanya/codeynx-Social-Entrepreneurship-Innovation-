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
  // Stack of snapshots: each entry is { stepIndex, stats, decisions, delayedEffectsQueue }
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
      setDelayedEffectsQueue([]);
      setGameStatus("playing");
      setFailureReason("");
      setActiveMessage(null);
      setPostGameFeedback(null);
      setRewindsLeft(MAX_REWINDS);
      setSnapshotHistory([]);

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
    setDelayedEffectsQueue([]);
    setGameStatus("playing");
    setFailureReason("");
    setActiveMessage(null);
    setPostGameFeedback(null);
    setRewindsLeft(MAX_REWINDS);
    setSnapshotHistory([]);
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
    setDelayedEffectsQueue(lastSnapshot.delayedEffectsQueue);
    setSnapshotHistory(prev => prev.slice(0, -1));
    setRewindsLeft(prev => prev - 1);
    setActiveMessage(null);
  };
  // ──────────────────────────────────────────────────────────────────

  // Calculate robust score
  const calculateScore = (finalStats, isSuccess) => {
    let score = (finalStats.impact * 10) + (finalStats.trust * 5) - (finalStats.risk * 5) + (finalStats.budget / 10000);
    if (!isSuccess) score /= 2;
    return Math.max(0, Math.round(score));
  };

  const saveRunToFirebase = async (isSuccess, finalReason, finalStats, finalDecisions) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const finalScore = calculateScore(finalStats, isSuccess);

      await addDoc(collection(db, "runs"), {
        uid: user.uid,
        playerName: user.displayName || "Unknown Entrepreneur",
        playerEmail: user.email || null,
        mission: currentScenario?.title || "Custom Mission",
        // Save full scenario JSON for Replay feature
        scenarioSnapshot: currentScenario || null,
        initialBudget: initialBudget || 0,
        // Save decision history for After Action Report
        decisionLog: (finalDecisions || []).map(d => ({ step: d.step, text: d.option?.text || d.text || "" })),
        score: finalScore,
        impact: finalStats.impact,
        risk: Math.round(finalStats.risk),
        trust: Math.round(finalStats.trust),
        budget: Math.round(finalStats.budget),
        isSuccess,
        failureReason: finalReason || null,
        timestamp: serverTimestamp()
      });
      console.log("Run saved to Global Leaderboard with full replay data!");
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

  // We capture the current stats/decisions synchronously at invocation time
  // because React state may not have flushed yet when the async function runs.
  const finishSimulation = async (isSuccess, finalReason) => {
    // Snapshot current values immediately before any state updates
    const snapStats = { ...stats };
    const snapDecisions = [...decisions];

    setGameStatus("analyzing_feedback");
    setFailureReason(finalReason || "");

    try {
      const response = await fetch("http://localhost:8080/api/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText: currentScenario?.title || "Custom Mission",
          decisions: snapDecisions.map(d => ({ step: d.step, text: d.option?.text || "" })),
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
    saveRunToFirebase(isSuccess, finalReason, snapStats, snapDecisions);
  };

  // Processing a Decision — pushes snapshot FIRST for undo support
  const makeDecision = (option) => {
    // 1. Push current state snapshot onto history stack before mutating
    setSnapshotHistory(prev => [
      ...prev,
      {
        stepIndex: currentStepIndex,
        stats: { ...stats },
        decisions: [...decisions],
        delayedEffectsQueue: [...delayedEffectsQueue],
      }
    ]);

    // 2. Record Decision
    setDecisions(prev => [...prev, { step: currentStepIndex, option }]);

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

    // 5. Move to next step
    advanceStep();
  };

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
        const errPayload = await response.json();
        throw new Error(errPayload.error || "AI Judging failed.");
      }

      const generatedOption = await response.json();
      setActiveMessage(null);
      makeDecision(generatedOption);

    } catch (error) {
      console.error(error);
      alert(`AI Judge Disabled: ${error.message}`);
      setActiveMessage(null);
    }
  };

  const advanceStep = () => {
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex >= currentScenario.steps.length) {
      finishSimulation(true, null);
      return;
    }

    setCurrentStepIndex(nextIndex);

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

  const dismissMessage = () => setActiveMessage(null);

  const restart = () => {
    setGameStatus("setup");
    setSnapshotHistory([]);
    setRewindsLeft(MAX_REWINDS);
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
        gameStatus,
        failureReason,
        activeMessage,
        postGameFeedback,
        rewindsLeft,
        snapshotHistory,
        backtrack,
        replaySimulation,
        executeCustomAction,
        startSimulation,
        makeDecision,
        dismissMessage,
        restart,
        restartSimulation: restart
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
