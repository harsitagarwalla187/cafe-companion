import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserPresence } from '../types';
import { X, Coffee, Send, Sparkles } from 'lucide-react';

interface CoffeeToastModalProps {
  targetUser: UserPresence;
  currentUser: UserPresence | null;
  initialMessage?: string;
  onClose: () => void;
  onSend: (targetUserId: string, targetName: string, targetTable: number, message: string, emoji: string) => void;
}

const DRINK_EMOJIS = [
  { emoji: '☕', name: 'Espresso / Cortado' },
  { emoji: '🧊', name: 'Cold Brew' },
  { emoji: '🍵', name: 'Matcha' },
  { emoji: '🥐', name: 'Warm Croissant' },
  { emoji: '🍰', name: 'Cheesecake' },
  { emoji: '✨', name: 'Good Energy' },
];

const PRESET_MESSAGES = [
  'Virtual coffee toast! Hope the focus session is going smoothly!',
  'Saw your project—looks super interesting! Down to say hi whenever you take a break.',
  'Great choice of seat! The coffee here today is top notch.',
  'Need a 5-minute break? Would love to hear about what you are building.'
];

export const CoffeeToastModal: React.FC<CoffeeToastModalProps> = ({
  targetUser,
  currentUser,
  initialMessage = '',
  onClose,
  onSend,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [message, setMessage] = useState(
    initialMessage || `Virtual coffee toast from across the room! Hope the session is going well.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSend(
      targetUser.id,
      targetUser.name,
      targetUser.tableId,
      message.trim(),
      selectedEmoji
    );

    // Fire confetti for celebration
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#fbbf24'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
            {selectedEmoji}
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-100">
              Send a Coffee Toast
            </h3>
            <p className="text-xs text-stone-400">
              To <span className="font-semibold text-amber-300">{targetUser.name}</span> at Table {targetUser.tableId}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Beverage / Treat Emoji Picker */}
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Select a Treat
            </label>
            <div className="grid grid-cols-6 gap-2">
              {DRINK_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(item.emoji)}
                  className={`p-2.5 rounded-xl border text-xl flex items-center justify-center transition-all ${
                    selectedEmoji === item.emoji
                      ? 'bg-amber-600/40 border-amber-500 ring-2 ring-amber-500/50 scale-105'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Toast Note
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a warm, non-intrusive note..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none font-sans"
            />
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-[11px] text-stone-500 block mb-1">
              Quick friendly templates:
            </label>
            <div className="space-y-1">
              {PRESET_MESSAGES.slice(0, 2).map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(msg)}
                  className="w-full text-left p-1.5 rounded-lg text-[10px] text-stone-400 hover:text-stone-200 bg-stone-950/60 hover:bg-stone-800 truncate"
                >
                  "{msg}"
                </button>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/60 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Toast ☕</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
