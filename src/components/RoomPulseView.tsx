import React from 'react';
import { UserPresence, GuestbookNote, CoffeeToast } from '../types';
import { GeminiService } from '../services/gemini';
import { Sparkles, Activity, Users, Coffee, Volume2, ShieldCheck, TrendingUp, Radio } from 'lucide-react';

interface RoomPulseViewProps {
  users: UserPresence[];
  notes: GuestbookNote[];
  toasts: CoffeeToast[];
}

export const RoomPulseView: React.FC<RoomPulseViewProps> = ({
  users,
  notes,
  toasts,
}) => {
  const pulse = GeminiService.generateRoomPulse(users);

  const focusPct = Math.round((pulse.focusCount / (pulse.totalPresent || 1)) * 100);
  const breakPct = Math.round((pulse.breakCount / (pulse.totalPresent || 1)) * 100);
  const collabPct = Math.round((pulse.collabCount / (pulse.totalPresent || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Café Ops & Sentiment Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-100">
            Barista & Room Intelligence Pulse
          </h2>
          <p className="text-xs text-stone-400">
            Real-time ambient feedback, table connectivity, and crowd dynamics powered by Google Cloud
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-950/80 border border-stone-800 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-[10px] uppercase font-bold text-stone-400">
              Crowd State
            </div>
            <div className="text-sm font-extrabold text-amber-300">
              {pulse.crowdEnergy}
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 px-4 py-2.5 rounded-2xl text-center">
            <div className="text-[10px] uppercase font-bold text-stone-400">
              Active Tables
            </div>
            <div className="text-sm font-extrabold text-emerald-400">
              {users.length} / 8 Occupied
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Focus Ratio */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Room Focus Distribution</span>
            </span>
            <span className="text-stone-400 font-mono text-[11px]">
              {users.length} seated
            </span>
          </div>

          {/* Multi-segmented Progress Bar */}
          <div className="w-full h-3 rounded-full bg-stone-950 overflow-hidden flex border border-stone-800">
            <div
              style={{ width: `${focusPct}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`Deep Focus: ${focusPct}%`}
            />
            <div
              style={{ width: `${breakPct}%` }}
              className="bg-amber-400 h-full transition-all"
              title={`Coffee Break: ${breakPct}%`}
            />
            <div
              style={{ width: `${collabPct}%` }}
              className="bg-emerald-400 h-full transition-all"
              title={`Open to Collab: ${collabPct}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
            <div className="text-rose-300">
              <span className="font-bold">{pulse.focusCount}</span> Focus ({focusPct}%)
            </div>
            <div className="text-amber-300">
              <span className="font-bold">{pulse.breakCount}</span> Break ({breakPct}%)
            </div>
            <div className="text-emerald-300">
              <span className="font-bold">{pulse.collabCount}</span> Collab ({collabPct}%)
            </div>
          </div>
        </div>

        {/* Metric 2: Ambient Vibe & Acoustics */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Sound & Acoustic Atmosphere</span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">
              Optimal
            </span>
          </div>

          <div className="text-xs text-stone-300 pt-1">
            {pulse.musicVibe}
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Recommended action: Keep espresso grinder pulse short. Window seats 1 & 2 are in high concentration mode.
          </p>
        </div>

        {/* Metric 3: Social Connectivity */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Community Interactions</span>
            </span>
            <span className="text-amber-300 font-bold text-[11px]">
              {toasts.length} Toasts Sent
            </span>
          </div>

          <div className="text-xs text-stone-300 pt-1">
            {notes.length} wall notes posted today
          </div>
          <p className="text-[11px] text-stone-400">
            Cross-table connectivity is thriving between Table 3 (Alex) and Table 5 (Elena).
          </p>
        </div>
      </div>

      {/* Gemini AI Summary & Barista Recommendations */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/30 border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gemini Ambient Room Observation</span>
        </div>
        <p className="text-sm text-stone-200 leading-relaxed font-sans">
          "{pulse.roomSentiment}"
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80">
            <span className="font-bold text-amber-200 block mb-1">
              ☕ Barista Brewing Recommendation:
            </span>
            <span className="text-stone-300">
              High density of tech workers currently engaged in analytical tasks. Recommend single-origin pour-overs and oat cortados for clean cognitive stamina without high-sugar crashes.
            </span>
          </div>
          <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800/80">
            <span className="font-bold text-blue-200 block mb-1">
              🤝 Community Catalyst Recommendation:
            </span>
            <span className="text-stone-300">
              Multiple guests share interests in AI Agents and Design Systems. Encourage a 15-minute open table swap at Table 4 around 4:00 PM.
            </span>
          </div>
        </div>
      </div>

      {/* Live Table Activity Stream */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Live Table Presence Stream</span>
        </h3>

        <div className="divide-y divide-stone-800">
          {users.map((u) => (
            <div
              key={u.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{u.avatar}</span>
                <div>
                  <div className="font-bold text-stone-200 flex items-center gap-1.5">
                    <span>{u.name}</span>
                    <span className="text-[10px] text-stone-400">
                      (Table {u.tableId} • {u.tableLabel?.split(' ')[1] || 'Hall'})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {u.role} • Drinking {u.currentDrink}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    u.status === 'focus'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : u.status === 'break'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {u.status === 'focus'
                    ? '🔴 Deep Focus'
                    : u.status === 'break'
                    ? '🟡 Coffee Break'
                    : '🟢 Open to Collab'}
                </span>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Checked in {Math.max(1, Math.round((Date.now() - u.checkedInAt) / 60000))}m ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
