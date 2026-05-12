import React, { useState, useEffect } from 'react'
import { Glyph } from './glyphs'
import { StarIcon, TOOLS } from './home'
import { relTime } from './history'

const RECIPES = {
  t55: { name: 'T55 長棍', short: 'T55', water: 70, salt: 2, yeast: 1, flour: '麵粉（T55）', tips: [] },
  t65: { name: 'T65 鄉村', short: 'T65', water: 75, salt: 2.2, yeast: 0.8, flour: '麵粉（T65）', tips: [] },
  focaccia: { name: '佛卡夏', short: 'Focaccia', water: 75, salt: 2, yeast: 1, oliveOil: 6, flour: '麵粉（高筋或中筋）', tips: [] },
};

const UNIT_CONV = { ml:1, l:1000, 'fl oz':29.5735, g:1, kg:1000, '台斤':600, '市斤':500, '磅':453.592 };

export function NoteDetailScreen({ onBack, note, store }) {
  const [editMode, setEditMode] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const tool = note ? TOOLS.find(t => t.id === note.toolId) : null;

  if (!note) {
    return (
      <div className="app-scroll">
        <div className="tool-head">
          <button className="back-btn" onClick={onBack}><Glyph name="arrow-left" size={16}/>返回</button>
          <span className="crumb">Note</span>
        </div>
      </div>
    );
  }

  const handleSaveEdit = () => {
    store.removeNote(note.id);
    store.addNote({
      toolId: note.toolId,
      mode: note.mode,
      summary: note.summary,
      inputs: note.inputs,
    });
    setSaveMsg('已保存');
    setEditMode(false);
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="app-scroll">
      <div className="tool-head">
        <button className="back-btn" onClick={onBack}><Glyph name="arrow-left" size={16}/>返回</button>
        <span className="crumb">{tool ? tool.label : 'Note'}</span>
        <div className="head-actions" style={{display:'flex', alignItems:'center', gap:8}}>
          {editMode ? (
            <>
              <button className="icon-btn" onClick={handleSaveEdit} title="保存編輯">
                <Glyph name="check" size={16}/>
              </button>
              <button className="icon-btn" onClick={() => setEditMode(false)} title="取消編輯">
                <Glyph name="close" size={16}/>
              </button>
            </>
          ) : (
            <>
              <button className="icon-btn" onClick={() => setEditMode(true)} title="編輯記事">
                <Glyph name="edit" size={16}/>
              </button>
              <button className="icon-btn" onClick={() => store.removeNote(note.id)} title="刪除記事">
                <Glyph name="close" size={16}/>
              </button>
            </>
          )}
          {saveMsg && <span style={{fontSize:12, color:'var(--text-3)'}}>{saveMsg}</span>}
        </div>
      </div>

      <div className="tool-title-block">
        <h1 className="tool-title">{tool ? tool.label : note.toolId}</h1>
        {note.mode && <div className="tool-sub">{note.mode}</div>}
        <div className="tool-sub" style={{fontSize:12, color:'var(--text-3)', marginTop:4}}>{relTime(note.ts)}</div>
      </div>

      <div className="tool-body">
        {note.toolId === 'bread' && (
          <BreadNoteDetail note={note} editMode={editMode} onNoteChange={(updated) => {
            note.inputs = updated.inputs;
            note.summary = updated.summary;
          }}/>
        )}
        {note.toolId === 'cocktail' && (
          <CocktailNoteDetail note={note} editMode={editMode} onNoteChange={(updated) => {
            note.inputs = updated.inputs;
            note.summary = updated.summary;
          }}/>
        )}
        {note.toolId === 'price' && (
          <PriceNoteDetail note={note} editMode={editMode} onNoteChange={(updated) => {
            note.inputs = updated.inputs;
            note.summary = updated.summary;
          }}/>
        )}
      </div>
    </div>
  );
}

