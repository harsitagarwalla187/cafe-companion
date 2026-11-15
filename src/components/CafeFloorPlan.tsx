import React, { useState } from 'react';
import { UserPresence, FocusStatus, TableSlot } from '../types';
import { TABLES } from '../services/realtime';
import { Coffee, Sparkles, Zap, Laptop, Volume2, ShieldCheck, UserCheck } from 'lucide-react';

interface CafeFloorPlanProps {
  users: UserPresence[];
  currentUser: UserPresence | null;
  onSelectUser: (user: UserPresence) => void;
  onSelectTableForCheckIn: (tableId: number) => void;
  onTriggerGeminiMatch: () => void;
}

export const CafeFloorPlan: React.FC<CafeFloorPlanProps> = ({
  users,
  currentUser,
  onSelectUser,
  onSelectTableForCheckIn,
  onTriggerGeminiMatch,
}) => {
  const [filter, setFilter] = useState<'all' | FocusStatus>('all');
  const [hoveredTableId, setHoveredTableId] = useState<number | null>(null);

  const getTableOccupant = (tableId: number) => {
    return users.find((u) => u.tableId === tableId);
  };

  const filteredTables = TABLES.filter((t) => {
    if (filter === 'all') return true;
    const occ = getTableOccupant(t.id);
    return occ?.status === filter;
  });

  const getStatusColor = (status: FocusStatus) => {
    switch (status) {
      case 'focus':
        return {
          border: 'border-rose-500/70',
          glow: 'shadow-lg shadow-rose-950/60 ring-2 ring-rose-500/40',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-500',
          label: 'Deep Focus',
          ringAnim: '',
        };
      case 'break':
        return {
          border: 'border-amber-500/80',
          glow: 'shadow-lg shadow-amber-950/60 ring-2 ring-amber-500/50',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'Coffee Break',
          ringAnim: 'radar-pulse-amber',
        };
      case 'collab':
        return {
          border: 'border-emerald-500/80',
          glow: 'shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/50',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'Open to Collab',
          ringAnim: 'radar-pulse-green',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <span>Café Floor Radar</span>
              <span className="text-xs font-normal text-stone-400">
                (Click any table to view occupant or connect)
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Deep Focus (Respect DND)</span>
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Coffee Break</span>
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Open to Collab</span>
            </span>
          </div>
        </div>

        {/* Filter Pills & AI Catalyst CTA */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-stone-800 text-stone-100 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setFilter('collab')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'collab'
                  ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-500/40'
                  : 'text-stone-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Collab
            </button>
            <button
              onClick={() => setFilter('break')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'break'
                  ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-stone-400 hover:text-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Break
            </button>
            <button
              onClick={() => setFilter('focus')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'focus'
                  ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-500/40'
                  : 'text-stone-400 hover:text-rose-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Focus
            </button>
          </div>

          {/* Gemini AI Matchmaker CTA Button */}
          <button
            onClick={onTriggerGeminiMatch}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-950/60 border border-amber-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>⚡ Find My Match with Gemini</span>
          </button>
        </div>
      </div>

      {/* 2D Interactive Architectural Floor Map */}
      <div className="relative rounded-3xl border border-stone-800/90 bg-gradient-to-b from-stone-950 via-[#14120f] to-[#1a1714] p-4 sm:p-6 overflow-hidden shadow-2xl">
        {/* Subtle floor grid texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #f59e0b 1px, transparent 1px), linear-gradient(to right, #292524 1px, transparent 1px), linear-gradient(to bottom, #292524 1px, transparent 1px)',
            backgroundSize: '32px 32px, 64px 64px, 64px 64px',
          }}
        />

        {/* Ambient zones layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* ZONE 1: Window Bar Counter (Left Column, md:col-span-3) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-4 bg-stone-900/40 p-4 rounded-2xl border border-stone-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-200">
                <Laptop className="w-3.5 h-3.5 text-amber-400" />
                <span>Window Counter</span>
              </div>
              <span className="text-[10px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-full">
                Power Outlets ⚡
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
              {[1, 2].map((id) => {
                const table = TABLES.find((t) => t.id === id)!;
                const occ = getTableOccupant(id);
                return renderTableCard(table, occ);
              })}
            </div>
            <div className="text-[10px] text-center text-stone-500 italic">
              Overlooks the street • High natural light
            </div>
          </div>

          {/* ZONE 2: Central Coworking & Espresso Bar (Center Column, md:col-span-5) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-4">
            {/* Espresso Bar Header & Pastry Counter */}
            <div className="bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/30 p-3.5 rounded-2xl border border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <span>Espresso Bar & Pastry Lab</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Brewing: Single-Origin Ethiopian Guji
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono text-amber-300/80 bg-amber-950/60 px-2 py-1 rounded-md border border-amber-700/30">
                  Prep: ~3 mins
                </span>
              </div>
            </div>

            {/* Center Tables */}
            <div className="bg-stone-900/40 p-4 rounded-2xl border border-stone-800/60 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                <div className="text-xs font-semibold text-stone-200">
                  Central Coworking Tables
                </div>
                <span className="text-[10px] text-stone-400">Spacious • 4 Seats</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[3, 4].map((id) => {
                  const table = TABLES.find((t) => t.id === id)!;
                  const occ = getTableOccupant(id);
                  return renderTableCard(table, occ);
                })}
              </div>
            </div>

            {/* Ambient Acoustic indicator */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-900/60 border border-stone-800/50 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Ambient Sound: Lo-Fi Chillhop (54 dB)</span>
              </div>
              <span className="text-emerald-400 font-medium">Optimal Focus</span>
            </div>
          </div>

          {/* ZONE 3: Quiet Booths & Garden Patio (Right Column, md:col-span-4) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-4">
            {/* Quiet Booths */}
            <div className="bg-stone-900/40 p-3.5 rounded-2xl border border-stone-800/60 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5">
                <div className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Quiet Acoustic Booths</span>
                </div>
                <span className="text-[10px] text-stone-400">Deep Work</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[5, 6].map((id) => {
                  const table = TABLES.find((t) => t.id === id)!;
                  const occ = getTableOccupant(id);
                  return renderTableCard(table, occ);
                })}
              </div>
            </div>

            {/* Sunlit Patio */}
            <div className="bg-stone-900/40 p-3.5 rounded-2xl border border-stone-800/60 backdrop-blur-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5">
                <div className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                  <span>🌿 Sunlit Garden Patio</span>
                </div>
                <span className="text-[10px] text-stone-400">Outdoor</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[7, 8].map((id) => {
                  const table = TABLES.find((t) => t.id === id)!;
                  const occ = getTableOccupant(id);
                  return renderTableCard(table, occ);
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function renderTableCard(table: TableSlot, occupant?: UserPresence) {
    const isCurrent = occupant?.id === currentUser?.id;
    const statusCfg = occupant ? getStatusColor(occupant.status) : null;
    const isHovered = hoveredTableId === table.id;

    if (!occupant) {
      return (
        <button
          key={table.id}
          onClick={() => onSelectTableForCheckIn(table.id)}
          onMouseEnter={() => setHoveredTableId(table.id)}
          onMouseLeave={() => setHoveredTableId(null)}
          className="w-full text-left p-3 rounded-xl border border-dashed border-stone-700/80 bg-stone-900/30 hover:bg-stone-800/50 hover:border-amber-500/50 transition-all group flex flex-col justify-between min-h-[92px]"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-stone-400 group-hover:text-amber-300 transition-colors">
              Table {table.id}
            </span>
            <span className="text-[10px] text-stone-500 group-hover:text-stone-300">
              Vacant
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 group-hover:text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-600 group-hover:bg-amber-400 transition-colors" />
            <span>Tap to sit here</span>
          </div>
          <div className="text-[10px] text-stone-400">
            {table.zone} {table.hasPowerOutlets && '• ⚡ Outlets'}
          </div>
        </button>
      );
    }

    return (
      <button
        key={table.id}
        onClick={() => onSelectUser(occupant)}
        onMouseEnter={() => setHoveredTableId(table.id)}
        onMouseLeave={() => setHoveredTableId(null)}
        className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group min-h-[110px] flex flex-col justify-between ${
          statusCfg?.border
        } ${statusCfg?.glow} ${
          isCurrent
            ? 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border-amber-500/80 ring-2 ring-amber-500/50'
            : 'bg-stone-900/80 hover:bg-stone-800/90'
        }`}
      >
        {/* Glow pill behind card for break/collab */}
        {statusCfg?.ringAnim && (
          <div className={`absolute -right-2 -top-2 w-8 h-8 rounded-full ${statusCfg.ringAnim} opacity-40`} />
        )}

        {/* Header: Table # & Status Badge */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-stone-200">
              Table {table.id}
            </span>
            {isCurrent && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 flex items-center gap-0.5">
                YOU
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusCfg?.badgeBg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg?.dot}`} />
            <span>{statusCfg?.label}</span>
          </span>
        </div>

        {/* Center: Avatar, Name & Current Work */}
        <div className="my-1.5 flex items-start gap-2">
          <div className="text-2xl flex-shrink-0 bg-stone-800/80 rounded-lg p-1 border border-stone-700/50">
            {occupant.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-stone-100 truncate group-hover:text-amber-200 transition-colors">
              {occupant.name}
            </div>
            <div className="text-[11px] text-stone-400 line-clamp-1">
              {occupant.role.split('@')[0]}
            </div>
            <div className="text-[10px] text-amber-200/90 line-clamp-1 italic mt-0.5">
              "{occupant.workingOn}"
            </div>
          </div>
        </div>

        {/* Footer: Drink & Tags */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-800/60 pt-1.5 mt-0.5">
          <span className="truncate max-w-[120px] text-stone-400 flex items-center gap-1">
            <span>☕</span>
            <span className="truncate">{occupant.currentDrink}</span>
          </span>
          <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-0.5">
            View & Match &rarr;
          </span>
        </div>
      </button>
    );
  }
};
