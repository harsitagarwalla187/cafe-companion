import React, { useState } from 'react';
import { Sparkles, Coffee, Laptop, Key, RefreshCw, Users, HelpCircle, ShieldCheck } from 'lucide-react';
import { UserPresence, FocusStatus } from '../types';
import { GeminiService } from '../services/gemini';

interface HeaderProps {
  currentUser: UserPresence | null;
  onOpenCheckIn: () => void;
  onOpenApiKeyModal: () => void;
  allUsers: UserPresence[];
  onSwitchUser: (userId: string) => void;
  onResetData: () => void;
  activeTab: 'radar' | 'wall' | 'insights';
  setActiveTab: (tab: 'radar' | 'wall' | 'insights') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenCheckIn,
  onOpenApiKeyModal,
  allUsers,
  onSwitchUser,
  onResetData,
  activeTab,
  setActiveTab,
}) => {
  const [showPerspectiveMenu, setShowPerspectiveMenu] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const hasCustomKey = GeminiService.hasApiKey();

  const getStatusBadge = (status: FocusStatus) => {
    switch (status) {
      case 'focus':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-500',
          label: 'Deep Focus (DND)',
        };
      case 'break':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          label: 'Coffee Break',
        };
      case 'collab':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          label: 'Open to Collab',
        };
    }
  };

  const statusInfo = currentUser ? getStatusBadge(currentUser.status) : null;

  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-500/30">
            <Coffee className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-100">
                The Third Place
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30">
                <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
                Google Cloud & Gemini
              </span>
            </div>
            <p className="text-xs text-stone-400">
              AI-Powered Coworking Radar & Community Matchmaker
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <div className="flex items-center bg-stone-900/90 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Table Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('wall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'wall'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Café Guestbook</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'insights'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Barista Room Pulse</span>
          </button>
        </div>

        {/* Right: User Status & Controls */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
              <span className="text-xl" title={currentUser.name}>
                {currentUser.avatar}
              </span>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] text-stone-400">
                    (Table {currentUser.tableId})
                  </span>
                </div>
                {statusInfo && (
                  <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                    <span>{statusInfo.label}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onOpenCheckIn}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/30 transition-all ml-1"
              >
                Edit Mode
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenCheckIn}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-900 font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all shadow-amber-950/40"
            >
              <Coffee className="w-4 h-4" />
              <span>Check In at a Table</span>
            </button>
          )}

          {/* Perspective Switcher for easy judging demo */}
          <div className="relative">
            <button
              onClick={() => setShowPerspectiveMenu(!showPerspectiveMenu)}
              title="Switch Perspective / Test different tables"
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden xl:inline text-stone-400">Switch Table</span>
            </button>

            {showPerspectiveMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[11px] font-semibold text-stone-400 px-2 py-1 border-b border-stone-800 mb-1">
                  Demo: View Café as Different Guest
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setShowPerspectiveMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                        currentUser?.id === u.id
                          ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                          : 'hover:bg-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{u.avatar}</span>
                        <div>
                          <div className="font-medium text-stone-200">{u.name}</div>
                          <div className="text-[10px] text-stone-400">
                            Table {u.tableId} • {u.role.split('@')[0]}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.status === 'focus'
                            ? 'bg-rose-500'
                            : u.status === 'break'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="border-t border-stone-800 mt-2 pt-1">
                  <button
                    onClick={() => {
                      onResetData();
                      setShowPerspectiveMenu(false);
                    }}
                    className="w-full text-left px-2 py-1 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded"
                  >
                    Reset Demo State to Defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Gemini API Key Toggle */}
          <button
            onClick={onOpenApiKeyModal}
            title={hasCustomKey ? 'Gemini API Key active' : 'Configure Gemini API Key (Free)'}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              hasCustomKey
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {hasCustomKey ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Key className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden lg:inline text-[11px]">
              {hasCustomKey ? 'Gemini Flash' : 'Gemini Key'}
            </span>
          </button>

          {/* Info Modal Toggle */}
          <button
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            title="How this works"
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Demo Info Dropdown */}
      {showDemoInfo && (
        <div className="border-t border-stone-800 bg-stone-900/95 px-6 py-3 text-xs text-stone-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-amber-400">Google Cloud Builder Pop-Up Concept:</span>{' '}
              "The Café Companion" turns isolated laptop workers into serendipitous collaborators.
              Use <strong className="text-stone-100">Table Radar</strong> to see statuses (🔴 Focus / 🟡 Break / 🟢 Collab), click{' '}
              <strong className="text-amber-300">"⚡ Match with Gemini"</strong> for 3 personalized, zero-awkward icebreakers, or post to the{' '}
              <strong className="text-stone-100">Café Guestbook</strong>!
            </div>
            <button
              onClick={() => setShowDemoInfo(false)}
              className="text-stone-400 hover:text-stone-200 underline text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