function BreadNoteDetail({ note, editMode, onNoteChange }) {
  const [recipe, setRecipe] = useState(note.inputs?.recipe || 't55');
  const [flour, setFlour] = useState(note.inputs?.flour || '500');

  useEffect(() => {
    if (editMode) {
      onNoteChange({
        inputs: { recipe, flour },
        summary: `麵粉 ${flour}g · 水 ${Math.round(parseFloat(flour)*RECIPES[recipe].water/100)}g`,
      });
    }
  }, [recipe, flour, editMode]);

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

  if (editMode) {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <div className="section-h"><span className="en">Recipe</span><span className="tc">配方</span></div>
          <div className="seg">
            {Object.entries(RECIPES).map(([k, v]) => (
              <button key={k} className={recipe === k ? 'on' : ''} onClick={() => setRecipe(k)}>{v.name}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span>麵粉重量</span><span className="hint">grams</span></div>
          <div className="input-wrap">
            <input type="number" inputMode="numeric" value={flour}
              onChange={e => setFlour(e.target.value.replace(/[^0-9.]/g,''))}
              placeholder="500"/>
            <div className="input-suffix">g</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-h"><span className="en">Recipe</span><span className="tc">配方</span></div>
      <div style={{marginBottom:12}}>
        <span style={{fontFamily:'var(--serif-en)', fontStyle:'italic', fontSize:12, color:'var(--text-2)'}}>{r.name}</span>
        <div style={{fontSize:13, color:'var(--text-2)', marginTop:2}}>麵粉 {f}g</div>
      </div>
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
  );
}

function CocktailNoteDetail({ note, editMode, onNoteChange }) {
  const [mode, setMode] = useState(note.inputs?.mode || 'mixing');
  const [target, setTarget] = useState(String(note.inputs?.target || '9'));
  const [total, setTotal] = useState(String(note.inputs?.total || '250'));
  const [base, setBase] = useState(String(note.inputs?.base || '40'));
  const [vol, setVol] = useState(String(note.inputs?.vol || '330'));
  const [pct, setPct] = useState(String(note.inputs?.pct || '5'));
  const [wt, setWt] = useState(String(note.inputs?.wt || '60'));
  const [gender, setGender] = useState(note.inputs?.gender || 'female');

  useEffect(() => {
    if (editMode && mode === 'mixing') {
      onNoteChange({
        inputs: { mode, target, total, base },
        summary: `目標 ${target}% · ${total}ml · 基酒 ${base}%`,
      });
    } else if (editMode && mode === 'bac') {
      const v = parseFloat(vol) || 0;
      const p = parseFloat(pct) || 0;
      const w = parseFloat(wt) || 0;
      const widmark = gender === 'male' ? 0.68 : 0.55;
      const pure = v * p / 100 * 0.789;
      const bac = w > 0 ? (pure / (w * widmark)) / 10 : 0;
      onNoteChange({
        inputs: { mode, vol, pct, wt, gender },
        summary: `${vol}ml · ${pct}% · ${gender === 'male' ? '男' : '女'} · BAC ${bac.toFixed(3)}%`,
      });
    }
  }, [mode, target, total, base, vol, pct, wt, gender, editMode]);

  if (editMode) {
    if (mode === 'mixing') {
      return (
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
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
            <div className="field-label"><span>基酒濃度</span><span className="hint">%</span></div>
            <div className="input-wrap">
              <input type="number" inputMode="decimal" value={base}
                onChange={e => setBase(e.target.value)}/>
              <div className="input-suffix">%</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          <div className="grid-2" style={{gap: 12}}>
            <div className="field">
              <div className="field-label"><span>飲料容量</span><span className="hint">ml</span></div>
              <div className="input-wrap">
                <input type="number" value={vol} onChange={e => setVol(e.target.value)}/>
                <div className="input-suffix">ml</div>
              </div>
            </div>
            <div className="field">
              <div className="field-label"><span>酒精濃度</span><span className="hint">%</span></div>
              <div className="input-wrap">
                <input type="number" value={pct} onChange={e => setPct(e.target.value)}/>
                <div className="input-suffix">%</div>
              </div>
            </div>
            <div className="field">
              <div className="field-label"><span>體重</span><span className="hint">kg</span></div>
              <div className="input-wrap">
                <input type="number" value={wt} onChange={e => setWt(e.target.value)}/>
                <div className="input-suffix">kg</div>
              </div>
            </div>
            <div className="field">
              <div className="field-label"><span>性別</span></div>
              <div className="input-wrap">
                <select value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="female">女性</option>
                  <option value="male">男性</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      {mode === 'mixing' ? (
        <div>
          <div style={{fontSize:13, color:'var(--text-2)', marginBottom:12}}>
            目標濃度: {target}% · 總容量: {total}ml · 基酒: {base}%
          </div>
        </div>
      ) : (
        <div>
          <div style={{fontSize:13, color:'var(--text-2)', marginBottom:12}}>
            容量: {vol}ml · 濃度: {pct}% · 體重: {wt}kg · {gender === 'male' ? '男性' : '女性'}
          </div>
        </div>
      )}
    </div>
  );
}

function PriceNoteDetail({ note, editMode, onNoteChange }) {
  const [products, setProducts] = useState(note.inputs?.products || []);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [tempName, setTempName] = useState('');
  const [tempPrice, setTempPrice] = useState('');
  const [tempQty, setTempQty] = useState('');
  const [tempUnit, setTempUnit] = useState('');
  const [tempType, setTempType] = useState('');

  useEffect(() => {
    if (editMode) {
      onNoteChange({
        inputs: { products },
        summary: `${products.length} 項商品`,
      });
    }
  }, [products, editMode]);

  const startEdit = (idx) => {
    const p = products[idx];
    setEditingIdx(idx);
    setTempName(p.name);
    setTempPrice(String(p.price));
    setTempQty(String(p.qty));
    setTempUnit(p.unit);
    setTempType(p.type);
  };

  const saveEdit = () => {
    const updated = [...products];
    updated[editingIdx] = {
      name: tempName,
      price: parseFloat(tempPrice),
      qty: parseFloat(tempQty),
      unit: tempUnit,
      type: tempType,
    };
    setProducts(updated);
    setEditingIdx(-1);
  };

  const removeProduct = (idx) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  if (editMode) {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {products.map((p, idx) => (
          editingIdx === idx ? (
            <div key={idx} style={{border:'1px solid var(--border)', borderRadius:8, padding:12, backgroundColor:'var(--surface-2)'}}>
              <div style={{display:'flex', flexDirection:'column', gap:10}}>
                <input value={tempName} onChange={e => setTempName(e.target.value)} placeholder="商品名稱" style={{padding:8, border:'1px solid var(--border)', borderRadius:6}}/>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <input type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} placeholder="售價" style={{padding:8, border:'1px solid var(--border)', borderRadius:6}}/>
                  <input type="number" value={tempQty} onChange={e => setTempQty(e.target.value)} placeholder="容量/數量" style={{padding:8, border:'1px solid var(--border)', borderRadius:6}}/>
                </div>
                <input value={tempUnit} onChange={e => setTempUnit(e.target.value)} placeholder="單位" style={{padding:8, border:'1px solid var(--border)', borderRadius:6}}/>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={saveEdit} style={{flex:1, padding:10, background:'var(--accent)', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>保存</button>
                  <button onClick={() => setEditingIdx(-1)} style={{flex:1, padding:10, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6, cursor:'pointer'}}>取消</button>
                </div>
              </div>
            </div>
          ) : (
            <div key={idx} style={{border:'1px solid var(--border)', borderRadius:8, padding:12, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}} onClick={() => startEdit(idx)}>
              <div>
                <div style={{fontWeight:500}}>{p.name}</div>
                <div style={{fontSize:12, color:'var(--text-2)'}}>${p.price} / {p.qty}{p.unit}</div>
              </div>
              <button onClick={(e) => {
                e.stopPropagation();
                removeProduct(idx);
              }} style={{background:'none', border:'none', cursor:'pointer', color:'var(--danger)'}}>
                <Glyph name="close" size={16}/>
              </button>
            </div>
          )
        ))}
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:12}}>
      {products.map((p, idx) => (
        <div key={idx} style={{border:'1px solid var(--border)', borderRadius:8, padding:12}}>
          <div style={{fontWeight:500}}>{p.name}</div>
          <div style={{fontSize:12, color:'var(--text-2)', marginTop:4}}>${p.price} / {p.qty}{p.unit}</div>
        </div>
      ))}
    </div>
  );
}
