import React, { useState } from 'react'
import { Glyph } from './glyphs'
import { relTime } from './history'

export function Splash() {
  return (
    <div className="splash">
      <div className="splash-mark" />
      <div className="splash-title">生活小工具</div>
      <div className="splash-sub">everyday · little · tools</div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5)  return ['深夜好', 'Late night'];
  if (h < 11) return ['早安',   'Good morning'];
  if (h < 14) return ['午安',   'Good afternoon'];
  if (h < 18) return ['下午好', 'Good afternoon'];
  return ['晚安', 'Good evening'];
}

function fmtDate() {
  const d = new Date();
  const w = ['日','一','二','三','四','五','六'][d.getDay()];
  const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${mn[d.getMonth()]} ${d.getDate()} · 星期${w}`;
}

export const TOOLS = [
  { id: 'bread',    label: '法國麵包配方', en: 'French Bread',
    desc: 'T55 · T65 · 佛卡夏。輸入麵粉重量，自動換算。', glyph: 'bread' },
  { id: 'cocktail', label: '調酒計算',     en: 'Cocktail',
    desc: '酒精濃度與血液濃度計算。', glyph: 'cocktail' },
  { id: 'price',    label: '比價計算',     en: 'Price Compare',
    desc: '不同單位、不同包裝的單價比較。', glyph: 'price' },
];

export function StarIcon({ filled = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6-5.3-2.8L6.7 19.7l1-6L3.3 9.4l6-.9z"/>
    </svg>
  );
}

function ToolCard({ tool, size = 'small', extraClass = '', onPick, isFav, onToggleFav }) {
  const isLarge = size === 'large';
  return (
    <div className={`tool-card ${size} ${extraClass}`} role="button" tabIndex={0}
      onClick={() => onPick(tool.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') onPick(tool.id); }}>
      <div style={{position:'absolute', top:10, right:10, zIndex:2}}
        onClick={(e) => { e.stopPropagation(); onToggleFav(tool.id); }}>
        <div className={`icon-btn ${isFav ? 'on' : ''}`} style={{width:28, height:28, cursor:'pointer'}}>
          <span style={{color: isFav ? '#fff' : 'var(--text-3)'}}><StarIcon filled={isFav} size={13}/></span>
        </div>
      </div>
      <div style={{paddingRight: 30}}>
        <div className="label-en">{tool.en}</div>
        <div className="label-tc">{tool.label}</div>
        {isLarge && <div className="desc">{tool.desc}</div>}
      </div>
      <div className={`glyph ${isLarge ? 'lg' : ''}`}>
        <Glyph name={tool.glyph} size={isLarge ? 56 : 32} stroke={1.2}/>
      </div>
    </div>
  );
}

export function Home({ onPick, layout = 'mixed', store }) {
  const [tab, setTab] = useState('tools');
  const [greet] = greeting();
  const { favorites, history, toggleFav, removeHistory, clearHistory } = store;
  const favTools = favorites.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
  const isFav = (id) => favorites.includes(id);

  return (
    <div className="app-scroll">
      <div className="home-header">
        <div className="home-greet">
          <div className="home-date">{fmtDate()}</div>
          <h1 className="home-hello">{greet}，<br/>今天想做<em>什麼</em>？</h1>
        </div>

        <div className="home-tabs">
          <button className={tab === 'tools' ? 'on' : ''} onClick={() => setTab('tools')}>工具</button>
          <button className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>
            最近使用 {history.length > 0 ? `· ${history.length}` : ''}
          </button>
        </div>
      </div>

      <div className="home-body">
        {tab === 'tools' && <>
          {favTools.length > 0 && (
            <div>
              <div className="section-h"><span className="en">Favorites</span><span className="tc">收藏</span></div>
              <div className="fav-strip">
                {favTools.map(t => (
                  <button key={t.id} className="fav-chip" onClick={() => onPick(t.id)}>
                    <span style={{color:'var(--accent)'}}><Glyph name={t.glyph} size={26} stroke={1.4}/></span>
                    <div className="meta">
                      <span className="en">{t.en}</span>
                      <span className="nm">{t.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="section-h"><span className="en">All Tools</span><span className="tc">所有工具</span></div>
            {layout === 'mixed' && (
              <div className="mix-grid">
                <ToolCard tool={TOOLS[0]} size="large" extraClass="mix-left" onPick={onPick}
                  isFav={isFav(TOOLS[0].id)} onToggleFav={toggleFav}/>
                <div className="mix-right">
                  {TOOLS.slice(1).map(t => (
                    <ToolCard key={t.id} tool={t} size="small" onPick={onPick}
                      isFav={isFav(t.id)} onToggleFav={toggleFav}/>
                  ))}
                </div>
              </div>
            )}
            {layout === 'grid' && (
              <div className="grid-2">
                {TOOLS.map(t => (
                  <div key={t.id} style={{aspectRatio:'1 / 1'}}>
                    <ToolCard tool={t} size="small" onPick={onPick}
                      isFav={isFav(t.id)} onToggleFav={toggleFav}/>
                  </div>
                ))}
              </div>
            )}
            {layout === 'list' && (
              <div className="list-stack">
                {TOOLS.map(t => (
                  <div key={t.id} className="list-row" role="button" tabIndex={0} onClick={() => onPick(t.id)}>
                    <div className="glyph lg" style={{background:'var(--surface-2)', borderRadius:14}}>
                      <Glyph name={t.glyph} size={28} stroke={1.4}/>
                    </div>
                    <div className="meta">
                      <div className="t">{t.label}</div>
                      <div className="d">{t.desc}</div>
                    </div>
                    <div className={`icon-btn ${isFav(t.id) ? 'on' : ''}`}
                      style={{width:32, height:32, cursor:'pointer'}}
                      onClick={(e) => { e.stopPropagation(); toggleFav(t.id); }}>
                      <span style={{color: isFav(t.id) ? '#fff' : 'var(--text-3)'}}>
                        <StarIcon filled={isFav(t.id)} size={14}/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="banner">
            <div className="b-l">
              <div className="b-en">Coming soon</div>
              <div className="b-t">更多生活小工具</div>
              <div className="b-d">時間計算 · 匯率 · 單位換算 · 持續更新中</div>
            </div>
            <div style={{color:'var(--text-3)', fontFamily:'var(--serif-en)', fontStyle:'italic', fontSize:24}}>+</div>
          </div>
        </>}

        {tab === 'history' && (
          <div>
            <div className="section-h">
              <span className="en">Recent</span>
              <span className="tc">最近使用</span>
              {history.length > 0 && (
                <button onClick={clearHistory}
                  style={{border:0, background:'transparent', color:'var(--text-3)', fontSize:11, cursor:'pointer', marginLeft:'auto', fontFamily:'var(--serif-en)', fontStyle:'italic'}}>
                  Clear all
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="empty-state">
                <div className="e-en">Empty</div>
                <div className="e-t">還沒有歷史紀錄</div>
                <div className="e-d">使用工具計算後會自動保存</div>
              </div>
            ) : (
              <div>
                {history.map(h => {
                  const tool = TOOLS.find(t => t.id === h.toolId);
                  return (
                    <div key={h.id} className="history-row">
                      <div className="h-glyph"><Glyph name={tool ? tool.glyph : 'bread'} size={20} stroke={1.4}/></div>
                      <div className="h-meta" role="button" tabIndex={0} style={{cursor:'pointer'}} onClick={() => onPick(h.toolId, h)}>
                        <div className="h-tool">{tool ? tool.label : h.toolId} {h.mode ? `· ${h.mode}` : ''}</div>
                        <div className="h-sum">{h.summary}</div>
                      </div>
                      <span className="h-time">{relTime(h.ts)}</span>
                      <button className="h-del" onClick={() => removeHistory(h.id)}>
                        <Glyph name="close" size={12}/>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="note-line">v1.1 · 加入主畫面，當作 App 使用</div>
      </div>
    </div>
  );
}

