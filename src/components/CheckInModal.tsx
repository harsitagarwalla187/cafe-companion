import React, { useState } from 'react';
import { UserPresence, FocusStatus } from '../types';
import { TABLES } from '../services/realtime';
import { X, Check, Coffee, Laptop, Sparkles, User, Tag } from 'lucide-react';

interface CheckInModalProps {
  currentUser: UserPresence | null;
  selectedTableId?: number | null;
  allUsers: UserPresence[];
  onClose: () => void;
  onSave: (data: Omit<UserPresence, 'id' | 'checkedInAt'> & { id?: string }) => void;
  onCheckOut: () => void;
}

const AVATAR_OPTIONS = ['👨🏻‍💻', '👩🏽‍💻', '🎨', '⚡', '☕', '✍️', '🧠', '🚀', '🔬', '🌿', '🎧', '👾'];

const PRESET_TOPICS = [
  'Gemini', 'React', 'Google Cloud', 'Figma', 'Python', 'AI Agents',
  'UI/UX', 'Specialty Coffee', 'Indie Hacking', 'Sci-Fi', 'Startups', 'TypeScript'
];

const PRESET_PROJECTS = [
  'Building an AI agent with Gemini 2.0 Flash',
  'Polishing a responsive mobile web app',
  'Designing clean dashboard UI in Figma',
  'Writing a tech blog post & documentation',
  'Debugging full-stack backend pipelines',
  'Prepping startup deck for demo day'
];

const PRESET_DRINKS = [
  'Iced Oat Cortado',
  'Single-Origin Ethiopian Pour-Over',
  'Cold Brew with Sweet Vanilla Foam',
  'Ceremonial Matcha Latte',
  'Double Espresso',
  'Chamomile & Mint Herbal Tea'
];

export const CheckInModal: React.FC<CheckInModalProps> = ({
  currentUser,
  selectedTableId,
  allUsers,
  onClose,
  onSave,
  onCheckOut,
}) => {
  const [tableId, setTableId] = useState<number>(
    selectedTableId || currentUser?.tableId || 4
  );
  const [name, setName] = useState<string>(currentUser?.name || 'Taylor Reed');
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || '🚀');
  const [role, setRole] = useState<string>(currentUser?.role || 'Full-Stack Developer & AI Enthusiast');
  const [status, setStatus] = useState<FocusStatus>(currentUser?.status || 'collab');
  const [workingOn, setWorkingOn] = useState<string>(
    currentUser?.workingOn || 'Building an AI agent with Gemini 2.0 Flash'
  );
  const [currentDrink, setCurrentDrink] = useState<string>(
    currentUser?.currentDrink || 'Iced Oat Cortado'
  );
  const [interestedIn, setInterestedIn] = useState<string[]>(
    currentUser?.interestedIn || ['Gemini', 'React', 'AI Agents', 'Specialty Coffee']
  );
  const [customTag, setCustomTag] = useState('');

  const handleToggleTag = (tag: string) => {
    if (interestedIn.includes(tag)) {
      setInterestedIn(interestedIn.filter((t) => t !== tag));
    } else {
      setInterestedIn([...interestedIn, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() && !interestedIn.includes(customTag.trim())) {
      setInterestedIn([...interestedIn, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tableSlot = TABLES.find((t) => t.id === tableId);
    onSave({
      id: currentUser?.id,
      name,
      avatar,
      role,
      tableId,
      tableLabel: tableSlot ? `${tableSlot.label} (${tableSlot.zone})` : `Table ${tableId}`,
      status,
      workingOn,
      currentDrink,
      interestedIn,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-stone-100">
              {currentUser ? 'Edit Laptop Mode' : 'Check In at Café'}
            </h2>
            <p className="text-xs text-stone-400">
              Set your table, status, and what you're open to discussing
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
          {/* Table Selector */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5 uppercase tracking-wider">
              1. Choose Your Table
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {TABLES.map((t) => {
                const occupant = allUsers.find(
                  (u) => u.tableId === t.id && u.id !== currentUser?.id
                );
                const isSelected = tableId === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTableId(t.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-stone-950 font-bold border-amber-400 shadow-md ring-2 ring-amber-400/50'
                        : occupant
                        ? 'bg-stone-950/60 border-stone-800 text-stone-400 opacity-60'
                        : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:border-stone-500'
                    }`}
                  >
                    <div className="text-xs font-bold">T{t.id}</div>
                    <div className="text-[9px] truncate">
                      {occupant ? occupant.name.split(' ')[0] : 'Free'}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Selected:{' '}
              <span className="text-amber-300 font-semibold">
                Table {tableId} ({TABLES.find((t) => t.id === tableId)?.zone})
              </span>
            </div>
          </div>

          {/* Name & Avatar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider">
                Name & Role
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Your Role or Headline (e.g. AI Researcher)"
                className="w-full mt-2 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider">
                Avatar Emoji
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-stone-950 border border-stone-800 rounded-xl max-h-[82px] overflow-y-auto">
                {AVATAR_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                      avatar === em
                        ? 'bg-amber-600 scale-110 shadow'
                        : 'hover:bg-stone-800'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Selector (The Core Laptop Mode) */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5 uppercase tracking-wider">
              2. Your Current Focus Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Deep Focus */}
              <button
                type="button"
                onClick={() => setStatus('focus')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  status === 'focus'
                    ? 'bg-rose-950/50 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Deep Focus</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Respect DND. Heads-down in flow state.
                </div>
              </button>

              {/* Coffee Break */}
              <button
                type="button"
                onClick={() => setStatus('break')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  status === 'break'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Coffee Break</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Taking 15m. Down to chat, play chess, or talk coffee.
                </div>
              </button>

              {/* Open to Collab */}
              <button
                type="button"
                onClick={() => setStatus('collab')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  status === 'collab'
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Open to Collab</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  Open to feedback, code review, or brainstorming.
                </div>
              </button>
            </div>
          </div>

          {/* What are you working on */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider">
              3. What Are You Working On Right Now?
            </label>
            <input
              type="text"
              required
              value={workingOn}
              onChange={(e) => setWorkingOn(e.target.value)}
              placeholder="e.g., Fine-tuning an AI agent, writing a grant proposal..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {PRESET_PROJECTS.slice(0, 3).map((proj) => (
                <button
                  key={proj}
                  type="button"
                  onClick={() => setWorkingOn(proj)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  {proj}
                </button>
              ))}
            </div>
          </div>

          {/* Current Drink in hand */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Drink In Hand</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_DRINKS.map((dr) => (
                <button
                  key={dr}
                  type="button"
                  onClick={() => setCurrentDrink(dr)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    currentDrink === dr
                      ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {dr}
                </button>
              ))}
            </div>
          </div>

          {/* Topics & Interests */}
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Topics You Love Discussing</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TOPICS.map((tag) => {
                const active = interestedIn.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-300'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  onCheckOut();
                  onClose();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 px-3 py-2 rounded-xl hover:bg-rose-950/30 transition-colors"
              >
                Vacate Table & Check Out
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-950/60 transition-all"
              >
                Save & Set Status
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
