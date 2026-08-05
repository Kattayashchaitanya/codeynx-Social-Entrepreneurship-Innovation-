# 🧠 CodeNynx — Social Entrepreneurship & Innovation Simulation Platform

<div align="center">

> *"Every year, thousands of young founders have ideas that could change lives — but they fail before they begin. Not because the idea is bad. But because they've never practiced the decisions that make or break a social enterprise. There is no safe place to fail. CodeNynx is that place."*

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI_Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📖 About

**CodeNynx** (also known as **Mind Spring**) is a consequence-bearing, AI-powered **social entrepreneurship simulation platform** that puts aspiring founders inside a live decision environment — before they risk real capital, real trust, or real communities.

It is not a quiz. It is not a case study. It is a dynamic **decision engine** where every choice creates ripple effects, delayed consequences surface to punish bad assumptions, and AI holds a mirror to your leadership quality after the game ends.

---

## 🎯 The Problem We Solve

**90% of social initiatives fail during execution — not ideation.**

| # | Problem | Reality |
|---|---------|---------|
| P1 | **The Execution Gap** | Founders lack real-world risk management and decision-making under pressure |
| P2 | **Ecosystem Complexity** | Navigating governments, NGOs, communities, and private partners is a skill never taught |
| P3 | **Resource Constraints** | Balancing social impact against financial sustainability has no safe practice ground |
| P4 | **No Testing Ground** | There is no accessible, risk-free mechanism to simulate and evaluate real consequences |

---

## ✨ Key Features

- 🎮 **Scenario-based Gameplay** — 6-step simulations built around YOUR social mission
- 🤖 **AI-Generated Situations** — Unique scenarios powered by Google Gemini AI
- ⏱️ **Delayed Consequence Engine** — Early decisions echo forward 3–4 steps later (just like reality)
- 📊 **Performance Tracking** — Real-time metrics for Impact, Trust, Risk, and Budget
- 🏆 **Global Leaderboard** — Compete and compare with other changemakers
- 🔄 **What-If Analysis** — Replay decisions and see alternate outcomes (Practice Mode)
- 🚨 **Crisis Event Modals** — Unexpected crises that test your resilience mid-simulation
- 🗳️ **Stakeholder Reactions** — Live feedback from Government, Community, NGOs, Private Sector & Media
- 📈 **After Action Report** — AI-generated post-mortem with blind-spot analysis
- 🛡️ **Dual Modes** — Practice Mode (coaching + checkpoints) vs Ground Zero (leaderboard eligible)

---

## 🏗️ Project Structure

```
codeynx-Social-Entrepreneurship-Innovation-/
├── frontend/                        # React + Vite frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── assets/                  # Static assets (images, SVGs)
│       ├── components/              # Reusable UI components
│       │   ├── BudgetBurnWarning.jsx
│       │   ├── ConfidenceMeter.jsx
│       │   ├── CrisisEventModal.jsx
│       │   ├── GovernmentPolicyCard.jsx
│       │   ├── PerformanceCharts.jsx
│       │   ├── StakeholderReactions.jsx
│       │   └── WhatIfExplorer.jsx
│       ├── context/
│       │   └── SimulationContext.jsx # Global simulation state
│       ├── data/
│       │   └── scenarios/           # Pre-built scenario data
│       │       ├── education.js
│       │       ├── empowerment.js
│       │       ├── environment.js
│       │       ├── mentalHealth.js
│       │       ├── water.js
│       │       └── index.js
│       ├── firebase/
│       │   └── config.js            # Firebase configuration
│       ├── pages/
│       │   ├── Login.jsx            # Authentication page
│       │   ├── SimulationSetup.jsx  # Mission & mode selection
│       │   ├── Simulation.jsx       # Core gameplay engine
│       │   ├── Dashboard.jsx        # User dashboard
│       │   ├── Leaderboard.jsx      # Global leaderboard
│       │   └── Result.jsx           # After Action Report
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── server.js                    # Express.js API server
│   └── package.json
├── idea_proposed.md                 # Full product specification
├── .gitignore
└── README.md
```

---

## 🎮 How It Works

### 1. 🧭 Define Your Mission
Enter your real social idea — *e.g., "Expand clean drinking water access to 5 remote villages in Rajasthan"* — and choose your stakeholder coalition: Government, Local Community, NGO Partners, Private Sector, and Media.

### 2. ⚙️ The Simulation Begins
An AI-generated 6-step scenario is built specifically around your mission. You navigate:
- Stakeholder pressure and community tensions
- Budget trade-offs and resource crises
- Staff and donor conflicts
- Media scrutiny and policy shifts

