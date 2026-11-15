import { UserPresence, GuestbookNote, CoffeeToast, TableSlot, FocusStatus } from '../types';

export const TABLES: TableSlot[] = [
  { id: 1, label: 'Table 1', zone: 'Window Counter', capacity: 2, hasPowerOutlets: true, x: 18, y: 24 },
  { id: 2, label: 'Table 2', zone: 'Window Counter', capacity: 2, hasPowerOutlets: true, x: 38, y: 24 },
  { id: 3, label: 'Table 3', zone: 'Center Hall', capacity: 4, hasPowerOutlets: true, x: 22, y: 55 },
  { id: 4, label: 'Table 4', zone: 'Center Hall', capacity: 4, hasPowerOutlets: false, x: 48, y: 55 },
  { id: 5, label: 'Table 5', zone: 'Quiet Booth', capacity: 2, hasPowerOutlets: true, x: 74, y: 26 },
  { id: 6, label: 'Table 6', zone: 'Quiet Booth', capacity: 2, hasPowerOutlets: true, x: 86, y: 26 },
  { id: 7, label: 'Table 7', zone: 'Sunlit Patio', capacity: 3, hasPowerOutlets: false, x: 72, y: 65 },
  { id: 8, label: 'Table 8', zone: 'Sunlit Patio', capacity: 3, hasPowerOutlets: false, x: 88, y: 65 },
];

const INITIAL_USERS: UserPresence[] = [
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    avatar: '👩🏽‍💻',
    tableId: 1,
    tableLabel: 'Table 1 (Window)',
    status: 'focus',
    role: 'AI Researcher @ DeepTech',
    workingOn: 'Fine-tuning Gemini 1.5 Pro on multimodal medical diagrams',
    interestedIn: ['Gemini', 'PyTorch', 'Vector DBs', 'Sci-Fi'],
    currentDrink: 'Iced Oat Cortado',
    vibeBio: 'Cracking latency benchmarks. Heads down for the next 2 hrs, but wave if you love LLMs!',
    checkedInAt: Date.now() - 45 * 60 * 1000,
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    avatar: '👨🏻‍💻',
    tableId: 3,
    tableLabel: 'Table 3 (Center)',
    status: 'break',
    role: 'Indie Hacker & Mobile Dev',
    workingOn: 'Just launched my Flutter habit tracker app, taking a breather',
    interestedIn: ['Flutter', 'Micro-SaaS', 'Specialty Coffee', 'Chess', 'Indie Hacking'],
    currentDrink: 'Ethiopian Single-Origin Pour-over',
    vibeBio: 'Need a 15-min brain break! Down for rapid chess, talking indie products, or coffee brewing.',
    checkedInAt: Date.now() - 25 * 60 * 1000,
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    avatar: '🎨',
    tableId: 5,
    tableLabel: 'Table 5 (Booth)',
    status: 'collab',
    role: 'Lead Product Designer',
    workingOn: 'Redesigning a fintech onboarding flow in Figma. Would love fresh eyes!',
    interestedIn: ['Design Systems', 'UX Research', 'Typography', 'Matcha', 'Startups'],
    currentDrink: 'Ceremonial Matcha Latte',
    vibeBio: 'Looking for 3 minutes of peer feedback on a signup flow. Can trade UI critique in exchange!',
    checkedInAt: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 'user-liam',
    name: 'Liam Vance',
    avatar: '✍️',
    tableId: 7,
    tableLabel: 'Table 7 (Patio)',
    status: 'break',
    role: 'Author & Game Writer',
    workingOn: 'Drafting worldbuilding lore for a solarpunk narrative RPG',
    interestedIn: ['Worldbuilding', 'Solarpunk', 'Narrative Design', 'Espresso', 'Board Games'],
    currentDrink: 'Double Espresso Romano',
    vibeBio: 'Enjoying the sun before hitting chapter 6. Always open to discussing weird sci-fi concepts.',
    checkedInAt: Date.now() - 90 * 60 * 1000,
  },
  {
    id: 'user-kai',
    name: 'Kai Tanaka',
    avatar: '⚡',
    tableId: 2,
    tableLabel: 'Table 2 (Window)',
    status: 'collab',
    role: 'Full-Stack & Cloud Builder',
    workingOn: 'Connecting Gemini Live Audio API with Cloud Run websockets',
    interestedIn: ['Google Cloud', 'Cloud Run', 'WebSockets', 'Go', 'Hackathons'],
    currentDrink: 'Cold Brew with Vanilla Foam',
    vibeBio: 'Competing in the Google Cloud Builder pop-up! Open to brainstorm architectures or exchange snacks.',
    checkedInAt: Date.now() - 15 * 60 * 1000,
  }
];

