import { UserPresence, MatchResult, CafeVibeReport } from '../types';

export class GeminiService {
  private static apiKey: string = (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : '') || '';

  public static setApiKey(key: string) {
    this.apiKey = key.trim();
    if (typeof window !== 'undefined') {
      if (this.apiKey) {
        localStorage.setItem('gemini_api_key', this.apiKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }
  }

  public static getApiKey(): string {
    return this.apiKey;
  }

  public static hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Core Gemini Matchmaker: Finds mutual synergy and creates 3 non-awkward icebreakers
   */
  public static async findMatch(
    currentUser: UserPresence,
    candidates: UserPresence[]
  ): Promise<MatchResult> {
    const validCandidates = candidates.filter(
      (c) => c.id !== currentUser.id && (c.status === 'break' || c.status === 'collab' || c.status === 'focus')
    );

    if (validCandidates.length === 0) {
      throw new Error('No other guests found in the café right now.');
    }

    // If Gemini API Key is available, use real Gemini 1.5/2.0 Flash
    if (this.apiKey) {
      try {
        return await this.callGeminiMatchmaker(currentUser, validCandidates);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local heuristic matcher:', err);
      }
    }

    // High fidelity realistic fallback matcher
    return this.fallbackMatchmaker(currentUser, validCandidates);
  }

  /**
   * Real Gemini API Call using Gemini 2.0 / 1.5 Flash
   */
  private static async callGeminiMatchmaker(
    currentUser: UserPresence,
    candidates: UserPresence[]
  ): Promise<MatchResult> {
    const prompt = `
You are the AI Matchmaker & Social Catalyst for "The Third Place", a smart coworking café.
Your goal is to connect two people in the room respectfully, serendipitously, and without ANY cringe or awkwardness.

CURRENT USER:
- Name: ${currentUser.name}
- Table: ${currentUser.tableLabel || `Table ${currentUser.tableId}`}
- Status: ${currentUser.status.toUpperCase()} (${currentUser.status === 'focus' ? 'Deep Focus' : currentUser.status === 'break' ? 'Coffee Break' : 'Open to Collab'})
- Role: ${currentUser.role}
- Currently Working On: ${currentUser.workingOn}
- Interests: ${currentUser.interestedIn.join(', ')}
- Current Drink: ${currentUser.currentDrink}

OTHER GUESTS IN THE CAFÉ:
${candidates
  .map(
    (c) => `
- ID: ${c.id}
  Name: ${c.name} (Table ${c.tableId})
  Status: ${c.status.toUpperCase()}
  Role: ${c.role}
  Working On: ${c.workingOn}
  Interests: ${c.interestedIn.join(', ')}
  Drink: ${c.currentDrink}
`
  )
  .join('\n')}

INSTRUCTIONS:
1. Select the single BEST match for ${currentUser.name}. Prefer candidates who are on BREAK or OPEN TO COLLAB over DEEP FOCUS, but consider complementary skills (e.g. Designer + Developer, AI Researcher + Cloud Builder, or shared hobbies).
2. Calculate a Match Score (78 to 98%).
3. Write a snappy, modern Headline.
4. Explain the "Shared Vibe / Synergy" in 2 warm, observant sentences.
5. Provide EXACTLY 3 natural, non-awkward icebreakers that ${currentUser.name} can say or send:
   - Icebreaker 1: Professional / Feedback exchange related to their actual work
   - Icebreaker 2: Casual coffee / café / vibe comment
   - Icebreaker 3: Playful or shared hobby connection
6. Suggest a lightweight micro-action (e.g., "Send a 5-min Coffee Toast", "Exchange Figma/GitHub link", "Grab 3 min fresh air").

RETURN STRICTLY VALID JSON ONLY in this exact format:
{
  "targetUserId": "id_of_selected_candidate",
  "matchScore": 92,
  "headline": "Full-Stack Design Synergy & Caffeine Comrades",
  "sharedVibe": "Elena is refining UI UX while you are building backend logic. Both of you appreciate thoughtful craft and clean systems.",
  "icebreakers": [
    "Hey Elena! Saw you're working on an onboarding flow—if you ever want a quick developer sanity check, I'm at Table 4!",
    "Virtual coffee toast from Table 4! How is the ceremonial matcha treating you today?",
    "Gemini matched us on design systems and startup energy. Down for a 3-minute breather whenever you pause?"
  ],
  "suggestedAction": "Send a Virtual Coffee Toast or wave from across the room"
}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(rawText);
    const target = candidates.find((c) => c.id === parsed.targetUserId) || candidates[0];

    return {
      targetUserId: target.id,
      targetUser: target,
      matchScore: parsed.matchScore || 90,
      headline: parsed.headline || 'Serendipitous Café Connection',
      sharedVibe: parsed.sharedVibe || `${currentUser.name} and ${target.name} share great overlap in projects and focus.`,
      icebreakers: parsed.icebreakers || [
        `Hey ${target.name}, how is your work going today?`,
        `Nice setup! What coffee are you drinking?`,
        `Gemini recommended we connect on ${target.interestedIn[0] || 'tech'}!`
      ],
      suggestedAction: parsed.suggestedAction || 'Send a virtual coffee toast',
    };
  }

  /**
   * High-quality local heuristic fallback
   */
  private static fallbackMatchmaker(
    currentUser: UserPresence,
    candidates: UserPresence[]
  ): MatchResult {
    // Score candidates based on complementary roles, status, and interest intersections
    let bestCandidate = candidates[0];
    let highestScore = -1;

    for (const cand of candidates) {
      let score = 70;
      if (cand.status === 'collab') score += 15;
      if (cand.status === 'break') score += 10;
      if (cand.status === 'focus') score += 2;

      // Check common interests
      const common = cand.interestedIn.filter((item) =>
        currentUser.interestedIn.some((my) => my.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(my.toLowerCase()))
      );
      score += common.length * 6;

      // Role complementarity (e.g. Design + Dev, Research + Engineering)
      const roleA = currentUser.role.toLowerCase();
      const roleB = cand.role.toLowerCase();
      if ((roleA.includes('design') && roleB.includes('dev')) || (roleA.includes('dev') && roleB.includes('design'))) {
        score += 8;
      }
      if ((roleA.includes('ai') || roleA.includes('research')) && (roleB.includes('cloud') || roleB.includes('full-stack') || roleB.includes('mobile'))) {
        score += 8;
      }

      if (score > highestScore) {
        highestScore = score;
        bestCandidate = cand;
      }
    }

    const clampedScore = Math.min(97, Math.max(79, highestScore));

    // Dynamic icebreakers based on target candidate
    const icebreakers: string[] = [
      `"Hey ${bestCandidate.name.split(' ')[0]}! Saw you're at ${bestCandidate.tableLabel || `Table ${bestCandidate.tableId}`} working on ${bestCandidate.workingOn.slice(0, 40)}... would love to hear more if you have 3 mins!"`,
      `"Coffee toast from across the room! How's that ${bestCandidate.currentDrink} treating you?"`,
      `"Gemini flagged that we both share an interest in ${bestCandidate.interestedIn[0] || 'innovative tech'}. Taking a breather whenever you are!"`
    ];

    return {
      targetUserId: bestCandidate.id,
      targetUser: bestCandidate,
      matchScore: clampedScore,
      headline: `${bestCandidate.name.split(' ')[0]} & You: ${bestCandidate.role.split('@')[0]} Synergy`,
      sharedVibe: `${bestCandidate.name} is currently ${bestCandidate.status === 'collab' ? 'actively looking for collaborators' : 'taking a coffee break'} while you're deep in thought. There is an immediate overlap in ${bestCandidate.interestedIn.slice(0, 2).join(' & ')}.`,
      icebreakers,
      suggestedAction: bestCandidate.status === 'focus' 
        ? 'Leave a friendly guestbook note or send a quiet Coffee Toast'
        : 'Send a Coffee Toast or walk over for a quick 3-minute chat',
    };
  }

  /**
   * Generates dynamic Café Room Sentiment & Vibe Report
   */
  public static generateRoomPulse(users: UserPresence[]): CafeVibeReport {
    const totalPresent = users.length;
    const focusCount = users.filter((u) => u.status === 'focus').length;
    const breakCount = users.filter((u) => u.status === 'break').length;
    const collabCount = users.filter((u) => u.status === 'collab').length;

    let crowdEnergy: 'Deep Flow' | 'Gentle Buzz' | 'Social Mixer' | 'Evening Chill' = 'Gentle Buzz';
    let roomSentiment = 'Productive, warm hum of keyboards and roasted Arabica.';

    if (focusCount > totalPresent * 0.5) {
      crowdEnergy = 'Deep Flow';
      roomSentiment = 'Laser-focused silence. Ambient lo-fi beats playing softly while laptop screens glow with code and design.';
    } else if (collabCount >= 2) {
      crowdEnergy = 'Social Mixer';
      roomSentiment = 'Active creative sparks flying! People are exchanging ideas between Tables 2, 3, and 5.';
    } else if (breakCount >= 2) {
      crowdEnergy = 'Gentle Buzz';
      roomSentiment = 'Relaxed afternoon vibe. Fresh pour-overs brewing and steam hissing from the espresso group head.';
    }

    return {
      roomSentiment,
      totalPresent,
      focusCount,
      breakCount,
      collabCount,
      musicVibe: 'Lo-Fi Chillhop & Acoustic Ambient (72 BPM)',
      crowdEnergy,
      dailyPrompt: 'What is a tool or idea you recently discovered that completely changed your workflow?',
    };
  }
}
