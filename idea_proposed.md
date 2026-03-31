# 🧠 CodeNynx — Reflective Social Entrepreneurship Simulation Platform

> *"Every year, thousands of young founders in India have ideas that could change lives — but they fail before they begin. Not because the idea is bad. But because they've never practiced the decisions that make or break a social enterprise. There is no safe place to fail. CodeNynx is that place."*

---

## 💡 The Problem

**90% of social initiatives in India fail during execution — not ideation.**

Young changemakers face four core barriers before they even start:

| # | Problem | Reality |
|---|---------|---------|
| P1 | **The Execution Gap** | Founders lack real-world risk management and decision-making under pressure before committing resources |
| P2 | **Ecosystem Complexity** | Navigating governments, community needs, NGOs, and private partners simultaneously is a skill never taught in classrooms |
| P3 | **Resource Constraints** | Balancing social impact against financial sustainability is the steepest learning curve — and nobody practices it |
| P4 | **No Testing Ground** | There is no accessible, risk-free mechanism for young changemakers to simulate and evaluate real consequences |

---

## 🚀 What CodeNynx Is

**CodeNynx** is a consequence-bearing social entrepreneurship simulation platform that puts founders inside a live, AI-powered decision environment unique to their exact mission — before they risk real capital, real trust, or real communities.

It is not a quiz. It is not a case study. It is a dynamic **decision engine** where every choice creates ripple effects, delayed consequences surface to punish bad assumptions, and the AI holds a mirror to your leadership quality after the game ends.

---

## 🎮 How It Works

### 1. Define Your Mission
You type your real idea — *"Expand clean drinking water access to 5 remote villages in Rajasthan"* — and choose your stakeholder coalition (Government, Local Community, NGO Partners, Private Sector, Media).

### 2. The Simulation Begins
An AI-generated 6-step scenario is built specifically around your mission. You navigate:
- Stakeholder pressure
- Budget trade-offs
- Hired/fired staff crises
- Donor tantrums
- Media scrutiny
- And more

Every option has an **emotional label** — not raw numbers — so you feel the weight of your choices like a founder would.

### 3. Delayed Consequences Fire
Some of your early decisions set **hidden flags**. Three steps later, the system fires a consequence you didn't see coming — just like reality. A crisis modal appears: *"A shift in government policy abruptly recalled your early institutional backing."* Your metrics drop. You absorb it and continue.

### 4. Choose Your Mode

| Feature | Practice Mode | Ground Zero (Real) |
|---------|:---:|:---:|
| Progress Phase Display | ✅ Step + Phase | Step only |
| Rewind Decisions | ✅ Max 2 checkpoints | ❌ Not rendered |
| AI Coaching Hints | ✅ Non-judgmental | ❌ None |
| What-If Analysis | ✅ Post-sim | ❌ No |
| Global Leaderboard | ❌ Not eligible | ✅ Eligible |
| Post-Mortem | Full with What-If | Raw only |

### 5. The After Action Report
When the simulation ends, an AI-generated report delivers:
- **Executive Summary** — overall leadership quality
- **Critical Mistake** — the exact decision that most diverged from what the ecosystem needed
- **Blind Spot Map** — every assumption that failed
- **What-If Analysis** *(Practice only)* — what would have changed if you'd made different calls
- **Societal Impact** — a vivid picture of the community you created or failed

---

## 🔑 The Core Differentiator — Delayed Consequence Engine

Most simulations apply consequences immediately. CodeNynx does not.

When you skip community consultation at Step 1, nothing happens. You feel clever. You move fast.

Then at Step 4, when a major donor arrives, the community hasn't been consulted — and your Trust collapses by 20 points before you've even seen the question. **Past decisions echo forward.**

```
Step 1: User picks "Launch campaign immediately" → sets flag: SKIP_COMMUNITY
Step 4: Engine checks flags → fires -20 Trust → modal appears → user sees consequence
Step 5: Same pattern for EARLY_GOVT flag → government withdraws support
```

This is the single most realistic feature of the platform — and the one no textbook exercise can replicate.

---

## 🏆 Scoring & Badges

```
Final Score = impact + trust − risk + ⌊budget ÷ 100⌋
```

| Badge | Condition |
|-------|-----------|
| 🛡️ Crisis Survivor | Budget < 20 AND Risk > 60 at end |
| 🤝 People's Leader | Trust > 70 at end |
| ⚖️ Balanced Thinker | All metrics between 20–80 |
| 🧠 Smart Planner | Risk < 20 at end |
| 🎖️ Participant | Default |

