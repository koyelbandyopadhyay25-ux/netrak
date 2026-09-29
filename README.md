# 🛡️ NETRAK — Security Awareness Copilot

> **Understand. Decide. Learn. Stay Secure.**

NETRAK is an intelligent **security awareness and decision-support platform** that helps employees make safer security decisions at the moment they matter.

It combines **deterministic security rules, organizational policy grounding, selective AI assistance, just-in-time learning, incident response, and security analytics**.

---

## ✨ What NETRAK Does

### 🤖 Security Assistant

Ask natural-language security questions about:

* Phishing & identity
* Cloud storage & data sharing
* Generative AI
* Source code
* Removable media
* Remote work

Responses provide **risk level, guidance, next steps, verified policy references, and recommended learning**.

### 📚 Policy-Grounded Answers

* 40 synthetic corporate security policies
* 40 matching FAQs
* Deterministic relevance and retrieval
* Citation validation
* No fabricated policy information when no relevant policy exists

### ⚡ Just-in-Time Learning

* 20 micro-lessons
* 20 workplace decision scenarios
* Interactive quizzes
* Immediate feedback
* Topic-level progress tracking

### 🚨 Incident Response

Detects predefined high-risk indicators such as credential exposure, lost hardware, exposed API keys, and suspicious downloads, then provides containment guidance and SOC reporting workflows.

### 🎣 Phishing Simulator

A contained training environment with synthetic phishing campaigns and safe **Open / Click / Report / Ignore** simulations.

### 📊 Security Command Center

Admin dashboard with:

* Awareness coverage
* Open incidents
* Quiz accuracy
* Learning completion
* Weak-topic detection
* Incident triage
* Policy version comparison
* Grounded Admin AI Advisor

---

## 🧠 Architecture

NETRAK follows a **rules-first, policy-second, logic-third, AI-where-needed** approach:

```text
User
 │
 ▼
React Frontend
 │
 ▼
Node / Express
 │
 ├── Intent Router
 ├── Policy Engine
 ├── Incident Engine
 │
 ▼
Retrieval + Deterministic Logic
 │
 ▼
Gemini Flash
 │
 ▼
Response Validation
 │
 ▼
Learning / Progress
 │
 ▼
Analytics
 │
 ▼
Admin Command Center
```

AI is intentionally **not used for everything**. Incident triggers, policy matching, quiz scoring, progress calculations, and metrics remain deterministic.

---

## 🔐 Security Design

* **No hardcoded API keys** — Gemini is initialized server-side using environment variables.
* **Deterministic incident detection** before LLM invocation.
* **RAG policy grounding** with retrieved context and citation validation.
* **Prompt-injection defense** through strict context separation and input filtering.
* **Response validation** removes unsupported policy citations.
* **Contained phishing simulations** with no real external phishing emails.
* **No false external actions** — the system does not claim an action occurred unless an integration actually performs it.

---

## 🛠️ Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Frontend     | React 19, TypeScript, Tailwind CSS, Vite |
| Backend      | Node.js, Express, tsx                    |
| AI           | Google GenAI SDK + Gemini Flash          |
| Architecture | RAG + deterministic pre-routing          |
| Testing      | Automated backend test suite             |

---

## 📁 Project Structure

```text
netrak/
├── server.ts
├── package.json
├── vite.config.ts
├── test/
│   └── backend-test.ts
└── src/
    ├── components/
    ├── pages/
    ├── services/
    └── server/
        ├── routes/
        ├── services/
        └── data/
```

Core backend services include:

```text
gemini.ts
policySearch.ts
retrievalService.ts
intentRouter.ts
riskDetector.ts
responseValidator.ts
incidentService.ts
trainingEngine.ts
analyticsEngine.ts
phishingService.ts
```

---

## ⚙️ Getting Started

### 1. Clone

```bash
git clone https://github.com/koyelbandyopadhyay25-ux/netrak.git
cd netrak
```

### 2. Install

```bash
npm install
```

### 3. Configure Environment

Create `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Never commit real secrets.

### 4. Run Tests

```bash
npm test
```

The test suite covers policy retrieval, prompt-injection handling, incident detection, citation validation, quiz scoring, and simulation metrics.

### 5. Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Production Build

```bash
npm run build
```

---

## 🎯 Core Value

Traditional security awareness is often **periodic and passive**.

NETRAK turns security awareness into a continuous workflow:

```text
Security Question
      ↓
Risk Detection
      ↓
Verified Policy
      ↓
Actionable Guidance
      ↓
Just-in-Time Learning
      ↓
Progress & Analytics
```

**NETRAK brings security awareness closer to the moment of decision.**
