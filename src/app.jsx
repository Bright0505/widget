import React, { useState, useEffect } from 'react'
import { IOSDevice } from './ios-frame'
import { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakRadio, TweakSelect } from './tweaks-panel'
import { Splash, Home } from './home'
import { BreadScreen, CocktailScreen, PriceScreen } from './tools'
import { useStore } from './history'

const TWEAK_DEFAULTS = { accent: '#C2683C', dark: false, layout: 'grid' };

function isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || window.navigator.standalone === true;
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('splash');
  const [prev, setPrev] = useState(null);
  const store = useStore();
  const standalone = isStandalone();

  useEffect(() => {
    if (screen === 'splash') {
      const id = setTimeout(() => setScreen('home'), 1800);
      return () => clearTimeout(id);
    }
  }, [screen]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = t.dark ? 'dark' : 'light';
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-soft', hexToSoft(t.accent, t.dark));
  }, [t.dark, t.accent]);

  useEffect(() => {
    if (!prev) return;
    const id = setTimeout(() => setPrev(null), 450);
    return () => clearTimeout(id);
  }, [screen]);

  const goto = (next) => { setPrev(screen); setScreen(next); };
  const back = () => goto('home');

  const appBody = (
    <div className="app-root">
      {screen === 'splash' && <Splash/>}
      {screen !== 'splash' && (
        <>
          <ScreenLayer active={screen === 'home'}>
            <Home onPick={goto} layout={t.layout} store={store}/>
          </ScreenLayer>
          <ScreenLayer active={screen === 'bread'}>
            {(screen === 'bread' || prev === 'bread') && <BreadScreen onBack={back} store={store}/>}
          </ScreenLayer>
          <ScreenLayer active={screen === 'cocktail'}>
            {(screen === 'cocktail' || prev === 'cocktail') && <CocktailScreen onBack={back} store={store}/>}
          </ScreenLayer>
          <ScreenLayer active={screen === 'price'}>
            {(screen === 'price' || prev === 'price') && <PriceScreen onBack={back} store={store}/>}
          </ScreenLayer>
        </>
      )}
    </div>
  );

  return (
    <div className={`stage ${standalone ? 'standalone' : ''}`}>
      {standalone ? appBody : (
        <IOSDevice
          deviceColor={t.dark ? '#1d1d1b' : '#f0ebe2'}
          time={fmtTime()}
        >
          {appBody}
        </IOSDevice>
      )}

      {!standalone && (
        <TweaksPanel title="Tweaks">
          <TweakSection label="主題 / Theme"/>
          <TweakColor label="重音色" value={t.accent}
            options={['#C2683C', '#3F6B5A', '#3D5A8A', '#7A5A8A', '#1A1A1A']}
            onChange={(v) => setTweak('accent', v)}/>
          <TweakToggle label="深色模式" value={t.dark} onChange={(v) => setTweak('dark', v)}/>
          <TweakSection label="首頁 / Home"/>
          <TweakRadio label="工具佈局"
            value={t.layout}
            options={['mixed','grid','list']}
            onChange={(v) => setTweak('layout', v)}/>
          <TweakSection label="導覽"/>
          <TweakSelect label="當前畫面"
            value={screen}
            options={['splash','home','bread','cocktail','price']}
            onChange={(v) => setScreen(v)}/>
        </TweaksPanel>
      )}
    </div>
  );
}

function ScreenLayer({ active, children }) {
  return (
    <div className={`screen ${active ? 'active' : 'enter-right'}`}
      style={{ pointerEvents: active ? 'auto' : 'none' }}>
      {children}
    </div>
  );
}

function fmtTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function hexToSoft(hex, dark) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);
  if (dark) {
    return `rgb(${Math.round(r*.25 + 30)}, ${Math.round(g*.25 + 25)}, ${Math.round(b*.25 + 20)})`;
  }
  const mix = (c) => Math.round(c * .15 + 245 * .85);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
