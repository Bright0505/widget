import React from 'react'
import { Glyph } from './glyphs'
import { StarIcon } from './home'
import { ShareModal } from './share'

const RECIPES = {
  t55: { name: 'T55 長棍', short: 'T55', water: 70, salt: 2, yeast: 1,
    flour: '麵粉（T55）',
    tips: ['發酵：室溫 2-3 小時或冷藏隔夜', '預熱 230-240°C 烘烤 20-25 分', '底盤放水製造蒸氣，表面更脆'] },
  t65: { name: 'T65 鄉村', short: 'T65', water: 75, salt: 2.2, yeast: 0.8,
    flour: '麵粉（T65）',
    tips: ['發酵：室溫 3-4 小時或冷藏隔夜', '預熱 220-230°C 烘烤 30-35 分', '水合度高，麵團濕黏屬正常'] },
  focaccia: { name: '佛卡夏', short: 'Focaccia', water: 75, salt: 2, yeast: 1, oliveOil: 6,
    flour: '麵粉（高筋或中筋）',
    tips: ['一發 1-2 小時至兩倍大，二發 30-45 分', '入烤盤後指尖戳洞，淋橄欖油', '預熱 200-220°C 烘烤 20-25 分'] },
};

export function BreadScreen({ onBack, store }) {
  const isFav = store.favorites.includes('bread');
  const onToggleFav = () => store.toggleFav('bread');
  const [recipe, setRecipe] = React.useState('t55');
  const [flour, setFlour] = React.useState('500');
  const lastSavedRef = React.useRef('');
  React.useEffect(() => {
    if (!flour || parseFloat(flour) <= 0) return;
    const sig = `${recipe}-${flour}`;
    if (sig === lastSavedRef.current) return;
    const id = setTimeout(() => {
      lastSavedRef.current = sig;
      store.addHistory({ toolId:'bread', mode: RECIPES[recipe].name,
        summary: `麵粉 ${flour}g · 水 ${Math.round(parseFloat(flour)*RECIPES[recipe].water/100)}g`,
      });
    }, 1500);
    return () => clearTimeout(id);
  }, [recipe, flour]);
  const r = RECIPES[recipe];
  const f = parseFloat(flour) || 0;
  const round = (x) => Math.round(x * 10) / 10;
  const water = round(f * r.water / 100);
  const salt = round(f * r.salt / 100);
  const yeast = round(f * r.yeast / 100);
  const oil = r.oliveOil ? round(f * r.oliveOil / 100) : 0;
  const total = round(f + water + salt + yeast + oil);

  const items = [
    { name: r.flour, amt: f, pct: 100, mute: false },
    { name: '水', amt: water, pct: r.water },
    { name: '鹽', amt: salt, pct: r.salt },
    { name: '新鮮酵母', amt: yeast, pct: r.yeast },
    ...(r.oliveOil ? [{ name: '橄欖油', amt: oil, pct: r.oliveOil }] : []),
  ];

  return (
    <div className="app-scroll">
      <div className="tool-head">
        <button className="back-btn" onClick={onBack}><Glyph name="arrow-left" size={16}/>返回</button>
        <span className="crumb">French Bread</span>
        <div className="head-actions">
          <button className={`icon-btn ${isFav ? 'on' : ''}`} onClick={onToggleFav}>
            <span style={{color: isFav ? '#fff' : 'var(--text-3)'}}><StarIcon filled={isFav} size={14}/></span>
          </button>
        </div>
      </div>
      <div className="tool-title-block">
        <h1 className="tool-title">法國麵包配方</h1>
        <div className="tool-sub">輸入麵粉重量，材料比例自動更新（烘焙百分比）</div>
      </div>
      <div className="tool-body">
        <div className="seg">
          {Object.entries(RECIPES).map(([k, v]) => (
            <button key={k} className={recipe === k ? 'on' : ''} onClick={() => setRecipe(k)}>{v.name}</button>
          ))}
        </div>

        <div className="field">
          <div className="field-label"><span>麵粉重量</span><span className="hint">grams</span></div>
          <div className="input-wrap">
            <input type="number" inputMode="numeric" value={flour}
              onChange={e => setFlour(e.target.value.replace(/[^0-9.]/g,''))}
              placeholder="500"/>
            <div className="input-suffix">g</div>
          </div>
          <div className="preset-row">
            {[250, 500, 750, 1000].map(n => (
              <button key={n} className={flour === String(n) ? 'on' : ''} onClick={() => setFlour(String(n))}>{n}g</button>
            ))}
          </div>
        </div>

        <div>
          <div className="section-h"><span className="en">Recipe · {r.short}</span><span className="tc">配方</span></div>
          <div className="recipe-list">
            {items.map((it, i) => (
              <div key={i} className="recipe-row">
                <div className="rr-name">
                  <span className="nm">{it.name}</span>
                  <span className="pct">{it.pct}%</span>
                </div>
                <div className="rr-bar"><i style={{ width: Math.min(100, it.pct) + '%' }}/></div>
                <div className="rr-amt">{it.amt}<span className="rr-unit">g</span></div>
              </div>
            ))}
            <div className="recipe-total">
              <span className="lbl">總重量</span>
              <span className="val">{total}<span style={{fontFamily:'var(--sans)', fontSize:14, color:'var(--text-2)', fontStyle:'normal', marginLeft:4}}>g</span></span>
            </div>
          </div>
        </div>

        <div className="tip">
          <div className="tip-en">Notes</div>
          <div className="tip-title">製作提示</div>
          <ul>{r.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function smartRound(v) {
  if (!v) return 0;
  const r = Math.round(v);
  const r5 = Math.round(v / 5) * 5;
  const r10 = Math.round(v / 10) * 10;
  if (Math.abs(v - r10) / v <= 0.05) return r10;
  if (Math.abs(v - r5) / v <= 0.03) return r5;
  return r;
}

export function CocktailScreen({ onBack, store, initialShare }) {
  const isFav = store.favorites.includes('cocktail');
  const onToggleFav = () => store.toggleFav('cocktail');
  const [mode, setMode] = React.useState('mixing');
  return (
    <div className="app-scroll">
      <div className="tool-head">
        <button className="back-btn" onClick={onBack}><Glyph name="arrow-left" size={16}/>返回</button>
        <span className="crumb">Cocktail</span>
        <div className="head-actions">
          <button className={`icon-btn ${isFav ? 'on' : ''}`} onClick={onToggleFav}>
            <span style={{color: isFav ? '#fff' : 'var(--text-3)'}}><StarIcon filled={isFav} size={14}/></span>
          </button>
        </div>
      </div>
      <div className="tool-title-block">
        <h1 className="tool-title">調酒計算</h1>
        <div className="tool-sub">{mode === 'mixing' ? '計算需要多少基酒，達到目標濃度' : '估算飲酒後的血液酒精濃度'}</div>
      </div>
      <div className="tool-body">
        <div className="seg">
          <button className={mode === 'mixing' ? 'on' : ''} onClick={() => setMode('mixing')}>調酒配方</button>
          <button className={mode === 'bac' ? 'on' : ''} onClick={() => setMode('bac')}>血液濃度</button>
        </div>
        {mode === 'mixing' ? <CocktailMixing initialShare={initialShare}/> : <CocktailBAC/>}
      </div>
    </div>
  );
}

function CocktailMixing({ initialShare }) {
  const init = initialShare?.m === 'mixing' ? initialShare : null;
  const [target, setTarget] = React.useState(init?.target ?? '9');
  const [total, setTotal] = React.useState(init?.total ?? '250');
  const [base, setBase] = React.useState(init?.base ?? '40');
  const [aux, setAux] = React.useState(init?.aux ?? [{ conc: '', vol: '' }]);
  const [showShare, setShowShare] = React.useState(false);

  const tConc = parseFloat(target) || 0;
  const tVol = parseFloat(total) || 0;
  const bConc = parseFloat(base) || 0;
  const auxList = aux.map(a => ({ conc: parseFloat(a.conc) || 0, vol: parseFloat(a.vol) || 0 })).filter(a => a.vol > 0);
  const auxVol = auxList.reduce((s, a) => s + a.vol, 0);

  const available = Math.max(0, tVol - auxVol);
  const alcRaw = bConc > 0 ? (tConc * available) / bConc : 0;
  const alc = smartRound(alcRaw);
  const mixer = Math.max(0, tVol - alc - auxVol);
  const actual = tVol > 0 ? (alc * bConc) / tVol : 0;

  const valid = tConc > 0 && tVol > 0 && bConc > 0 && tConc <= bConc && available > 0 && alc <= tVol;

  const fillAlc = tVol > 0 ? (alc / tVol) * 100 : 0;
  const fillAux = tVol > 0 ? (auxVol / tVol) * 100 : 0;
  const fillMix = tVol > 0 ? (mixer / tVol) * 100 : 0;

  return (
    <>
      <div className="glass-stage">
        <CocktailGlass alc={fillAlc} aux={fillAux} mix={fillMix}/>
        <div className="stats">
          <div className="stat alc">
            <div className="l">Alcohol</div>
            <div className="v">{valid ? alc : '—'}<small>ml</small></div>
          </div>
          <div className="stat">
            <div className="l">Actual %</div>
            <div className="v">{valid ? actual.toFixed(1) : '—'}<small>%</small></div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{gap: 12}}>
        <div className="field">
          <div className="field-label"><span>目標濃度</span><span className="hint">%</span></div>
          <div className="input-wrap">
            <input type="number" inputMode="decimal" value={target}
              onChange={e => setTarget(e.target.value)}/>
            <div className="input-suffix">%</div>
          </div>
        </div>
        <div className="field">
          <div className="field-label"><span>總容量</span><span className="hint">ml</span></div>
          <div className="input-wrap">
            <input type="number" inputMode="decimal" value={total}
              onChange={e => setTotal(e.target.value)}/>
            <div className="input-suffix">ml</div>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-label"><span>基酒濃度</span><span className="hint">e.g. 40% 伏特加</span></div>
        <div className="input-wrap">
          <input type="number" inputMode="decimal" value={base} onChange={e => setBase(e.target.value)}/>
          <div className="input-suffix">%</div>
        </div>
      </div>

      <div>
        <div className="section-h"><span className="en">Recipe</span><span className="tc">配方明細</span></div>
        <div className="liquid-list">
          <div className="liquid-row">
            <div><div className="nm">基酒</div><div className="pct">{base}% · {valid ? Math.round(fillAlc) : 0}% 杯量</div></div>
            <div className="vol">{valid ? alc : '—'}<small style={{fontFamily:'var(--sans)', fontSize:11, color:'var(--text-3)', fontStyle:'normal', marginLeft:2}}>ml</small></div>
            <div className="bar"><i style={{ width: fillAlc + '%' }}/></div>
          </div>
          {auxList.length > 0 && auxList.map((a, i) => (
            <div key={i} className="liquid-row aux">
              <div><div className="nm">輔料 {i + 1}</div><div className="pct">{a.conc}% · {Math.round(a.vol/tVol*100)}% 杯量</div></div>
              <div className="vol">{a.vol}<small style={{fontFamily:'var(--sans)', fontSize:11, color:'var(--text-3)', fontStyle:'normal', marginLeft:2}}>ml</small></div>
              <div className="bar"><i style={{ width: (a.vol/tVol*100) + '%' }}/></div>
            </div>
          ))}
          <div className="liquid-row aux">
            <div><div className="nm">稀釋液（水/冰塊融化等）</div><div className="pct">{valid ? Math.round(fillMix) : 0}% 杯量</div></div>
            <div className="vol">{valid ? mixer : '—'}<small style={{fontFamily:'var(--sans)', fontSize:11, color:'var(--text-3)', fontStyle:'normal', marginLeft:2}}>ml</small></div>
            <div className="bar"><i style={{ width: fillMix + '%' }}/></div>
          </div>
        </div>
      </div>

      <div>
        <div className="section-h"><span className="en">Optional</span><span className="tc">輔料（含酒精的果汁、香甜酒…）</span></div>
        <div style={{display:'flex', flexDirection:'column', gap: 10}}>
          {aux.map((a, i) => (
            <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap: 8, alignItems: 'center'}}>
              <div className="input-wrap">
                <input type="number" inputMode="decimal" placeholder="濃度 %" value={a.conc}
                  onChange={e => setAux(aux.map((x, j) => j === i ? {...x, conc: e.target.value} : x))}/>
                <div className="input-suffix">%</div>
              </div>
              <div className="input-wrap">
                <input type="number" inputMode="decimal" placeholder="容量 ml" value={a.vol}
                  onChange={e => setAux(aux.map((x, j) => j === i ? {...x, vol: e.target.value} : x))}/>
                <div className="input-suffix">ml</div>
              </div>
              <button onClick={() => setAux(aux.length === 1 ? [{conc:'', vol:''}] : aux.filter((_, j) => j !== i))}
                style={{width:36, height:36, borderRadius:'50%', border:'1px solid var(--border)', background:'var(--surface)', cursor:'pointer', color:'var(--text-3)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Glyph name="close" size={14}/>
              </button>
            </div>
          ))}
          <button className="add-liq" onClick={() => setAux([...aux, {conc:'', vol:''}])}>
            <Glyph name="plus" size={14}/> 新增輔料
          </button>
        </div>
      </div>

      {!valid && tConc > 0 && bConc > 0 && tConc > bConc && (
        <div className="tip" style={{background:'#FBE9E2'}}>
          <div className="tip-en" style={{color:'var(--danger)'}}>Warning</div>
          <div className="tip-title">目標濃度不能高於基酒濃度</div>
        </div>
      )}

      <div className="note-line">⚠️ 此計算器僅供參考。請勿酒駕，珍愛生命。</div>

      {valid && (
        <button className="btn-share" onClick={() => setShowShare(true)}>
          <Glyph name="share" size={16}/> 分享配方
        </button>
      )}
      {showShare && (
        <ShareModal
          data={{ t: 'cocktail', m: 'mixing', target, total, base, aux }}
          title="調酒配方"
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}

function CocktailGlass({ alc = 0, aux = 0, mix = 0 }) {
  const totalFill = Math.min(100, alc + aux + mix);
  const liquidH = 80;
  const baseY = 110;
  const fillH = (totalFill / 100) * liquidH;
  const topY = baseY - fillH;
  const alcH = (alc / 100) * liquidH;
  const auxH = (aux / 100) * liquidH;
  return (
    <svg viewBox="0 0 100 130" width="100%" style={{maxWidth: 130}}>
      <defs>
        <clipPath id="glass-clip">
          <path d="M22 18 L78 18 L72 110 L28 110 Z"/>
        </clipPath>
      </defs>
      <g clipPath="url(#glass-clip)">
        <rect x="0" y={topY} width="100" height={fillH}
          fill="var(--accent)" opacity=".18">
          <animate attributeName="y" to={topY} dur=".4s" fill="freeze"/>
        </rect>
        <rect x="0" y={baseY - alcH} width="100" height={alcH} fill="var(--accent)" opacity=".55"/>
        <rect x="0" y={baseY - alcH - auxH} width="100" height={auxH} fill="var(--text-3)" opacity=".4"/>
        {totalFill > 0 && (
          <rect x="0" y={topY} width="100" height="1.5" fill="var(--text)" opacity=".15"/>
        )}
      </g>
      <path d="M22 18 L78 18 L72 110 L28 110 Z"
        stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <path d="M20 18 L80 18" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function CocktailBAC() {
  const [vol, setVol] = React.useState('330');
  const [pct, setPct] = React.useState('5');
  const [wt, setWt] = React.useState('60');
  const [gender, setGender] = React.useState('female');

  const v = parseFloat(vol) || 0;
  const p = parseFloat(pct) || 0;
  const w = parseFloat(wt) || 0;
  const widmark = gender === 'male' ? 0.68 : 0.55;
  const pure = v * p / 100 * 0.789;
  const bac = w > 0 ? (pure / (w * widmark)) / 10 : 0;

  let level = 'safe', msg = '濃度較低，但仍建議避免駕駛';
  if (bac >= 0.05 && bac < 0.08) { level = 'warn'; msg = '已達禁止駕駛標準（0.05%）'; }
  else if (bac >= 0.08 && bac < 0.25) { level = 'bad'; msg = '濃度過高，可能出現嚴重醉酒症狀'; }
  else if (bac >= 0.25) { level = 'bad'; msg = '濃度極高，有生命危險，請立即就醫'; }

  return (
    <>
      <div className="bac-card">
        <div className="l">Blood Alcohol Concentration</div>
        <div className="v">{bac.toFixed(3)}<sup>%</sup></div>
        <div className={`bac-pill ${level}`}>{msg}</div>
      </div>

      <div className="grid-2" style={{gap: 12}}>
        <div className="field">
          <div className="field-label"><span>飲料容量</span><span className="hint">ml</span></div>
          <div className="input-wrap"><input type="number" value={vol} onChange={e => setVol(e.target.value)}/><div className="input-suffix">ml</div></div>
        </div>
        <div className="field">
          <div className="field-label"><span>酒精濃度</span><span className="hint">%</span></div>
          <div className="input-wrap"><input type="number" value={pct} onChange={e => setPct(e.target.value)}/><div className="input-suffix">%</div></div>
        </div>
        <div className="field">
          <div className="field-label"><span>體重</span><span className="hint">kg</span></div>
          <div className="input-wrap"><input type="number" value={wt} onChange={e => setWt(e.target.value)}/><div className="input-suffix">kg</div></div>
        </div>
        <div className="field">
          <div className="field-label"><span>性別</span><span className="hint">Widmark</span></div>
          <div className="input-wrap">
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="female">女性</option>
              <option value="male">男性</option>
            </select>
          </div>
        </div>
      </div>

      <div className="note-line">⚠️ 僅供參考，實際濃度受多種因素影響。請勿酒駕。</div>
    </>
  );
}

const UNIT_OPTIONS = {
  volume: { ml:'毫升 (ml)', l:'公升 (L)', 'fl oz':'液體盎司' },
  weight: { g:'公克 (g)', kg:'公斤 (kg)', '台斤':'台斤', '市斤':'市斤', '磅':'磅' },
  package:{ '包':'包', '瓶':'瓶', '罐':'罐', '片':'片', '張':'張', '條':'條' },
};
const UNIT_CONV = { ml:1, l:1000, 'fl oz':29.5735, g:1, kg:1000, '台斤':600, '市斤':500, '磅':453.592 };
const UNIT_TYPE_LABEL = { volume:'容量類', weight:'重量類', package:'包裝類' };

export function PriceScreen({ onBack, store, initialShare }) {
  const isFav = store.favorites.includes('price');
  const onToggleFav = () => store.toggleFav('price');
  const [showShare, setShowShare] = React.useState(false);
  const [products, setProducts] = React.useState(() => {
    if (!initialShare?.products?.length) return [];
    return initialShare.products.map((p, i) => {
      const conv = UNIT_CONV[p.unit] || 1;
      const standardQty = p.qty * conv;
      return {
        id: Date.now() + i, name: p.name, price: p.price, qty: p.qty, unit: p.unit, type: p.type,
        unitPrice: p.price / p.qty,
        standardUnitPrice: p.price / standardQty,
        standardUnit: p.type === 'volume' ? 'ml' : p.type === 'weight' ? 'g' : p.unit,
      };
    });
  });
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [type, setType] = React.useState('volume');
  const [unit, setUnit] = React.useState('ml');
  const [addError, setAddError] = React.useState('');

  React.useEffect(() => {
    setUnit(Object.keys(UNIT_OPTIONS[type])[0]);
  }, [type]);

  const add = () => {
    const pr = parseFloat(price), q = parseFloat(qty);
    if (!name.trim()) { setAddError('請輸入商品名稱'); return; }
    if (!(pr > 0)) { setAddError('請輸入有效的售價（需大於 0）'); return; }
    if (!(q > 0)) { setAddError('請輸入有效的容量或數量（需大於 0）'); return; }
    setAddError('');
    const conv = UNIT_CONV[unit] || 1;
    const standardQty = q * conv;
    const newP = {
      id: Date.now(), name, price: pr, qty: q, unit, type,
      unitPrice: pr / q,
      standardUnitPrice: pr / standardQty,
      standardUnit: type === 'volume' ? 'ml' : type === 'weight' ? 'g' : unit,
    };
    setProducts([...products, newP]);
    store.addHistory({ toolId:'price', summary: `${name} · $${pr} / ${q}${unit}` });
    setName(''); setPrice(''); setQty('');
  };

  const grouped = ['volume','weight','package'].map(t => ({
    type: t,
    items: products.filter(p => p.type === t).sort((a, b) =>
      t === 'package' ? a.unitPrice - b.unitPrice : a.standardUnitPrice - b.standardUnitPrice)
  })).filter(g => g.items.length > 0);

  return (
    <div className="app-scroll">
      <div className="tool-head">
        <button className="back-btn" onClick={onBack}><Glyph name="arrow-left" size={16}/>返回</button>
        <span className="crumb">Price Compare</span>
        <div className="head-actions">
          <button className={`icon-btn ${isFav ? 'on' : ''}`} onClick={onToggleFav}>
            <span style={{color: isFav ? '#fff' : 'var(--text-3)'}}><StarIcon filled={isFav} size={14}/></span>
          </button>
        </div>
      </div>
      <div className="tool-title-block">
        <h1 className="tool-title">比價計算</h1>
        <div className="tool-sub">輸入幾種商品的價格與容量，自動換算單價並排序</div>
      </div>
      <div className="tool-body">
        <div>
          <div className="section-h"><span className="en">Add</span><span className="tc">新增商品</span></div>
          <div style={{display:'flex', flexDirection:'column', gap: 12}}>
            <div className="input-wrap">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="商品名稱（例如：好市多牛奶）"/>
            </div>
            <div className="grid-2" style={{gap: 12}}>
              <div className="input-wrap"><input type="number" inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} placeholder="售價"/><div className="input-suffix">$</div></div>
              <div className="input-wrap"><input type="number" inputMode="decimal" value={qty} onChange={e => setQty(e.target.value)} placeholder="容量/數量"/></div>
            </div>
            <div className="grid-2" style={{gap: 12}}>
              <div className="input-wrap">
                <select value={type} onChange={e => setType(e.target.value)}>
                  {Object.entries(UNIT_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="input-wrap">
                <select value={unit} onChange={e => setUnit(e.target.value)}>
                  {Object.entries(UNIT_OPTIONS[type]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={add}>新增商品</button>
            {addError && (
              <div style={{color:'var(--danger)', fontSize:12, marginTop:-4, paddingLeft:4}}>{addError}</div>
            )}
          </div>
        </div>

        <div>
          <div className="section-h">
            <span className="en">Compare</span><span className="tc">比較結果</span>
            {products.length > 0 && (
              <button className="btn-share-sm" onClick={() => setShowShare(true)}>
                <Glyph name="share" size={13}/> 分享
              </button>
            )}
          </div>
          {showShare && (
            <ShareModal
              data={{ t: 'price', products: products.map(p => ({ name: p.name, price: p.price, qty: p.qty, unit: p.unit, type: p.type })) }}
              title="比價結果"
              onClose={() => setShowShare(false)}
            />
          )}
          {products.length === 0 && (
            <div className="empty-state">
              <div className="e-en">Empty</div>
              <div className="e-t">還沒有商品</div>
              <div className="e-d">新增 2 件以上來開始比價</div>
            </div>
          )}
          {grouped.map(g => {
            const items = g.items;
            const max = Math.max(...items.map(p => g.type === 'package' ? p.unitPrice : p.standardUnitPrice));
            return (
              <div key={g.type} style={{marginBottom: 18}}>
                <div style={{fontFamily:'var(--serif-en)', fontStyle:'italic', fontSize:11, color:'var(--text-3)', margin:'14px 0 8px', letterSpacing:'.05em'}}>
                  {UNIT_TYPE_LABEL[g.type]}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                  {items.map((p, idx) => {
                    const isBest = idx === 0 && items.length > 1;
                    const cmp = g.type === 'package' ? p.unitPrice : p.standardUnitPrice;
                    return (
                      <div key={p.id} className={`product-row ${isBest ? 'best' : ''}`}>
                        {isBest && <div className="crown">最划算</div>}
                        <button className="pr-del" onClick={() => setProducts(products.filter(x => x.id !== p.id))}>
                          <Glyph name="close" size={14}/>
                        </button>
                        <div className="pr-top">
                          <div className="pr-name">{p.name}</div>
                          <div className="pr-meta">${p.price} / {p.qty}{p.unit}</div>
                        </div>
                        <div className="pr-bar"><i style={{ width: (cmp / max * 100) + '%' }}/></div>
                        <div className="pr-unit">
                          <div className="pu-l">每 {p.standardUnit}</div>
                          <div className="pu-v">${cmp < 1 ? cmp.toFixed(3) : cmp.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
