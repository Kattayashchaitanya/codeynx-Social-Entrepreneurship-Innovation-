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

function extractJSON(text) {
  try {
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

    if (!missionText) return res.status(400).json({ error: "missionText is required" });

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the backend server." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the AI engine for 'MindSpring', a Reflective Social Entrepreneurship Simulation.
The user's mission: "${missionText}"
Stakeholders: ${stakeholders.join(', ')}
Starting Budget: ₹${Number(budget).toLocaleString()}

Generate a 10-step interactive narrative scenario exactly matching the JSON schema below.
CRITICAL RULES for Variety:
1. Every mission must be unique. Do NOT use generic text. Incorporate the mission's domain (e.g., healthcare, education, water) deeply into the narrative.
2. "budgetPercentage": Percentage of starting budget (e.g., -10 = loss of 10%, 5 = gain of 5%).
3. "stakeholderReactions": 1-sentence reaction for EVERY stakeholder listed above for EVERY option.
4. "crisisEvent": Root of 1 random step (except 1st/last).
5. "governmentPolicy": Root of 1 or 2 steps.
6. Delayed Consequences: 'stepToTriggerOn' between 2 and 10.
7. CRITICAL: NEVER include numerical markers (e.g. +30, Trust +5) in the 'text' field.
8. RETURN RAW JSON ONLY.

SCHEMA:
{
  "id": "custom",
  "title": "...",
  "description": "...",
  "stakeholders": ["..."],
  "startingStats": { "impact": 5, "budget": 100, "risk": 20, "trust": 30 },
  "steps": [
    {
      "id": "step_1",
      "question": "...",
      "governmentPolicy": null,
      "crisisEvent": null,
      "options": [
        {
          "id": "opt_1",
          "text": "...",
          "effects": { "impact": 10, "budgetPercentage": -15, "risk": 5, "trust": 10 },
          "stakeholderReactions": { "Government": "...", "Local Community": "..." },
          "delayedEffect": null 
        }
      ]
    }
  ]
}
`;
    
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      const parsedData = extractJSON(output);
      console.log(`AI Scenario Successfully Generated: ${parsedData.title}`);
      return res.status(200).json(parsedData);
    } catch (aiError) {
      console.error("AI GENERATION ERROR:", aiError.message);
      
      const fallbacks = [
        {
          id: "fallback_launch",
          title: "The Pilot Launch Challenge",
          description: "Your mission faces early resistance. You must choose how to deploy your first batch of resources.",
          stakeholders: stakeholders,
          startingStats: { impact: 10, budget: 100, risk: 15, trust: 25 },
          steps: Array.from({ length: 10 }, (_, i) => ({
            id: `step_${i+1}`,
            question: `Phase ${i+1}: ${[
              "Capital deployment: How do you allocate your first ₹10Lac?",
              "Community concerns: Traditional leaders are skeptical of your tech.",
              "Supply Chain: A vendor goes bankrupt during peak delivery.",
              "Scaling Up: An investor offers a loan with massive interest.",
              "Staff Burnout: Your lead operator wants to quit for a corporate job.",
              "Regulatory: New tax laws affect social ventures.",
              "Impact Data: A study shows your results are slower than expected.",
              "Publicity: A famous influencer wants to visit. Is it a distraction?",
              "Expansion: Replicate the module in the next village or stay firm?",
              "The Legacy: Hand over the keys to a community trust or a global NGO?"
            ][i]}`,
            options: [
              { id: "opt_1", text: "Choose Path A: Aggressive Growth", effects: { impact: 20, budgetPercentage: -20, risk: 20, trust: 5 }, stakeholderReactions: { "Government": "Fast but messy.", "Local Community": "Impressive speed." } },
              { id: "opt_2", text: "Choose Path B: Sustainable Quality", effects: { impact: 5, budgetPercentage: -5, risk: -10, trust: 15 }, stakeholderReactions: { "Government": "Stable.", "Local Community": "We trust you." } }
            ]
          }))
        },
        {
          id: "fallback_crisis",
          title: "The Resource Scarcity Challenge",
          description: "Internal and external forces are draining your budget faster than expected.",
          stakeholders: stakeholders,
          startingStats: { impact: 5, budget: 100, risk: 30, trust: 20 },
          steps: Array.from({ length: 10 }, (_, i) => ({
            id: `step_${i+1}`,
            question: `Phase ${i+1}: ${[
              "Budget Cut: A donor pulls out. Do you cut staff or marketing?",
              "The Competition: A bigger nonprofit mimics your model.",
              "Safety Crisis: A minor incident on site. How do you report it?",
              "Price Hike: Local materials just doubled in cost.",
              "Transparency: The media demands a full audit of your ₹30Cr budget.",
              "Community Strike: Local workers want higher wages immediately.",
              "Corruption: A local official asks for a 'consulting fee'.",
              "Tech Failure: Your primary digital platform crashes for a week.",
              "Pivot: Change your core focus to stay financially afloat?",
              "The End: Sell the assets or ask for one last community donation?"
            ][i]}`,
            options: [
              { id: "opt_1", text: "Stay the Course: Operational Integrity", effects: { impact: 10, budgetPercentage: -15, risk: -10, trust: 30 }, stakeholderReactions: { "Government": "Noble.", "Local Community": "Absolute loyalty." } },
              { id: "opt_2", text: "Practical Pivot: Economic Survival", effects: { impact: 0, budgetPercentage: 10, risk: 10, trust: -15 }, stakeholderReactions: { "Government": "Smart business.", "Local Community": "Are you leaving us?" } }
            ]
          }))
        }
      ];

      const selected = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      console.warn("Using Procedural Fallback:", selected.title);
      return res.status(200).json(selected);
    }
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
    const prompt = `Judge this action: "${userAction}" for mission "${missionText}". Return JSON only. No numbers in text.`;
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      res.status(200).json(extractJSON(output));
    } catch {
      res.status(200).json({
        id: "custom", text: userAction,
        effects: { impact: 5, budgetPercentage: -5, risk: 5, trust: 5 },
        stakeholderReactions: { "Government": "We are watching closely.", "Local Community": "Interesting move." }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-feedback', async (req, res) => {
  try {
    const { missionText, decisions, finalStats, isSuccess } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Provide post-game feedback for mission "${missionText}". JSON only.`;
    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text();
      res.status(200).json(extractJSON(output));
    } catch {
      res.status(200).json({ summary: "Good job.", strengths: ["Persistence"], mistakes: ["Budget"], societalImpact: "Improved baseline." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server started successfully on http://localhost:${PORT}`);
});
