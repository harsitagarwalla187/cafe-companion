import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserPresence, MatchResult } from '../types';
import { GeminiService } from '../services/gemini';
import { Sparkles, X, Coffee, Send, Copy, Check, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';

interface MatchmakerModalProps {
  currentUser: UserPresence;
  candidates: UserPresence[];
  targetUser?: UserPresence | null;
  onClose: () => void;
  onSendToast: (target: UserPresence, message?: string) => void;
}

export const MatchmakerModal: React.FC<MatchmakerModalProps> = ({
  currentUser,
  candidates,
  targetUser,
  onClose,
  onSendToast,
}) => {
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const runMatchmaking = async () => {
    setLoading(true);
    setError(null);
    try {
      // If a specific target was clicked, match with them; otherwise match across all candidates
      const pool = targetUser ? [targetUser] : candidates;
      const result = await GeminiService.findMatch(currentUser, pool);
      setMatch(result);

      // Trigger confetti on successful match calculation
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#fbbf24'],
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to find a match.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runMatchmaking();
  }, []);

  const handleCopyIcebreaker = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-stone-100">
                Gemini Social Catalyst
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Flash Reasoning
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Zero-awkward serendipity connecting people across café tables
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-stone-200">
                Gemini is Reading the Room...
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Analyzing complementary projects, table statuses, and crafting natural icebreakers
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              onClick={runMatchmaking}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Match Result Display */}
        {match && !loading && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Target Match Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border border-stone-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl bg-stone-800/80 p-2 rounded-2xl border border-stone-700">
                  {match.targetUser.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-100 text-base">
                      {match.targetUser.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-amber-300">
                      Table {match.targetUser.tableId}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400">
                    {match.targetUser.role}
                  </div>
                  <div className="text-[11px] text-amber-200/90 italic mt-0.5">
                    Working on: {match.targetUser.workingOn}
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-center flex-shrink-0 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-2xl">
                <div className="text-2xl font-black text-amber-300">
                  {match.matchScore}%
                </div>
                <div className="text-[9px] uppercase font-bold tracking-wider text-amber-400">
                  Synergy
                </div>
              </div>
            </div>

            {/* Gemini Shared Vibe Rationale */}
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-300 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Why Gemini Matched You: {match.headline}</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                {match.sharedVibe}
              </p>
            </div>

            {/* 3 Tailored Icebreakers */}
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-2 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>3 Zero-Awkward Conversation Starters</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Click to copy or send as toast
                </span>
              </label>

              <div className="space-y-2">
                {match.icebreakers.map((starter, index) => {
                  const isCopied = copiedIndex === index;
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 group"
                    >
                      <div className="text-xs text-stone-200 leading-relaxed font-sans flex-1">
                        <span className="text-amber-400 font-bold mr-1.5">
                          #{index + 1}
                        </span>
                        <span>{starter}</span>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => handleCopyIcebreaker(starter, index)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-stone-400" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Send directly as toast */}
                        <button
                          type="button"
                          onClick={() => {
                            onSendToast(match.targetUser, starter);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Coffee className="w-3 h-3 text-amber-400" />
                          <span>Send Toast ☕</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={runMatchmaking}
                className="px-3 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Shuffle / Find Another</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSendToast(match.targetUser);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/60 transition-all"
              >
                <Coffee className="w-4 h-4 text-stone-950" />
                <span>Send Custom Coffee Toast to Table {match.targetUser.tableId}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
