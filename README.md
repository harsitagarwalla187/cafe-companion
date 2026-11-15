# ☕ The Third Place — AI-Powered Café Coworking & Community Matchmaker

> **Google Cloud Builder Pop-Up Hackathon Project**  
> *"Cafés are where people work alone together. The Third Place turns awkward silence into serendipitous networking and collaboration."*

---

## 🎯 Alignment with Problem Statement
- **Connect People**: Live 2D Table Radar with Laptop Modes (🔴 Deep Focus, 🟡 Coffee Break, 🟢 Open to Collab) and opt-in table matching.
- **Smarter Ordering & Discovery**: Drink-to-cognition pairings (e.g. oat cortado for deep analytical flow, ceremonial matcha for calm creative design).
- **Understand the Room**: Barista Room Pulse analyzing crowd focus distribution, acoustic recommendations, and ambient room sentiment.
- **Google Cloud & Gemini Technology**: Gemini 2.0 / 1.5 Flash for semantic profile reasoning, non-awkward icebreakers, and room telemetry.

---

## 🚀 Features

### 1. 🗺️ Interactive Table Radar
- **Visual 2D Floor Plan**: 8 numbered tables across 4 architectural zones:
  - *Window Counter* (Tables 1 & 2 • High natural light & power outlets)
  - *Central Coworking* (Tables 3 & 4 • Spacious communal tables)
  - *Quiet Acoustic Booths* (Tables 5 & 6 • Deep work acoustic panels)
  - *Sunlit Patio* (Tables 7 & 8 • Casual outdoor seating)
- **Live Status Rings**:
  - 🔴 **Deep Focus (DND)**: Respectful flow state indicator
  - 🟡 **Coffee Break**: Stepping away for 15m; open to casual chat or coffee talk
  - 🟢 **Open to Collab**: Welcoming feedback, brainstorming, or code review

### 2. ⚡ Gemini Social Catalyst (AI Matchmaker)
- Analyzes candidate projects, skills, and current statuses in the room.
- Generates a **Synergy Score (%)** and explains *why* the connection works.
- Crafts **3 Zero-Awkward Icebreakers**:
  1. *Professional / Technical*: Specific to what they are actually building.
  2. *Casual Coffee / Vibe*: Warm observation about their drink or seating.
  3. *Shared Hobby / Rabbit Hole*: Common interests (AI, design, sci-fi, chess).
- One-click copy or instant **"Send as Coffee Toast ☕"** with celebratory confetti.

### 3. 📖 Café Guestbook & Daily AI Prompt
- Live sticky notes wall with answers to Gemini's daily community prompt.
- Filter by `#DailyPrompt`, `#CoffeeThought`, `#TechTip`, `#CollabOffer`.
- Upvote and react in real-time.

### 4. 📊 Barista & Room Intelligence Pulse
- Kitchen / Manager view showing:
  - Focus distribution meter (% in Deep Focus vs Socializing)
  - Ambient acoustic guidance (optimal BPM & decibel levels)
  - Bean & drink pairing recommendations based on crowd cognitive load
  - Live table activity feed

---

## 🛠️ How to Run

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Start the dev server
npm run dev

# 3. For judging demo: open with host to access from your phone over café Wi-Fi:
npm run dev -- --host
```

---

## 🔑 Gemini API Key (100% Free)
1. Click the **"Gemini Key"** icon in the header.
2. Paste your free Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey).
3. *Note:* If no key is entered, the app automatically runs a high-fidelity local fallback simulation so your live demo never fails!
