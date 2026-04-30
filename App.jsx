import { useState, useEffect, useReducer, useRef, useMemo, useCallback } from "react";
import {
  Home, CheckSquare, Calendar, Target, MoreHorizontal, Plus, X, Trash2, Check,
  ChevronLeft, ChevronRight, Clock, Search, Mic, Settings, Bell, Zap,
  Coffee, Play, Pause, RotateCcw, ShoppingCart, BookOpen, Wallet, ChefHat,
  Download, Upload, Plane, Repeat, GripVertical, BarChart2, Sparkles, Edit3,
  MicOff, Dumbbell, Cake
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ════════════════════════════════════════════════════════════════════════════
// CSS
// ════════════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #000; --s0: #060606; --s1: #0E0E0E; --s2: #161616; --s3: #232323; --s4: #303030;
  --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.12);
  --lime: #AAFF00; --lime-soft: rgba(170,255,0,0.12); --lime-glow: rgba(170,255,0,0.4); --lime-dim: rgba(170,255,0,0.06);
  --text: #F5F5F5; --muted: #707070; --dim: #353535;
  --red: #FF3B3B; --red-soft: rgba(255,59,59,0.15);
  --amber: #FFB800; --cyan: #00E0FF; --pink: #FF2D78; --violet: #8B5CF6; --orange: #FF6B35;
  --r: 12px; --r-sm: 8px;
  font-family: 'Inter', system-ui, sans-serif; font-size: 16px;
  -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased;
}
html, body, #root { height: 100%; background: #000; color: var(--text); overflow: hidden; }
.display, h1, h2, h3 { font-family: 'Anton', sans-serif; letter-spacing: 0.005em; text-transform: uppercase; font-weight: 400; }
.mono { font-family: 'JetBrains Mono', monospace; }
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

.app { max-width: 460px; margin: 0 auto; height: 100vh; height: 100dvh; display: flex; flex-direction: column; position: relative; overflow: hidden; background: #000; border-left: 1px solid var(--border); border-right: 1px solid var(--border); }
.app::before {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image: url('${import.meta.env.BASE_URL}bg-pattern.jpeg');
  background-size: cover; background-position: center; background-repeat: no-repeat;
  opacity: 0.55;
}
.app::after {
  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse at top, rgba(0,0,0,0.4), rgba(0,0,0,0.85));
}
.app > * { position: relative; z-index: 1; }
.main { flex: 1; overflow-y: auto; padding: 14px 14px 80px; overscroll-behavior: contain; }

.topbar { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.logo { font-family: 'Anton'; font-size: 18px; letter-spacing: 0.06em; display: flex; align-items: center; gap: 6px; color: var(--text); }
.logo .lime { color: var(--lime); text-shadow: 0 0 12px var(--lime-glow); }

.nav { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.97); backdrop-filter: blur(24px); border-top: 1px solid var(--border2); display: flex; padding: 6px 0 env(safe-area-inset-bottom, 8px); z-index: 100; }
.nav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 5px 2px; border: none; background: none; cursor: pointer; color: var(--muted); transition: all 0.12s; font-family: 'Anton'; font-size: 8px; letter-spacing: 0.05em; text-transform: uppercase; flex: 1; min-width: 0; }
.nav-btn.active { color: var(--lime); }
.nav-btn.active svg { filter: drop-shadow(0 0 10px var(--lime-glow)); }

.fab { position: absolute; bottom: 70px; right: 14px; width: 54px; height: 54px; border-radius: 50%; background: var(--lime); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 28px var(--lime-glow); z-index: 99; transition: transform 0.1s; }
.fab:active { transform: scale(0.92); }

