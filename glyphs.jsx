// glyphs.jsx — minimal SVG glyphs for the 3 tools (no emoji)

const Glyph = ({ size = 38, stroke = 1.4, name = 'bread', color = 'currentColor' }) => {
  const s = size;
  if (name === 'bread') {
    // a loaf — half-circle with diagonal scoring lines
    return (
      <svg width={s} height={s} viewBox="0 0 38 38" fill="none">
        <path d="M5 26 C5 17 11 12 19 12 C27 12 33 17 33 26 L33 28 L5 28 Z"
          stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill="none"/>
        <path d="M12 17 L9 23 M19 15 L15 22 M26 17 L22 22" stroke={color} strokeWidth={stroke * .8} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === 'cocktail') {
    // martini glass — V on a stem
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
    // 2 stacked horizontal bars of different lengths (price comparison)
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
  return null;
};

window.Glyph = Glyph;
