'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Slot = { startMin: number; endMin: number };
type Day = { day: number; slots: Slot[] };
type Week = Day[];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STEP = 30; // minutes per grid cell

function fmt(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// Fallback TZ list (used if Intl.supportedValuesOf is unavailable)
const FALLBACK_TZS = [
  'Asia/Colombo',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Kuala_Lumpur',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Manila',
  'Asia/Jakarta',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Madrid',
  'Africa/Nairobi',
  'Africa/Cairo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

export default function Availability() {
  const [week, setWeek] = useState<Week>(() =>
    [...Array(7)].map((_, i) => ({ day: i, slots: [] }))
  );
  const [timezone, setTimezone] = useState<string>('Asia/Colombo');
  const [tzOptions, setTzOptions] = useState<string[]>(FALLBACK_TZS);

  // drag state
  const isDragging = useRef(false);
  const dragStart = useRef<{ day: number; startMin: number } | null>(null);
  const lastHover = useRef<{ day: number; min: number } | null>(null);

  // save state
  const hasLoaded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // Load timezones (modern browsers)
  useEffect(() => {
    try {
      if (typeof Intl.supportedValuesOf === 'function') {
        const all = Intl.supportedValuesOf('timeZone');
        if (Array.isArray(all) && all.length) setTzOptions(all);
      }
    } catch {}
  }, []);

  // initial load
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/availability', {
          headers: { 'x-user-id': 'DEMO_USER' },
        });
        if (!res.ok)
          throw new Error(
            `GET /api/availability failed: ${res.status} ${await res.text()}`
          );
        const d = await res.json();
        if (d?.week) setWeek(d.week);
        if (d?.timezone) setTimezone(d.timezone);
        hasLoaded.current = true;
      } catch (e) {
        console.error(e);
        setSaveState('error');
      }
    };
    run();
  }, []);

  // commit drag even if mouseup happens outside the grid
  useEffect(() => {
    function handleUp() {
      if (!isDragging.current || !dragStart.current) return;
      const { day, startMin } = dragStart.current;
      const endMinFromHover =
        lastHover.current && lastHover.current.day === day
          ? lastHover.current.min
          : startMin;
      const end =
        endMinFromHover === startMin ? startMin + STEP : endMinFromHover + STEP;
      addSlot(day, Math.min(startMin, end), Math.max(startMin, end));
      // reset drag state
      isDragging.current = false;
      dragStart.current = null;
      lastHover.current = null;
    }
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  // debounced autosave when week/timezone change (after initial load)
  useEffect(() => {
    if (!hasLoaded.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveToServer();
    }, 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [week, timezone]);

  const rows = useMemo(
    () => Array.from({ length: Math.floor(1440 / STEP) }, (_, i) => i * STEP),
    []
  );

  function mergeSlots(slots: Slot[]) {
    if (!slots.length) return [];
    const sorted = [...slots].sort((a, b) => a.startMin - b.startMin);
    const out: Slot[] = [{ ...sorted[0] }];
    for (let i = 1; i < sorted.length; i++) {
      const last = out[out.length - 1];
      const cur = sorted[i];
      if (cur.startMin <= last.endMin)
        last.endMin = Math.max(last.endMin, cur.endMin);
      else out.push({ ...cur });
    }
    return out;
  }

  function addSlot(day: number, startMin: number, endMin: number) {
    const clampedStart = Math.max(0, Math.min(1440, startMin));
    const clampedEnd = Math.max(0, Math.min(1440, endMin));
    if (clampedEnd <= clampedStart) return;

    setWeek((prev) =>
      prev.map((d: Day) => {
        if (d.day !== day) return d;
        const merged = mergeSlots([
          ...d.slots,
          { startMin: clampedStart, endMin: clampedEnd },
        ]);
        return { ...d, slots: merged };
      })
    );
  }

  function onCellMouseDown(day: number, min: number) {
    isDragging.current = true;
    dragStart.current = { day, startMin: min };
    lastHover.current = { day, min };
  }

  function onCellMouseEnter(day: number, min: number) {
    if (!isDragging.current || !dragStart.current) return;
    if (dragStart.current.day !== day) return; // same-day drags only (v1)
    lastHover.current = { day, min };
  }

  function onCellClick(day: number, min: number) {
    // single click creates one STEP block
    if (!isDragging.current) addSlot(day, min, min + STEP);
  }

  function removeSlot(day: number, idx: number) {
    setWeek((prev) =>
      prev.map((d: Day) =>
        d.day === day ? { ...d, slots: d.slots.filter((_, i) => i !== idx) } : d
      )
    );
  }

  // highlight helpers
  const isCellInSaved = (day: number, min: number): boolean => {
    const d = week.find((x: Day) => x.day === day);
    if (!d) return false;
    const cellEnd = min + STEP; // cell interval [min, min+STEP)
    return d.slots.some((s: Slot) => s.startMin < cellEnd && s.endMin > min);
  };

  const isCellInPreview = (day: number, min: number): boolean => {
    if (!isDragging.current || !dragStart.current) return false;
    if (dragStart.current.day !== day) return false;
    const start = dragStart.current.startMin;
    const hover =
      lastHover.current?.day === day ? lastHover.current.min : start;
    const a = Math.min(start, hover);
    const b = Math.max(start, hover) + STEP;
    const cellStart = min,
      cellEnd = min + STEP;
    return a < cellEnd && b > cellStart;
  };

  async function saveToServer() {
    try {
      setSaveState('saving');
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'DEMO_USER',
        },
        body: JSON.stringify({ timezone, week }),
      });
      if (!res.ok) {
        const text = await res.text();
        setSaveState('error');
        throw new Error(`PUT /api/availability failed: ${res.status} ${text}`);
      }
      setSaveState('saved');
      // reset to idle after a short delay
      setTimeout(() => setSaveState('idle'), 1200);
    } catch (e) {
      console.error(e);
      setSaveState('error');
    }
  }

  async function saveNow() {
    // manual save (button)
    // cancel pending autosave and push immediately
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await saveToServer();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Weekly Availability</h1>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm opacity-80">Timezone</label>
        <input
          className="border rounded px-2 py-1"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          list="tz"
          placeholder="Search timezones..."
        />
        <datalist id="tz">
          {tzOptions.map((tz) => (
            <option key={tz} value={tz} />
          ))}
        </datalist>

        <div className="ml-auto flex items-center gap-3">
          {saveState === 'saved' && (
            <span className="text-green-600 text-sm">Saved ✓</span>
          )}
          {saveState === 'error' && (
            <span className="text-red-600 text-sm">Save failed</span>
          )}
          <button
            onClick={saveNow}
            disabled={saveState === 'saving'}
            className={`px-3 py-2 rounded-xl text-white ${
              saveState === 'saving' ? 'bg-gray-500' : 'bg-black'
            }`}
          >
            {saveState === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-auto border rounded-2xl select-none">
        <div
          className="min-w-[900px] grid"
          style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
        >
          {/* header row */}
          <div />
          {DAY_LABELS.map((d) => (
            <div key={d} className="p-2 font-semibold text-center">
              {d}
            </div>
          ))}

          {/* time rows */}
          {rows.map((min) => (
            <React.Fragment key={`row-${min}`}>
              <div className="border-t p-1 text-xs text-right pr-2">
                {fmt(min)}
              </div>
              {week.map((d) => {
                const saved = isCellInSaved(d.day, min);
                const preview = isCellInPreview(d.day, min);
                return (
                  <div
                    key={`c-${d.day}-${min}`}
                    className={`border-t border-l h-6 cursor-crosshair transition-colors
                      ${
                        preview
                          ? 'bg-green-300/70'
                          : saved
                          ? 'bg-green-200'
                          : 'hover:bg-gray-100'
                      }`}
                    onMouseDown={() => onCellMouseDown(d.day, min)}
                    onMouseEnter={() => onCellMouseEnter(d.day, min)}
                    onClick={() => onCellClick(d.day, min)}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Selected slots */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {week.map((d) => (
          <div key={`day-${d.day}`} className="p-3 rounded-2xl border">
            <div className="font-medium mb-2">{DAY_LABELS[d.day]}</div>
            <div className="flex flex-wrap gap-2">
              {d.slots.length === 0 && (
                <span className="text-sm opacity-70">No free slots</span>
              )}
              {d.slots.map((s, idx) => (
                <span
                  key={`${s.startMin}-${s.endMin}`}
                  className="text-sm px-2 py-1 rounded-full bg-green-100 border"
                >
                  {fmt(s.startMin)}–{fmt(s.endMin)}
                  <button
                    className="ml-2 text-red-600"
                    onClick={() => removeSlot(d.day, idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
