export type FocusStatus = 'focus' | 'break' | 'collab';

export interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  tableId: number; // 1 to 8
  tableLabel?: string;
  status: FocusStatus;
  role: string;
  workingOn: string;
  interestedIn: string[];
  currentDrink: string;
  vibeBio?: string;
  checkedInAt: number;
  isCurrentUser?: boolean;
}

export interface TableSlot {
  id: number;
  label: string;
  zone: 'Window Counter' | 'Center Hall' | 'Quiet Booth' | 'Sunlit Patio' | 'Barista Bar';
  capacity: number;
  hasPowerOutlets: boolean;
  x: number; // percentage coordinates for visual floor plan
  y: number;
}

export interface MatchResult {
  targetUserId: string;
  targetUser: UserPresence;
  matchScore: number; // 0-100
  headline: string;
  sharedVibe: string;
  icebreakers: string[];
  suggestedAction: string;
}

export interface GuestbookNote {
  id: string;
  authorName: string;
  authorAvatar: string;
  tableId: number;
  status: FocusStatus;
  content: string;
  likes: number;
  timestamp: number;
  tags?: string[];
}

export interface CoffeeToast {
  id: string;
  fromName: string;
  fromTable: number;
  toUserId: string;
  toName: string;
  toTable: number;
  message: string;
  drinkEmoji: string;
  timestamp: number;
  read: boolean;
}

export interface CafeVibeReport {
  roomSentiment: string;
  totalPresent: number;
  focusCount: number;
  breakCount: number;
  collabCount: number;
  musicVibe: string;
  crowdEnergy: 'Deep Flow' | 'Gentle Buzz' | 'Social Mixer' | 'Evening Chill';
  dailyPrompt: string;
}
