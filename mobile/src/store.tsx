import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { config } from './config';
import type { Lang, SkillId } from './content';
import type { Checkins } from './measures';

// All data lives on the device for now. When a backend is chosen, sync from here:
// every change goes through `update`, so that is the one place to add an upload.

export type Outcome = 'hard' | 'ok' | 'well';
export type LogEntry = { id: string; at: string; skills: SkillId[]; outcome?: Outcome; note?: string };
export type Reflection = { week: number; at: string; skill?: SkillId; why?: string; goalStep?: number; nextSkill?: SkillId; obstacle?: string };
export type Profile = { name: string; code: string; goal: string; startedAt: string };

export type Data = {
  lang: Lang;
  profile: Profile | null;
  logs: LogEntry[];
  reflections: Reflection[];
  checkins: Checkins;
};

const KEY = 'kinbridge-app-v1';
const EMPTY: Data = { lang: 'en', profile: null, logs: [], reflections: [], checkins: {} };

type Store = {
  ready: boolean;
  data: Data;
  update: (fn: (d: Data) => Data) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(EMPTY);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (loaded.current) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const update = useCallback((fn: (d: Data) => Data) => setData((d) => fn(d)), []);
  const value = useMemo(() => ({ ready, data, update }), [ready, data, update]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside StoreProvider');
  return s;
}

// ---------- Helpers ----------

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Monday of the week containing `d`.
export function weekStart(d: Date) {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
}

// Programme week (1-based, capped at the programme length) counted from enrolment.
export function programmeWeek(profile: Profile | null, now = new Date()) {
  if (!profile) return 1;
  const days = Math.floor((weekStart(now).getTime() - weekStart(new Date(profile.startedAt)).getTime()) / 86400000);
  return Math.min(config.programmeWeeks, Math.max(1, Math.floor(days / 7) + 1));
}

export function logsInWeek(logs: LogEntry[], now = new Date()) {
  const start = weekStart(now).getTime();
  const end = start + 7 * 86400000;
  return logs.filter((l) => {
    const t = new Date(l.at).getTime();
    return t >= start && t < end;
  });
}
