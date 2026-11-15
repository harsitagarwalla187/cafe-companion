import React, { useState, useEffect } from 'react';
import { UserPresence, GuestbookNote, CoffeeToast } from './types';
import { realtimeStore } from './services/realtime';
import { Header } from './components/Header';
import { CafeFloorPlan } from './components/CafeFloorPlan';
import { CommunityWall } from './components/CommunityWall';
import { RoomPulseView } from './components/RoomPulseView';
import { UserProfileModal } from './components/UserProfileModal';
import { CheckInModal } from './components/CheckInModal';
import { MatchmakerModal } from './components/MatchmakerModal';
import { CoffeeToastModal } from './components/CoffeeToastModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ToastBanner } from './components/ToastBanner';
import { Sparkles, Coffee, Heart, Laptop, ArrowRight } from 'lucide-react';

export function App() {
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [notes, setNotes] = useState<GuestbookNote[]>([]);
  const [toasts, setToasts] = useState<CoffeeToast[]>([]);
  const [currentUser, setCurrentUser] = useState<UserPresence | null>(null);

  const [activeTab, setActiveTab] = useState<'radar' | 'wall' | 'insights'>('radar');

  // Modals state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedTableForCheckIn, setSelectedTableForCheckIn] = useState<number | null>(null);
  const [profileModalUser, setProfileModalUser] = useState<UserPresence | null>(null);
  const [matchmakerOpen, setMatchmakerOpen] = useState(false);
  const [matchmakerTarget, setMatchmakerTarget] = useState<UserPresence | null>(null);
  const [toastModalTarget, setToastModalTarget] = useState<UserPresence | null>(null);
  const [toastInitialMessage, setToastInitialMessage] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [bannerToast, setBannerToast] = useState<CoffeeToast | null>(null);

  // Sync state with realtime store
  const refreshFromStore = () => {
    const currentUsers = realtimeStore.getUsers();
    setUsers(currentUsers);
    setNotes(realtimeStore.getNotes());
    const allToasts = realtimeStore.getToasts();
    setToasts(allToasts);
    setCurrentUser(realtimeStore.getCurrentUser());
  };

  useEffect(() => {
    refreshFromStore();
    const unsubscribe = realtimeStore.subscribe(() => {
      refreshFromStore();
    });
    return unsubscribe;
  }, []);

  // When a toast is added, trigger banner if it's sent to current user or if current user sent it
  const handleSendToast = (
    targetUserId: string,
    targetName: string,
    targetTable: number,
    message: string,
    emoji: string
  ) => {
    const newToast = realtimeStore.sendToast(
      targetUserId,
      targetName,
      targetTable,
      message,
      emoji
    );
    setBannerToast(newToast);
  };

  const handleOpenToastModal = (target: UserPresence, message?: string) => {
    setToastModalTarget(target);
    setToastInitialMessage(message || '');
  };

  const handleTriggerMatchWithTarget = (target: UserPresence) => {
    setProfileModalUser(null);
    setMatchmakerTarget(target);
    setMatchmakerOpen(true);
  };

  const handleTriggerGeneralMatch = () => {
    setMatchmakerTarget(null);
    setMatchmakerOpen(true);
  };

  const handleSelectTableForCheckIn = (tableId: number) => {
    setSelectedTableForCheckIn(tableId);
    setShowCheckInModal(true);
  };

  // Safe fallback current user if not checked in yet
  const effectiveCurrentUser: UserPresence = currentUser || {
    id: 'user-demo-guest',
    name: 'Taylor Reed (You)',
    avatar: '🚀',
    tableId: 4,
    tableLabel: 'Table 4 (Center Hall)',
    status: 'collab',
    role: 'Full-Stack Developer & AI Enthusiast',
    workingOn: 'Building an AI agent with Gemini 2.0 Flash',
    interestedIn: ['Gemini', 'React', 'AI Agents', 'Specialty Coffee'],
    currentDrink: 'Iced Oat Cortado',
    checkedInAt: Date.now() - 10 * 60 * 1000,
    isCurrentUser: true,
  };

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Global Navigation Header */}
      <Header
        currentUser={currentUser}
        onOpenCheckIn={() => {
          setSelectedTableForCheckIn(null);
          setShowCheckInModal(true);
        }}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        allUsers={users}
        onSwitchUser={(userId) => realtimeStore.switchActiveUser(userId)}
        onResetData={() => realtimeStore.resetToDefaults()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick Check-in Prompt Banner if not checked in */}
        {!currentUser && (
          <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-stone-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                ☕
              </span>
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  You are currently in spectator mode
                </div>
                <div className="text-sm font-semibold text-stone-200">
                  Pick an empty table or set your laptop focus mode to discover connections in the room!
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedTableForCheckIn(null);
                setShowCheckInModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/50"
            >
              <span>Check In at a Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Table Radar (Floor Plan) */}
        {activeTab === 'radar' && (
          <CafeFloorPlan
            users={users}
            currentUser={currentUser}
            onSelectUser={(u) => setProfileModalUser(u)}
            onSelectTableForCheckIn={handleSelectTableForCheckIn}
            onTriggerGeminiMatch={handleTriggerGeneralMatch}
          />
        )}

        {/* Tab 2: Café Guestbook Wall */}
        {activeTab === 'wall' && (
          <CommunityWall
            notes={notes}
            currentUser={currentUser}
            onAddNote={(content, tags) => realtimeStore.addNote(content, tags)}
            onLikeNote={(id) => realtimeStore.likeNote(id)}
            onOpenCheckIn={() => setShowCheckInModal(true)}
          />
        )}

        {/* Tab 3: Barista & Room Pulse */}
        {activeTab === 'insights' && (
          <RoomPulseView users={users} notes={notes} toasts={toasts} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-stone-800/80 bg-stone-950/90 py-5 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300">The Third Place</span>
            <span>•</span>
            <span>Google Cloud Builder Pop-Up Hackathon</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span className="inline-flex items-center gap-1 text-blue-300">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Gemini 2.0 / 1.5 Flash
            </span>
            <span>•</span>
            <span>Zero-Cost Serverless Realtime</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* User Profile Modal (when a table is clicked) */}
      {profileModalUser && (
        <UserProfileModal
          user={profileModalUser}
          currentUser={currentUser}
          onClose={() => setProfileModalUser(null)}
          onMatchWithUser={handleTriggerMatchWithTarget}
          onSendToast={(target) => handleOpenToastModal(target)}
          onEditOwnProfile={() => {
            setProfileModalUser(null);
            setShowCheckInModal(true);
          }}
        />
      )}

      {/* Check In / Edit Laptop Mode Modal */}
      {showCheckInModal && (
        <CheckInModal
          currentUser={currentUser}
          selectedTableId={selectedTableForCheckIn}
          allUsers={users}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedTableForCheckIn(null);
          }}
          onSave={(data) => {
            realtimeStore.checkIn(data);
          }}
          onCheckOut={() => {
            realtimeStore.checkOut();
          }}
        />
      )}

      {/* Gemini AI Matchmaker & Icebreakers Modal */}
      {matchmakerOpen && (
        <MatchmakerModal
          currentUser={effectiveCurrentUser}
          candidates={users}
          targetUser={matchmakerTarget}
          onClose={() => {
            setMatchmakerOpen(false);
            setMatchmakerTarget(null);
          }}
          onSendToast={(target, message) => {
            handleOpenToastModal(target, message);
          }}
        />
      )}

      {/* Send Coffee Toast Modal */}
      {toastModalTarget && (
        <CoffeeToastModal
          targetUser={toastModalTarget}
          currentUser={currentUser}
          initialMessage={toastInitialMessage}
          onClose={() => {
            setToastModalTarget(null);
            setToastInitialMessage('');
          }}
          onSend={handleSendToast}
        />
      )}

      {/* Free Gemini API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
          onKeySaved={refreshFromStore}
        />
      )}

      {/* Realtime Toast Banner */}
      <ToastBanner
        toast={bannerToast}
        onDismiss={() => setBannerToast(null)}
      />
    </div>
  );
}

export default App;