const INITIAL_NOTES: GuestbookNote[] = [
  {
    id: 'note-1',
    authorName: 'Alex Rivera',
    authorAvatar: '👨🏻‍💻',
    tableId: 3,
    status: 'break',
    content: 'The barista today made the single origin Ethiopian pour-over taste like jasmine and berries. 10/10.',
    likes: 6,
    timestamp: Date.now() - 35 * 60 * 1000,
    tags: ['#CoffeeReview', '#PourOver']
  },
  {
    id: 'note-2',
    authorName: 'Elena Rostova',
    authorAvatar: '🎨',
    tableId: 5,
    status: 'collab',
    content: 'Daily prompt answer: The hill I will die on is that dark mode is NOT just inverted hex values, you need proper contrast depth!',
    likes: 12,
    timestamp: Date.now() - 20 * 60 * 1000,
    tags: ['#DesignRant', '#DailyPrompt']
  },
  {
    id: 'note-3',
    authorName: 'Kai Tanaka',
    authorAvatar: '⚡',
    tableId: 2,
    status: 'collab',
    content: 'If anyone needs a USB-C to HDMI adapter or a second monitor cable, I have an extra at Table 2!',
    likes: 8,
    timestamp: Date.now() - 10 * 60 * 1000,
    tags: ['#TechSwap', '#Community']
  }
];

