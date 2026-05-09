import React from 'react'

const STORE_KEY = 'wgt.store.v1';

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { favorites: [], history: [], notes: [] };
    const obj = JSON.parse(raw);
    return {
      favorites: Array.isArray(obj.favorites) ? obj.favorites : [],
      history: Array.isArray(obj.history) ? obj.history : [],
      notes: Array.isArray(obj.notes) ? obj.notes : [],
    };
  } catch { return { favorites: [], history: [], notes: [] }; }
}

function writeStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {}
}

export function useStore() {
  const [s, setS] = React.useState(readStore);
  React.useEffect(() => writeStore(s), [s]);

  const toggleFav = React.useCallback((toolId) => {
    setS(prev => ({
      ...prev,
      favorites: prev.favorites.includes(toolId)
        ? prev.favorites.filter(x => x !== toolId)
        : [toolId, ...prev.favorites],
    }));
  }, []);

  const addHistory = React.useCallback((entry) => {
    setS(prev => {
      const ts = Date.now();
      const next = [{ ...entry, ts, id: ts + '-' + Math.random().toString(36).slice(2, 7) }, ...prev.history].slice(0, 30);
      return { ...prev, history: next };
    });
  }, []);

  const clearHistory = React.useCallback(() => setS(prev => ({ ...prev, history: [] })), []);

  const removeHistory = React.useCallback((id) => {
    setS(prev => ({ ...prev, history: prev.history.filter(h => h.id !== id) }));
  }, []);

  const addNote = React.useCallback((entry) => {
    setS(prev => {
      const ts = Date.now();
      const next = [{ ...entry, ts, id: ts + '-' + Math.random().toString(36).slice(2, 7) }, ...prev.notes].slice(0, 100);
      return { ...prev, notes: next };
    });
  }, []);

  const clearNotes = React.useCallback(() => setS(prev => ({ ...prev, notes: [] })), []);

  const removeNote = React.useCallback((id) => {
    setS(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  }, []);

  return {
    favorites: s.favorites, history: s.history, notes: s.notes,
    toggleFav, addHistory, clearHistory, removeHistory,
    addNote, clearNotes, removeNote
  };
}

export function relTime(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return '剛剛';
  if (d < 3600) return Math.floor(d / 60) + ' 分鐘前';
  if (d < 86400) return Math.floor(d / 3600) + ' 小時前';
  if (d < 86400 * 7) return Math.floor(d / 86400) + ' 天前';
  const date = new Date(ts);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
