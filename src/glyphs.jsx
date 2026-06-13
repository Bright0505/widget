import React from 'react'

export const Glyph = ({ size = 38, stroke = 1.4, name = 'bread', color = 'currentColor' }) => {
  const s = size;
  if (name === 'bread') {
    return (
      <svg width={s} height={s} viewBox="0 0 38 38" fill="none">
        <path d="M5 26 C5 17 11 12 19 12 C27 12 33 17 33 26 L33 28 L5 28 Z"
          stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill="none"/>
        <path d="M12 17 L9 23 M19 15 L15 22 M26 17 L22 22" stroke={color} strokeWidth={stroke * .8} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === 'cocktail') {
    return (
      <svg width={s} height={s} viewBox="0 0 38 38" fill="none">
        <path d="M7 9 L31 9 L20 22 L18 22 Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill="none"/>
        <line x1="19" y1="22" x2="19" y2="31" stroke={color} strokeWidth={stroke}/>
        <line x1="13" y1="31" x2="25" y2="31" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
        <circle cx="14" cy="13" r="1.4" fill={color}/>
      </svg>
    );
  }
  if (name === 'price') {
    return (
      <svg width={s} height={s} viewBox="0 0 38 38" fill="none">
        <rect x="6" y="11" width="22" height="6" rx="3" stroke={color} strokeWidth={stroke} fill="none"/>
        <rect x="6" y="22" width="14" height="6" rx="3" fill={color}/>
        <circle cx="32" cy="14" r="2" fill={color}/>
      </svg>
    );
  }
  if (name === 'arrow-right') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name === 'arrow-left') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name === 'plus') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === 'close') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === 'share') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 3v11M8 7l4-4 4 4" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 17v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === 'edit') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-7" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L9 20H6v-3L18.5 2.5z" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name === 'check') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={stroke + .2} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
};

export function StarIcon({ filled = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8L6.7 19.7l1-6L3.3 9.4l6-.9z"/>
    </svg>
  );
}
