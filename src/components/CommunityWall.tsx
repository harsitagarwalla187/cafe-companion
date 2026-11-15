import React, { useState } from 'react';
import { GuestbookNote, UserPresence } from '../types';
import { Sparkles, Heart, Send, MessageCircle, Tag, Coffee } from 'lucide-react';

interface CommunityWallProps {
  notes: GuestbookNote[];
  currentUser: UserPresence | null;
  onAddNote: (content: string, tags?: string[]) => void;
  onLikeNote: (id: string) => void;
  onOpenCheckIn: () => void;
}

export const CommunityWall: React.FC<CommunityWallProps> = ({
  notes,
  currentUser,
  onAddNote,
  onLikeNote,
  onOpenCheckIn,
}) => {
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('#DailyPrompt');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote(content.trim(), [selectedTag]);
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Daily Café Prompt Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Today's Café Prompt</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-100 leading-snug">
              "What is a tool, prompt, or technique you recently discovered that completely shifted how you build or work?"
            </h2>
            <p className="text-xs text-stone-400">
              Leave a thought on the wall below for fellow café nomads to see!
            </p>
          </div>

          <div className="flex-shrink-0 text-center bg-stone-950/70 border border-stone-800 p-3 rounded-2xl">
            <div className="text-xs text-stone-400 font-medium">Wall Notes</div>
            <div className="text-2xl font-black text-amber-400">{notes.length}</div>
            <div className="text-[10px] text-stone-500">Live from tables</div>
          </div>
        </div>
      </div>

      {/* Post a Sticky Note Input */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-amber-400" />
              <span>
                {currentUser
                  ? `Leave a note from Table ${currentUser.tableId}`
                  : 'Leave a note on the wall'}
              </span>
            </span>
            {currentUser && (
              <span className="text-[11px] text-amber-300 font-medium">
                Posting as {currentUser.name} ({currentUser.avatar})
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                currentUser
                  ? 'Share your answer to the prompt, a quick tip, a book rec, or a coffee thought...'
                  : 'Check in at a table first to leave a signed note, or write anonymously...'
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-stone-400 text-[11px]">Tag:</span>
              {['#DailyPrompt', '#CoffeeThought', '#TechTip', '#CollabOffer'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    selectedTag === tag
                      ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!currentUser && (
                <button
                  type="button"
                  onClick={onOpenCheckIn}
                  className="text-xs text-amber-400 hover:underline px-2 py-1"
                >
                  Set My Table &rarr;
                </button>
              )}
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Stick on Wall</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const statusDot =
            note.status === 'focus'
              ? 'bg-rose-500'
              : note.status === 'break'
              ? 'bg-amber-400'
              : 'bg-emerald-400';

          return (
            <div
              key={note.id}
              className="bg-stone-900/80 border border-stone-800/90 rounded-2xl p-4 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all group min-h-[140px]"
            >
              {/* Header: Author & Table */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{note.authorAvatar}</span>
                  <div>
                    <div className="text-xs font-bold text-stone-200">
                      {note.authorName}
                    </div>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                      <span>Table {note.tableId}</span>
                    </div>
                  </div>
                </div>

                {note.tags && note.tags[0] && (
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-700/30">
                    {note.tags[0]}
                  </span>
                )}
              </div>

              {/* Note Content */}
              <p className="text-xs text-stone-200 my-3 leading-relaxed font-sans">
                "{note.content}"
              </p>

              {/* Footer: Timestamp & Likes */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-[11px] text-stone-400">
                <span className="text-[10px] text-stone-500">
                  {Math.max(1, Math.round((Date.now() - note.timestamp) / 60000))}m ago
                </span>

                <button
                  onClick={() => onLikeNote(note.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-950/60 hover:bg-stone-800 text-stone-300 hover:text-rose-400 transition-colors border border-stone-800"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400/80 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs">{note.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
