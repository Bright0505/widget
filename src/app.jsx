import React, { useState, useEffect } from 'react'
import { Splash, Home } from './home'
import { BreadScreen, CocktailScreen, PriceScreen } from './tools'
import { useStore } from './history'
import { parseShareFromUrl } from './share'

export default function App() {
  const [initialShare] = useState(() => {
    const share = parseShareFromUrl();
    if (share) window.history.replaceState(null, '', window.location.pathname);
    return share;
  });
  const [screen, setScreen] = useState(() => {
    const share = initialShare;
    if (share?.t === 'cocktail') return 'cocktail';
    if (share?.t === 'price') return 'price';
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) return 'home';
    return 'splash';
  });
  const [prev, setPrev] = useState(null);
  const [restoreEntry, setRestoreEntry] = useState(null);
  const store = useStore();

  useEffect(() => {
    if (screen === 'splash') {
      const id = setTimeout(() => {
        sessionStorage.setItem('splashShown', 'true');
        setScreen('home');
      }, 1800);
      return () => clearTimeout(id);
    }
  }, [screen]);

  useEffect(() => {
    if (!prev) return;
    const id = setTimeout(() => setPrev(null), 450);
    return () => clearTimeout(id);
  }, [screen]);

  const goto = (next, entry = null) => { setPrev(screen); setScreen(next); setRestoreEntry(entry); };
  const back = () => goto('home');

  return (
    <div className="stage">
      <div className="app-root">
        {screen === 'splash' && <Splash/>}
        {screen !== 'splash' && (
          <>
            <ScreenLayer active={screen === 'home'}>
              <Home onPick={goto} layout="grid" store={store}/>
            </ScreenLayer>
            <ScreenLayer active={screen === 'bread'}>
              {(screen === 'bread' || prev === 'bread') && <BreadScreen onBack={back} store={store} restoreEntry={screen === 'bread' ? restoreEntry : null}/>}
            </ScreenLayer>
            <ScreenLayer active={screen === 'cocktail'}>
              {(screen === 'cocktail' || prev === 'cocktail') && <CocktailScreen onBack={back} store={store} initialShare={initialShare} restoreEntry={screen === 'cocktail' ? restoreEntry : null}/>}
            </ScreenLayer>
            <ScreenLayer active={screen === 'price'}>
              {(screen === 'price' || prev === 'price') && <PriceScreen onBack={back} store={store} initialShare={initialShare} restoreEntry={screen === 'price' ? restoreEntry : null}/>}
            </ScreenLayer>
          </>
        )}
      </div>
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