// Realtime Store with BroadcastChannel for seamless multi-tab demoing
class RealtimeStore {
  private channel: BroadcastChannel | null = null;
  private users: UserPresence[] = [];
  private notes: GuestbookNote[] = [];
  private toasts: CoffeeToast[] = [];
  private listeners: Set<() => void> = new Set();
  private currentUserId: string | null = null;

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('third_place_cafe_channel');
      this.channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC') {
          this.users = event.data.users || this.users;
          this.notes = event.data.notes || this.notes;
          this.toasts = event.data.toasts || this.toasts;
          this.notify();
        }
      };
    }
  }

  private loadFromStorage() {
    try {
      const savedUsers = localStorage.getItem('cafe_users');
      const savedNotes = localStorage.getItem('cafe_notes');
      const savedToasts = localStorage.getItem('cafe_toasts');
      const savedCurrentUserId = localStorage.getItem('cafe_current_user_id');

      this.users = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
      this.notes = savedNotes ? JSON.parse(savedNotes) : INITIAL_NOTES;
      this.toasts = savedToasts ? JSON.parse(savedToasts) : [];
      this.currentUserId = savedCurrentUserId || null;
    } catch {
      this.users = INITIAL_USERS;
      this.notes = INITIAL_NOTES;
      this.toasts = [];
    }
  }

  private saveAndBroadcast() {
    try {
      localStorage.setItem('cafe_users', JSON.stringify(this.users));
      localStorage.setItem('cafe_notes', JSON.stringify(this.notes));
      localStorage.setItem('cafe_toasts', JSON.stringify(this.toasts));
      if (this.currentUserId) {
        localStorage.setItem('cafe_current_user_id', this.currentUserId);
      } else {
        localStorage.removeItem('cafe_current_user_id');
      }
    } catch (e) {
      console.warn('Storage quota or error', e);
    }

    if (this.channel) {
      this.channel.postMessage({
        type: 'SYNC',
        users: this.users,
        notes: this.notes,
        toasts: this.toasts,
      });
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getUsers(): UserPresence[] {
    return this.users.map((u) => ({
      ...u,
      isCurrentUser: u.id === this.currentUserId,
    }));
  }

  public getCurrentUser(): UserPresence | null {
    if (!this.currentUserId) return null;
    return this.users.find((u) => u.id === this.currentUserId) || null;
  }

  public checkIn(user: Omit<UserPresence, 'id' | 'checkedInAt'> & { id?: string }): UserPresence {
    const id = user.id || `user-me-${Date.now()}`;
    const newUser: UserPresence = {
      ...user,
      id,
      checkedInAt: Date.now(),
      isCurrentUser: true,
    };

    // Remove any user currently occupying that specific table or previous session
    this.users = this.users.filter((u) => u.id !== id && u.tableId !== user.tableId);
    this.users.push(newUser);
    this.currentUserId = id;
    this.saveAndBroadcast();
    return newUser;
  }

  public updateStatus(status: FocusStatus, workingOn?: string, currentDrink?: string) {
    if (!this.currentUserId) return;
    this.users = this.users.map((u) => {
      if (u.id === this.currentUserId) {
        return {
          ...u,
          status,
          workingOn: workingOn !== undefined ? workingOn : u.workingOn,
          currentDrink: currentDrink !== undefined ? currentDrink : u.currentDrink,
        };
      }
      return u;
    });
    this.saveAndBroadcast();
  }

  public checkOut() {
    if (!this.currentUserId) return;
    this.users = this.users.filter((u) => u.id !== this.currentUserId);
    this.currentUserId = null;
    this.saveAndBroadcast();
  }

  public switchActiveUser(userId: string) {
    this.currentUserId = userId;
    localStorage.setItem('cafe_current_user_id', userId);
    this.notify();
  }

  public getNotes(): GuestbookNote[] {
    return [...this.notes].sort((a, b) => b.timestamp - a.timestamp);
  }

  public addNote(content: string, tags: string[] = []): GuestbookNote {
    const current = this.getCurrentUser() || {
      name: 'Café Guest',
      avatar: '☕',
      tableId: 4,
      status: 'break' as FocusStatus,
    };

    const newNote: GuestbookNote = {
      id: `note-${Date.now()}`,
      authorName: current.name,
      authorAvatar: current.avatar,
      tableId: current.tableId,
      status: current.status,
      content,
      likes: 0,
      timestamp: Date.now(),
      tags,
    };

    this.notes = [newNote, ...this.notes];
    this.saveAndBroadcast();
    return newNote;
  }

  public likeNote(id: string) {
    this.notes = this.notes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n));
    this.saveAndBroadcast();
  }

  public getToasts(): CoffeeToast[] {
    return this.toasts;
  }

  public sendToast(
    toUserId: string,
    toName: string,
    toTable: number,
    message: string,
    drinkEmoji = '☕'
  ): CoffeeToast {
    const fromUser = this.getCurrentUser();
    const newToast: CoffeeToast = {
      id: `toast-${Date.now()}`,
      fromName: fromUser ? fromUser.name : 'A Neighbor',
      fromTable: fromUser ? fromUser.tableId : 0,
      toUserId,
      toName,
      toTable,
      message,
      drinkEmoji,
      timestamp: Date.now(),
      read: false,
    };
    this.toasts = [newToast, ...this.toasts];
    this.saveAndBroadcast();
    return newToast;
  }

  public resetToDefaults() {
    this.users = INITIAL_USERS;
    this.notes = INITIAL_NOTES;
    this.toasts = [];
    this.currentUserId = null;
    this.saveAndBroadcast();
  }
}

export const realtimeStore = new RealtimeStore();