You cannot win by being reckless. You cannot win by hoarding budget and doing nothing. The scoring enforces the real trade-off at the heart of social entrepreneurship: **impact without sustainability is collapse**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Vite + TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Animation** | Framer Motion |
| **AI (Scenario + Feedback)** | Google Gemini 2.5 Flash |
| **AI (Insights)** | Groq API (llama3-8b) with silent fallback |
| **Database / Auth** | Firebase Firestore + Firebase Auth |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
codenyx/
├── frontend/
│   └── src/
│       ├── engine/
│       │   ├── scenarioData.ts       # 6-step MVP scenario with hidden flags
│       │   ├── delayEngine.ts        # Delayed consequence checker
│       │   └── scoreEngine.ts        # Score + badge calculator
│       ├── store/
│       │   └── useSimulationStore.ts # Zustand store — full game state
│       ├── components/simulation/
│       │   ├── DecisionCard.tsx      # Current step + options (shows emotional labels)
│       │   ├── LiveDashboard.tsx     # Real-time metric cards
│       │   ├── ProgressBar.tsx       # Phase + step tracker
│       │   ├── FeedbackHints.tsx     # Practice-mode AI coaching
│       │   ├── EventNotification.tsx # Delayed consequence modal
│       │   └── DecisionTimeline.tsx  # Post-game emotional label history
│       ├── pages/v2/
│       │   ├── SetupPageV2.tsx       # Mode selection + feature comparison
│       │   ├── SimulationPageV2.tsx  # Main simulation loop
│       │   └── LeaderboardPageV2.tsx # Global Ground Zero leaderboard
│       ├── pages/
│       │   └── ResultView.tsx        # Score, badge, What-If, AI insights
│       ├── services/
│       │   ├── aiService.ts          # Groq API client
│       │   ├── insightFallback.ts    # Silent fallback insights
│       │   └── firebaseClient.ts     # Firestore save + leaderboard fetch
│       └── types.ts                  # All shared TypeScript interfaces
└── backend/
    └── server.js                     # Express: Gemini scenario + feedback endpoints
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([get one free](https://aistudio.google.com/))
- A Firebase project ([set up here](https://firebase.google.com/))
- (Optional) A Groq API key for AI insights ([groq.com](https://groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/Kattayashchaitanya/codeynx-Social-Entrepreneurship-Innovation-
cd codeynx-Social-Entrepreneurship-Innovation-
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
```

Start the backend:

```bash
node server.js
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_key_here  # optional — fallback works without it
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Note:** If Firebase is not configured, the app automatically bypasses login and runs in guest mode. The simulation works fully without any API keys — the backend falls back to a procedural scenario generator, and the AI insights panel uses a hardcoded fallback.

---

## 🎯 The MVP Scenario — Youth Mental Health Initiative

The default hardcoded scenario walks through a real-world initiative:

| Step | Phase | Decision | Hidden Flag | Resolves At |
|------|-------|----------|-------------|-------------|
| 1 | Planning | Community consultation vs. campaign launch | `SKIP_COMMUNITY` if campaign chosen | Step 4 |
| 2 | Planning | Government partnership vs. grassroots | `EARLY_GOVT` if govt chosen | Step 5 |
| 3 | Execution | Counselor quits — hire fast or pause? | — | — |
| 4 | Execution | Donor expansion request | Checks `SKIP_COMMUNITY` → fires −20 Trust | Resolves Step 1 |
| 5 | Crisis | Budget crisis — cut outreach or core? | Checks `EARLY_GOVT` → govt withdraws | Resolves Step 2 |
| 6 | Outcome | Media attention — speak or protect privacy? | — | — |

---

## 🗺️ Feature Roadmap

| Feature | MVP | v1.1 | v2.0 |
|---------|:---:|:---:|:---:|
| AI Scenario Generation (Gemini) | ✅ | ✅ | ✅ |
| Delayed Consequence Engine | ✅ | ✅ | ✅ |
| Dual Mode (Practice / Ground Zero) | ✅ | ✅ | ✅ |
| Checkpoint Rewind (Practice) | ✅ | ✅ | ✅ |
| AI After Action Report | ✅ | ✅ | ✅ |
| What-If Analysis | ✅ | ✅ | ✅ |
| Global Leaderboard | ✅ | ✅ | ✅ |
| Decision Confidence Meter | 🔜 | ✅ | ✅ |
| Per-Stakeholder Reaction Feed | 🔜 | ✅ | ✅ |
| Performance Charts | 🔜 | ✅ | ✅ |
| Downloadable AAR Report | 🔜 | ✅ | ✅ |
| Mission Replay from Dashboard | 🔜 | ✅ | ✅ |
| Multi-Scenario Library | ❌ | 🔜 | ✅ |
| Real Policy API Integrations | ❌ | ❌ | 🔜 |

---

## 👥 Team

**Built by:** Katta Yash Chaitanya  
**GitHub:** [@Kattayashchaitanya](https://github.com/Kattayashchaitanya)  
**Project:** Social Entrepreneurship Innovation Hackathon

---

## 📄 License

MIT — built for the community of future changemakers.

---

*CodeNynx — A safe place to fail. A structured place to learn. A launchpad to lead.*