.card { background: rgba(28,28,28,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: var(--r); padding: 14px; }
.card-sm { background: rgba(28,28,28,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 10px 12px; }
.card-lime { background: var(--lime-soft); border: 1px solid var(--lime); border-radius: var(--r); padding: 14px; }

.input, .select, .textarea { width: 100%; padding: 12px 14px; background: var(--s2); border: 1px solid var(--border2); border-radius: var(--r-sm); color: var(--text); font-family: 'Inter'; font-size: 14px; outline: none; transition: border-color 0.12s; }
.input:focus, .select:focus, .textarea:focus { border-color: var(--lime); }
.input::placeholder, .textarea::placeholder { color: var(--muted); }
.select { -webkit-appearance: none; cursor: pointer; padding-right: 30px; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%23707070' stroke-width='1.5' fill='none'/></svg>"); background-repeat: no-repeat; background-position: right 12px center; }
.textarea { resize: none; min-height: 70px; line-height: 1.5; }
.label { font-size: 11px; color: var(--muted); display: block; margin-bottom: 5px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; }

.btn { padding: 11px 18px; border-radius: var(--r-sm); border: none; cursor: pointer; font-family: 'Inter'; font-weight: 600; font-size: 14px; transition: all 0.1s; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--lime); color: #000; box-shadow: 0 4px 16px var(--lime-glow); }
.btn-ghost { background: var(--s2); color: var(--text); border: 1px solid var(--border2); }
.btn-danger { background: rgba(255,59,59,0.1); color: var(--red); border: 1px solid rgba(255,59,59,0.25); }
.btn-icon { width: 36px; height: 36px; padding: 0; }

.overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: flex-end; justify-content: center; }
.modal { background: var(--s0); border-radius: 20px 20px 0 0; padding: 4px 18px 28px; width: 100%; max-width: 460px; border: 1px solid var(--border2); border-bottom: none; max-height: 92vh; overflow-y: auto; animation: slideUp 0.22s cubic-bezier(0.22,1,0.36,1); }
.modal-fs { background: var(--s0); width: 100%; max-width: 460px; height: 100vh; animation: slideUp 0.22s cubic-bezier(0.22,1,0.36,1); display: flex; flex-direction: column; }
.grip { width: 36px; height: 4px; background: var(--s4); border-radius: 2px; margin: 10px auto 18px; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pop { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

.tag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.chip { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; background: var(--s2); border: 1px solid var(--border); color: var(--muted); display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
.chip.on { background: var(--lime); color: #000; border-color: var(--lime); }

.chk { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--muted); flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; background: transparent; }
.chk.on { background: var(--lime); border-color: var(--lime); }
.chk.round { border-radius: 50%; }

.pbar { height: 4px; background: var(--s3); border-radius: 2px; overflow: hidden; }
.pfill { height: 100%; transition: width 0.4s ease; background: var(--lime); }

.prio-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.prio-3 { background: #FF3B3B; box-shadow: 0 0 8px rgba(255,59,59,0.6); }
.prio-2 { background: #FF8C42; }
.prio-1 { background: #10EDAA; }

.kanban { display: flex; gap: 10px; overflow-x: auto; margin: 0 -14px; padding: 4px 14px 8px; }
.kanban-col { flex-shrink: 0; width: 240px; background: var(--s0); border: 1px solid var(--border); border-radius: var(--r); padding: 10px; min-height: 70vh; }
.kanban-col.over { border-color: var(--lime); background: var(--lime-dim); }
.kanban-col-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 0 2px; }
.task-card { background: rgba(28,28,28,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 11px; margin-bottom: 7px; cursor: grab; transition: all 0.12s; position: relative; }
.task-card.dragging { opacity: 0.4; transform: scale(0.96); }
.task-card.done-card { opacity: 0.5; }

.cal-tabs { display: flex; gap: 6px; margin-bottom: 14px; padding: 4px; background: var(--s1); border: 1px solid var(--border); border-radius: var(--r-sm); }
.cal-tab { flex: 1; padding: 8px; background: none; border: none; color: var(--muted); cursor: pointer; font-family: 'Anton'; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; border-radius: 6px; transition: all 0.12s; }
.cal-tab.active { background: var(--lime); color: #000; }

.month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: var(--border); border-radius: var(--r-sm); overflow: hidden; width: 100%; }
.month-day { background: var(--s0); min-height: 56px; padding: 2px 1px; position: relative; cursor: pointer; transition: background 0.12s; min-width: 0; overflow: hidden; }
.month-day.today { background: var(--lime-soft); }
.month-day.today .day-num { color: var(--lime); font-weight: 700; }
.month-day.other-month { opacity: 0.3; }
.month-day.holiday { background: rgba(255,107,53,0.08); }
.day-num { font-size: 9px; color: var(--muted); margin-bottom: 1px; font-family: 'JetBrains Mono'; padding-left: 2px; }
.day-task-bar { color: #000; font-size: 7px; padding: 1px 2px; border-radius: 2px; font-weight: 600; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.15; cursor: pointer; min-width: 0; }
.month-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; margin-bottom: 4px; width: 100%; }
.month-weekday-cell { text-align: center; font-size: 10px; color: var(--muted); padding: 4px 0; font-family: 'JetBrains Mono'; min-width: 0; overflow: hidden; }
.calendar-view .month-grid, .calendar-view .month-weekdays { margin-left: -8px; margin-right: -8px; width: calc(100% + 16px); }

.day-list-card { background: rgba(28,28,28,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 8px; overflow: hidden; }
.day-list-card.is-today { border-color: var(--lime); }
.day-list-head { padding: 10px 14px; background: var(--s2); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.day-list-head.is-today { background: var(--lime-soft); }
.day-list-body { padding: 4px 12px 8px; }
.day-list-body .row-item { padding: 8px 4px; cursor: pointer; gap: 8px; display: flex; align-items: center; }
.day-list-body .row-item + .row-item { border-top: 1px solid var(--border); }

.gantt-row { display: flex; align-items: center; height: 32px; border-bottom: 1px solid var(--border); position: relative; }
.gantt-label { width: 110px; font-size: 11px; padding: 0 6px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-right: 1px solid var(--border2); }
.gantt-track { flex: 1; height: 100%; position: relative; min-width: 600px; background: repeating-linear-gradient(90deg, transparent, transparent 39px, var(--border) 39px, var(--border) 40px); }
.gantt-bar { position: absolute; top: 6px; bottom: 6px; border-radius: 3px; padding: 0 6px; display: flex; align-items: center; font-size: 10px; font-weight: 600; color: #000; overflow: hidden; white-space: nowrap; }
.gantt-today-line { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--red); z-index: 5; }

.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stat-tile { background: rgba(28,28,28,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: var(--r-sm); padding: 12px; }
.stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: 'Anton'; }
.stat-val { font-family: 'Anton'; font-size: 28px; line-height: 1; margin-top: 4px; }

.pomo-circle { width: 240px; height: 240px; margin: 20px auto; position: relative; }
.pomo-svg { transform: rotate(-90deg); }
.pomo-time { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }

/* CELEBRATION ANIMATION */
.celebrate-overlay { position: fixed; inset: 0; z-index: 999; pointer-events: none; overflow: hidden; }
.poo-fly {
  position: absolute; top: 38%; left: 50%; width: 180px; height: auto;
  animation: pooFly 2.2s cubic-bezier(0.22,1,0.36,1) forwards;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(170,255,0,0.4));
}
@keyframes pooFly {
  0% { transform: translate(-200%, -50%) rotate(-180deg) scale(0.5); opacity: 0; }
  20% { transform: translate(-50%, -50%) rotate(0deg) scale(1.1); opacity: 1; }
  60% { transform: translate(-50%, -50%) rotate(15deg) scale(1.1); opacity: 1; }
  100% { transform: translate(200%, -50%) rotate(180deg) scale(0.5); opacity: 0; }
}
.spruch { position: absolute; top: 56%; left: 50%; transform: translate(-50%, -50%); font-family: 'Anton'; font-size: 30px; color: var(--lime); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; text-shadow: 0 0 24px var(--lime-glow), 0 4px 12px rgba(0,0,0,0.8); animation: spruchPop 2.2s ease-out forwards; }
@keyframes spruchPop {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
  20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
}
.confetti { position: absolute; top: -20px; width: 12px; height: 12px; background: var(--lime); animation: confettiFall 2.5s linear forwards; }
@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0.4; }
}

/* SPLASH */
.splash { position: fixed; inset: 0; z-index: 500; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 50px 28px 40px; animation: fadeIn 0.4s ease; overflow: hidden; }
.splash::before {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background-image: url('${import.meta.env.BASE_URL}bg-pattern.jpeg');
  background-size: cover; background-position: center; background-repeat: no-repeat;
  opacity: 0.7;
}
.splash::after {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%);
}
.splash > * { position: relative; z-index: 1; }
.splash-logo { font-family: 'Anton'; font-size: 56px; line-height: 0.95; letter-spacing: 0.005em; text-align: center; color: var(--text); text-shadow: 0 4px 24px rgba(0,0,0,0.8); }
.splash-logo .lime { color: var(--lime); text-shadow: 0 0 40px var(--lime-glow), 0 0 12px var(--lime); }
.splash-tag { color: rgba(255,255,255,0.85); font-size: 13px; text-align: center; line-height: 1.6; max-width: 320px; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }
.splash-poo {
  width: 240px; height: auto; max-height: 36vh; object-fit: contain;
  filter: drop-shadow(0 12px 32px rgba(0,0,0,0.7)) drop-shadow(0 0 40px rgba(170,255,0,0.3));
  animation: float 3.6s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-18px) rotate(2deg); }
}
.splash-glow { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 360px; background: radial-gradient(circle, rgba(170,255,0,0.18), transparent 70%); pointer-events: none; z-index: 0; animation: glowPulse 3s ease-in-out infinite; }
@keyframes glowPulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.1); }
}

.drag-ghost { position: fixed; pointer-events: none; z-index: 9999; opacity: 0.85; transform: scale(1.05) rotate(2deg); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }

.row { display: flex; align-items: center; gap: 8px; }
.col { display: flex; flex-direction: column; gap: 8px; }
.between { display: flex; justify-content: space-between; align-items: center; }
.divider { height: 1px; background: var(--border); margin: 14px 0; }
.section-title { font-family: 'Anton'; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin: 18px 0 10px; }
.empty { text-align: center; padding: 32px 16px; color: var(--muted); }
.empty-icon { opacity: 0.3; margin-bottom: 10px; }
.view { animation: fadeIn 0.18s ease; }
`;

// ════════════════════════════════════════════════════════════════════════════
// SCHEMA & MIGRATIONS
// ════════════════════════════════════════════════════════════════════════════
const SCHEMA_VERSION = 4;
const STORAGE_KEY = "gsd-data";

// localStorage wrapper that mimics Claude's window.storage API
const storage = {
  async get(key) {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      try { return await window.storage.get(key); } catch { /* fall through */ }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const value = window.localStorage.getItem(key);
      return value ? { value } : null;
    }
    return null;
  },
  async set(key, value) {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.set === "function") {
      try { return await window.storage.set(key, value); } catch { /* fall through */ }
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return { value };
    }
    return null;
  },
};


const uid = () => Math.random().toString(36).slice(2, 11);
const nowIso = () => new Date().toISOString();
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };

function getDefaults() {
  return {
    version: SCHEMA_VERSION,
    meta: { deviceId: uid(), createdAt: nowIso(), lastModified: nowIso() },
    settings: {
      notifications: false, userName: "", dailyRitualDate: null, onboarded: false, lastRolloverDate: null,
      notifTasks: true, notifEvents: true, notifBirthdays: true, notifWorkouts: true, notifHabits: false,
      dailyDigest: false, dailyDigestTime: "07:00",
    },
    tasks: [], events: [], workouts: [], projects: [], habits: [],
    shoppingLists: [], goals: [], books: [], budget: [], notes: [], meals: {},
    pomodoros: [], achievements: [],
  };
}

const migrations = {
  1: (d) => ({ ...getDefaults(), ...d, version: 1 }),
  2: (d) => ({ ...d, version: 2,
    projects: d.projects || [], habits: d.habits || [], goals: d.goals || [],
    books: d.books || [], budget: d.budget || [], meals: d.meals || {},
    pomodoros: d.pomodoros || [], achievements: d.achievements || [],
    settings: { notifications: false, userName: "", dailyRitualDate: null, ...(d.settings || {}) },
    tasks: (d.tasks || []).map(t => ({
      id: t.id || uid(), title: t.title || "", status: t.status || "todo",
      priority: t.priority ?? 2, category: t.category || "privat",
      startDate: t.startDate || t.dueDate || "", endDate: t.endDate || t.dueDate || "",
      startTime: t.startTime || "", endTime: t.endTime || "",
      allDay: t.allDay !== false, notes: t.notes || "",
      subtasks: t.subtasks || [], tags: t.tags || [], projectId: t.projectId || null,
      estimatedMinutes: t.estimatedMinutes || 0, actualMinutes: t.actualMinutes || 0,
      energy: t.energy || "any", isFrog: t.isFrog || false,
      reminderMinutes: t.reminderMinutes || 0, recurrence: t.recurrence || null,
      createdAt: t.createdAt || Date.now(), completedAt: t.completedAt,
    })),
  }),
  3: (d) => ({ ...d, version: 3,
    events: d.events || [], workouts: d.workouts || [],
    settings: { onboarded: false, lastRolloverDate: null, ...(d.settings || {}) },
    tasks: (d.tasks || []).map(t => ({ ...t, recurrence: t.recurrence || null })),
  }),
  4: (d) => ({ ...d, version: 4,
    notes: d.notes || [],
    settings: {
      notifTasks: true, notifEvents: true, notifBirthdays: true, notifWorkouts: true, notifHabits: false,
      dailyDigest: false, dailyDigestTime: "07:00",
      ...(d.settings || {}),
    },
  }),
};

function migrate(raw) {
  if (!raw) return seedData(getDefaults());
  let d = { ...raw };
  const fromV = d.version || 0;
  if (fromV >= SCHEMA_VERSION) return d;
  for (let v = fromV + 1; v <= SCHEMA_VERSION; v++) if (migrations[v]) d = migrations[v](d);
  return d;
}

// ════════════════════════════════════════════════════════════════════════════
// HOLIDAYS
// ════════════════════════════════════════════════════════════════════════════
function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function germanHolidays(year) {
  const easter = easterDate(year);
  return [
    { date: localDate(new Date(year, 0, 1)), name: "Neujahr" },
    { date: localDate(addDays(easter, -2)), name: "Karfreitag" },
    { date: localDate(addDays(easter, 1)), name: "Ostermontag" },
    { date: localDate(new Date(year, 4, 1)), name: "Tag der Arbeit" },
    { date: localDate(addDays(easter, 39)), name: "Christi Himmelfahrt" },
    { date: localDate(addDays(easter, 50)), name: "Pfingstmontag" },
    { date: localDate(new Date(year, 9, 3)), name: "Tag der Deutschen Einheit" },
    { date: localDate(new Date(year, 11, 25)), name: "1. Weihnachtstag" },
    { date: localDate(new Date(year, 11, 26)), name: "2. Weihnachtstag" },
  ];
}

function generateHolidayEvents() {
  const startY = new Date().getFullYear();
  const all = [];
  for (let y = startY; y < startY + 10; y++) {
    all.push(...germanHolidays(y));
  }
  return all.map(h => ({
    id: `holiday-${h.date}`, title: h.name, type: "holiday",
    startDate: h.date, endDate: h.date, allDay: true, startTime: "", endTime: "",
    notes: "Gesetzlicher Feiertag (DE)", color: "#FF6B35",
    reminderMinutes: 0, recurrence: null, isHoliday: true, createdAt: Date.now(),
  }));
}

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════
const CATS = [
  { id: "arbeit",   label: "Arbeit",     color: "#AAFF00", icon: "💼" },
  { id: "privat",   label: "Privat",     color: "#00E0FF", icon: "🏠" },
  { id: "health",   label: "Gesundheit", color: "#FF2D78", icon: "💪" },
  { id: "haushalt", label: "Haushalt",   color: "#FFB800", icon: "🧹" },
  { id: "social",   label: "Sozial",     color: "#8B5CF6", icon: "👥" },
  { id: "urlaub",   label: "Urlaub",     color: "#FF6B35", icon: "✈️" },
  { id: "lernen",   label: "Lernen",     color: "#10EDAA", icon: "📚" },
];
const PRIOS = [
  { id: 3, label: "Hoch",    color: "#FF3B3B", className: "prio-3" },
  { id: 2, label: "Mittel",  color: "#FF8C42", className: "prio-2" },
  { id: 1, label: "Niedrig", color: "#10EDAA", className: "prio-1" },
];
const ENERGIES = [
  { id: "morning",   label: "Morgen", icon: "🌅" },
  { id: "afternoon", label: "Mittag", icon: "☀️" },
  { id: "evening",   label: "Abend",  icon: "🌙" },
  { id: "any",       label: "Egal",   icon: "🔁" },
];
const STATUSES = [
  { id: "backlog", label: "Backlog",   color: "#707070" },
  { id: "todo",    label: "Heute",     color: "#FFB800" },
  { id: "doing",   label: "In Arbeit", color: "#AAFF00" },
  { id: "review",  label: "Review",    color: "#00E0FF" },
  { id: "done",    label: "Erledigt",  color: "#10EDAA" },
];
const EVENT_TYPES = [
  { id: "event",    label: "Termin",     icon: Calendar, color: "#00E0FF" },
  { id: "birthday", label: "Geburtstag", icon: Cake,     color: "#FF2D78" },
  { id: "vacation", label: "Urlaub",     icon: Plane,    color: "#FF6B35" },
];
const WORKOUT_TYPES = [
  { id: "strength", label: "Kraft",      emoji: "💪", color: "#AAFF00" },
  { id: "cardio",   label: "Ausdauer",   emoji: "🏃", color: "#00E0FF" },
  { id: "yoga",     label: "Yoga",       emoji: "🧘", color: "#8B5CF6" },
  { id: "sport",    label: "Sport",      emoji: "⚽", color: "#FF8C42" },
  { id: "stretch",  label: "Stretching", emoji: "🤸", color: "#FF2D78" },
  { id: "other",    label: "Sonstiges",  emoji: "🏋️", color: "#FFB800" },
];
const RECURRENCE_OPTS = [
  { id: "none",    label: "Einmalig" },
  { id: "daily",   label: "Täglich" },
  { id: "weekly",  label: "Wöchentlich" },
  { id: "monthly", label: "Monatlich" },
];
const DAYS_SHORT = ["Mo","Di","Mi","Do","Fr","Sa","So"];
const DAYS_FULL  = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
const MONTHS_DE  = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

const SHIT_SPRUECHE = [
  "SHIT DONE!", "EINE WENIGER!", "ABGESCHISSEN!", "SCHEISSE VERSENKT!",
  "SHIT ERLEDIGT!", "KACKE ABGEHAKT!", "ABGESCHISSEN!", "FERTIG DER MIST!",
  "SCHEISSE GECLEART!", "ERLEDIGT, DU HUND!", "GET SHIT DONE!", "SHIT GESCHREDDERT!",
  "SHIT ZERLEGT!", "RAUS DAMIT!", "SHIT GESLAYT!", "SHIT GONE!",
  "LIKE A BOSS!", "DURCHGEKACKT!", "SCHROTT ERLEDIGT!", "KACK BESIEGT!",
];

const catOf = id => CATS.find(c => c.id === id) || CATS[1];
const prioOf = id => PRIOS.find(p => p.id === id) || PRIOS[1];
const statusOf = id => STATUSES.find(s => s.id === id) || STATUSES[0];
const eventTypeOf = id => EVENT_TYPES.find(e => e.id === id) || EVENT_TYPES[0];
const workoutTypeOf = id => WORKOUT_TYPES.find(w => w.id === id) || WORKOUT_TYPES[0];

// ════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════
function dateRange(start, end) {
  const out = [];
  if (!start) return out;
  const s = new Date(start + "T12:00:00");
  const e = new Date((end || start) + "T12:00:00");
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) out.push(localDate(d));
  return out;
}

function weekDates(offset = 0) {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const mon = new Date(now);
  mon.setDate(now.getDate() - dow + offset * 7);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return localDate(d); });
}

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ year, month: month - 1, day: prevDays - i, otherMonth: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ year, month, day: d, otherMonth: false });
  while (cells.length < 42) {
    const last = cells[cells.length - 1];
    let d = last.day + 1, m = last.month, y = last.year;
    const dim = new Date(y, m + 1, 0).getDate();
    if (d > dim) { d = 1; m += 1; if (m > 11) { m = 0; y += 1; } }
    cells.push({ year: y, month: m, day: d, otherMonth: m !== month || y !== year });
  }
  return cells.slice(0, 42);
}

const cellDate = c => `${c.year}-${String(c.month+1).padStart(2,"0")}-${String(c.day).padStart(2,"0")}`;

function getTaskDates(t, winStart, winEnd) {
  if (!t.startDate) return [];
  const baseDates = dateRange(t.startDate, t.endDate || t.startDate);
  if (!t.recurrence || t.recurrence.type === "none") return baseDates;
  if (!winStart || !winEnd) return baseDates;
  const out = new Set(baseDates);
  const start = new Date(winStart + "T12:00:00");
  const end = new Date(winEnd + "T12:00:00");
  const baseStart = new Date(t.startDate + "T12:00:00");
  if (t.recurrence.type === "daily") {
    for (let d = new Date(Math.max(start.getTime(), baseStart.getTime())); d <= end; d.setDate(d.getDate() + 1)) out.add(localDate(d));
  } else if (t.recurrence.type === "weekly") {
    const wds = (t.recurrence.weekdays && t.recurrence.weekdays.length) ? t.recurrence.weekdays : [(baseStart.getDay() + 6) % 7];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d < baseStart) continue;
      if (wds.includes((d.getDay() + 6) % 7)) out.add(localDate(d));
    }
  } else if (t.recurrence.type === "monthly") {
    const dom = baseStart.getDate();
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d < baseStart) continue;
      if (d.getDate() === dom) out.add(localDate(d));
    }
  }
  return Array.from(out);
}

function getEventDates(e, winStart, winEnd) {
  if (!e.startDate) return [];
  const baseDates = dateRange(e.startDate, e.endDate || e.startDate);
  if (!e.recurrence || e.recurrence.type === "none") return baseDates;
  if (!winStart || !winEnd) return baseDates;
  const out = new Set(baseDates);
  const start = new Date(winStart + "T12:00:00");
  const end = new Date(winEnd + "T12:00:00");
  const baseStart = new Date(e.startDate + "T12:00:00");
  if (e.recurrence.type === "yearly") {
    const m = baseStart.getMonth(), d = baseStart.getDate();
    for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
      if (cur.getMonth() === m && cur.getDate() === d) out.add(localDate(cur));
    }
  }
  return Array.from(out);
}

function getWorkoutDates(w, winStart, winEnd) {
  const out = [];
  const start = new Date(winStart + "T12:00:00");
  const end = new Date(winEnd + "T12:00:00");
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (((d.getDay() + 6) % 7) === w.weekday) out.push(localDate(d));
  }
  return out;
}

// Habits — frequency "daily" → every day; if weekdays array exists, only those.
function getHabitDates(h, winStart, winEnd) {
  const out = [];
  const start = new Date(winStart + "T12:00:00");
  const end = new Date(winEnd + "T12:00:00");
  const wds = h.weekdays && h.weekdays.length ? h.weekdays : null;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (h.frequency === "daily") {
      if (!wds || wds.includes((d.getDay() + 6) % 7)) out.push(localDate(d));
    }
  }
  return out;
}

function fireCelebration() { window.dispatchEvent(new CustomEvent("gsd:celebrate")); }

// ════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS — Web today, Capacitor-ready for APK build
// ════════════════════════════════════════════════════════════════════════════
// When running as APK with Capacitor, replace the body of these functions with
// `import { LocalNotifications } from '@capacitor/local-notifications'`
// and use LocalNotifications.schedule() / cancel() — same API shape.
const Notif = {
  isCapacitor: () => typeof window !== "undefined" && !!window.Capacitor,
  async requestPermission() {
    if (this.isCapacitor()) {
      // const { LocalNotifications } = await import('@capacitor/local-notifications');
      // return (await LocalNotifications.requestPermissions()).display === "granted";
      return true;
    }
    if (typeof Notification === "undefined") return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const r = await Notification.requestPermission();
    return r === "granted";
  },
  async schedule({ id, title, body, at, channelKey }) {
    // channelKey: "tasks" | "events" | "birthdays" | "workouts" | "habits"
    if (!at) return;
    const delay = new Date(at).getTime() - Date.now();
    if (delay < 0) return; // past — don't fire
    if (this.isCapacitor()) {
      // const { LocalNotifications } = await import('@capacitor/local-notifications');
      // await LocalNotifications.schedule({ notifications: [{
      //   id: typeof id === "number" ? id : Math.abs(hashCode(String(id))),
      //   title, body, schedule: { at: new Date(at) },
      //   extra: { channelKey }
      // }] });
      return;
    }
    // Web fallback: only works while page is open. Schedule via setTimeout.
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (delay > 2147483647) return; // setTimeout max
    setTimeout(() => {
      try { new Notification(title, { body, tag: String(id), icon: `${import.meta.env.BASE_URL}icon-192.png` }); } catch {}
    }, delay);
  },
  async cancel(id) {
    if (this.isCapacitor()) {
      // const { LocalNotifications } = await import('@capacitor/local-notifications');
      // await LocalNotifications.cancel({ notifications: [{ id: typeof id === "number" ? id : Math.abs(hashCode(String(id))) }] });
      return;
    }
    // Web: timeouts can't be reliably cancelled by id without tracking — best effort
  },
  // Daily digest — schedule full-day plan at chosen time, for next 7 days.
  // In Capacitor: native schedule survives app close. In web: only fires while open.
  async scheduleDailyDigest({ time, getStateForDate }) {
    if (!time) return;
    const [hh, mm] = time.split(":").map(Number);
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now); d.setDate(now.getDate() + i);
      d.setHours(hh, mm, 0, 0);
      if (d.getTime() < Date.now()) continue;
      const dateStr = localDate(d);
      const { title, body } = getStateForDate(dateStr);
      this.schedule({
        id: `digest-${dateStr}`,
        title, body, at: d, channelKey: "digest",
      });
    }
  },
  // For test button — fire one immediately
  async fireNow({ title, body }) {
    if (this.isCapacitor()) {
      // const { LocalNotifications } = await import('@capacitor/local-notifications');
      // await LocalNotifications.schedule({ notifications: [{ id: Date.now() % 2147483647, title, body, schedule: { at: new Date(Date.now() + 1000) } }] });
      return;
    }
    if (typeof Notification === "undefined" || Notification.permission !== "granted") {
      alert("Notifications nicht erlaubt. Erst aktivieren.");
      return;
    }
    try { new Notification(title, { body, icon: `${import.meta.env.BASE_URL}icon-192.png` }); } catch {}
  },
};
function hashCode(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return h; }

// Build complete day list as text — used for digest notification body
function buildDigestBody(state, dateStr) {
  const dt = new Date(dateStr + "T12:00:00");
  const weekday = (dt.getDay() + 6) % 7;
  const tasks = state.tasks.filter(t => getTaskDates(t, dateStr, dateStr).includes(dateStr) && t.status !== "done");
  const events = state.events.filter(e => getEventDates(e, dateStr, dateStr).includes(dateStr));
  const workouts = state.workouts.filter(w => w.weekday === weekday);
  const habits = (state.habits || []).filter(h => {
    if (h.frequency !== "daily") return false;
    if (!h.weekdays || h.weekdays.length === 0) return true;
    return h.weekdays.includes(weekday);
  });
  const items = [
    ...events.map(e => ({ time: e.startTime || "", icon: e.isHoliday ? "🎉" : e.type === "birthday" ? "🎂" : e.type === "vacation" ? "✈️" : "📅", title: e.title })),
    ...tasks.map(t => ({ time: t.startTime || "", icon: t.isFrog ? "💩" : "⚡", title: t.title })),
    ...workouts.map(w => ({ time: w.time || "", icon: "💪", title: w.title })),
    ...habits.map(h => ({ time: "", icon: h.emoji || "🔥", title: h.title })),
  ].sort((a, b) => {
    if (!a.time && b.time) return -1;
    if (a.time && !b.time) return 1;
    return (a.time || "").localeCompare(b.time || "");
  });
  const dayLabel = dt.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const counts = `${events.length} Termine · ${tasks.length} Aufgaben · ${workouts.length} Sport · ${habits.length} Habits`;
  if (items.length === 0) {
    return {
      title: `💩 Dein Tag — ${dayLabel}`,
      body: "Heute steht nichts an. Nice. Mach was draus.",
    };
  }
  const lines = items.map(it => `${it.time ? it.time + "  " : ""}${it.icon} ${it.title}`).join("\n");
  return {
    title: `💩 Dein Tag — ${dayLabel}`,
    body: `${counts}\n\n${lines}`,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// SEED DATA
// ════════════════════════════════════════════════════════════════════════════
function seedData(base) {
  const today = localDate();
  const tomorrow = localDate(addDays(new Date(), 1));
  const inTwo = localDate(addDays(new Date(), 2));
  const inThree = localDate(addDays(new Date(), 3));
  const inFour = localDate(addDays(new Date(), 4));
  const inFive = localDate(addDays(new Date(), 5));
  const inWeek = localDate(addDays(new Date(), 7));
  const inTen = localDate(addDays(new Date(), 10));
  const inTwoWeeks = localDate(addDays(new Date(), 14));
  const inThreeWeeks = localDate(addDays(new Date(), 21));
  const yesterday = localDate(addDays(new Date(), -1));
  const twoDaysAgo = localDate(addDays(new Date(), -2));
  const threeDaysAgo = localDate(addDays(new Date(), -3));

  const projects = [
    { id: "proj-italy", name: "Italien-Reise", color: "#FF6B35", deadline: inTwoWeeks, description: "Sommerurlaub Toskana", createdAt: Date.now() },
    { id: "proj-q2", name: "Q2 Projekt", color: "#AAFF00", deadline: inWeek, description: "Quartalsabschluss", createdAt: Date.now() },
  ];

  return {
    ...base,
    settings: { ...base.settings, onboarded: false },
    tasks: [
      { id: uid(), title: "Wohnung putzen", status: "todo", priority: 2, category: "haushalt", startDate: today, endDate: today, startTime: "10:00", endTime: "12:00", allDay: false, notes: "", subtasks: [{id:uid(),title:"Bad",done:false},{id:uid(),title:"Küche",done:false},{id:uid(),title:"Wohnzimmer",done:false}], tags: [], projectId: null, estimatedMinutes: 120, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 15, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Quartalsbericht fertigstellen", status: "doing", priority: 3, category: "arbeit", startDate: today, endDate: inThree, startTime: "", endTime: "", allDay: true, notes: "Q1 Zahlen einbauen, mit Marketing abstimmen", subtasks: [], tags: [], projectId: "proj-q2", estimatedMinutes: 240, actualMinutes: 60, energy: "any", isFrog: true, reminderMinutes: 0, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Italien-Urlaub planen", status: "doing", priority: 2, category: "urlaub", startDate: today, endDate: inWeek, startTime: "", endTime: "", allDay: true, notes: "Flüge, Hotel, Mietwagen", subtasks: [{id:uid(),title:"Flüge buchen",done:true},{id:uid(),title:"Hotel reservieren",done:false},{id:uid(),title:"Mietwagen",done:false}], tags: [], projectId: "proj-italy", estimatedMinutes: 0, actualMinutes: 0, energy: "any", isFrog: false, reminderMinutes: 0, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Steuererklärung", status: "backlog", priority: 3, category: "privat", startDate: inFive, endDate: inFive, startTime: "", endTime: "", allDay: true, notes: "Belege sortieren", subtasks: [], tags: [], projectId: null, estimatedMinutes: 180, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 1440, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Arzttermin Hausarzt", status: "todo", priority: 3, category: "health", startDate: tomorrow, endDate: tomorrow, startTime: "09:00", endTime: "09:30", allDay: false, notes: "Routine-Check", subtasks: [], tags: [], projectId: null, estimatedMinutes: 30, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 30, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Mama anrufen", status: "todo", priority: 2, category: "social", startDate: tomorrow, endDate: tomorrow, startTime: "18:00", endTime: "18:30", allDay: false, notes: "", subtasks: [], tags: [], projectId: null, estimatedMinutes: 30, actualMinutes: 0, energy: "evening", isFrog: false, reminderMinutes: 15, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Team-Meeting vorbereiten", status: "todo", priority: 3, category: "arbeit", startDate: inTwo, endDate: inTwo, startTime: "08:00", endTime: "09:00", allDay: false, notes: "Slides für Quarterly Review", subtasks: [], tags: [], projectId: "proj-q2", estimatedMinutes: 60, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 30, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Buch zurückgeben", status: "backlog", priority: 1, category: "privat", startDate: inFour, endDate: inFour, startTime: "", endTime: "", allDay: true, notes: "Stadtbibliothek", subtasks: [], tags: [], projectId: null, estimatedMinutes: 30, actualMinutes: 0, energy: "any", isFrog: false, reminderMinutes: 0, recurrence: null, createdAt: Date.now() },
      { id: uid(), title: "Wäsche waschen", status: "todo", priority: 1, category: "haushalt", startDate: today, endDate: today, startTime: "", endTime: "", allDay: true, notes: "Wiederholt sich Samstags", subtasks: [], tags: [], projectId: null, estimatedMinutes: 0, actualMinutes: 0, energy: "any", isFrog: false, reminderMinutes: 0, recurrence: { type: "weekly", weekdays: [5] }, createdAt: Date.now() },
      { id: uid(), title: "Müll rausbringen", status: "todo", priority: 1, category: "haushalt", startDate: today, endDate: today, startTime: "07:00", endTime: "07:15", allDay: false, notes: "", subtasks: [], tags: [], projectId: null, estimatedMinutes: 5, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 0, recurrence: { type: "weekly", weekdays: [0, 3] }, createdAt: Date.now() },
      { id: uid(), title: "Vitamin D nehmen", status: "todo", priority: 2, category: "health", startDate: today, endDate: today, startTime: "08:00", endTime: "", allDay: false, notes: "Tägliches Supplement", subtasks: [], tags: [], projectId: null, estimatedMinutes: 1, actualMinutes: 0, energy: "morning", isFrog: false, reminderMinutes: 0, recurrence: { type: "daily" }, createdAt: Date.now() },
      { id: uid(), title: "5km Lauf", status: "done", priority: 2, category: "health", startDate: today, endDate: today, startTime: "07:00", endTime: "08:00", allDay: false, notes: "", subtasks: [], tags: [], projectId: null, estimatedMinutes: 60, actualMinutes: 55, energy: "morning", isFrog: false, reminderMinutes: 0, recurrence: null, createdAt: Date.now() - 86400000, completedAt: Date.now() - 3600000 },
      { id: uid(), title: "E-Mails beantworten", status: "done", priority: 1, category: "arbeit", startDate: today, endDate: today, startTime: "", endTime: "", allDay: true, notes: "", subtasks: [], tags: [], projectId: null, estimatedMinutes: 0, actualMinutes: 30, energy: "morning", isFrog: false, reminderMinutes: 0, recurrence: null, createdAt: Date.now() - 86400000, completedAt: Date.now() - 7200000 },
      { id: uid(), title: "Einkaufen gehen", status: "done", priority: 2, category: "haushalt", startDate: yesterday, endDate: yesterday, startTime: "", endTime: "", allDay: true, notes: "", subtasks: [], tags: [], projectId: null, estimatedMinutes: 0, actualMinutes: 0, energy: "any", isFrog: false, reminderMinutes: 0, recurrence: null, createdAt: Date.now() - 172800000, completedAt: Date.now() - 86400000 },
      { id: uid(), title: "Code Review", status: "review", priority: 2, category: "arbeit", startDate: today, endDate: today, startTime: "14:00", endTime: "15:00", allDay: false, notes: "PR von Mark prüfen", subtasks: [], tags: [], projectId: "proj-q2", estimatedMinutes: 60, actualMinutes: 0, energy: "afternoon", isFrog: false, reminderMinutes: 15, recurrence: null, createdAt: Date.now() },
    ],
    events: [
      ...generateHolidayEvents(),
      { id: uid(), title: "Anna's Geburtstag", type: "birthday", startDate: inFive, endDate: inFive, allDay: true, startTime: "", endTime: "", notes: "Geschenk besorgen!", color: "#FF2D78", reminderMinutes: 1440, recurrence: { type: "yearly" }, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Italien Urlaub", type: "vacation", startDate: inTwoWeeks, endDate: inThreeWeeks, allDay: true, startTime: "", endTime: "", notes: "Flug 06:30 ab Frankfurt", color: "#FF6B35", reminderMinutes: 0, recurrence: null, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Zahnarzt", type: "event", startDate: inThree, endDate: inThree, allDay: false, startTime: "14:30", endTime: "15:30", notes: "Kontrolltermin", color: "#00E0FF", reminderMinutes: 60, recurrence: null, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Konzert mit Marc", type: "event", startDate: inWeek, endDate: inWeek, allDay: false, startTime: "20:00", endTime: "23:00", notes: "Tickets nicht vergessen", color: "#8B5CF6", reminderMinutes: 60, recurrence: null, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Papa's Geburtstag", type: "birthday", startDate: localDate(new Date(new Date().getFullYear(), 5, 12)), endDate: localDate(new Date(new Date().getFullYear(), 5, 12)), allDay: true, startTime: "", endTime: "", notes: "", color: "#FF2D78", reminderMinutes: 1440, recurrence: { type: "yearly" }, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Teammeeting", type: "event", startDate: tomorrow, endDate: tomorrow, allDay: false, startTime: "10:00", endTime: "11:00", notes: "Wöchentliches Standup", color: "#00E0FF", reminderMinutes: 15, recurrence: null, isHoliday: false, createdAt: Date.now() },
      { id: uid(), title: "Friseur", type: "event", startDate: inTen, endDate: inTen, allDay: false, startTime: "16:00", endTime: "17:00", notes: "", color: "#00E0FF", reminderMinutes: 60, recurrence: null, isHoliday: false, createdAt: Date.now() },
    ],
    workouts: [
      { id: uid(), title: "Krafttraining Push", weekday: 0, time: "07:00", duration: 60, type: "strength", notes: "Brust, Schulter, Trizeps", color: "#AAFF00", reminderMinutes: 30, createdAt: Date.now() },
      { id: uid(), title: "Laufen 5km", weekday: 1, time: "07:00", duration: 45, type: "cardio", notes: "Lockeres Tempo", color: "#00E0FF", reminderMinutes: 15, createdAt: Date.now() },
      { id: uid(), title: "Krafttraining Pull", weekday: 2, time: "07:00", duration: 60, type: "strength", notes: "Rücken, Bizeps", color: "#AAFF00", reminderMinutes: 30, createdAt: Date.now() },
      { id: uid(), title: "Yoga", weekday: 3, time: "18:30", duration: 45, type: "yoga", notes: "Vinyasa Flow", color: "#8B5CF6", reminderMinutes: 30, createdAt: Date.now() },
      { id: uid(), title: "Krafttraining Beine", weekday: 4, time: "07:00", duration: 75, type: "strength", notes: "Squats, Deadlifts", color: "#AAFF00", reminderMinutes: 30, createdAt: Date.now() },
      { id: uid(), title: "Lange Runde 10km", weekday: 5, time: "09:00", duration: 80, type: "cardio", notes: "Wochenend-Lauf", color: "#00E0FF", reminderMinutes: 60, createdAt: Date.now() },
    ],
    habits: [
      { id: uid(), title: "Wasser 2L", emoji: "💧", color: "#00E0FF", frequency: "daily", completions: { [today]: true, [yesterday]: true, [twoDaysAgo]: true, [threeDaysAgo]: true }, createdAt: Date.now() },
      { id: uid(), title: "10 Min lesen", emoji: "📖", color: "#AAFF00", frequency: "daily", completions: { [yesterday]: true, [twoDaysAgo]: true }, createdAt: Date.now() },
      { id: uid(), title: "Meditation", emoji: "🧘", color: "#8B5CF6", frequency: "daily", completions: { [twoDaysAgo]: true, [threeDaysAgo]: true }, createdAt: Date.now() },
      { id: uid(), title: "Kein Zucker", emoji: "🚫", color: "#FF2D78", frequency: "daily", completions: { [today]: true }, createdAt: Date.now() },
    ],
    shoppingLists: [
      { id: uid(), name: "Wocheneinkauf", color: "#AAFF00", items: [
        { id: uid(), text: "Milch × 2", done: false }, { id: uid(), text: "Brot vom Bäcker", done: false },
        { id: uid(), text: "Äpfel 1 kg", done: true }, { id: uid(), text: "Pasta & Tomaten", done: false },
        { id: uid(), text: "Olivenöl", done: false }, { id: uid(), text: "Käse", done: false },
        { id: uid(), text: "Bananen", done: true }, { id: uid(), text: "Hähnchenbrust", done: false },
      ]},
      { id: uid(), name: "Drogerie", color: "#00E0FF", items: [
        { id: uid(), text: "Zahnpasta", done: false }, { id: uid(), text: "Shampoo", done: false },
        { id: uid(), text: "Duschgel", done: false },
      ]},
      { id: uid(), name: "Italien-Urlaub", color: "#FF6B35", items: [
        { id: uid(), text: "Sonnencreme", done: false }, { id: uid(), text: "Reisepass prüfen", done: true },
        { id: uid(), text: "Adapter", done: false }, { id: uid(), text: "Reiseapotheke", done: false },
      ]},
    ],
    projects,
    goals: [
      { id: uid(), title: "Buch fertig schreiben", deadline: localDate(addDays(new Date(), 90)), progress: 35, notes: "Kapitel 5 in Arbeit", createdAt: Date.now() },
      { id: uid(), title: "10km in unter 50 Min", deadline: localDate(addDays(new Date(), 120)), progress: 60, notes: "", createdAt: Date.now() },
      { id: uid(), title: "5kg abnehmen", deadline: localDate(addDays(new Date(), 60)), progress: 40, notes: "", createdAt: Date.now() },
    ],
    books: [
      { id: uid(), title: "Atomic Habits", author: "James Clear", status: "reading", createdAt: Date.now() },
      { id: uid(), title: "Deep Work", author: "Cal Newport", status: "wishlist", createdAt: Date.now() },
      { id: uid(), title: "Sapiens", author: "Yuval Noah Harari", status: "done", createdAt: Date.now() },
    ],
    budget: [
      { id: uid(), amount: 89.50, category: "Essen", note: "Wocheneinkauf", date: yesterday, createdAt: Date.now() },
      { id: uid(), amount: 45.00, category: "Transport", note: "Tankfüllung", date: twoDaysAgo, createdAt: Date.now() },
      { id: uid(), amount: 120.00, category: "Freizeit", note: "Konzertkarte", date: today, createdAt: Date.now() },
      { id: uid(), amount: 12.50, category: "Essen", note: "Bäcker", date: today, createdAt: Date.now() },
    ],
  };
}

// ════════════════════════════════════════════════════════════════════════════
// REDUCER
// ════════════════════════════════════════════════════════════════════════════
function reducer(state, { type, payload }) {
  const touch = s => ({ ...s, meta: { ...s.meta, lastModified: nowIso() } });
  switch (type) {
    case "LOAD": return payload;
    case "SET_VIEW": return { ...state, view: payload };
    case "ADD_TASK":      return touch({ ...state, tasks: [payload, ...state.tasks] });
    case "UPD_TASK":      return touch({ ...state, tasks: state.tasks.map(t => t.id === payload.id ? { ...t, ...payload } : t) });
    case "DEL_TASK":      return touch({ ...state, tasks: state.tasks.filter(t => t.id !== payload) });
    case "MOVE_TASK":     return touch({ ...state, tasks: state.tasks.map(t => t.id === payload.id ? { ...t, status: payload.status, completedAt: payload.status === "done" ? Date.now() : undefined } : t) });
    case "TOGGLE_SUBTASK":return touch({ ...state, tasks: state.tasks.map(t => t.id === payload.taskId ? { ...t, subtasks: t.subtasks.map(s => s.id === payload.subId ? { ...s, done: !s.done } : s) } : t) });
    case "ADD_SUBTASK":   return touch({ ...state, tasks: state.tasks.map(t => t.id === payload.taskId ? { ...t, subtasks: [...t.subtasks, { id: uid(), title: payload.title, done: false }] } : t) });
    case "DEL_SUBTASK":   return touch({ ...state, tasks: state.tasks.map(t => t.id === payload.taskId ? { ...t, subtasks: t.subtasks.filter(s => s.id !== payload.subId) } : t) });
    case "ADD_POMO":      return touch({ ...state, pomodoros: [...state.pomodoros, payload], tasks: state.tasks.map(t => t.id === payload.taskId ? { ...t, actualMinutes: (t.actualMinutes || 0) + payload.duration } : t) });
    case "ROLLOVER_TASKS": {
      const today = localDate();
      return touch({ ...state, tasks: state.tasks.map(t => {
        if (t.status === "done") return t;
        if (t.recurrence && t.recurrence.type !== "none") return t;
        if (!t.endDate) return t;
        if (t.endDate < today) {
          const lengthDays = dateRange(t.startDate || t.endDate, t.endDate).length - 1;
          const newEnd = localDate(addDays(new Date(today + "T12:00:00"), lengthDays));
          return { ...t, startDate: today, endDate: newEnd };
        }
        return t;
      }), settings: { ...state.settings, lastRolloverDate: today } });
    }
    case "ADD_EVENT":   return touch({ ...state, events: [...state.events, payload] });
    case "UPD_EVENT":   return touch({ ...state, events: state.events.map(e => e.id === payload.id ? { ...e, ...payload } : e) });
    case "DEL_EVENT":   return touch({ ...state, events: state.events.filter(e => e.id !== payload) });
    case "ADD_WORKOUT": return touch({ ...state, workouts: [...state.workouts, payload] });
    case "UPD_WORKOUT": return touch({ ...state, workouts: state.workouts.map(w => w.id === payload.id ? { ...w, ...payload } : w) });
    case "DEL_WORKOUT": return touch({ ...state, workouts: state.workouts.filter(w => w.id !== payload) });
    case "ADD_HABIT":    return touch({ ...state, habits: [...state.habits, payload] });
    case "DEL_HABIT":    return touch({ ...state, habits: state.habits.filter(h => h.id !== payload) });
    case "TOGGLE_HABIT": return touch({ ...state, habits: state.habits.map(h => h.id === payload.id ? { ...h, completions: { ...h.completions, [payload.date]: !h.completions[payload.date] } } : h) });
    case "ADD_LIST":    return touch({ ...state, shoppingLists: [...state.shoppingLists, payload] });
    case "DEL_LIST":    return touch({ ...state, shoppingLists: state.shoppingLists.filter(l => l.id !== payload) });
    case "ADD_ITEM":    return touch({ ...state, shoppingLists: state.shoppingLists.map(l => l.id === payload.listId ? { ...l, items: [...l.items, payload.item] } : l) });
    case "TOGGLE_ITEM": return touch({ ...state, shoppingLists: state.shoppingLists.map(l => l.id === payload.listId ? { ...l, items: l.items.map(i => i.id === payload.itemId ? { ...i, done: !i.done } : i) } : l) });
    case "DEL_ITEM":    return touch({ ...state, shoppingLists: state.shoppingLists.map(l => l.id === payload.listId ? { ...l, items: l.items.filter(i => i.id !== payload.itemId) } : l) });
    case "ADD_GOAL": return touch({ ...state, goals: [...state.goals, payload] });
    case "UPD_GOAL": return touch({ ...state, goals: state.goals.map(g => g.id === payload.id ? { ...g, ...payload } : g) });
    case "DEL_GOAL": return touch({ ...state, goals: state.goals.filter(g => g.id !== payload) });
    case "ADD_BOOK": return touch({ ...state, books: [...state.books, payload] });
    case "UPD_BOOK": return touch({ ...state, books: state.books.map(b => b.id === payload.id ? { ...b, ...payload } : b) });
    case "DEL_BOOK": return touch({ ...state, books: state.books.filter(b => b.id !== payload) });
    case "ADD_BUDGET": return touch({ ...state, budget: [payload, ...state.budget] });
    case "DEL_BUDGET": return touch({ ...state, budget: state.budget.filter(b => b.id !== payload) });
    case "ADD_NOTE": return touch({ ...state, notes: [payload, ...(state.notes || [])] });
    case "UPD_NOTE": return touch({ ...state, notes: (state.notes || []).map(n => n.id === payload.id ? { ...n, ...payload, updatedAt: Date.now() } : n) });
    case "DEL_NOTE": return touch({ ...state, notes: (state.notes || []).filter(n => n.id !== payload) });
    case "SET_MEAL":   return touch({ ...state, meals: { ...state.meals, [payload.date]: { ...(state.meals[payload.date] || {}), [payload.slot]: payload.text } } });
    case "UPD_SETTINGS": return touch({ ...state, settings: { ...state.settings, ...payload } });
    case "WIPE_USER_DATA": {
      // Delete everything except holidays. Keeps settings and version.
      const holidays = (state.events || []).filter(e => e.isHoliday);
      return touch({
        ...state,
        tasks: [], events: holidays, workouts: [], projects: [], habits: [],
        shoppingLists: [], goals: [], books: [], budget: [], notes: [], meals: {},
        pomodoros: [], achievements: [],
      });
    }
    default: return state;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════════════════════
function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Spracheingabe nicht unterstützt"); return; }
    const r = new SR();
    r.lang = "de-DE"; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e) => { onResult(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false); r.onend = () => setListening(false);
    r.start(); recognitionRef.current = r; setListening(true);
  }, [onResult]);
  const stop = useCallback(() => { recognitionRef.current?.stop(); setListening(false); }, []);
  return { listening, start, stop, supported: typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition) };
}

function useDragDrop(onDrop) {
  const [drag, setDrag] = useState({ active: false, id: null, x: 0, y: 0, offsetX: 0, offsetY: 0, ghost: null, overId: null });
  const dragRef = useRef(drag); dragRef.current = drag;
  const startDrag = useCallback((id, e, ghostContent) => {
    e.preventDefault();
    const t = e.touches?.[0] || e;
    const rect = e.currentTarget.getBoundingClientRect();
    setDrag({ active: true, id, x: t.clientX, y: t.clientY, offsetX: t.clientX - rect.left, offsetY: t.clientY - rect.top, ghost: ghostContent, overId: null });
  }, []);
  useEffect(() => {
    if (!drag.active) return;
    const onMove = (e) => {
      const t = e.touches?.[0] || e;
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const zone = el?.closest?.("[data-drop-zone]");
      setDrag(d => ({ ...d, x: t.clientX, y: t.clientY, overId: zone?.dataset?.dropZone || null }));
    };
    const onEnd = (e) => {
      const t = e.changedTouches?.[0] || e;
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const zone = el?.closest?.("[data-drop-zone]");
      if (zone && dragRef.current.id) onDrop(dragRef.current.id, zone.dataset.dropZone);
      setDrag({ active: false, id: null, x: 0, y: 0, offsetX: 0, offsetY: 0, ghost: null, overId: null });
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchend", onEnd);
    };
  }, [drag.active, onDrop]);
  return { drag, startDrag };
}

function useNotifications(state) {
  const { tasks, events, workouts, habits, settings } = state;
  const scheduledRef = useRef(new Set());
  useEffect(() => {
    if (!settings.notifications) return;
    const schedule = (key, fireAt, channelKey, title, body) => {
      if (scheduledRef.current.has(key)) return;
      if (fireAt <= Date.now()) return;
      scheduledRef.current.add(key);
      Notif.schedule({ id: key, title, body, at: new Date(fireAt), channelKey });
    };
    // Tasks
    if (settings.notifTasks) {
      tasks.forEach(t => {
        if (!t.startDate || !t.startTime || !t.reminderMinutes || t.status === "done") return;
        const dueMs = new Date(`${t.startDate}T${t.startTime}:00`).getTime();
        schedule(`task-${t.id}-${dueMs}`, dueMs - t.reminderMinutes * 60000, "tasks", `⚡ ${t.title}`, `Beginnt um ${t.startTime} Uhr`);
      });
    }
    // Events / Birthdays
    (events || []).forEach(e => {
      if (!e.startDate || !e.reminderMinutes || e.isHoliday) return;
      const isBday = e.type === "birthday";
      if (isBday && !settings.notifBirthdays) return;
      if (!isBday && !settings.notifEvents) return;
      const time = e.startTime || "09:00";
      const dueMs = new Date(`${e.startDate}T${time}:00`).getTime();
      const icon = isBday ? "🎂" : e.type === "vacation" ? "✈️" : "📅";
      schedule(`event-${e.id}-${dueMs}`, dueMs - e.reminderMinutes * 60000, isBday ? "birthdays" : "events", `${icon} ${e.title}`, e.notes || "Erinnerung");
    });
    // Workouts (next 7 days)
    if (settings.notifWorkouts) {
      const today = new Date();
      (workouts || []).forEach(w => {
        if (!w.reminderMinutes) return;
        for (let i = 0; i < 7; i++) {
          const d = addDays(today, i);
          if (((d.getDay() + 6) % 7) === w.weekday) {
            const dateStr = localDate(d);
            const dueMs = new Date(`${dateStr}T${w.time}:00`).getTime();
            schedule(`workout-${w.id}-${dateStr}`, dueMs - w.reminderMinutes * 60000, "workouts", `💪 ${w.title}`, `${workoutTypeOf(w.type).label} um ${w.time}`);
          }
        }
      });
    }
    // Habits — daily 08:00 reminder for next 7 days
    if (settings.notifHabits) {
      const today = new Date();
      (habits || []).forEach(h => {
        for (let i = 0; i < 7; i++) {
          const d = addDays(today, i);
          const dateStr = localDate(d);
          const dueMs = new Date(`${dateStr}T08:00:00`).getTime();
          schedule(`habit-${h.id}-${dateStr}`, dueMs, "habits", `${h.emoji || "🔥"} ${h.title}`, "Habit-Erinnerung");
        }
      });
    }
    // Daily digest — full day plan at chosen time
    if (settings.dailyDigest && settings.dailyDigestTime) {
      Notif.scheduleDailyDigest({
        time: settings.dailyDigestTime,
        getStateForDate: (dateStr) => buildDigestBody(state, dateStr),
      });
    }
  }, [tasks, events, workouts, habits, settings.notifications, settings.notifTasks, settings.notifEvents, settings.notifBirthdays, settings.notifWorkouts, settings.notifHabits, settings.dailyDigest, settings.dailyDigestTime]);
}

// ════════════════════════════════════════════════════════════════════════════
// CELEBRATION OVERLAY
// ════════════════════════════════════════════════════════════════════════════
const BASE = import.meta.env.BASE_URL;
const POO_IMAGES = [`${BASE}poo-1.png`, `${BASE}poo-2.png`, `${BASE}poo-3.png`, `${BASE}poo-4.png`, `${BASE}poo-splash.png`];

function CelebrationOverlay() {
  const [active, setActive] = useState(false);
  const [spruch, setSpruch] = useState("");
  const [pooImg, setPooImg] = useState(POO_IMAGES[0]);
  useEffect(() => {
    const handler = () => {
      setSpruch(SHIT_SPRUECHE[Math.floor(Math.random() * SHIT_SPRUECHE.length)]);
      setPooImg(POO_IMAGES[Math.floor(Math.random() * POO_IMAGES.length)]);
      setActive(true);
      setTimeout(() => setActive(false), 6000);
    };
    window.addEventListener("gsd:celebrate", handler);
    return () => window.removeEventListener("gsd:celebrate", handler);
  }, []);
  if (!active) return null;
  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.6,
    duration: 1.8 + Math.random() * 1.2, size: 8 + Math.random() * 8, rotate: Math.random() * 360,
  }));
  return (
    <div className="celebrate-overlay">
      <img src={pooImg} alt="" className="poo-fly" />
      <div className="spruch">{spruch}</div>
      {confetti.map(c => (
        <div key={c.id} className="confetti" style={{
          left: `${c.left}%`, width: `${c.size}px`, height: `${c.size}px`,
          animationDelay: `${c.delay}s`, animationDuration: `${c.duration}s`,
          transform: `rotate(${c.rotate}deg)`, background: "var(--lime)",
        }} />
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SPLASH
// ════════════════════════════════════════════════════════════════════════════
function SplashScreen({ onStart }) {
  return (
    <div className="splash">
      <div className="splash-glow" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <img src={`${BASE}poo-splash.png`} alt="" className="splash-poo" />
      </div>
      <div style={{ textAlign: "center", width: "100%", maxWidth: 360 }}>
        <div className="splash-logo">GET SHIT <span className="lime">DONE!</span></div>
        <div style={{ marginTop: 14, color: "var(--lime)", fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: "0.3em", opacity: 0.8 }}>⚡ V3.0 ⚡</div>
        <p className="splash-tag" style={{ marginTop: 18, marginBottom: 22 }}>
          Mach jetzt endlich dein Scheiß fertig, Junge!
        </p>
        <button className="btn btn-primary" onClick={onStart} style={{ width: "100%", padding: 18, fontSize: 16, fontFamily: "Anton", letterSpacing: "0.08em" }}>
          ⚡ LET'S GET SHIT DONE
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════════════════════════════════
function AddTaskModal({ onClose, onAdd, projects }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [cat, setCat] = useState("privat");
  const [prio, setPrio] = useState(2);
  const [status, setStatus] = useState("todo");
  const [allDay, setAllDay] = useState(true);
  const [startDate, setStartDate] = useState(localDate());
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [energy, setEnergy] = useState("any");
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [projectId, setProjectId] = useState("");
  const [isFrog, setIsFrog] = useState(false);
  const [recType, setRecType] = useState("none");
  const [recWeekdays, setRecWeekdays] = useState([]);
  const voice = useVoiceInput((text) => setTitle(prev => (prev ? prev + " " : "") + text));

  const submit = () => {
    if (!title.trim()) return;
    const recurrence = recType === "none" ? null : { type: recType, weekdays: recType === "weekly" ? recWeekdays : undefined };
    onAdd({
      id: uid(), title: title.trim(), notes: notes.trim(),
      status, priority: prio, category: cat,
      startDate, endDate: endDate || startDate,
      startTime: allDay ? "" : startTime, endTime: allDay ? "" : endTime, allDay,
      subtasks: [], tags: [], projectId: projectId || null,
      estimatedMinutes: 0, actualMinutes: 0, energy, isFrog,
      reminderMinutes: Number(reminderMinutes), recurrence, createdAt: Date.now(),
    });
    onClose();
  };
  const toggleWd = (i) => setRecWeekdays(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="display" style={{ fontSize: 22 }}>Neue Aufgabe</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="col" style={{ gap: 12 }}>
          <div style={{ position: "relative" }}>
            <input className="input" placeholder="Was muss gedone sein?" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && submit()} autoFocus style={{ paddingRight: 44 }} />
            {voice.supported && (
              <button onClick={voice.listening ? voice.stop : voice.start} style={{ position: "absolute", right: 6, top: 6, width: 36, height: 36, borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: voice.listening ? "var(--lime)" : "var(--s3)", color: voice.listening ? "#000" : "var(--lime)" }}>
                {voice.listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
          <textarea className="textarea" placeholder="Notizen (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">Kategorie</label>
              <select className="select" value={cat} onChange={e => setCat(e.target.value)}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select></div>
            <div><label className="label">Priorität</label>
              <select className="select" value={prio} onChange={e => setPrio(Number(e.target.value))}>
                {PRIOS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">Status</label>
              <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select></div>
            <div><label className="label">Energie</label>
              <select className="select" value={energy} onChange={e => setEnergy(e.target.value)}>
                {ENERGIES.map(e => <option key={e.id} value={e.id}>{e.icon} {e.label}</option>)}
              </select></div>
          </div>
          <div className="card-sm">
            <label className="row" style={{ cursor: "pointer", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14 }}>Ganztägig</span>
              <span className={`chk ${allDay ? "on" : ""}`} onClick={() => setAllDay(!allDay)}>{allDay && <Check size={12} color="#000" strokeWidth={3} />}</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">Start</label><input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><label className="label">Ende</label><input className="input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} /></div>
          </div>
          {!allDay && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label className="label">Von</label><input className="input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
              <div><label className="label">Bis</label><input className="input" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
            </div>
          )}
          <div><label className="label">🔁 Wiederholung</label>
            <select className="select" value={recType} onChange={e => setRecType(e.target.value)}>
              {RECURRENCE_OPTS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>
          {recType === "weekly" && (
            <div><label className="label">Wochentage</label>
              <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                {DAYS_SHORT.map((d, i) => (
                  <button key={i} className={`chip ${recWeekdays.includes(i) ? "on" : ""}`} onClick={() => toggleWd(i)} style={{ flex: 1, padding: "8px 0", justifyContent: "center" }}>{d}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">🔔 Erinnerung</label>
              <select className="select" value={reminderMinutes} onChange={e => setReminderMinutes(e.target.value)}>
                <option value={0}>Keine</option><option value={5}>5 Min</option><option value={15}>15 Min</option>
                <option value={30}>30 Min</option><option value={60}>1 Std</option><option value={1440}>1 Tag</option>
              </select></div>
            <div><label className="label">Projekt</label>
              <select className="select" value={projectId} onChange={e => setProjectId(e.target.value)}>
                <option value="">Keins</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
          </div>
          <div className="card-sm" onClick={() => setIsFrog(!isFrog)} style={{ cursor: "pointer", borderColor: isFrog ? "var(--lime)" : "var(--border)" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row">
                <span style={{ fontSize: 18 }}>💩</span>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>Shit of the Day</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Härteste Aufgabe heute</div></div>
              </div>
              <span className={`chk ${isFrog ? "on" : ""}`}>{isFrog && <Check size={12} color="#000" strokeWidth={3} />}</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={submit} style={{ width: "100%", padding: 14, fontSize: 15, marginTop: 4 }}>⚡ ERSTELLEN</button>
        </div>
      </div>
    </div>
  );
}

function AddEventModal({ onClose, onAdd, defaultDate }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("event");
  const [allDay, setAllDay] = useState(true);
  const [startDate, setStartDate] = useState(defaultDate || localDate());
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(60);
  const [yearly, setYearly] = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    const t = eventTypeOf(type);
    onAdd({
      id: uid(), title: title.trim(), type,
      startDate, endDate: endDate || startDate,
      allDay, startTime: allDay ? "" : startTime, endTime: allDay ? "" : endTime,
      notes: notes.trim(), color: t.color, reminderMinutes: Number(reminderMinutes),
      recurrence: (yearly || type === "birthday") ? { type: "yearly" } : null,
      isHoliday: false, createdAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="display" style={{ fontSize: 22 }}>Neuer Termin</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="col" style={{ gap: 12 }}>
          <input className="input" placeholder="Titel..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <div><label className="label">Typ</label>
            <div className="row" style={{ gap: 6 }}>
              {EVENT_TYPES.map(t => (
                <button key={t.id} className={`chip ${type === t.id ? "on" : ""}`} onClick={() => setType(t.id)} style={{ flex: 1, justifyContent: "center" }}>
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card-sm">
            <label className="row" style={{ cursor: "pointer", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14 }}>Ganztägig</span>
              <span className={`chk ${allDay ? "on" : ""}`} onClick={() => setAllDay(!allDay)}>{allDay && <Check size={12} color="#000" strokeWidth={3} />}</span>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">Start</label><input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
            <div><label className="label">Ende</label><input className="input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} /></div>
          </div>
          {!allDay && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label className="label">Von</label><input className="input" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
              <div><label className="label">Bis</label><input className="input" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
            </div>
          )}
          <textarea className="textarea" placeholder="Notizen (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div><label className="label">🔔 Erinnerung</label>
            <select className="select" value={reminderMinutes} onChange={e => setReminderMinutes(e.target.value)}>
              <option value={0}>Keine</option><option value={15}>15 Min</option><option value={30}>30 Min</option>
              <option value={60}>1 Std</option><option value={1440}>1 Tag</option><option value={2880}>2 Tage</option>
            </select>
          </div>
          {type !== "birthday" && (
            <div className="card-sm" onClick={() => setYearly(!yearly)} style={{ cursor: "pointer", borderColor: yearly ? "var(--lime)" : "var(--border)" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span style={{ fontSize: 13 }}>🔁 Jährlich wiederholen</span>
                <span className={`chk ${yearly ? "on" : ""}`}>{yearly && <Check size={12} color="#000" strokeWidth={3} />}</span>
              </div>
            </div>
          )}
          <button className="btn btn-primary" onClick={submit} style={{ width: "100%", padding: 14, fontSize: 15 }}>⚡ TERMIN ERSTELLEN</button>
        </div>
      </div>
    </div>
  );
}

function AddWorkoutModal({ onClose, onAdd, defaultWeekday }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("strength");
  const [weekday, setWeekday] = useState(defaultWeekday ?? 1);
  const [time, setTime] = useState("07:00");
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(30);
  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      id: uid(), title: title.trim(), weekday: Number(weekday), time,
      duration: Number(duration), type, notes: notes.trim(),
      color: workoutTypeOf(type).color, reminderMinutes: Number(reminderMinutes), createdAt: Date.now(),
    });
    onClose();
  };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="display" style={{ fontSize: 22 }}>💪 Training</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="col" style={{ gap: 12 }}>
          <input className="input" placeholder="z.B. Krafttraining, 5km Lauf..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <div><label className="label">Typ</label>
            <div className="row" style={{ gap: 5, flexWrap: "wrap" }}>
              {WORKOUT_TYPES.map(t => (
                <button key={t.id} className={`chip ${type === t.id ? "on" : ""}`} onClick={() => setType(t.id)}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Wochentag</label>
            <div className="row" style={{ gap: 4 }}>
              {DAYS_SHORT.map((d, i) => (
                <button key={i} className={`chip ${weekday === i ? "on" : ""}`} onClick={() => setWeekday(i)} style={{ flex: 1, padding: "10px 0", justifyContent: "center" }}>{d}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label className="label">Uhrzeit</label><input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
            <div><label className="label">Dauer (Min)</label><input className="input" type="number" value={duration} onChange={e => setDuration(e.target.value)} /></div>
          </div>
          <textarea className="textarea" placeholder="Notizen (Übungsplan, etc.)" value={notes} onChange={e => setNotes(e.target.value)} />
          <div><label className="label">🔔 Erinnerung vor Start</label>
            <select className="select" value={reminderMinutes} onChange={e => setReminderMinutes(e.target.value)}>
              <option value={0}>Keine</option><option value={15}>15 Min</option><option value={30}>30 Min</option><option value={60}>1 Std</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={submit} style={{ width: "100%", padding: 14, fontSize: 15 }}>⚡ HINZUFÜGEN</button>
        </div>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, dispatch, projects, openPomo }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task);
  const [newSub, setNewSub] = useState("");
  const proj = projects.find(p => p.id === task.projectId);
  const subPct = task.subtasks.length ? Math.round(task.subtasks.filter(s => s.done).length / task.subtasks.length * 100) : 0;
  const save = () => { dispatch({ type: "UPD_TASK", payload: draft }); setEditing(false); };
  const moveTo = (statusId) => {
    dispatch({ type: "MOVE_TASK", payload: { id: task.id, status: statusId } });
    if (statusId === "done") fireCelebration();
    onClose();
  };
  if (editing) {
    return (
      <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="grip" />
          <h3 className="display" style={{ fontSize: 18, marginBottom: 14 }}>Bearbeiten</h3>
          <div className="col" style={{ gap: 10 }}>
            <input className="input" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
            <textarea className="textarea" placeholder="Notizen" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input className="input" type="date" value={draft.startDate} onChange={e => setDraft({ ...draft, startDate: e.target.value })} />
              <input className="input" type="date" value={draft.endDate} onChange={e => setDraft({ ...draft, endDate: e.target.value })} />
            </div>
            {!draft.allDay && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input className="input" type="time" value={draft.startTime} onChange={e => setDraft({ ...draft, startTime: e.target.value })} />
                <input className="input" type="time" value={draft.endTime} onChange={e => setDraft({ ...draft, endTime: e.target.value })} />
              </div>
            )}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setEditing(false)} style={{ flex: 1 }}>Abbrechen</button>
              <button className="btn btn-primary" onClick={save} style={{ flex: 1 }}>Speichern</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 6 }}>
            <span className="tag" style={{ background: catOf(task.category).color + "22", color: catOf(task.category).color }}>{catOf(task.category).icon} {catOf(task.category).label}</span>
            <span className="tag" style={{ background: prioOf(task.priority).color + "22", color: prioOf(task.priority).color }}>{prioOf(task.priority).label}</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="row" style={{ marginBottom: 10 }}>
          {task.isFrog && <span style={{ fontSize: 22 }}>💩</span>}
          <h3 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.25, flex: 1 }}>{task.title}</h3>
          <button onClick={() => { setEditing(true); setDraft(task); }} className="btn btn-ghost btn-icon"><Edit3 size={15} /></button>
        </div>
        <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {task.startDate && (
            <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}>
              <Calendar size={11} /> {new Date(task.startDate + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
              {task.endDate && task.endDate !== task.startDate && ` – ${new Date(task.endDate + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`}
            </span>
          )}
          {!task.allDay && task.startTime && <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}><Clock size={11} /> {task.startTime}{task.endTime ? `–${task.endTime}` : ""}</span>}
          {task.reminderMinutes > 0 && <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}><Bell size={11} /> {task.reminderMinutes} Min</span>}
          {task.recurrence && task.recurrence.type !== "none" && (
            <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}>
              <Repeat size={11} /> {task.recurrence.type === "daily" ? "Täglich" : task.recurrence.type === "weekly" ? "Wöchentlich" : "Monatlich"}
            </span>
          )}
          {proj && <span className="tag" style={{ background: proj.color + "22", color: proj.color }}>📁 {proj.name}</span>}
        </div>
        {task.notes && (<div className="card-sm" style={{ marginBottom: 14 }}><p style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{task.notes}</p></div>)}
        <div className="section-title" style={{ marginTop: 8 }}>Unteraufgaben {task.subtasks.length > 0 && `· ${subPct}%`}</div>
        {task.subtasks.length > 0 && (<div className="pbar" style={{ marginBottom: 10 }}><div className="pfill" style={{ width: `${subPct}%` }} /></div>)}
        <div className="col" style={{ gap: 6, marginBottom: 12 }}>
          {task.subtasks.map(sub => (
            <div key={sub.id} className="row" style={{ padding: "6px 0" }}>
              <span className={`chk round ${sub.done ? "on" : ""}`} onClick={() => dispatch({ type: "TOGGLE_SUBTASK", payload: { taskId: task.id, subId: sub.id } })}>
                {sub.done && <Check size={11} color="#000" strokeWidth={3} />}
              </span>
              <span style={{ flex: 1, fontSize: 13, textDecoration: sub.done ? "line-through" : "none", color: sub.done ? "var(--muted)" : "var(--text)" }}>{sub.title}</span>
              <button onClick={() => dispatch({ type: "DEL_SUBTASK", payload: { taskId: task.id, subId: sub.id } })} className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }}><X size={12} /></button>
            </div>
          ))}
          <input className="input" placeholder="Neue Unteraufgabe..." value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newSub.trim()) { dispatch({ type: "ADD_SUBTASK", payload: { taskId: task.id, title: newSub.trim() } }); setNewSub(""); } }} style={{ padding: "8px 12px", fontSize: 13 }} />
        </div>
        <div className="section-title">Status</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5, marginBottom: 14 }}>
          {STATUSES.map(s => (
            <button key={s.id} className="btn" onClick={() => moveTo(s.id)} style={{ padding: "8px 4px", fontSize: 10, background: task.status === s.id ? s.color + "22" : "var(--s2)", border: task.status === s.id ? `1.5px solid ${s.color}` : "1px solid var(--border2)", color: task.status === s.id ? s.color : "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "Anton" }}>{s.label}</button>
          ))}
        </div>
        <div className="card-sm" style={{ marginBottom: 12 }}>
          <div className="between">
            <div><div className="stat-label">Zeit erfasst</div>
              <div className="display" style={{ fontSize: 22, marginTop: 2 }}>{task.actualMinutes || 0}<span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>min</span></div>
            </div>
            <button className="btn btn-primary" onClick={() => { onClose(); openPomo(task.id); }}><Play size={14} /> POMODORO</button>
          </div>
        </div>
        <button className="btn btn-danger" style={{ width: "100%" }} onClick={() => { dispatch({ type: "DEL_TASK", payload: task.id }); onClose(); }}>
          <Trash2 size={14} /> LÖSCHEN
        </button>
      </div>
    </div>
  );
}

function EventDetailModal({ event, onClose, dispatch }) {
  if (event.isHoliday) {
    return (
      <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="grip" />
          <div className="between" style={{ marginBottom: 12 }}>
            <span className="tag" style={{ background: "rgba(255,107,53,0.2)", color: "var(--orange)" }}>🎉 Feiertag</span>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{event.title}</h3>
          <p className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>{new Date(event.startDate + "T12:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>Gesetzlicher Feiertag in Deutschland</p>
        </div>
      </div>
    );
  }
  const t = eventTypeOf(event.type);
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 12 }}>
          <span className="tag" style={{ background: t.color + "22", color: t.color }}><t.icon size={12} /> {t.label}</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 12 }}>{event.title}</h3>
        <div className="row" style={{ flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}>
            <Calendar size={11} /> {new Date(event.startDate + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
            {event.endDate !== event.startDate && ` – ${new Date(event.endDate + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`}
          </span>
          {!event.allDay && event.startTime && <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}><Clock size={11} /> {event.startTime}{event.endTime && `–${event.endTime}`}</span>}
          {event.reminderMinutes > 0 && <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}><Bell size={11} /> {event.reminderMinutes} Min</span>}
          {event.recurrence?.type === "yearly" && <span className="tag" style={{ background: "var(--s2)", color: "var(--muted)" }}><Repeat size={11} /> Jährlich</span>}
        </div>
        {event.notes && (<div className="card-sm" style={{ marginBottom: 14 }}><p style={{ fontSize: 13, lineHeight: 1.5 }}>{event.notes}</p></div>)}
        <button className="btn btn-danger" style={{ width: "100%" }} onClick={() => { dispatch({ type: "DEL_EVENT", payload: event.id }); onClose(); }}>
          <Trash2 size={14} /> LÖSCHEN
        </button>
      </div>
    </div>
  );
}

function PomodoroModal({ taskId, tasks, onClose, dispatch }) {
  const task = tasks.find(t => t.id === taskId);
  const [mode, setMode] = useState("work");
  const duration = { work: 25 * 60, break: 5 * 60 };
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current); setRunning(false);
            if (mode === "work") {
              dispatch({ type: "ADD_POMO", payload: { id: uid(), taskId, duration: 25, completedAt: Date.now() } });
              try { if (Notification.permission === "granted") new Notification("⚡ Pomodoro fertig!", { body: "Zeit für eine Pause" }); } catch {}
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode, taskId, dispatch]);
  const total = duration[mode];
  const progress = ((total - secondsLeft) / total) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const r = 100, c = 2 * Math.PI * r;
  const reset = () => { setRunning(false); setSecondsLeft(duration[mode]); };
  const switchMode = (m) => { setMode(m); setSecondsLeft(duration[m]); setRunning(false); };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-fs">
        <div className="between" style={{ padding: "16px 18px" }}>
          <h2 className="display" style={{ fontSize: 22 }}>Fokus</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20 }}>
          {task && (
            <div className="card-lime" style={{ width: "100%", textAlign: "center", marginBottom: 24 }}>
              <div className="stat-label" style={{ marginBottom: 4 }}>Aktuelle Aufgabe</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{task.title}</div>
            </div>
          )}
          <div className="row" style={{ marginBottom: 12 }}>
            <button className={`chip ${mode === "work" ? "on" : ""}`} onClick={() => switchMode("work")}>🎯 Arbeit</button>
            <button className={`chip ${mode === "break" ? "on" : ""}`} onClick={() => switchMode("break")}>☕ Pause</button>
          </div>
          <div className="pomo-circle">
            <svg className="pomo-svg" width="240" height="240" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r={r} stroke="var(--s3)" strokeWidth="8" fill="none" />
              <circle cx="120" cy="120" r={r} stroke="var(--lime)" strokeWidth="8" fill="none"
                strokeDasharray={c} strokeDashoffset={c * (1 - progress / 100)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s linear", filter: "drop-shadow(0 0 8px var(--lime-glow))" }} />
            </svg>
            <div className="pomo-time">
              <div className="display" style={{ fontSize: 56, lineHeight: 1, color: "var(--lime)" }}>
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <div className="stat-label" style={{ marginTop: 6 }}>{mode === "work" ? "Fokus" : "Pause"}</div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 24, gap: 12 }}>
            <button className="btn btn-ghost btn-icon" onClick={reset} style={{ width: 52, height: 52 }}><RotateCcw size={20} /></button>
            <button className="btn btn-primary" onClick={() => setRunning(!running)} style={{ width: 64, height: 64, borderRadius: "50%", padding: 0 }}>
              {running ? <Pause size={26} fill="#000" /> : <Play size={26} fill="#000" />}
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => switchMode(mode === "work" ? "break" : "work")} style={{ width: 52, height: 52 }}>
              {mode === "work" ? <Coffee size={20} /> : <Zap size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchModal({ tasks, events, onClose, openTask, openEvent }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const results = useMemo(() => {
    if (!q.trim()) return { tasks: [], events: [] };
    const ql = q.toLowerCase();
    return {
      tasks: tasks.filter(t => t.title.toLowerCase().includes(ql) || (t.notes || "").toLowerCase().includes(ql) || (t.subtasks || []).some(s => s.title.toLowerCase().includes(ql))).slice(0, 20),
      events: events.filter(e => !e.isHoliday && (e.title.toLowerCase().includes(ql) || (e.notes || "").toLowerCase().includes(ql))).slice(0, 10),
    };
  }, [q, tasks, events]);
  const total = results.tasks.length + results.events.length;
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ minHeight: "60vh" }}>
        <div className="grip" />
        <div className="row" style={{ marginBottom: 14, gap: 8 }}>
          <Search size={20} color="var(--muted)" />
          <input ref={inputRef} className="input" placeholder="Suchen..." value={q} onChange={e => setQ(e.target.value)} style={{ border: "none", background: "none", padding: 0, fontSize: 17 }} />
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="divider" />
        {!q.trim() ? (
          <div className="empty"><Search size={36} className="empty-icon" /><p>Tasks, Termine, Notizen durchsuchen</p></div>
        ) : total === 0 ? (
          <div className="empty"><p>Keine Treffer für "{q}"</p></div>
        ) : (
          <div className="col" style={{ gap: 6 }}>
            <div className="stat-label">{total} Treffer</div>
            {results.tasks.map(t => (
              <div key={t.id} className="card-sm" onClick={() => { onClose(); openTask(t.id); }} style={{ cursor: "pointer", borderLeft: `3px solid ${catOf(t.category).color}` }}>
                <div className="between">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.title}</div>
                    {t.notes && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.notes}</div>}
                  </div>
                  <span className="tag" style={{ background: statusOf(t.status).color + "22", color: statusOf(t.status).color, fontSize: 9 }}>{statusOf(t.status).label}</span>
                </div>
              </div>
            ))}
            {results.events.map(e => {
              const t = eventTypeOf(e.type);
              return (
                <div key={e.id} className="card-sm" onClick={() => { onClose(); openEvent(e.id); }} style={{ cursor: "pointer", borderLeft: `3px solid ${e.color}` }}>
                  <div className="between">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{new Date(e.startDate + "T12:00:00").toLocaleDateString("de-DE")}</div>
                    </div>
                    <span className="tag" style={{ background: t.color + "22", color: t.color, fontSize: 9 }}>{t.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsModal({ state, dispatch, onClose }) {
  const [name, setName] = useState(state.settings.userName || "");
  const [wipeStep, setWipeStep] = useState(0); // 0=hidden, 1=first confirm, 2=second
  const [wipeText, setWipeText] = useState("");
  const enableNotifications = async () => {
    const ok = await Notif.requestPermission();
    if (ok) dispatch({ type: "UPD_SETTINGS", payload: { notifications: true } });
    else alert("Notifications wurden vom Browser/System nicht erlaubt.");
  };
  const disableNotifications = () => dispatch({ type: "UPD_SETTINGS", payload: { notifications: false } });
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `gsd-backup-${localDate()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const migrated = migrate(parsed);
        if (confirm("Aktuelle Daten überschreiben?")) dispatch({ type: "LOAD", payload: { ...migrated, view: state.view } });
      } catch (err) { alert("Datei konnte nicht gelesen werden"); }
    };
    reader.readAsText(file);
  };
  const doWipe = () => {
    dispatch({ type: "WIPE_USER_DATA" });
    setWipeStep(0);
    setWipeText("");
    alert("Alle Daten gelöscht. Feiertage bleiben erhalten.");
  };
  const NOTIF_CHANNELS = [
    { key: "notifTasks", label: "Aufgaben", emoji: "✅" },
    { key: "notifEvents", label: "Termine", emoji: "📅" },
    { key: "notifBirthdays", label: "Geburtstage", emoji: "🎂" },
    { key: "notifWorkouts", label: "Sport / Training", emoji: "💪" },
    { key: "notifHabits", label: "Habits", emoji: "🔥" },
  ];
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 18 }}>
          <h2 className="display" style={{ fontSize: 22 }}>Einstellungen</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="col" style={{ gap: 12 }}>
          <div><label className="label">Dein Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} onBlur={() => dispatch({ type: "UPD_SETTINGS", payload: { userName: name } })} placeholder="Wie soll ich dich nennen?" /></div>

          {/* Notifications master switch */}
          <div className="section-title">🔔 Benachrichtigungen</div>
          <div className="card-sm">
            <div className="between">
              <div><div style={{ fontWeight: 600, fontSize: 14 }}>Push-Benachrichtigungen</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{state.settings.notifications ? "Aktiviert" : "Deaktiviert"}</div></div>
              {state.settings.notifications
                ? <button className="btn btn-ghost" onClick={disableNotifications} style={{ padding: "6px 12px", fontSize: 12 }}>Aus</button>
                : <button className="btn btn-primary" onClick={enableNotifications} style={{ padding: "6px 12px", fontSize: 12 }}>Aktivieren</button>}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, lineHeight: 1.4 }}>
              Im Browser nur bei geöffneter App. Für Hintergrund-Benachrichtigungen brauchst du die Android-APK (Capacitor).
            </div>
          </div>

          {/* Per-channel toggles */}
          {state.settings.notifications && (
            <div className="card-sm">
              <div className="stat-label" style={{ marginBottom: 8 }}>Was soll dich erinnern?</div>
              <div className="col" style={{ gap: 6 }}>
                {NOTIF_CHANNELS.map(ch => {
                  const on = !!state.settings[ch.key];
                  return (
                    <div key={ch.key} className="between" onClick={() => dispatch({ type: "UPD_SETTINGS", payload: { [ch.key]: !on } })} style={{ cursor: "pointer", padding: "6px 0" }}>
                      <span style={{ fontSize: 13 }}>{ch.emoji} {ch.label}</span>
                      <span className={`chk ${on ? "on" : ""}`}>{on && <Check size={12} color="#000" strokeWidth={3} />}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily digest */}
          {state.settings.notifications && (
            <div className="card-sm">
              <div className="between" onClick={() => dispatch({ type: "UPD_SETTINGS", payload: { dailyDigest: !state.settings.dailyDigest } })} style={{ cursor: "pointer" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>📰 Tageszusammenfassung</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    {state.settings.dailyDigest ? `Täglich um ${state.settings.dailyDigestTime || "07:00"}` : "Aus"}
                  </div>
                </div>
                <span className={`chk ${state.settings.dailyDigest ? "on" : ""}`}>{state.settings.dailyDigest && <Check size={12} color="#000" strokeWidth={3} />}</span>
              </div>
              {state.settings.dailyDigest && (
                <>
                  <div style={{ borderTop: "1px solid var(--border)", margin: "10px 0 8px", opacity: 0.5 }} />
                  <div className="row" style={{ gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, flex: 1 }}>⏰ Uhrzeit</span>
                    <input
                      type="time"
                      className="input"
                      value={state.settings.dailyDigestTime || "07:00"}
                      onChange={e => dispatch({ type: "UPD_SETTINGS", payload: { dailyDigestTime: e.target.value } })}
                      style={{ width: 110, padding: "6px 10px", fontSize: 13 }}
                    />
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      const today = localDate();
                      const { title, body } = buildDigestBody(state, today);
                      Notif.fireNow({ title, body });
                    }}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12 }}
                  >
                    🧪 Test-Nachricht senden
                  </button>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, lineHeight: 1.4 }}>
                    Komplette Liste aller Termine, Aufgaben, Sport- und Habit-Einträge des Tages. Im Browser nur bei geöffneter App, in der APK auch im Hintergrund.
                  </div>
                </>
              )}
            </div>
          )}

          {/* Daten / Backup */}
          <div className="section-title">💾 Daten & Backup</div>
          <button className="btn btn-primary" onClick={exportData}><Download size={14} /> Backup exportieren</button>
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            <Upload size={14} /> Backup importieren
            <input type="file" accept=".json" onChange={e => e.target.files[0] && importData(e.target.files[0])} style={{ display: "none" }} />
          </label>
          <div className="card-sm">
            <div className="stat-label">Schema-Version</div>
            <div className="mono" style={{ fontSize: 12, marginTop: 4 }}>v{state.version} · {state.tasks.length} Tasks · {state.events.length} Events · {state.workouts.length} Workouts · {state.habits.length} Habits · {(state.notes||[]).length} Notizen</div>
          </div>

          {/* Wipe (versteckt) */}
          <div className="section-title" style={{ marginTop: 8 }}>⚠️ Gefahrenzone</div>
          {wipeStep === 0 && (
            <button className="btn btn-ghost" onClick={() => setWipeStep(1)} style={{ color: "#FF3B3B", borderColor: "#FF3B3B33" }}>
              🗑️ Alle Daten löschen
            </button>
          )}
          {wipeStep === 1 && (
            <div className="card" style={{ borderColor: "#FF3B3B" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FF3B3B", marginBottom: 6 }}>Wirklich alles löschen?</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
                Das löscht <b>alle Aufgaben, Termine, Geburtstage, Workouts, Habits, Listen, Notizen, Bücher, Ziele, Mahlzeiten und Pomodoros</b>.<br/>
                Feiertage bleiben erhalten.<br/>
                <b>Diese Aktion kann nicht rückgängig gemacht werden.</b>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setWipeStep(0)} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-danger" onClick={() => setWipeStep(2)} style={{ flex: 2 }}>Ich verstehe, weiter</button>
              </div>
            </div>
          )}
          {wipeStep === 2 && (
            <div className="card" style={{ borderColor: "#FF3B3B" }}>
              <div style={{ fontSize: 13, marginBottom: 8 }}>Tippe <b style={{ color: "#FF3B3B" }}>LÖSCHEN</b> ein um zu bestätigen:</div>
              <input className="input" value={wipeText} onChange={e => setWipeText(e.target.value)} autoFocus style={{ marginBottom: 10, borderColor: wipeText === "LÖSCHEN" ? "#FF3B3B" : "var(--border)" }} placeholder="LÖSCHEN" />
              <div className="row" style={{ gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => { setWipeStep(0); setWipeText(""); }} style={{ flex: 1 }}>Abbrechen</button>
                <button className="btn btn-danger" disabled={wipeText !== "LÖSCHEN"} onClick={doWipe} style={{ flex: 2, opacity: wipeText === "LÖSCHEN" ? 1 : 0.4 }}>
                  🗑️ Endgültig löschen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DailyRitualModal({ tasks, dispatch, onClose }) {
  const today = localDate();
  const candidates = tasks.filter(t => t.status !== "done" && t.status !== "todo").slice(0, 10);
  const [picked, setPicked] = useState([]);
  const finish = () => {
    picked.forEach(id => dispatch({ type: "MOVE_TASK", payload: { id, status: "todo" } }));
    dispatch({ type: "UPD_SETTINGS", payload: { dailyRitualDate: today } });
    onClose();
  };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <h2 className="display" style={{ fontSize: 24, marginBottom: 6 }}>⚡ Daily Plan</h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>Wähle bis zu 3 Aufgaben für heute</p>
        {candidates.length === 0 ? (
          <div className="empty"><p>Alles schon eingeplant! 🎉</p></div>
        ) : (
          <div className="col" style={{ gap: 6, marginBottom: 14 }}>
            {candidates.map(t => {
              const on = picked.includes(t.id);
              return (
                <div key={t.id} className="card-sm" style={{ cursor: "pointer", borderColor: on ? "var(--lime)" : "var(--border)", background: on ? "var(--lime-soft)" : "var(--s1)" }}
                  onClick={() => setPicked(p => on ? p.filter(x => x !== t.id) : (p.length < 3 ? [...p, t.id] : p))}>
                  <div className="row">
                    <span className={`chk ${on ? "on" : ""}`}>{on && <Check size={11} color="#000" strokeWidth={3} />}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{t.title}</span>
                    {t.isFrog && <span>💩</span>}
                    <span style={{ fontSize: 11 }}>{catOf(t.category).icon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Später</button>
          <button className="btn btn-primary" onClick={finish} style={{ flex: 2 }} disabled={picked.length === 0}>
            ⚡ {picked.length > 0 ? `${picked.length} EINPLANEN` : "EINPLANEN"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// VIEWS
// ════════════════════════════════════════════════════════════════════════════
function DashboardView({ state, dispatch, openTask, openEvent, openPomo, setShowRitual }) {
  const today = localDate();
  const todayWeekday = (new Date().getDay() + 6) % 7;
  const todayTasks = state.tasks.filter(t => getTaskDates(t, today, today).includes(today) && t.status !== "done");
  const frog = state.tasks.find(t => t.isFrog && t.status !== "done");
  const doneToday = state.tasks.filter(t => t.completedAt && localDate(new Date(t.completedAt)) === today).length;
  const total = state.tasks.length || 1;
  const doneAll = state.tasks.filter(t => t.status === "done").length;
  const pomosToday = state.pomodoros.filter(p => localDate(new Date(p.completedAt)) === today).length;
  const habitsToday = state.habits.filter(h => h.completions[today]).length;
  let streak = 0;
  const sd = new Date();
  for (let i = 0; i < 30; i++) {
    const ds = localDate(sd);
    if (!state.tasks.some(t => t.completedAt && localDate(new Date(t.completedAt)) === ds)) break;
    streak++; sd.setDate(sd.getDate() - 1);
  }
  const h = new Date().getHours();
  const greet = h < 12 ? "Morgen" : h < 18 ? "Tag" : "Abend";
  const name = state.settings.userName ? `, ${state.settings.userName}` : "";
  const chart7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i);
    const ds = localDate(d);
    return { day: DAYS_SHORT[(d.getDay() + 6) % 7], done: state.tasks.filter(t => t.completedAt && localDate(new Date(t.completedAt)) === ds).length };
  });
  const ritualDoneToday = state.settings.dailyRitualDate === today;
  const todayEvents = state.events.filter(e => getEventDates(e, today, today).includes(today));
  const todayWorkouts = state.workouts.filter(w => w.weekday === todayWeekday);
  const todayHabits = (state.habits || []).filter(h => {
    if (h.frequency === "daily") {
      if (!h.weekdays || h.weekdays.length === 0) return true;
      return h.weekdays.includes(todayWeekday);
    }
    return false;
  });
  // Build unified today-list, sorted by time. Items without time first.
  const todayItems = [
    ...todayEvents.map(e => ({ kind: "event", item: e, time: e.startTime || "", id: `e-${e.id}` })),
    ...todayTasks.map(t => ({ kind: "task", item: t, time: t.startTime || "", id: `t-${t.id}` })),
    ...todayWorkouts.map(w => ({ kind: "workout", item: w, time: w.time || "", id: `w-${w.id}` })),
    ...todayHabits.map(h => ({ kind: "habit", item: h, time: "", id: `h-${h.id}` })),
  ].sort((a, b) => {
    if (!a.time && b.time) return -1;
    if (a.time && !b.time) return 1;
    return (a.time || "").localeCompare(b.time || "");
  });
  const handleQuickComplete = (id, ev) => {
    ev.stopPropagation();
    dispatch({ type: "MOVE_TASK", payload: { id, status: "done" } });
    fireCelebration();
  };
  const toggleHabit = (id) => dispatch({ type: "TOGGLE_HABIT", payload: { id, date: today } });

  return (
    <div className="view">
      <div style={{ marginBottom: 14 }}>
        <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Anton" }}>
          {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="display" style={{ fontSize: 26, marginTop: 2 }}>
          GUTEN {greet}<span style={{ color: "var(--lime)" }}>{name}</span>
        </h1>
      </div>

      {/* 1. Daily Plan */}
      {!ritualDoneToday && (
        <div className="card-lime" style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => setShowRitual(true)}>
          <div className="between">
            <div><div className="stat-label" style={{ color: "#fff" }}>⚡ Daily Plan</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 }}>Was ist heute wichtig?</div></div>
            <ChevronRight size={20} color="#fff" />
          </div>
        </div>
      )}

      {/* 2. ALLES heute */}
      {todayItems.length > 0 && (
        <>
          <div className="section-title">⚡ Heute · {todayItems.length} {todayItems.length === 1 ? "Eintrag" : "Einträge"}</div>
          {todayItems.map(it => {
            if (it.kind === "event") {
              const e = it.item;
              const eType = eventTypeOf(e.type);
              return (
                <div key={it.id} onClick={() => !e.isHoliday && openEvent && openEvent(e.id)} className="card-sm" style={{ marginBottom: 6, cursor: e.isHoliday ? "default" : "pointer", borderLeft: `3px solid ${e.color}` }}>
                  <div className="between">
                    <div className="row" style={{ flex: 1, minWidth: 0 }}>
                      {e.isHoliday ? <span style={{ fontSize: 14 }}>🎉</span> : <eType.icon size={14} color={e.color} />}
                      <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
                    </div>
                    {e.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{e.startTime}</span>}
                  </div>
                </div>
              );
            }
            if (it.kind === "task") {
              const t = it.item;
              return (
                <div key={it.id} onClick={() => openTask(t.id)} className="card-sm" style={{ marginBottom: 6, cursor: "pointer", borderLeft: `3px solid ${catOf(t.category).color}` }}>
                  <div className="between">
                    <div className="row" style={{ flex: 1, minWidth: 0 }}>
                      <span className="chk round" onClick={ev => handleQuickComplete(t.id, ev)} style={{ width: 18, height: 18 }}></span>
                      <div className={`prio-dot ${prioOf(t.priority).className}`} />
                      <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{t.isFrog && "💩 "}{t.title}</span>
                    </div>
                    {t.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{t.startTime}</span>}
                  </div>
                </div>
              );
            }
            if (it.kind === "workout") {
              const w = it.item;
              return (
                <div key={it.id} className="card-sm" style={{ marginBottom: 6, borderLeft: `3px solid ${w.color}` }}>
                  <div className="between">
                    <div className="row" style={{ flex: 1, minWidth: 0 }}>
                      <Dumbbell size={14} color={w.color} />
                      <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>💪 {w.title}</span>
                    </div>
                    {w.time && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{w.time}</span>}
                  </div>
                </div>
              );
            }
            if (it.kind === "habit") {
              const hb = it.item;
              const done = !!(hb.completions || {})[today];
              return (
                <div key={it.id} onClick={() => toggleHabit(hb.id)} className="card-sm" style={{ marginBottom: 6, cursor: "pointer", borderLeft: `3px solid ${hb.color}` }}>
                  <div className="between">
                    <div className="row" style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14 }}>{hb.emoji}</span>
                      <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>{hb.title}</span>
                    </div>
                    <span className={`chk ${done ? "on" : ""}`}>{done && <Check size={12} color="#000" strokeWidth={3} />}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </>
      )}

      {/* 3. Shit of the Day */}
      {frog && (
        <div onClick={() => openTask(frog.id)} className="card" style={{ marginTop: 12, marginBottom: 12, cursor: "pointer", borderLeft: "3px solid var(--lime)" }}>
          <div className="row">
            <span style={{ fontSize: 28 }}>💩</span>
            <div style={{ flex: 1 }}><div className="stat-label">Shit of the Day</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{frog.title}</div></div>
            <ChevronRight size={18} color="var(--muted)" />
          </div>
        </div>
      )}

      {todayItems.length === 0 && !frog && (
        <div className="empty"><Sparkles size={32} className="empty-icon" /><p>Heute steht nichts an. ⚡</p></div>
      )}

      {/* 5. Stats */}
      <div className="stat-grid" style={{ marginBottom: 8, marginTop: 16 }}>
        <div className="stat-tile"><div className="stat-label">Heute fertig</div>
          <div className="stat-val" style={{ color: "var(--lime)" }}>{doneToday}</div></div>
        <div className="stat-tile"><div className="stat-label">🔥 Streak</div>
          <div className="stat-val">{streak}<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>Tg</span></div></div>
        <div className="stat-tile"><div className="stat-label">Pomodoros</div>
          <div className="stat-val">{pomosToday}<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 3 }}>×25m</span></div></div>
        <div className="stat-tile"><div className="stat-label">Habits</div>
          <div className="stat-val">{habitsToday}<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>/{state.habits.length}</span></div></div>
      </div>
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <div className="stat-tile"><div className="stat-label">Heute geplant</div><div className="stat-val">{todayTasks.length}</div></div>
        <div className="stat-tile"><div className="stat-label">Quote</div>
          <div className="stat-val">{Math.round(doneAll/total*100)}<span style={{ fontSize: 11, color: "var(--muted)" }}>%</span></div></div>
      </div>

      {/* 6. Chart */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="stat-label" style={{ marginBottom: 10 }}>Letzte 7 Tage</div>
        <ResponsiveContainer width="100%" height={88}>
          <AreaChart data={chart7} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
            <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#AAFF00" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#AAFF00" stopOpacity={0} />
            </linearGradient></defs>
            <XAxis dataKey="day" tick={{ fill: "#707070", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#707070", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "var(--s1)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} />
            <Area type="monotone" dataKey="done" stroke="#AAFF00" strokeWidth={2} fill="url(#ag)" dot={{ fill: "#AAFF00", r: 3, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TasksView({ state, dispatch, openTask }) {
  const [filter, setFilter] = useState("all");
  const onDrop = useCallback((id, status) => {
    dispatch({ type: "MOVE_TASK", payload: { id, status } });
    if (status === "done") fireCelebration();
  }, [dispatch]);
  const { drag, startDrag } = useDragDrop(onDrop);
  const filtered = state.tasks.filter(t => {
    if (filter === "all") return true;
    if (filter === "frog") return t.isFrog;
    return t.priority === Number(filter);
  });
  return (
    <div className="view">
      <div className="between" style={{ marginBottom: 12 }}>
        <h2 className="display" style={{ fontSize: 24 }}>Aufgaben</h2>
        <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{filtered.length} TASKS</span>
      </div>
      <div className="row" style={{ gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
        <button className={`chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>Alle</button>
        <button className={`chip ${filter === "frog" ? "on" : ""}`} onClick={() => setFilter("frog")}>💩 Shits</button>
        <button className={`chip ${filter === "3" ? "on" : ""}`} onClick={() => setFilter("3")}><span className="prio-dot prio-3" />Hoch</button>
        <button className={`chip ${filter === "2" ? "on" : ""}`} onClick={() => setFilter("2")}><span className="prio-dot prio-2" />Mittel</button>
        <button className={`chip ${filter === "1" ? "on" : ""}`} onClick={() => setFilter("1")}><span className="prio-dot prio-1" />Niedrig</button>
      </div>
      <div className="kanban">
        {STATUSES.map(col => {
          const colTasks = filtered.filter(t => t.status === col.id);
          const isOver = drag.active && drag.overId === col.id;
          return (
            <div key={col.id} className={`kanban-col ${isOver ? "over" : ""}`} data-drop-zone={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id) onDrop(id, col.id); }}>
              <div className="kanban-col-head">
                <div className="row">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                  <span className="display" style={{ fontSize: 12 }}>{col.label}</span>
                </div>
                <span style={{ background: "var(--s2)", borderRadius: 20, padding: "1px 8px", fontSize: 11, color: "var(--muted)" }}>{colTasks.length}</span>
              </div>
              {colTasks.map(t => (
                <div key={t.id}
                  className={`task-card ${drag.id === t.id ? "dragging" : ""} ${t.status === "done" ? "done-card" : ""}`}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", t.id); e.dataTransfer.effectAllowed = "move"; }}
                  onTouchStart={(e) => startDrag(t.id, e, t.title)}
                  onClick={() => { if (!drag.active) openTask(t.id); }}>
                  <div className="between" style={{ marginBottom: 6 }}>
                    <span className="tag" style={{ background: catOf(t.category).color + "1A", color: catOf(t.category).color, fontSize: 10 }}>
                      {catOf(t.category).icon} {catOf(t.category).label}
                    </span>
                    <div className="row" style={{ gap: 4 }}>
                      {t.isFrog && <span style={{ fontSize: 12 }}>💩</span>}
                      {t.recurrence && t.recurrence.type !== "none" && <Repeat size={11} color="var(--muted)" />}
                      <div className={`prio-dot ${prioOf(t.priority).className}`} />
                    </div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{t.title}</p>
                  <div className="row" style={{ marginTop: 7, gap: 8, flexWrap: "wrap" }}>
                    {t.startDate && (
                      <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
                        📅 {new Date(t.startDate + "T12:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                        {t.endDate && t.endDate !== t.startDate && ` →`}
                      </span>
                    )}
                    {t.startTime && <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>🕐 {t.startTime}</span>}
                    {t.subtasks.length > 0 && <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>☑ {t.subtasks.filter(s => s.done).length}/{t.subtasks.length}</span>}
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: "var(--dim)", fontSize: 11 }}>—</div>}
            </div>
          );
        })}
      </div>
      {drag.active && drag.ghost && (
        <div className="drag-ghost" style={{ left: drag.x - drag.offsetX, top: drag.y - drag.offsetY, width: 220 }}>
          <div className="task-card"><p style={{ fontSize: 13 }}>{drag.ghost}</p></div>
        </div>
      )}
    </div>
  );
}

function CalendarView({ state, dispatch, openTask, openEvent, setShowAddEvent }) {
  const [tab, setTab] = useState("month");
  return (
    <div className="view calendar-view">
      <div className="between" style={{ marginBottom: 12 }}>
        <h2 className="display" style={{ fontSize: 24 }}>Kalender</h2>
        <button className="btn btn-primary" onClick={() => setShowAddEvent(true)} style={{ padding: "7px 11px", fontSize: 11 }}>
          <Plus size={13} /> TERMIN
        </button>
      </div>
      <div className="cal-tabs">
        <button className={`cal-tab ${tab === "month" ? "active" : ""}`} onClick={() => setTab("month")}>Monat</button>
        <button className={`cal-tab ${tab === "week" ? "active" : ""}`} onClick={() => setTab("week")}>Woche</button>
        <button className={`cal-tab ${tab === "gantt" ? "active" : ""}`} onClick={() => setTab("gantt")}>Gantt</button>
      </div>
      {tab === "month" && <MonthView state={state} dispatch={dispatch} openTask={openTask} openEvent={openEvent} />}
      {tab === "week" && <WeekListView state={state} dispatch={dispatch} openTask={openTask} openEvent={openEvent} />}
      {tab === "gantt" && <GanttView state={state} dispatch={dispatch} openTask={openTask} openEvent={openEvent} />}
    </div>
  );
}

function MonthView({ state, dispatch, openTask, openEvent }) {
  const [offset, setOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const today = localDate();
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = target.getFullYear(), month = target.getMonth();
  const cells = monthMatrix(year, month);
  const winStart = cellDate(cells[0]), winEnd = cellDate(cells[cells.length - 1]);
  const itemsByDate = useMemo(() => {
    const m = {};
    state.tasks.forEach(t => getTaskDates(t, winStart, winEnd).forEach(d => { (m[d] = m[d] || []).push({ kind: "task", item: t }); }));
    state.events.forEach(e => getEventDates(e, winStart, winEnd).forEach(d => { (m[d] = m[d] || []).push({ kind: "event", item: e }); }));
    state.workouts.forEach(w => getWorkoutDates(w, winStart, winEnd).forEach(d => { (m[d] = m[d] || []).push({ kind: "workout", item: w }); }));
    (state.habits || []).forEach(h => getHabitDates(h, winStart, winEnd).forEach(d => { (m[d] = m[d] || []).push({ kind: "habit", item: h }); }));
    return m;
  }, [state.tasks, state.events, state.workouts, state.habits, winStart, winEnd]);
  return (
    <div>
      <div className="between" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o - 1)}><ChevronLeft size={16} /></button>
        <div className="display" style={{ fontSize: 17 }}>{MONTHS_DE[month]} {year}</div>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o + 1)}><ChevronRight size={16} /></button>
      </div>
      <div className="month-weekdays">
        {DAYS_SHORT.map(d => <div key={d} className="month-weekday-cell">{d}</div>)}
      </div>
      <div className="month-grid">
        {cells.map((c, i) => {
          const ds = cellDate(c);
          const items = itemsByDate[ds] || [];
          const hasHoliday = items.some(it => it.kind === "event" && it.item.isHoliday);
          const isToday = ds === today;
          return (
            <div key={i} className={`month-day ${isToday ? "today" : ""} ${c.otherMonth ? "other-month" : ""} ${hasHoliday ? "holiday" : ""}`} onClick={() => setSelectedDate(ds)}>
              <div className="day-num">{c.day}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {items.slice(0, 3).map((it, idx) => {
                  if (it.kind === "task") {
                    return <div key={idx} className="day-task-bar" onClick={(e) => { e.stopPropagation(); openTask(it.item.id); }} style={{ background: catOf(it.item.category).color }}>{it.item.title}</div>;
                  } else if (it.kind === "event") {
                    return <div key={idx} className="day-task-bar" onClick={(e) => { e.stopPropagation(); openEvent(it.item.id); }} style={{ background: it.item.color, opacity: it.item.isHoliday ? 0.7 : 1 }}>
                      {it.item.isHoliday ? "🎉 " : it.item.type === "birthday" ? "🎂 " : it.item.type === "vacation" ? "✈️ " : ""}{it.item.title}
                    </div>;
                  } else if (it.kind === "habit") {
                    return <div key={idx} className="day-task-bar" style={{ background: it.item.color, opacity: 0.7 }} onClick={(e) => e.stopPropagation()}>{it.item.emoji} {it.item.title}</div>;
                  } else {
                    return <div key={idx} className="day-task-bar" style={{ background: it.item.color, opacity: 0.85 }} onClick={(e) => e.stopPropagation()}>💪 {it.item.title}</div>;
                  }
                })}
                {items.length > 3 && <div style={{ fontSize: 8, color: "var(--lime)", fontWeight: 700, paddingLeft: 2, cursor: "pointer" }}>+{items.length - 3} mehr</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="row" style={{ flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {CATS.map(c => (
          <div key={c.id} className="row" style={{ gap: 4 }}>
            <div style={{ width: 10, height: 10, background: c.color, borderRadius: 2 }} />
            <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{c.label}</span>
          </div>
        ))}
        <div className="row" style={{ gap: 4 }}>
          <div style={{ width: 10, height: 10, background: "#FF6B35", borderRadius: 2 }} />
          <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>Feiertag</span>
        </div>
      </div>
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          items={itemsByDate[selectedDate] || []}
          onClose={() => setSelectedDate(null)}
          openTask={(id) => { setSelectedDate(null); openTask(id); }}
          openEvent={(id) => { setSelectedDate(null); openEvent(id); }}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

function DayDetailModal({ date, items, onClose, openTask, openEvent, dispatch }) {
  const dt = new Date(date + "T12:00:00");
  const dayLabel = `${DAYS_FULL[(dt.getDay() + 6) % 7]}, ${dt.getDate()}. ${MONTHS_DE[dt.getMonth()]}`;
  const tasks = items.filter(i => i.kind === "task");
  const events = items.filter(i => i.kind === "event");
  const workouts = items.filter(i => i.kind === "workout");
  const habits = items.filter(i => i.kind === "habit");
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="grip" />
        <div className="between" style={{ marginBottom: 14 }}>
          <h2 className="display" style={{ fontSize: 20 }}>{dayLabel}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, color: "var(--muted)" }}>Nichts an diesem Tag.</div>
        ) : (
          <div className="col" style={{ gap: 14 }}>
            {events.length > 0 && (
              <div>
                <div className="stat-label" style={{ marginBottom: 6 }}>Termine</div>
                <div className="col" style={{ gap: 6 }}>
                  {events.map((it, i) => (
                    <div key={`e-${i}`} className="card-sm" style={{ cursor: it.item.isHoliday ? "default" : "pointer", borderLeft: `3px solid ${it.item.color}` }} onClick={() => !it.item.isHoliday && openEvent(it.item.id)}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14 }}>
                          {it.item.isHoliday ? "🎉 " : it.item.type === "birthday" ? "🎂 " : it.item.type === "vacation" ? "✈️ " : "📅 "}{it.item.title}
                        </span>
                        {it.item.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{it.item.startTime}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tasks.length > 0 && (
              <div>
                <div className="stat-label" style={{ marginBottom: 6 }}>Aufgaben</div>
                <div className="col" style={{ gap: 6 }}>
                  {tasks.map((it, i) => (
                    <div key={`t-${i}`} className="card-sm" style={{ cursor: "pointer", borderLeft: `3px solid ${catOf(it.item.category).color}` }} onClick={() => openTask(it.item.id)}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, textDecoration: it.item.status === "done" ? "line-through" : "none", opacity: it.item.status === "done" ? 0.55 : 1 }}>
                          {it.item.isFrog && "💩 "}{it.item.title}
                        </span>
                        {it.item.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{it.item.startTime}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {workouts.length > 0 && (
              <div>
                <div className="stat-label" style={{ marginBottom: 6 }}>Sport</div>
                <div className="col" style={{ gap: 6 }}>
                  {workouts.map((it, i) => (
                    <div key={`w-${i}`} className="card-sm" style={{ borderLeft: `3px solid ${it.item.color}` }}>
                      <div className="row" style={{ justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14 }}>💪 {it.item.title}</span>
                        <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{it.item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {habits.length > 0 && (
              <div>
                <div className="stat-label" style={{ marginBottom: 6 }}>Habits</div>
                <div className="col" style={{ gap: 6 }}>
                  {habits.map((it, i) => {
                    const done = !!(it.item.completions || {})[date];
                    return (
                      <div key={`h-${i}`} className="card-sm" style={{ cursor: "pointer", borderLeft: `3px solid ${it.item.color}` }} onClick={() => dispatch && dispatch({ type: "TOGGLE_HABIT", payload: { id: it.item.id, date } })}>
                        <div className="row" style={{ justifyContent: "space-between" }}>
                          <span style={{ fontSize: 14, textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>{it.item.emoji} {it.item.title}</span>
                          <span className={`chk ${done ? "on" : ""}`}>{done && <Check size={12} color="#000" strokeWidth={3} />}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WeekListView({ state, dispatch, openTask, openEvent }) {
  const [offset, setOffset] = useState(0);
  const dates = weekDates(offset);
  const today = localDate();
  const winStart = dates[0], winEnd = dates[6];
  const itemsByDate = useMemo(() => {
    const m = {};
    dates.forEach(d => { m[d] = []; });
    state.tasks.forEach(t => {
      getTaskDates(t, winStart, winEnd).forEach(d => {
        if (m[d]) m[d].push({ kind: "task", item: t, time: t.startTime || "" });
      });
    });
    state.events.forEach(e => {
      getEventDates(e, winStart, winEnd).forEach(d => {
        if (m[d]) m[d].push({ kind: "event", item: e, time: e.startTime || "" });
      });
    });
    state.workouts.forEach(w => {
      getWorkoutDates(w, winStart, winEnd).forEach(d => {
        if (m[d]) m[d].push({ kind: "workout", item: w, time: w.time });
      });
    });
    (state.habits || []).forEach(h => {
      getHabitDates(h, winStart, winEnd).forEach(d => {
        if (m[d]) m[d].push({ kind: "habit", item: h, time: "" });
      });
    });
    Object.keys(m).forEach(d => {
      m[d].sort((a, b) => {
        if (!a.time && b.time) return -1;
        if (a.time && !b.time) return 1;
        return (a.time || "").localeCompare(b.time || "");
      });
    });
    return m;
  }, [state.tasks, state.events, state.workouts, state.habits, winStart, winEnd]);
  const label = `${new Date(dates[0] + "T12:00:00").getDate()}. – ${new Date(dates[6] + "T12:00:00").getDate()}. ${MONTHS_DE[new Date(dates[6] + "T12:00:00").getMonth()]}`;
  return (
    <div>
      <div className="between" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o - 1)}><ChevronLeft size={16} /></button>
        <div className="display" style={{ fontSize: 14 }}>{label}</div>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o + 1)}><ChevronRight size={16} /></button>
      </div>
      <div className="col" style={{ gap: 0 }}>
        {dates.map((d, i) => {
          const items = itemsByDate[d];
          const isT = d === today;
          const dt = new Date(d + "T12:00:00");
          return (
            <div key={d} className={`day-list-card ${isT ? "is-today" : ""}`}>
              <div className={`day-list-head ${isT ? "is-today" : ""}`}>
                <div className="row">
                  <div className="display" style={{ fontSize: 13, color: isT ? "var(--lime)" : "var(--text)" }}>{DAYS_FULL[i]}</div>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{dt.getDate()}. {MONTHS_DE[dt.getMonth()].slice(0, 3)}</span>
                </div>
                {items.length > 0 && <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{items.length}</span>}
              </div>
              <div className="day-list-body">
                {items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 12, color: "var(--dim)", fontSize: 12 }}>—</div>
                ) : items.map((it, idx) => {
                  if (it.kind === "task") {
                    const t = it.item;
                    return (
                      <div key={`t-${idx}`} onClick={() => openTask(t.id)} className="row-item">
                        <div className={`prio-dot ${prioOf(t.priority).className}`} />
                        <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: t.status === "done" ? "line-through" : "none", opacity: t.status === "done" ? 0.5 : 1 }}>
                          {t.isFrog && "💩 "}{t.title}
                        </span>
                        {t.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{t.startTime}</span>}
                        <span className="tag" style={{ background: catOf(t.category).color + "22", color: catOf(t.category).color, fontSize: 9 }}>{catOf(t.category).icon}</span>
                      </div>
                    );
                  } else if (it.kind === "event") {
                    const e = it.item;
                    return (
                      <div key={`e-${idx}`} onClick={() => openEvent(e.id)} className="row-item">
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.isHoliday ? "🎉 " : e.type === "birthday" ? "🎂 " : e.type === "vacation" ? "✈️ " : ""}{e.title}
                        </span>
                        {e.startTime && <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{e.startTime}</span>}
                      </div>
                    );
                  } else if (it.kind === "habit") {
                    const h = it.item;
                    const done = !!(h.completions || {})[d];
                    return (
                      <div key={`h-${idx}`} className="row-item" onClick={() => dispatch && dispatch({ type: "TOGGLE_HABIT", payload: { id: h.id, date: d } })}>
                        <span style={{ fontSize: 13, flexShrink: 0 }}>{h.emoji}</span>
                        <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>{h.title}</span>
                        <span className={`chk ${done ? "on" : ""}`} style={{ width: 16, height: 16 }}>{done && <Check size={10} color="#000" strokeWidth={3} />}</span>
                      </div>
                    );
                  } else {
                    const w = it.item;
                    return (
                      <div key={`w-${idx}`} className="row-item" style={{ cursor: "default" }}>
                        <Dumbbell size={12} color={w.color} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>💪 {w.title}</span>
                        <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{w.time}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GanttView({ state, dispatch, openTask, openEvent }) {
  const [offset, setOffset] = useState(0);
  const today = localDate();
  const start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + offset * 7);
  const days = Array.from({ length: 21 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return localDate(d); });
  const dayWidth = 40;
  const tasksWithDates = state.tasks.filter(t => t.startDate);
  const eventsWithDates = (state.events || []).filter(e => e.startDate && !e.isHoliday);
  const allBars = [
    ...tasksWithDates.map(t => ({ id: t.id, kind: "task", title: t.title, startDate: t.startDate, endDate: t.endDate || t.startDate, color: catOf(t.category).color, faded: t.status === "done", item: t })),
    ...eventsWithDates.map(e => ({ id: e.id, kind: "event", title: (e.type === "birthday" ? "🎂 " : e.type === "vacation" ? "✈️ " : "📅 ") + e.title, startDate: e.startDate, endDate: e.endDate || e.startDate, color: e.color, faded: false, item: e })),
  ];
  const headerStart = new Date(days[0] + "T12:00:00");
  const headerEnd = new Date(days[days.length - 1] + "T12:00:00");
  const monthLabel = `${MONTHS_DE[headerStart.getMonth()].slice(0, 3)} ${headerStart.getDate()} – ${MONTHS_DE[headerEnd.getMonth()].slice(0, 3)} ${headerEnd.getDate()}`;
  return (
    <div>
      <div className="between" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o - 1)}><ChevronLeft size={16} /></button>
        <div className="display" style={{ fontSize: 13 }}>{monthLabel}</div>
        <button className="btn btn-ghost btn-icon" onClick={() => setOffset(o => o + 1)}><ChevronRight size={16} /></button>
      </div>
      {allBars.length === 0 ? (
        <div className="empty"><p>Keine Aufgaben oder Termine mit Datum</p></div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", background: "var(--s0)" }}>
          <div style={{ minWidth: 110 + days.length * dayWidth }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border2)", height: 36, background: "var(--s1)" }}>
              <div className="gantt-label display" style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center" }}>Eintrag</div>
              <div style={{ flex: 1, display: "flex" }}>
                {days.map(d => {
                  const dt = new Date(d + "T12:00:00");
                  const isT = d === today;
                  return (
                    <div key={d} style={{ width: dayWidth, textAlign: "center", borderRight: "1px solid var(--border)", padding: "4px 0", background: isT ? "var(--lime-soft)" : "transparent" }}>
                      <div className="mono" style={{ fontSize: 9, color: isT ? "var(--lime)" : "var(--muted)" }}>{DAYS_SHORT[(dt.getDay() + 6) % 7]}</div>
                      <div className="display" style={{ fontSize: 12, color: isT ? "var(--lime)" : "var(--text)" }}>{dt.getDate()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {allBars.map(b => {
              const startIdx = days.indexOf(b.startDate);
              const endIdx = days.indexOf(b.endDate);
              const visStart = startIdx === -1 ? 0 : startIdx;
              const visEnd = endIdx === -1 ? days.length - 1 : endIdx;
              if (visEnd < 0 || visStart >= days.length) {
                const tStart = new Date(b.startDate + "T12:00:00");
                const tEnd = new Date(b.endDate + "T12:00:00");
                if (tEnd < headerStart || tStart > headerEnd) return null;
              }
              const left = Math.max(0, visStart) * dayWidth;
              const width = (Math.min(visEnd, days.length - 1) - Math.max(0, visStart) + 1) * dayWidth - 2;
              if (width <= 0) return null;
              return (
                <div key={`${b.kind}-${b.id}`} className="gantt-row" onClick={() => b.kind === "task" ? openTask(b.id) : openEvent(b.id)} style={{ cursor: "pointer" }}>
                  <div className="gantt-label">{b.title}</div>
                  <div className="gantt-track">
                    <div className="gantt-bar" style={{ left, width, background: b.color, opacity: b.faded ? 0.4 : 1 }}>
                      {width > 60 && b.title}
                    </div>
                    {days.includes(today) && <div className="gantt-today-line" style={{ left: days.indexOf(today) * dayWidth + dayWidth / 2 }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SportView({ state, dispatch, setShowAddWorkout }) {
  const today = localDate();
  const todayWeekday = (new Date().getDay() + 6) % 7;
  const workoutsByDay = useMemo(() => {
    const m = {};
    DAYS_SHORT.forEach((_, i) => { m[i] = []; });
    state.workouts.forEach(w => { if (m[w.weekday]) m[w.weekday].push(w); });
    Object.values(m).forEach(arr => arr.sort((a, b) => (a.time || "").localeCompare(b.time || "")));
    return m;
  }, [state.workouts]);
  const totalThisWeek = state.workouts.length;
  const totalMinutes = state.workouts.reduce((a, w) => a + (w.duration || 0), 0);
  return (
    <div className="view">
      <div className="between" style={{ marginBottom: 14 }}>
        <h2 className="display" style={{ fontSize: 24 }}>💪 Sport</h2>
        <button className="btn btn-primary" onClick={() => setShowAddWorkout(true)} style={{ padding: "7px 11px", fontSize: 11 }}>
          <Plus size={13} /> WORKOUT
        </button>
      </div>
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <div className="stat-tile"><div className="stat-label">Pro Woche</div>
          <div className="stat-val" style={{ color: "var(--lime)" }}>{totalThisWeek}<span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>×</span></div></div>
        <div className="stat-tile"><div className="stat-label">Trainingszeit</div>
          <div className="stat-val">{Math.floor(totalMinutes / 60)}<span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>h {totalMinutes % 60}m</span></div></div>
      </div>
      <div className="col" style={{ gap: 8 }}>
        {DAYS_SHORT.map((_, i) => {
          const wos = workoutsByDay[i];
          const isT = i === todayWeekday;
          return (
            <div key={i} className={`day-list-card ${isT ? "is-today" : ""}`}>
              <div className={`day-list-head ${isT ? "is-today" : ""}`}>
                <div className="display" style={{ fontSize: 13, color: isT ? "var(--lime)" : "var(--text)" }}>
                  {DAYS_FULL[i]}{isT ? " · HEUTE" : ""}
                </div>
                <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{wos.length} {wos.length === 1 ? "Einheit" : "Einheiten"}</span>
              </div>
              <div className="day-list-body">
                {wos.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 14, color: "var(--dim)", fontSize: 12 }}>Ruhetag</div>
                ) : wos.map((w, idx) => {
                  const wt = workoutTypeOf(w.type);
                  return (
                    <div key={w.id} className="row-item">
                      <span style={{ fontSize: 16 }}>{wt.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{w.title}</div>
                        {w.notes && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.notes}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="mono" style={{ fontSize: 12, color: "var(--lime)" }}>{w.time}</div>
                        <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{w.duration}min</div>
                      </div>
                      <button onClick={() => dispatch({ type: "DEL_WORKOUT", payload: w.id })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}><X size={11} /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {state.workouts.length === 0 && (
        <div className="empty" style={{ marginTop: 20 }}>
          <Dumbbell size={32} className="empty-icon" />
          <p>Noch kein Trainingsplan.<br />Lege dein erstes Workout an. 💪</p>
        </div>
      )}
    </div>
  );
}

function ShoppingView({ state, dispatch }) {
  const [active, setActive] = useState(state.shoppingLists[0]?.id || null);
  const [newItem, setNewItem] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const cur = state.shoppingLists.find(l => l.id === active);
  const COLORS = ["#AAFF00", "#00E0FF", "#FF2D78", "#FFB800", "#8B5CF6", "#FF6B35"];
  return (
    <div className="view">
      <div className="between" style={{ marginBottom: 12 }}>
        <h2 className="display" style={{ fontSize: 24 }}>Einkauf</h2>
        <button className="btn btn-primary" style={{ padding: "7px 11px", fontSize: 11 }} onClick={() => setAdding(!adding)}><Plus size={13} /> LISTE</button>
      </div>
      {adding && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 8 }}>
            <input
              className="input"
              placeholder="Listen-Name..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newName.trim()) {
                  const id = uid();
                  dispatch({ type: "ADD_LIST", payload: { id, name: newName.trim(), color: COLORS[state.shoppingLists.length % COLORS.length], items: [] } });
                  setActive(id); setNewName(""); setAdding(false);
                }
              }}
              autoFocus
            />
            <button
              className="btn btn-primary"
              disabled={!newName.trim()}
              onClick={() => {
                if (!newName.trim()) return;
                const id = uid();
                dispatch({ type: "ADD_LIST", payload: { id, name: newName.trim(), color: COLORS[state.shoppingLists.length % COLORS.length], items: [] } });
                setActive(id); setNewName(""); setAdding(false);
              }}
              style={{ padding: "10px 14px" }}
            >OK</button>
            <button className="btn btn-ghost" onClick={() => { setNewName(""); setAdding(false); }}>Abbrechen</button>
          </div>
        </div>
      )}
      <div className="row" style={{ gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
        {state.shoppingLists.map(l => {
          const p = l.items.length ? Math.round(l.items.filter(i => i.done).length / l.items.length * 100) : 0;
          return (
            <div key={l.id} onClick={() => setActive(l.id)} style={{ flexShrink: 0, padding: "10px 14px", borderRadius: 10, cursor: "pointer", minWidth: 110, border: `1.5px solid ${active === l.id ? l.color : "var(--border)"}`, background: active === l.id ? l.color + "18" : "var(--s1)" }}>
              <p className="display" style={{ fontSize: 11, color: active === l.id ? l.color : "var(--text)", marginBottom: 5 }}>{l.name}</p>
              <div className="pbar"><div className="pfill" style={{ width: `${p}%`, background: l.color }} /></div>
              <p className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{l.items.filter(i => i.done).length}/{l.items.length}</p>
            </div>
          );
        })}
      </div>
      {cur && (
        <>
          <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            <input className="input" placeholder="Artikel hinzufügen..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && newItem.trim()) { dispatch({ type: "ADD_ITEM", payload: { listId: cur.id, item: { id: uid(), text: newItem.trim(), done: false } } }); setNewItem(""); } }} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={() => { if (newItem.trim()) { dispatch({ type: "ADD_ITEM", payload: { listId: cur.id, item: { id: uid(), text: newItem.trim(), done: false } } }); setNewItem(""); } }} style={{ padding: "0 16px" }}><Plus size={16} /></button>
          </div>
          <div className="card">
            {cur.items.length === 0 ? <p className="empty">Liste ist leer</p> : [...cur.items].sort((a, b) => a.done - b.done).map(item => (
              <div key={item.id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span className={`chk ${item.done ? "on" : ""}`} onClick={() => dispatch({ type: "TOGGLE_ITEM", payload: { listId: cur.id, itemId: item.id } })}>
                  {item.done && <Check size={11} color="#000" strokeWidth={3} />}
                </span>
                <span style={{ flex: 1, fontSize: 14, textDecoration: item.done ? "line-through" : "none", color: item.done ? "var(--muted)" : "var(--text)" }}>{item.text}</span>
                <button onClick={() => dispatch({ type: "DEL_ITEM", payload: { listId: cur.id, itemId: item.id } })} className="btn btn-ghost btn-icon" style={{ width: 24, height: 24 }}><X size={12} /></button>
              </div>
            ))}
          </div>
          <button className="btn btn-danger" style={{ width: "100%", marginTop: 12 }} onClick={() => { if (confirm("Liste löschen?")) { dispatch({ type: "DEL_LIST", payload: cur.id }); setActive(state.shoppingLists.filter(l => l.id !== cur.id)[0]?.id || null); } }}>
            <Trash2 size={14} /> Liste löschen
          </button>
        </>
      )}
      {state.shoppingLists.length === 0 && (
        <div className="empty"><ShoppingCart size={32} className="empty-icon" /><p>Noch keine Listen</p></div>
      )}
    </div>
  );
}

function MoreView({ state, dispatch, setSubView }) {
  const tiles = [
    { id: "habits", icon: "🔥", label: "Habits", count: state.habits.length, color: "#FF6B35" },
    { id: "goals", icon: "🎯", label: "Ziele", count: state.goals.length, color: "#AAFF00" },
    { id: "stats", icon: "📊", label: "Statistik", count: null, color: "#00E0FF" },
    { id: "books", icon: "📚", label: "Bücher", count: state.books.length, color: "#10EDAA" },
    { id: "meals", icon: "🍳", label: "Mahlzeiten", count: null, color: "#FFB800" },
    { id: "notes", icon: "📝", label: "Notizen", count: (state.notes || []).length, color: "#FF2D78" },
  ];
  return (
    <div className="view">
      <h2 className="display" style={{ fontSize: 24, marginBottom: 14 }}>Mehr</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {tiles.map(t => (
          <div key={t.id} onClick={() => setSubView(t.id)} style={{
            background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r)",
            padding: 16, cursor: "pointer", aspectRatio: "1.4", display: "flex", flexDirection: "column",
            justifyContent: "space-between", transition: "all 0.12s",
          }} onMouseEnter={e => e.currentTarget.style.borderColor = t.color}
             onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <div style={{ fontSize: 28 }}>{t.icon}</div>
            <div>
              <div className="display" style={{ fontSize: 14, color: t.color }}>{t.label}</div>
              {t.count !== null && <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{t.count} Einträge</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitsSub({ state, dispatch, onBack }) {
  const today = localDate();
  const [adding, setAdding] = useState(false);
  const [newH, setNewH] = useState({ title: "", emoji: "💪" });
  const EMOJIS = ["💧","📖","🧘","🏃","💪","🥗","🚫","☀️","🌙","✍️","🎯","🔥"];
  const COLORS = ["#AAFF00","#00E0FF","#FF2D78","#FFB800","#8B5CF6","#FF6B35"];
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Habits</h2>
        <button className="btn btn-primary" onClick={() => setAdding(true)} style={{ padding: "7px 11px", fontSize: 11 }}><Plus size={13} /></button>
      </div>
      {adding && (
        <div className="card" style={{ marginBottom: 12 }}>
          <input className="input" placeholder="Habit-Name..." value={newH.title} onChange={e => setNewH({ ...newH, title: e.target.value })} style={{ marginBottom: 10 }} autoFocus />
          <div className="row" style={{ gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
            {EMOJIS.map(em => (
              <button key={em} className={`chip ${newH.emoji === em ? "on" : ""}`} onClick={() => setNewH({ ...newH, emoji: em })} style={{ padding: "6px 10px", fontSize: 16 }}>{em}</button>
            ))}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)} style={{ flex: 1 }}>Abbrechen</button>
            <button className="btn btn-primary" onClick={() => { if (newH.title.trim()) { dispatch({ type: "ADD_HABIT", payload: { id: uid(), title: newH.title.trim(), emoji: newH.emoji, color: COLORS[state.habits.length % COLORS.length], frequency: "daily", completions: {}, createdAt: Date.now() } }); setAdding(false); setNewH({ title: "", emoji: "💪" }); } }} style={{ flex: 2 }}>Anlegen</button>
          </div>
        </div>
      )}
      <div className="col" style={{ gap: 8 }}>
        {state.habits.map(h => {
          const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return { date: localDate(d), label: DAYS_SHORT[(d.getDay() + 6) % 7], done: !!h.completions[localDate(d)] }; });
          let streak = 0; const sd = new Date();
          for (let i = 0; i < 30; i++) { if (!h.completions[localDate(sd)]) break; streak++; sd.setDate(sd.getDate() - 1); }
          return (
            <div key={h.id} className="card">
              <div className="between" style={{ marginBottom: 10 }}>
                <div className="row">
                  <span style={{ fontSize: 22 }}>{h.emoji}</span>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{h.title}</div>
                    <div className="mono" style={{ fontSize: 11, color: h.color, marginTop: 2 }}>🔥 {streak} Tage</div></div>
                </div>
                <button onClick={() => { if (confirm("Habit löschen?")) dispatch({ type: "DEL_HABIT", payload: h.id }); }} className="btn btn-ghost btn-icon"><X size={14} /></button>
              </div>
              <div className="row" style={{ gap: 4, justifyContent: "space-between" }}>
                {week.map(d => (
                  <button key={d.date} onClick={() => dispatch({ type: "TOGGLE_HABIT", payload: { id: h.id, date: d.date } })} style={{ flex: 1, padding: "9px 0", borderRadius: 6, border: d.date === today ? `1.5px solid ${h.color}` : "1px solid var(--border)", background: d.done ? h.color : "var(--s2)", color: d.done ? "#000" : "var(--muted)", cursor: "pointer", fontSize: 11 }}>
                    <div className="mono" style={{ fontSize: 9, marginBottom: 1 }}>{d.label}</div>
                    {d.done ? <Check size={11} strokeWidth={3} style={{ display: "inline" }} /> : "·"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {state.habits.length === 0 && <div className="empty"><p>Noch keine Habits</p></div>}
      </div>
    </div>
  );
}

function GoalsSub({ state, dispatch, onBack }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", deadline: "", progress: 0 });
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Ziele</h2>
        <button className="btn btn-primary" onClick={() => setAdding(true)} style={{ padding: "7px 11px", fontSize: 11 }}><Plus size={13} /></button>
      </div>
      {adding && (
        <div className="card" style={{ marginBottom: 12 }}>
          <input className="input" placeholder="Ziel..." value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} style={{ marginBottom: 10 }} autoFocus />
          <input className="input" type="date" value={draft.deadline} onChange={e => setDraft({ ...draft, deadline: e.target.value })} style={{ marginBottom: 10 }} />
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)} style={{ flex: 1 }}>Abbrechen</button>
            <button className="btn btn-primary" onClick={() => { if (draft.title.trim()) { dispatch({ type: "ADD_GOAL", payload: { id: uid(), title: draft.title.trim(), deadline: draft.deadline, progress: 0, notes: "", createdAt: Date.now() } }); setAdding(false); setDraft({ title: "", deadline: "", progress: 0 }); } }} style={{ flex: 2 }}>Anlegen</button>
          </div>
        </div>
      )}
      <div className="col" style={{ gap: 8 }}>
        {state.goals.map(g => (
          <div key={g.id} className="card">
            <div className="between" style={{ marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{g.title}</div>
                {g.deadline && <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>📅 bis {new Date(g.deadline + "T12:00:00").toLocaleDateString("de-DE")}</div>}
              </div>
              <div className="display" style={{ fontSize: 22, color: "var(--lime)" }}>{g.progress}%</div>
            </div>
            <div className="pbar" style={{ marginBottom: 10 }}><div className="pfill" style={{ width: `${g.progress}%` }} /></div>
            <div className="row" style={{ gap: 8 }}>
              <input type="range" min="0" max="100" step="5" value={g.progress} onChange={e => dispatch({ type: "UPD_GOAL", payload: { id: g.id, progress: Number(e.target.value) } })} style={{ flex: 1 }} />
              <button onClick={() => { if (confirm("Ziel löschen?")) dispatch({ type: "DEL_GOAL", payload: g.id }); }} className="btn btn-ghost btn-icon"><X size={14} /></button>
            </div>
          </div>
        ))}
        {state.goals.length === 0 && <div className="empty"><p>Keine Ziele angelegt</p></div>}
      </div>
    </div>
  );
}

function StatsSub({ state, onBack }) {
  const totalDone = state.tasks.filter(t => t.status === "done").length;
  const totalTotal = state.tasks.length || 1;
  const byCat = CATS.map(c => ({ name: c.label, value: state.tasks.filter(t => t.category === c.id).length, color: c.color })).filter(d => d.value > 0);
  const byPrio = PRIOS.map(p => ({ name: p.label, value: state.tasks.filter(t => t.priority === p.id).length, color: p.color })).filter(d => d.value > 0);
  const days30 = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 29 + i); const ds = localDate(d); return { day: d.getDate(), done: state.tasks.filter(t => t.completedAt && localDate(new Date(t.completedAt)) === ds).length }; });
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Statistik</h2>
      </div>
      <div className="stat-grid" style={{ marginBottom: 14 }}>
        <div className="stat-tile"><div className="stat-label">Erledigt</div><div className="stat-val" style={{ color: "var(--lime)" }}>{totalDone}</div></div>
        <div className="stat-tile"><div className="stat-label">Gesamt</div><div className="stat-val">{state.tasks.length}</div></div>
        <div className="stat-tile"><div className="stat-label">Quote</div><div className="stat-val">{Math.round(totalDone/totalTotal*100)}<span style={{fontSize:11}}>%</span></div></div>
        <div className="stat-tile"><div className="stat-label">Pomos</div><div className="stat-val">{state.pomodoros.length}</div></div>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="stat-label" style={{ marginBottom: 10 }}>Letzte 30 Tage</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={days30} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: "#707070", fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fill: "#707070", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "var(--s1)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="done" fill="#AAFF00" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {byCat.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="stat-label" style={{ marginBottom: 10 }}>Nach Kategorie</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={byCat} dataKey="value" outerRadius={56} innerRadius={32}>{byCat.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie>
              <Tooltip contentStyle={{ background: "var(--s1)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
          <div className="row" style={{ flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {byCat.map(c => (
              <div key={c.name} className="row" style={{ gap: 4 }}>
                <div style={{ width: 10, height: 10, background: c.color, borderRadius: 2 }} />
                <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BooksSub({ state, dispatch, onBack }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", author: "", status: "wishlist" });
  const STATUSES_B = [{ id: "wishlist", label: "Wunschliste" }, { id: "reading", label: "Lese ich" }, { id: "done", label: "Gelesen" }];
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Bücher</h2>
        <button className="btn btn-primary" onClick={() => setAdding(true)} style={{ padding: "7px 11px", fontSize: 11 }}><Plus size={13} /></button>
      </div>
      {adding && (
        <div className="card" style={{ marginBottom: 12 }}>
          <input className="input" placeholder="Titel..." value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} style={{ marginBottom: 8 }} autoFocus />
          <input className="input" placeholder="Autor..." value={draft.author} onChange={e => setDraft({ ...draft, author: e.target.value })} style={{ marginBottom: 8 }} />
          <select className="select" value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} style={{ marginBottom: 10 }}>
            {STATUSES_B.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)} style={{ flex: 1 }}>Abbrechen</button>
            <button className="btn btn-primary" onClick={() => { if (draft.title.trim()) { dispatch({ type: "ADD_BOOK", payload: { id: uid(), ...draft, title: draft.title.trim(), createdAt: Date.now() } }); setAdding(false); setDraft({ title: "", author: "", status: "wishlist" }); } }} style={{ flex: 2 }}>Hinzufügen</button>
          </div>
        </div>
      )}
      {STATUSES_B.map(s => {
        const books = state.books.filter(b => b.status === s.id);
        if (books.length === 0) return null;
        return (
          <div key={s.id} style={{ marginBottom: 14 }}>
            <div className="section-title">{s.label} ({books.length})</div>
            {books.map(b => (
              <div key={b.id} className="card-sm" style={{ marginBottom: 6 }}>
                <div className="between">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{b.title}</div>
                    {b.author && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{b.author}</div>}
                  </div>
                  <select className="select" value={b.status} onChange={e => dispatch({ type: "UPD_BOOK", payload: { id: b.id, status: e.target.value } })} style={{ width: "auto", padding: "5px 26px 5px 10px", fontSize: 11 }}>
                    {STATUSES_B.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <button onClick={() => dispatch({ type: "DEL_BOOK", payload: b.id })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}><X size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      {state.books.length === 0 && <div className="empty"><BookOpen size={32} className="empty-icon" /><p>Keine Bücher angelegt</p></div>}
    </div>
  );
}

function MealsSub({ state, dispatch, onBack }) {
  const dates = weekDates(0);
  const SLOTS = [{ id: "breakfast", label: "Frühstück", icon: "🌅" }, { id: "lunch", label: "Mittag", icon: "☀️" }, { id: "dinner", label: "Abend", icon: "🌙" }];
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Mahlzeiten</h2>
      </div>
      <div className="col" style={{ gap: 10 }}>
        {dates.map((d, i) => (
          <div key={d} className="card">
            <div className="display" style={{ fontSize: 13, marginBottom: 10 }}>{DAYS_FULL[i]}</div>
            <div className="col" style={{ gap: 6 }}>
              {SLOTS.map(s => (
                <div key={s.id} className="row" style={{ gap: 8 }}>
                  <span style={{ width: 22 }}>{s.icon}</span>
                  <input className="input" placeholder={s.label} value={state.meals[d]?.[s.id] || ""} onChange={e => dispatch({ type: "SET_MEAL", payload: { date: d, slot: s.id, text: e.target.value } })} style={{ padding: "8px 12px", fontSize: 13 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetSub({ state, dispatch, onBack }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ amount: "", category: "Essen", note: "" });
  const CATS_B = ["Essen", "Transport", "Wohnen", "Freizeit", "Sonstiges"];
  const total = state.budget.reduce((a, b) => a + b.amount, 0);
  const byCat = CATS_B.map(c => ({ name: c, value: state.budget.filter(b => b.category === c).reduce((a, b) => a + b.amount, 0) })).filter(c => c.value > 0);
  const COLORS = ["#AAFF00","#00E0FF","#FF2D78","#FFB800","#8B5CF6"];
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>Budget</h2>
        <button className="btn btn-primary" onClick={() => setAdding(true)} style={{ padding: "7px 11px", fontSize: 11 }}><Plus size={13} /></button>
      </div>
      <div className="card" style={{ marginBottom: 14, textAlign: "center" }}>
        <div className="stat-label">Ausgaben gesamt</div>
        <div className="display" style={{ fontSize: 36, color: "var(--lime)", marginTop: 4 }}>{total.toFixed(2)}€</div>
      </div>
      {adding && (
        <div className="card" style={{ marginBottom: 12 }}>
          <input className="input" type="number" step="0.01" placeholder="Betrag €" value={draft.amount} onChange={e => setDraft({ ...draft, amount: e.target.value })} style={{ marginBottom: 8 }} autoFocus />
          <select className="select" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} style={{ marginBottom: 8 }}>
            {CATS_B.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Notiz" value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} style={{ marginBottom: 10 }} />
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setAdding(false)} style={{ flex: 1 }}>Abbrechen</button>
            <button className="btn btn-primary" onClick={() => { if (draft.amount) { dispatch({ type: "ADD_BUDGET", payload: { id: uid(), amount: parseFloat(draft.amount), category: draft.category, note: draft.note, date: localDate(), createdAt: Date.now() } }); setAdding(false); setDraft({ amount: "", category: "Essen", note: "" }); } }} style={{ flex: 2 }}>Erfassen</button>
          </div>
        </div>
      )}
      {byCat.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="stat-label" style={{ marginBottom: 10 }}>Nach Kategorie</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={byCat} dataKey="value" outerRadius={56} innerRadius={32}>{byCat.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
              <Tooltip contentStyle={{ background: "var(--s1)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 11 }} formatter={(v) => `${v.toFixed(2)}€`} /></PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="col" style={{ gap: 6 }}>
        {state.budget.map(b => (
          <div key={b.id} className="card-sm">
            <div className="between">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{b.note || b.category}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{b.category} · {new Date(b.date + "T12:00:00").toLocaleDateString("de-DE")}</div>
              </div>
              <div className="row">
                <div className="display" style={{ fontSize: 16, color: "var(--lime)" }}>{b.amount.toFixed(2)}€</div>
                <button onClick={() => dispatch({ type: "DEL_BUDGET", payload: b.id })} className="btn btn-ghost btn-icon" style={{ width: 26, height: 26 }}><X size={11} /></button>
              </div>
            </div>
          </div>
        ))}
        {state.budget.length === 0 && <div className="empty"><Wallet size={32} className="empty-icon" /><p>Keine Ausgaben</p></div>}
      </div>
    </div>
  );
}

function NotesSub({ state, dispatch, onBack }) {
  const [editing, setEditing] = useState(null); // null | "new" | id
  const [draft, setDraft] = useState({ title: "", content: "", color: "#FFB800", tags: [], pinned: false });
  const [newTag, setNewTag] = useState("");
  const NOTE_COLORS = [
    { id: "#FFB800", name: "Gelb" },
    { id: "#AAFF00", name: "Lime" },
    { id: "#00E0FF", name: "Cyan" },
    { id: "#FF2D78", name: "Pink" },
    { id: "#8B5CF6", name: "Lila" },
    { id: "#FF6B35", name: "Orange" },
  ];
  const notes = state.notes || [];
  // Sort: pinned first, then most recent
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0);
  });
  const startEdit = (n) => {
    setDraft({ title: n.title || "", content: n.content || "", color: n.color || "#FFB800", tags: n.tags || [], pinned: !!n.pinned });
    setEditing(n.id);
  };
  const startNew = () => {
    setDraft({ title: "", content: "", color: "#FFB800", tags: [], pinned: false });
    setEditing("new");
  };
  const save = () => {
    if (!draft.title.trim() && !draft.content.trim()) { setEditing(null); return; }
    if (editing === "new") {
      dispatch({ type: "ADD_NOTE", payload: { id: uid(), ...draft, title: draft.title.trim(), content: draft.content, createdAt: Date.now(), updatedAt: Date.now() } });
    } else {
      dispatch({ type: "UPD_NOTE", payload: { id: editing, ...draft, title: draft.title.trim() } });
    }
    setEditing(null);
  };
  const addTag = () => {
    const t = newTag.trim();
    if (!t || draft.tags.includes(t)) return;
    setDraft({ ...draft, tags: [...draft.tags, t] });
    setNewTag("");
  };
  const removeTag = (t) => setDraft({ ...draft, tags: draft.tags.filter(x => x !== t) });
  return (
    <div className="view">
      <div className="row" style={{ marginBottom: 14 }}>
        <button onClick={onBack} className="btn btn-ghost btn-icon"><ChevronLeft size={18} /></button>
        <h2 className="display" style={{ fontSize: 22, flex: 1 }}>📝 Notizen</h2>
        {!editing && <button className="btn btn-primary" onClick={startNew} style={{ padding: "7px 11px", fontSize: 11 }}><Plus size={13} /> NEU</button>}
      </div>
      {editing && (
        <div className="card" style={{ marginBottom: 14, borderLeft: `4px solid ${draft.color}` }}>
          <input className="input" placeholder="Titel..." value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} style={{ marginBottom: 10 }} autoFocus />
          <textarea className="textarea" placeholder="Schreib was..." value={draft.content} onChange={e => setDraft({ ...draft, content: e.target.value })} style={{ minHeight: 140, marginBottom: 10 }} />
          <div className="stat-label" style={{ marginBottom: 6 }}>Farbe</div>
          <div className="row" style={{ gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {NOTE_COLORS.map(c => (
              <button key={c.id} onClick={() => setDraft({ ...draft, color: c.id })} style={{
                width: 30, height: 30, borderRadius: "50%", background: c.id, cursor: "pointer",
                border: draft.color === c.id ? "3px solid #fff" : "2px solid var(--border)",
              }} title={c.name} />
            ))}
          </div>
          <div className="stat-label" style={{ marginBottom: 6 }}>Tags</div>
          <div className="row" style={{ flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
            {draft.tags.map(t => (
              <span key={t} className="tag" style={{ background: draft.color + "22", color: draft.color, fontSize: 11, cursor: "pointer" }} onClick={() => removeTag(t)}>
                {t} <X size={10} style={{ marginLeft: 3, verticalAlign: "middle" }} />
              </span>
            ))}
          </div>
          <div className="row" style={{ gap: 6, marginBottom: 12 }}>
            <input className="input" placeholder="Tag..." value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} style={{ flex: 1 }} />
            <button className="btn btn-ghost" onClick={addTag} style={{ padding: "8px 12px" }}>Add</button>
          </div>
          <div className="card-sm" onClick={() => setDraft({ ...draft, pinned: !draft.pinned })} style={{ cursor: "pointer", borderColor: draft.pinned ? "var(--lime)" : "var(--border)", marginBottom: 10 }}>
            <div className="between">
              <span style={{ fontSize: 13 }}>📌 Anpinnen</span>
              <span className={`chk ${draft.pinned ? "on" : ""}`}>{draft.pinned && <Check size={12} color="#000" strokeWidth={3} />}</span>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setEditing(null)} style={{ flex: 1 }}>Abbrechen</button>
            {editing !== "new" && (
              <button className="btn btn-danger" onClick={() => { if (confirm("Notiz löschen?")) { dispatch({ type: "DEL_NOTE", payload: editing }); setEditing(null); } }} style={{ flex: 1 }}>Löschen</button>
            )}
            <button className="btn btn-primary" onClick={save} style={{ flex: 2 }}>Speichern</button>
          </div>
        </div>
      )}
      {!editing && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {sorted.map(n => (
            <div key={n.id} onClick={() => startEdit(n)} style={{
              background: n.color + "22", border: `1.5px solid ${n.color}55`, borderRadius: "var(--r)",
              padding: 12, cursor: "pointer", minHeight: 120, display: "flex", flexDirection: "column",
              position: "relative",
            }}>
              {n.pinned && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 12 }}>📌</span>}
              <div className="display" style={{ fontSize: 14, color: n.color, marginBottom: 6, paddingRight: n.pinned ? 16 : 0 }}>{n.title || "Ohne Titel"}</div>
              <div style={{ fontSize: 11, color: "var(--text)", opacity: 0.85, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", whiteSpace: "pre-wrap" }}>{n.content}</div>
              {n.tags && n.tags.length > 0 && (
                <div className="row" style={{ flexWrap: "wrap", gap: 3, marginTop: 6 }}>
                  {n.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: 9, color: n.color, opacity: 0.85 }}>#{t}</span>)}
                  {n.tags.length > 3 && <span style={{ fontSize: 9, color: "var(--muted)" }}>+{n.tags.length - 3}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {!editing && sorted.length === 0 && (
        <div className="empty"><span style={{ fontSize: 32 }}>📝</span><p>Noch keine Notizen. Tipp auf NEU.</p></div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "dashboard", Icon: Home,         label: "HOME" },
  { id: "tasks",     Icon: CheckSquare,  label: "TASKS" },
  { id: "calendar",  Icon: Calendar,     label: "KAL" },
  { id: "sport",     Icon: Dumbbell,     label: "SPORT" },
  { id: "shopping",  Icon: ShoppingCart, label: "KAUF" },
  { id: "more",      Icon: MoreHorizontal,label: "MEHR" },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    return { ...seedData(getDefaults()), view: "dashboard" };
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [openEventId, setOpenEventId] = useState(null);
  const [pomoTaskId, setPomoTaskId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [moreSubView, setMoreSubView] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true); // Splash IMMER beim Start

  // LOAD
  useEffect(() => {
    (async () => {
      try {
        {
          const res = await storage.get(STORAGE_KEY);
          if (res?.value) {
            const parsed = JSON.parse(res.value);
            const migrated = migrate(parsed);
            dispatch({ type: "LOAD", payload: { ...migrated, view: state.view } });
          }
        }
      } catch (e) { /* not found, use seed */ }
      setLoaded(true);
    })();
  }, []);

  // SAVE
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        {
          const { view, ...persist } = state;
          await storage.set(STORAGE_KEY, JSON.stringify(persist));
        }
      } catch (e) {}
    })();
  }, [state, loaded]);

  // ROLLOVER once per day
  useEffect(() => {
    if (!loaded) return;
    const today = localDate();
    if (state.settings.lastRolloverDate !== today) {
      dispatch({ type: "ROLLOVER_TASKS" });
    }
  }, [loaded]);

  useNotifications(state);

  const taskDetail = openTaskId ? state.tasks.find(t => t.id === openTaskId) : null;
  const eventDetail = openEventId ? state.events.find(e => e.id === openEventId) : null;

  const openTask = (id) => setOpenTaskId(id);
  const openEvent = (id) => setOpenEventId(id);
  const openPomo = (id) => setPomoTaskId(id);

  // Splash anzeigen
  if (showSplash) {
    return (
      <>
        <style>{CSS}</style>
        <CelebrationOverlay />
        <SplashScreen onStart={() => setShowSplash(false)} />
      </>
    );
  }

  const showFab = ["dashboard", "tasks", "calendar", "sport"].includes(state.view);
  const fabAction = () => {
    if (state.view === "calendar") setShowAddEvent(true);
    else if (state.view === "sport") setShowAddWorkout(true);
    else setShowAddTask(true);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <CelebrationOverlay />
        <div className="topbar">
          <div className="logo">GET SHIT <span className="lime">DONE!</span></div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowSearch(true)} style={{ width: 34, height: 34 }}><Search size={16} /></button>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(true)} style={{ width: 34, height: 34 }}><Settings size={16} /></button>
          </div>
        </div>

        <div className="main">
          {state.view === "dashboard" && <DashboardView state={state} dispatch={dispatch} openTask={openTask} openEvent={openEvent} openPomo={openPomo} setShowRitual={setShowRitual} />}
          {state.view === "tasks" && <TasksView state={state} dispatch={dispatch} openTask={openTask} />}
          {state.view === "calendar" && <CalendarView state={state} dispatch={dispatch} openTask={openTask} openEvent={openEvent} setShowAddEvent={setShowAddEvent} />}
          {state.view === "sport" && <SportView state={state} dispatch={dispatch} setShowAddWorkout={setShowAddWorkout} />}
          {state.view === "shopping" && <ShoppingView state={state} dispatch={dispatch} />}
          {state.view === "more" && (
            <>
              {moreSubView === null && <MoreView state={state} dispatch={dispatch} setSubView={setMoreSubView} />}
              {moreSubView === "habits" && <HabitsSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "goals" && <GoalsSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "stats" && <StatsSub state={state} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "books" && <BooksSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "meals" && <MealsSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "budget" && <BudgetSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
              {moreSubView === "notes" && <NotesSub state={state} dispatch={dispatch} onBack={() => setMoreSubView(null)} />}
            </>
          )}
        </div>

        {showFab && (
          <button className="fab" onClick={fabAction}>
            <Plus size={26} color="#000" strokeWidth={2.5} />
          </button>
        )}

        <nav className="nav">
          {NAV.map(({ id, Icon, label }) => (
            <button key={id} className={`nav-btn ${state.view === id ? "active" : ""}`} onClick={() => { dispatch({ type: "SET_VIEW", payload: id }); if (id !== "more") setMoreSubView(null); }}>
              <Icon size={20} strokeWidth={state.view === id ? 2.4 : 2} />
              {label}
            </button>
          ))}
        </nav>

        {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={t => dispatch({ type: "ADD_TASK", payload: t })} projects={state.projects} />}
        {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} onAdd={e => dispatch({ type: "ADD_EVENT", payload: e })} />}
        {showAddWorkout && <AddWorkoutModal onClose={() => setShowAddWorkout(false)} onAdd={w => dispatch({ type: "ADD_WORKOUT", payload: w })} />}
        {taskDetail && <TaskDetailModal task={taskDetail} onClose={() => setOpenTaskId(null)} dispatch={dispatch} projects={state.projects} openPomo={openPomo} />}
        {eventDetail && <EventDetailModal event={eventDetail} onClose={() => setOpenEventId(null)} dispatch={dispatch} />}
        {pomoTaskId && <PomodoroModal taskId={pomoTaskId} tasks={state.tasks} onClose={() => setPomoTaskId(null)} dispatch={dispatch} />}
        {showSearch && <SearchModal tasks={state.tasks} events={state.events} onClose={() => setShowSearch(false)} openTask={openTask} openEvent={openEvent} />}
        {showSettings && <SettingsModal state={state} dispatch={dispatch} onClose={() => setShowSettings(false)} />}
        {showRitual && <DailyRitualModal tasks={state.tasks} dispatch={dispatch} onClose={() => setShowRitual(false)} />}
      </div>
    </>
  );
}
