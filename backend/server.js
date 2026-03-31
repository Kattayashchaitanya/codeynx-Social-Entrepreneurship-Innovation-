require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── UTILS ───────────────────────────────────────────────────────────────────

/**
 * Robustly extracts and parses JSON from AI response.
 * Handles markdown backticks, conversational preamble, etc.
 */
function extractJSON(text) {
  try {
    // Find the first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No JSON object found in response.");
    
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("JSON EXTRACTION FAILED:", err.message);
    console.error("RAW AI OUTPUT:", text);
    throw err;
  }
}

// ─── API ROUTES ──────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MindSpring API is running smoothly.' });
});

app.post('/api/generate-scenario', async (req, res) => {
  try {
    const { missionText, stakeholders, budget } = req.body;

    if (!missionText) {
      return res.status(400).json({ error: "missionText is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the backend server." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the AI engine for 'MindSpring', a Reflective Social Entrepreneurship Simulation Game.
The user has provided the following mission and parameters:
Mission: "${missionText}"
Stakeholders: ${stakeholders.join(', ')}
Starting Budget: ₹${Number(budget).toLocaleString()} (Do not use this for flat subtraction, use percentages).

Generate a dynamic 7-to-10-step interactive narrative scenario exactly matching the JSON schema below.
CRITICAL RULES:
1. "budgetPercentage" determines the percentage of the starting budget affected. (e.g., -10 means the player loses 10% of their starting budget; 5 means they gain 5%).
2. "impact", "risk", and "trust" are flat numbers added/subtracted (e.g., 10, -15).
3. "stakeholderReactions" MUST be included for every single option. Each reaction should be a 1-sentence response from every stakeholder listed above.
4. "crisisEvent" should be injected at the root of 1 random step (except the first and last).
5. "governmentPolicy" should be injected at the root of 1 or 2 steps where regulatory context fits.
6. Delayed Consequences are randomly placed. 'stepToTriggerOn' must be a later step index (between 2 and 10).
7. Return ONLY valid JSON. No markdown backticks, no markdown blocks, just the raw JSON object.
8. CRITICAL: Do NOT include ANY statistical numbers, impact markers, or math (e.g., "+30", "Impact +10", "Trust +5") inside the "text" field of the options. The narrative should describe the action, not the result. The player should make choices based on narrative consequence, not just chasing numbers.

FORMAT:
{
  "id": "custom",
  "title": "A short, catchy title based on the mission",
  "description": "A 2-3 sentence overview of the challenge.",
  "stakeholders": ["the stakeholders provided"],
  "startingStats": { "impact": 5, "budget": 100, "risk": 20, "trust": 30 },
  "steps": [
    {
      "id": "step_1",
      "question": "Narrative situation requiring a choice involving the mission.",
      "governmentPolicy": null OR { "title": "...", "description": "...", "impactSummary": "..." },
      "crisisEvent": null OR {
        "title": "...", 
        "description": "...", 
        "effects": { "impact": -5, "risk": 15, "trust": -10, "budgetPercentage": -5 }
      },
      "options": [
        {
          "id": "opt_1",
          "text": "The choice description (purely narrative, no impact stats here)",
          "effects": { "impact": 10, "budgetPercentage": -15, "risk": 5, "trust": 10 },
          "stakeholderReactions": {
            "Government": "...",
            "Local Community": "...",
            "NGO Partners": "..."
          },
          "delayedEffect": null 
        }
      ]
    }
  ]
}

Ensure there are strictly between 7 and 10 steps, with 2 or 3 options per step.
`;
    
    // Call Gemini!
    let parsedData;
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      parsedData = extractJSON(output);
      console.log(`AI Scenario Successfully Generated: ${parsedData.title}`);
    } catch (aiError) {
      console.error("AI GENERATION ERROR:", aiError.message);
      
      // Select randomized fallback
      const fallbacks = [
        {
          id: "fallback_01",
          title: "The Pilot Launch Challenge (Procedural)",
          description: "Your mission faces early resistance. You must choose how to deploy your first batch of resources.",
          stakeholders: stakeholders,
          startingStats: { impact: 10, budget: 100, risk: 15, trust: 25 },
          steps: [
            {
              id: "step_1",
              question: "Phase 1: Initial deployment of capital. How do you choose to deploy your first batch of resources?",
              options: [
                { id: "opt_1", text: "Spend aggressively on high-end infrastructure.", effects: { impact: 25, budgetPercentage: -30, risk: 10, trust: 5 }, stakeholderReactions: { "Government": "Fast progress, but show us the receipts.", "Local Community": "We like the speed!" }, delayedEffect: null },
                { id: "opt_2", text: "Invest slowly in local staff training first.", effects: { impact: 5, budgetPercentage: -10, risk: -15, trust: 20 }, stakeholderReactions: { "Government": "Prudent data-driven approach.", "Local Community": "Finally, someone investing in us." }, delayedEffect: null }
              ]
            },
            {
              id: "step_2",
              question: "Phase 2: Local leaders represent concerns about long-term sustainability. What is your response?",
              options: [
                { id: "opt_1", text: "Create a community-run advisory board.", effects: { impact: 10, budgetPercentage: -5, risk: -5, trust: 30 }, stakeholderReactions: { "Government": "Excellent local governance.", "Local Community": "We feel heard, thank you." }, delayedEffect: null },
                { id: "opt_2", text: "Keep decision-making centralized for speed.", effects: { impact: 20, budgetPercentage: 0, risk: 15, trust: -20 }, stakeholderReactions: { "Government": "Efficiency is key.", "Local Community": "You act like an outsider." }, delayedEffect: null }
              ]
            }
            // ... truncated for brevity in this tool call, but I will include all 10 in the actual file if needed
            // Actually, I'll provide the full file to be safe.
          ]
        }
      ];

      // Re-fill the fallbacks with full 10-step arcs to keep the user's previous request satisfied.
      const fullFallback01 = {
        id: "fallback_01",
        title: "The Pilot Launch Challenge (Procedural)",
        description: "Your mission faces early resistance. You must choose how to deploy your first batch of resources.",
        stakeholders: stakeholders,
        startingStats: { impact: 10, budget: 100, risk: 15, trust: 25 },
        steps: [
          {
            id: "step_1",
            question: "Phase 1: Initial deployment of capital.",
            options: [
              { id: "opt_1", text: "Spend aggressively on high-end infrastructure.", effects: { impact: 25, budgetPercentage: -30, risk: 10, trust: 5 }, stakeholderReactions: { "Government": "Fast progress, but show us the receipts.", "Local Community": "We like the speed!" } },
              { id: "opt_2", text: "Invest slowly in local staff training first.", effects: { impact: 5, budgetPercentage: -10, risk: -15, trust: 20 }, stakeholderReactions: { "Government": "Prudent data-driven approach.", "Local Community": "Finally, someone investing in us." } }
            ]
          },
          {
            id: "step_2",
            question: "Phase 2: Local leaders represent concerns about long-term sustainability.",
            options: [
              { id: "opt_1", text: "Create a community-run advisory board.", effects: { impact: 10, budgetPercentage: -5, risk: -5, trust: 30 }, stakeholderReactions: { "Government": "Excellent local governance.", "Local Community": "We feel heard, thank you." } },
              { id: "opt_2", text: "Keep decision-making centralized for speed.", effects: { impact: 20, budgetPercentage: 0, risk: 15, trust: -20 }, stakeholderReactions: { "Government": "Efficiency is key.", "Local Community": "You act like an outsider." } }
            ]
          },
          {
            id: "step_3",
            question: "Phase 3: An unexpected supply chain disruption hits your primary vendor.",
            crisisEvent: { title: "Vendor Bankruptcy", description: "Your main equipment supplier has filed for Chapter 11.", effects: { impact: -10, risk: 15, trust: -5, budgetPercentage: -5 } },
            options: [
              { id: "opt_1", text: "Pay for an expensive, immediate local alternative.", effects: { impact: 5, budgetPercentage: -20, risk: -10, trust: 15 }, stakeholderReactions: { "Government": "Smart mitigation.", "Local Community": "Supporting local business is good." } },
              { id: "opt_2", text: "Wait for the legal resolution of the bankruptcy.", effects: { impact: -15, budgetPercentage: 0, risk: 20, trust: -10 }, stakeholderReactions: { "Government": "Slow response time.", "Local Community": "The help isn't coming." } }
            ]
          },
          {
            id: "step_4",
            question: "Phase 4: Scaling up. A major investor offers a massive funding round.",
            options: [
              { id: "opt_1", text: "Accept the funding and pivot toward volume.", effects: { impact: 35, budgetPercentage: 50, risk: 20, trust: -15 }, stakeholderReactions: { "Government": "Good for the regional economy.", "Local Community": "Are we just numbers to you now?" } },
              { id: "opt_2", text: "Reject the funding to preserve purely social goals.", effects: { impact: 15, budgetPercentage: -10, risk: -20, trust: 35 }, stakeholderReactions: { "Government": "Noble, but potentially unstable.", "Local Community": "We trust your mission completely." } }
            ]
          },
          {
            id: "step_5",
            question: "Phase 5: Internal conflict. Your lead manager wants to prioritize higher-paying urban clients.",
            options: [
              { id: "opt_1", text: "Pivot to urban clients to cross-subsidize rural work.", effects: { impact: 5, budgetPercentage: 25, risk: 10, trust: -10 }, stakeholderReactions: { "Government": "Sustainable business model.", "Local Community": "You are forgetting us." } },
              { id: "opt_2", text: "Refuse and stay 100% focused on the marginalized.", effects: { impact: 20, budgetPercentage: -15, risk: -5, trust: 25 }, stakeholderReactions: { "Government": "High-risk social play.", "Local Community": "Loyalty is everything." } }
            ]
          },
          {
            id: "step_6",
            question: "Phase 6: A local university offers to partner for a randomized control trial.",
            options: [
              { id: "opt_1", text: "Participate to get high-fidelity data.", effects: { impact: 0, budgetPercentage: -5, risk: -5, trust: 10 }, stakeholderReactions: { "Government": "Data is power.", "Local Community": "Are we lab rats?" } },
              { id: "opt_2", text: "Decline and use those resources for direct aid.", effects: { impact: 15, budgetPercentage: -5, risk: 5, trust: 5 }, stakeholderReactions: { "Government": "How will we prove this works?", "Local Community": "Thank you for the direct help." } }
            ]
          },
          {
            id: "step_7",
            question: "Phase 7: A neighboring province asks you to replicate the project immediately.",
            options: [
              { id: "opt_1", text: "Scale fast and hire a second team.", effects: { impact: 30, budgetPercentage: -40, risk: 35, trust: 10 }, stakeholderReactions: { "Government": "Impressive spread.", "Local Community": "Don't spread yourself too thin." } },
              { id: "opt_2", text: "Refuse scale until local operations are perfect.", effects: { impact: 5, budgetPercentage: 5, risk: -15, trust: 10 }, stakeholderReactions: { "Government": "Cautious.", "Local Community": "We appreciate the focus." } }
            ]
          },
          {
            id: "step_8",
            question: "Phase 8: New regulatory compliance mandates strict environmental reporting.",
            governmentPolicy: { title: "Green Social Act", description: "Social ventures must report carbon footprint yearly.", impactSummary: "Increases risk but improves trust." },
            options: [
              { id: "opt_1", text: "Hire a dedicated compliance officer.", effects: { impact: 0, budgetPercentage: -15, risk: -25, trust: 15 }, stakeholderReactions: { "Government": "Perfect compliance.", "Local Community": "More money on bureaucracy." } },
              { id: "opt_2", text: "Use existing staff to keep costs low.", effects: { impact: 5, budgetPercentage: 0, risk: 20, trust: -10 }, stakeholderReactions: { "Government": "Risk of legal action.", "Local Community": "Focusing on the work instead of reports." } }
            ]
          },
          {
            id: "step_9",
            question: "Phase 9: A local disaster strikes a nearby village.",
            options: [
              { id: "opt_1", text: "Pivot 50% of operation to immediate relief.", effects: { impact: 50, budgetPercentage: -25, risk: 10, trust: 40 }, stakeholderReactions: { "Government": "Heroic intervention.", "Local Community": "Our brothers are being saved!" } },
              { id: "opt_2", text: "Stick to the core mission to ensure long-term stability.", effects: { impact: 10, budgetPercentage: 5, risk: -10, trust: -20 }, stakeholderReactions: { "Government": "Measured and disciplined.", "Local Community": "Where is the empathy?" } }
            ]
          },
          {
            id: "step_10",
            question: "Phase 10: Final Legacy. How do you hand over the project for the long term?",
            options: [
              { id: "opt_1", text: "Transform into a community-owned cooperative.", effects: { impact: 30, budgetPercentage: -10, risk: -20, trust: 50 }, stakeholderReactions: { "Government": "Sustainable model.", "Local Community": "This belongs to us now." } },
              { id: "opt_2", text: "Sell to a larger NGO to ensure professional management.", effects: { impact: 50, budgetPercentage: 10, risk: -30, trust: -10 }, stakeholderReactions: { "Government": "Great partnership.", "Local Community": "The founders are leaving us." } }
            ]
          }
        ]
      };

      parsedData = fullFallback01; // Defaulting to the robust one for safety
      console.warn("Using Procedural Fallback scenario:", parsedData.title);
    }
    
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: `Server Error: ${err.message}` });
  }
});

app.post('/api/judge-action', async (req, res) => {
  try {
    const { missionText, currentQuestion, userAction } = req.body;

    if (!userAction) return res.status(400).json({ error: "userAction is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the AI engine for 'MindSpring', a Reflective Social Entrepreneurship Simulator.
The player has typed a custom action instead of picking standard choices. You must act as the Game Master and judge the mathematical and narrative consequences of their text.

Mission Scope: "${missionText}"
Current Scenario Question: "${currentQuestion}"
Player's Typed Action: "${userAction}"

Analyze what the player typed. If it is a good idea, reward them. If it is foolish, reckless, or unrealistic, punish them.
Strictly return a minified JSON object exactly matching this schema:
{
  "id": "custom_opt",
  "text": "[The Player's Typed Action Summarized in 1 sentence. Do NOT include impact stats like +10 or Trust+5 here]",
  "effects": {
    "impact": [Number between -30 and 40],
    "budgetPercentage": [Number between -50 and 50 representing percentage of budget lost/gained],
    "risk": [Number between -20 and 50],
    "trust": [Number between -30 and 40]
  },
  "stakeholderReactions": {
    "Government": "[1-sentence reaction]",
    "Local Community": "[1-sentence reaction]",
    "NGO Partners": "[1-sentence reaction]"
  },
  "delayedEffect": null OR {
    "stepToTriggerOn": [Any number between 2 and 10],
    "effect": {
       "impact": [Number], "trust": [Number], "risk": [Number], "budgetPercentage": [Number],
       "message": "[A short sentence describing a future consequence of their custom action]"
    }
  }
}
CRITICAL RULE: NEVER include numerical markers (e.g. +30, Impact +5) in the 'text' field.
`;
    
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      const parsedData = extractJSON(output);
      res.status(200).json(parsedData);
    } catch (aiError) {
      console.error("AI JUDGE ERROR:", aiError.message);
      res.status(200).json({
        id: "custom_opt",
        text: userAction.substring(0, 50) + "...",
        effects: { impact: 5, budgetPercentage: -5, risk: 10, trust: 5 },
        stakeholderReactions: { "Government": "We are observing this play out.", "Local Community": "We need to see results first." },
        delayedEffect: null
      });
    }
  } catch (err) {
    console.error("SERVER ERROR JUDGING CHOICE:", err);
    res.status(500).json({ error: `Server Error judging choice: ${err.message}` });
  }
});

app.post('/api/generate-feedback', async (req, res) => {
  try {
    const { missionText, decisions, finalStats, isSuccess } = req.body;

    if (!decisions) return res.status(400).json({ error: "decisions array is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the AI Game Master for 'MindSpring', a Social Entrepreneurship Simulator.
The player just finished their mission. You must analyze their decisions and generate an After Action Report.

Mission Scope: "${missionText}"
Did they succeed?: ${isSuccess ? 'Yes' : 'No'}
Final Stats - Impact: ${finalStats.impact}, Risk: ${finalStats.risk}%, Trust: ${finalStats.trust}%, Remaining Budget: ${finalStats.budget}
Timeline of Decisions Made:
${JSON.stringify(decisions, null, 2)}

Provide a deeply insightful, brutally honest breakdown of their performance.
Strictly return a JSON object exactly matching this schema:
{
  "summary": "[A 2-3 sentence overarching summary of how their leadership steered the mission]",
  "strengths": ["[Strength 1 based on a specific good choice they made]", "[Strength 2]"],
  "mistakes": ["[Mistake 1 based on a specific poor/risky choice they made]", "[Mistake 2]"],
  "societalImpact": "[A vivid 2-3 sentence description of what the local society looks like now as a direct result of their actions]"
}
CRITICAL RULE: Return ONLY valid JSON. No markdown backticks.
`;
    
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      const parsedData = extractJSON(output);
      res.status(200).json(parsedData);
    } catch (aiError) {
      console.error("AI FEEDBACK ERROR:", aiError.message);
      res.status(200).json({
        summary: "Your leadership steered the initiative through its phases.",
        strengths: ["Decisive action.", "Goal focus."],
        mistakes: ["Resource management could be optimized."],
        societalImpact: "A new baseline has been established in the community."
      });
    }
  } catch (err) {
    console.error("SERVER ERROR FEEDBACK:", err);
    res.status(500).json({ error: `Server Error feedback: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server started successfully on http://localhost:${PORT}`);
});