> Every option carries an **emotional label** — not raw numbers — so you feel the weight of your choices like a real founder would.

### 3. 💥 Delayed Consequences Fire
Some early decisions set **hidden flags**. Steps later, the system fires a consequence you didn't see coming — just like reality.

```
Step 1: User picks "Launch campaign immediately" → sets flag: SKIP_COMMUNITY
Step 4: Engine checks flags → fires -20 Trust → crisis modal appears
Step 5: EARLY_GOVT flag → government withdraws support unexpectedly
```

### 4. 🎛️ Choose Your Mode

| Feature | Practice Mode | Ground Zero (Real) |
|---------|:---:|:---:|
| Progress Phase Display | ✅ Step + Phase | Step only |
| Rewind Decisions | ✅ Max 2 checkpoints | ❌ |
| AI Coaching Hints | ✅ Non-judgmental | ❌ |
| What-If Analysis | ✅ Post-sim | ❌ |
| Global Leaderboard | ❌ Not eligible | ✅ Eligible |
| Post-Mortem | Full with What-If | Raw only |

### 5. 📋 The After Action Report
When the simulation ends, an AI-generated report delivers:
- **Executive Summary** — overall leadership quality assessment
- **Critical Mistake** — the exact decision that most hurt your mission
- **Blind Spot Map** — every assumption that failed
- **What-If Analysis** *(Practice only)* — what would have changed with different calls
- **Societal Impact** — a vivid picture of the community you built or failed

---

## 🏆 Scoring & Badges

```
Final Score = Impact + Trust − Risk + ⌊Budget ÷ 100⌋
```

| Badge | Condition |
|-------|-----------|
| 🛡️ Crisis Survivor | Budget < 20 AND Risk > 60 at end |
| 🤝 People's Leader | Trust > 70 at end |
| ⚖️ Balanced Thinker | All four metrics within 15 points of each other |
| 🚀 Impact Champion | Impact > 80 at end |
| 💡 Strategic Genius | Score in the top 10% of all players |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Styling |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Firebase** | Authentication & Firestore database |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server |
| **Google Gemini AI** (`@google/generative-ai`) | AI scenario & report generation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm `v9+`
- A Google Gemini API key ([Get one here](https://ai.google.dev/))
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/Kattayashchaitanya/codeynx-Social-Entrepreneurship-Innovation-.git
cd codeynx-Social-Entrepreneurship-Innovation-
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=3001
```

Start the backend server:

```bash
node server.js
```

> The backend will run at `http://localhost:3001`

### 3. Set Up the Frontend

```bash
cd frontend
npm install
```

Configure Firebase in `src/firebase/config.js` with your Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Start the frontend dev server:

```bash
npm run dev
```

> The app will run at `http://localhost:5173`

---

## 🌐 Available Scenarios

| Scenario | Domain |
|----------|--------|
| 🎓 **Education** | Access to quality education in underserved communities |
| 💧 **Water Access** | Clean drinking water in rural/remote areas |
| 🌱 **Environment** | Sustainability and environmental conservation |
| 💪 **Women's Empowerment** | Economic and social empowerment initiatives |
| 🧠 **Mental Health** | Community mental health awareness and access |

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Login** | Firebase Google/Email authentication |
| **Simulation Setup** | Choose mission, mode, and stakeholder coalition |
| **Simulation** | Core 6-step decision gameplay with live metrics |
| **Dashboard** | View past simulations and personal stats |
| **Leaderboard** | Global ranking of all Ground Zero players |
| **Result** | AI-powered After Action Report |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your code follows the existing style and all components are properly tested.

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Katta Yash Chaitanya**

- GitHub: [@Kattayashchaitanya](https://github.com/Kattayashchaitanya)
- Project: [codeynx-Social-Entrepreneurship-Innovation-](https://github.com/Kattayashchaitanya/codeynx-Social-Entrepreneurship-Innovation-)

---

## 🌟 Acknowledgements

- [Google Gemini AI](https://ai.google.dev/) — for powering the intelligent scenario generation
- [Firebase](https://firebase.google.com/) — for authentication and real-time database
- [Framer Motion](https://www.framer.com/motion/) — for beautiful UI animations
- [Lucide React](https://lucide.dev/) — for the crisp icon set
- The social entrepreneurship community for the inspiration to build this platform

---

<div align="center">

**Made with ❤️ for changemakers who dare to simulate before they start.**

⭐ **Star this repo** if you find it useful!

</div>
