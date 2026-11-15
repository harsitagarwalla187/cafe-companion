import React from 'react';
import { UserPresence, FocusStatus } from '../types';
import { X, Sparkles, Coffee, Laptop, Tag, Clock, Send, Edit3, CheckCircle } from 'lucide-react';

interface UserProfileModalProps {
  user: UserPresence | null;
  currentUser: UserPresence | null;
  onClose: () => void;
  onMatchWithUser: (user: UserPresence) => void;
  onSendToast: (user: UserPresence) => void;
  onEditOwnProfile: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  currentUser,
  onClose,
  onMatchWithUser,
  onSendToast,
  onEditOwnProfile,
}) => {
  if (!user) return null;

  const isSelf = user.id === currentUser?.id;

  const getStatusDisplay = (status: FocusStatus) => {
    switch (status) {
      case 'focus':
        return {
          label: 'Deep Focus Mode',
          sub: 'Please do not disturb. Currently heads-down in flow state.',
          pill: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
        };
      case 'break':
        return {
          label: 'Coffee Break',
          sub: 'Stepping back for 15 mins. Open to casual chat or coffee talk!',
          pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'collab':
        return {
          label: 'Open to Collab & Peer Review',
          sub: 'Actively welcoming feedback, brainstorming, or code/design reviews!',
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
    }
  };

  const statusInfo = getStatusDisplay(user.status);
  const minutesSeated = Math.max(1, Math.round((Date.now() - user.checkedInAt) / 60000));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Avatar & Main info */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-16 h-16 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-stone-100 truncate">{user.name}</h3>
              {isSelf && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                  YOU
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-amber-200/90">{user.role}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Table {user.tableId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Seated {minutesSeated}m ago
              </span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className={`mt-5 p-3.5 rounded-2xl border ${statusInfo.pill} space-y-1`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`} />
            <span>{statusInfo.label}</span>
          </div>
          <p className="text-xs text-stone-300">{statusInfo.sub}</p>
        </div>

        {/* What they're working on */}
        <div className="mt-4 space-y-1">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-amber-400" />
            <span>Currently Working On</span>
          </label>
          <div className="p-3 bg-stone-950/70 border border-stone-800/80 rounded-xl text-sm text-stone-200 italic font-sans">
            "{user.workingOn}"
          </div>
        </div>

        {/* Vibe / Bio if present */}
        {user.vibeBio && (
          <div className="mt-3 text-xs text-stone-400 bg-stone-950/40 p-2.5 rounded-xl border border-stone-800/40">
            <span className="font-semibold text-stone-300">Table Note: </span>
            {user.vibeBio}
          </div>
        )}

        {/* Interests & Current Drink */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1.5 flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Drink in Hand</span>
            </span>
            <span className="text-stone-200 font-medium">{user.currentDrink}</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 font-semibold block mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Interests & Topics</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {user.interestedIn.map((tag, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          {isSelf ? (
            <button
              onClick={onEditOwnProfile}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit My Laptop Mode / Status</span>
            </button>
          ) : (
            <>
              {/* Primary AI Match Trigger */}
              <button
                onClick={() => onMatchWithUser(user)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>⚡ Gemini Match & Icebreakers</span>
              </button>

              {/* Send Coffee Toast */}
              <button
                onClick={() => onSendToast(user)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-all"
              >
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Send Coffee Toast ☕</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
