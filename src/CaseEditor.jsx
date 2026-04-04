import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save, Download, Upload, Play, ChevronRight, ChevronDown } from 'lucide-react';

const ICON_OPTIONS = ['Search','DoorClosed','BookOpen','Map','Settings','FileText','Lock','ChevronLeft','Smartphone','Flashlight','Battery','Zap','PenTool','Key','Ticket','Camera','Book','Library','Footprints','Home','AlertCircle'];

const EMPTY_CASE = {
  id: '', title: '', subtitle: '', difficulty: '★★☆', estimate: '~15 min',
  isCustom: true, startingRoom: '', victoryText: '',
  rooms: {}, items: {}, actions: {}, combines: [], codes: [],
  victoryConditions: { requiredItems: [], requiredFlags: [] }
};

function genId(prefix = 'r') { return prefix + '_' + Math.random().toString(36).slice(2, 8); }

// ============================================
// CASE EDITOR COMPONENT
// ============================================
export default function CaseEditor({ onBack, onTestCase }) {
  const [caseData, setCaseData] = useState(() => {
    const saved = localStorage.getItem('noir_editor_wip');
    return saved ? JSON.parse(saved) : { ...EMPTY_CASE, id: 'custom_' + Date.now() };
  });
  const [activeTab, setActiveTab] = useState('info');
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [expandedAction, setExpandedAction] = useState(null);
  const [notification, setNotification] = useState('');

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(''), 2000); };

  const update = useCallback((fn) => {
    setCaseData(prev => {
      const next = fn({ ...prev });
      localStorage.setItem('noir_editor_wip', JSON.stringify(next));
      return next;
    });
  }, []);

  const setField = (key, val) => update(d => { d[key] = val; return d; });

  // ---- Save/Load ----
  const saveCase = () => {
    const customs = JSON.parse(localStorage.getItem('noir_custom_cases') || '[]');
    const idx = customs.findIndex(c => c.id === caseData.id);
    if (idx >= 0) customs[idx] = caseData; else customs.push(caseData);
    localStorage.setItem('noir_custom_cases', JSON.stringify(customs));
    notify('✓ Sprawa zapisana!');
  };

  const exportCase = () => {
    const blob = new Blob([JSON.stringify(caseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `noir_case_${caseData.id}.json`; a.click();
    URL.revokeObjectURL(url);
    notify('✓ Wyeksportowano!');
  };

  const importCase = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          imported.isCustom = true;
          setCaseData(imported);
          localStorage.setItem('noir_editor_wip', JSON.stringify(imported));
          notify('✓ Zaimportowano!');
        } catch { notify('✗ Błąd importu!'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const testCase = () => {
    if (!caseData.startingRoom || !caseData.rooms[caseData.startingRoom]) {
      notify('✗ Ustaw pokój startowy!'); return;
    }
    saveCase();
    onTestCase(caseData);
  };

  // ---- Rooms ----
  const addRoom = () => {
    const roomId = genId('room');
    update(d => {
      d.rooms[roomId] = { name: 'Nowy Pokój', description: 'Opis...', nodes: [] };
      if (!d.startingRoom) d.startingRoom = roomId;
      return d;
    });
    setExpandedRoom(roomId);
  };

  const deleteRoom = (roomId) => {
    update(d => {
      delete d.rooms[roomId];
      if (d.startingRoom === roomId) d.startingRoom = Object.keys(d.rooms)[0] || '';
      return d;
    });
  };

  const updateRoom = (roomId, field, val) => {
    update(d => { d.rooms[roomId][field] = val; return d; });
  };

  // ---- Nodes ----
  const addNode = (roomId) => {
    update(d => {
      d.rooms[roomId].nodes.push({ id: genId('n'), label: 'Nowa akcja', action: genId('act'), icon: 'Search' });
      return d;
    });
  };

  const addNavNode = (roomId) => {
    const targets = Object.keys(caseData.rooms).filter(id => id !== roomId);
    const target = targets[0] || '';
    update(d => {
      d.rooms[roomId].nodes.push({ id: genId('nav'), label: 'Idź...', target, icon: 'DoorClosed' });
      return d;
    });
  };

  const updateNode = (roomId, nodeIdx, field, val) => {
    update(d => { d.rooms[roomId].nodes[nodeIdx][field] = val; return d; });
  };

  const deleteNode = (roomId, nodeIdx) => {
    update(d => { d.rooms[roomId].nodes.splice(nodeIdx, 1); return d; });
  };

  // ---- Items ----
  const addItem = () => {
    const key = genId('item');
    update(d => { d.items[key] = { name: 'Nowy przedmiot', desc: 'Opis...', icon: 'Search' }; return d; });
  };

  const deleteItem = (key) => {
    update(d => { delete d.items[key]; return d; });
  };

  const updateItem = (key, field, val) => {
    update(d => { d.items[key][field] = val; return d; });
  };

  // ---- Actions ----
  const addAction = (actionId) => {
    update(d => {
      if (!d.actions[actionId]) {
        d.actions[actionId] = { branches: [{ conditions: [{ type: 'noFlag', key: actionId + '_done' }], effects: [{ type: 'setFlag', key: actionId + '_done' }, { type: 'log', text: 'Znalazłeś coś!' }] }], defaultLog: 'Nic nowego.' };
      }
      return d;
    });
    setExpandedAction(actionId);
  };

  const addBranch = (actionId) => {
    update(d => {
      d.actions[actionId].branches.push({ conditions: [], effects: [{ type: 'log', text: 'Opis...' }] });
      return d;
    });
  };

  const updateBranchCondition = (actionId, branchIdx, condIdx, field, val) => {
    update(d => { d.actions[actionId].branches[branchIdx].conditions[condIdx][field] = val; return d; });
  };

  const addCondition = (actionId, branchIdx) => {
    update(d => { d.actions[actionId].branches[branchIdx].conditions.push({ type: 'noFlag', key: '' }); return d; });
  };

  const deleteCondition = (actionId, branchIdx, condIdx) => {
    update(d => { d.actions[actionId].branches[branchIdx].conditions.splice(condIdx, 1); return d; });
  };

  const updateEffect = (actionId, branchIdx, effectIdx, field, val) => {
    update(d => { d.actions[actionId].branches[branchIdx].effects[effectIdx][field] = val; return d; });
  };

  const addEffect = (actionId, branchIdx) => {
    update(d => { d.actions[actionId].branches[branchIdx].effects.push({ type: 'log', text: '' }); return d; });
  };

  const deleteEffect = (actionId, branchIdx, effectIdx) => {
    update(d => { d.actions[actionId].branches[branchIdx].effects.splice(effectIdx, 1); return d; });
  };

  const deleteBranch = (actionId, branchIdx) => {
    update(d => { d.actions[actionId].branches.splice(branchIdx, 1); return d; });
  };

  // ---- Combines ----
  const addCombine = () => {
    update(d => { d.combines.push({ item1: '', item2: '', resultItem: '', removeItems: [], log: 'Połączono!', flag: '' }); return d; });
  };

  const updateCombine = (idx, field, val) => {
    update(d => { d.combines[idx][field] = val; return d; });
  };

  const deleteCombine = (idx) => {
    update(d => { d.combines.splice(idx, 1); return d; });
  };

  // ---- Victory ----
  const toggleVictoryItem = (key) => {
    update(d => {
      const arr = d.victoryConditions.requiredItems;
      if (arr.includes(key)) d.victoryConditions.requiredItems = arr.filter(i => i !== key);
      else arr.push(key);
      return d;
    });
  };

  const addVictoryFlag = () => {
    update(d => { d.victoryConditions.requiredFlags.push(''); return d; });
  };

  const updateVictoryFlag = (idx, val) => {
    update(d => { d.victoryConditions.requiredFlags[idx] = val; return d; });
  };

  const deleteVictoryFlag = (idx) => {
    update(d => { d.victoryConditions.requiredFlags.splice(idx, 1); return d; });
  };

  // ---- All action IDs from rooms ----
  const allActionIds = Object.values(caseData.rooms).flatMap(r => (r.nodes || []).filter(n => n.action).map(n => n.action));
  const roomIds = Object.keys(caseData.rooms);
  const itemKeys = Object.keys(caseData.items);

  const tabs = [
    { id: 'info', label: '1. Informacje' },
    { id: 'rooms', label: '2. Pokoje' },
    { id: 'items', label: '3. Przedmioty' },
    { id: 'actions', label: '4. Logika Akcji' },
    { id: 'combines', label: '5. Łączenie' },
    { id: 'victory', label: '6. Warunki Wygranej' }
  ];

  return (
    <div className="noir-container">
      <header className="noir-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="sound-toggle" onClick={onBack}><ArrowLeft size={16} /></button>
          <div>
            <h1 className="noir-header__title">Edytor Spraw</h1>
            <p className="noir-header__subtitle">Twórz własne zagadki detektywistyczne</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="editor-btn editor-btn--sm" onClick={importCase}><Upload size={14} /> Import</button>
          <button className="editor-btn editor-btn--sm" onClick={exportCase}><Download size={14} /> Export</button>
          <button className="editor-btn editor-btn--sm editor-btn--accent" onClick={saveCase}><Save size={14} /> Zapisz</button>
          <button className="editor-btn editor-btn--sm editor-btn--play" onClick={testCase}><Play size={14} /> Testuj</button>
        </div>
      </header>

      <AnimatePresence>
        {notification && (
          <motion.div className="editor-notify" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="editor-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`editor-tab ${activeTab === t.id ? 'editor-tab--active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="editor-content">
        {/* ---- TAB: INFO ---- */}
        {activeTab === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <h2 className="editor-section__title">Informacje o sprawie</h2>
            <div className="editor-fields">
              <label className="editor-label">Tytuł <input className="editor-input" value={caseData.title} onChange={e => setField('title', e.target.value)} placeholder="np. Zaginiony Klejnot" /></label>
              <label className="editor-label">Podtytuł <input className="editor-input" value={caseData.subtitle} onChange={e => setField('subtitle', e.target.value)} placeholder="np. Kradzież w muzeum" /></label>
              <label className="editor-label">Trudność
                <select className="editor-input" value={caseData.difficulty} onChange={e => setField('difficulty', e.target.value)}>
                  <option>★☆☆</option><option>★★☆</option><option>★★★</option><option>★★★★</option><option>★★★★★</option>
                </select>
              </label>
              <label className="editor-label">Czas gry <input className="editor-input" value={caseData.estimate} onChange={e => setField('estimate', e.target.value)} placeholder="~20 min" /></label>
              <label className="editor-label">Pokój startowy
                <select className="editor-input" value={caseData.startingRoom} onChange={e => setField('startingRoom', e.target.value)}>
                  <option value="">-- wybierz --</option>
                  {roomIds.map(id => <option key={id} value={id}>{caseData.rooms[id].name} ({id})</option>)}
                </select>
              </label>
              <label className="editor-label">Tekst po wygranej <textarea className="editor-input editor-input--textarea" value={caseData.victoryText} onChange={e => setField('victoryText', e.target.value)} placeholder="Sprawa rozwiązana!..." rows={4} /></label>
            </div>
          </motion.div>
        )}

        {/* ---- TAB: ROOMS ---- */}
        {activeTab === 'rooms' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <div className="editor-section__header">
              <h2 className="editor-section__title">Pokoje ({roomIds.length})</h2>
              <button className="editor-btn" onClick={addRoom}><Plus size={14} /> Dodaj pokój</button>
            </div>
            {roomIds.map(roomId => {
              const room = caseData.rooms[roomId];
              const isExpanded = expandedRoom === roomId;
              const isStart = caseData.startingRoom === roomId;
              return (
                <div key={roomId} className={`editor-card ${isStart ? 'editor-card--highlight' : ''}`}>
                  <div className="editor-card__header" onClick={() => setExpandedRoom(isExpanded ? null : roomId)}>
                    <span>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <span className="editor-card__title">{room.name} {isStart && <span className="editor-badge">START</span>}</span>
                    <span className="editor-card__id">{roomId}</span>
                    <button className="editor-btn--delete" onClick={e => { e.stopPropagation(); deleteRoom(roomId); }}><Trash2 size={12} /></button>
                  </div>
                  {isExpanded && (
                    <div className="editor-card__body">
                      <label className="editor-label">Nazwa <input className="editor-input" value={room.name} onChange={e => updateRoom(roomId, 'name', e.target.value)} /></label>
                      <label className="editor-label">Opis <textarea className="editor-input editor-input--textarea" value={room.description} onChange={e => updateRoom(roomId, 'description', e.target.value)} rows={3} /></label>
                      <div className="editor-sub-header">
                        <span>Akcje i przejścia ({room.nodes.length})</span>
                        <div style={{display:'flex', gap:'0.5rem'}}>
                          <button className="editor-btn editor-btn--sm" onClick={() => addNode(roomId)}><Plus size={12} /> Akcja</button>
                          <button className="editor-btn editor-btn--sm" onClick={() => addNavNode(roomId)}><Plus size={12} /> Przejście</button>
                        </div>
                      </div>
                      {room.nodes.map((node, ni) => (
                        <div key={node.id} className="editor-node">
                          <input className="editor-input editor-input--sm" value={node.label} onChange={e => updateNode(roomId, ni, 'label', e.target.value)} placeholder="Etykieta" />
                          <select className="editor-input editor-input--sm" value={node.icon} onChange={e => updateNode(roomId, ni, 'icon', e.target.value)}>
                            {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                          </select>
                          {node.target !== undefined ? (
                            <select className="editor-input editor-input--sm" value={node.target} onChange={e => updateNode(roomId, ni, 'target', e.target.value)}>
                              {roomIds.filter(id => id !== roomId).map(id => <option key={id} value={id}>{caseData.rooms[id].name}</option>)}
                            </select>
                          ) : (
                            <input className="editor-input editor-input--sm" value={node.action} onChange={e => updateNode(roomId, ni, 'action', e.target.value)} placeholder="ID akcji" />
                          )}
                          <button className="editor-btn--delete" onClick={() => deleteNode(roomId, ni)}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ---- TAB: ITEMS ---- */}
        {activeTab === 'items' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <div className="editor-section__header">
              <h2 className="editor-section__title">Przedmioty ({itemKeys.length})</h2>
              <button className="editor-btn" onClick={addItem}><Plus size={14} /> Dodaj</button>
            </div>
            {itemKeys.map(key => {
              const item = caseData.items[key];
              return (
                <div key={key} className="editor-card">
                  <div className="editor-node">
                    <span className="editor-card__id" style={{minWidth:'80px'}}>{key}</span>
                    <input className="editor-input editor-input--sm" value={item.name} onChange={e => updateItem(key, 'name', e.target.value)} placeholder="Nazwa" />
                    <input className="editor-input editor-input--sm" value={item.desc} onChange={e => updateItem(key, 'desc', e.target.value)} placeholder="Opis" style={{flex:2}} />
                    <select className="editor-input editor-input--sm" value={item.icon} onChange={e => updateItem(key, 'icon', e.target.value)} style={{width:'100px'}}>
                      {ICON_OPTIONS.map(ic => <option key={ic}>{ic}</option>)}
                    </select>
                    <button className="editor-btn--delete" onClick={() => deleteItem(key)}><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ---- TAB: ACTIONS ---- */}
        {activeTab === 'actions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <h2 className="editor-section__title">Logika Akcji</h2>
            <p className="editor-hint">Definiuje co się dzieje po kliknięciu akcji w pokoju. Każda ma gałęzie z warunkami i efektami.</p>
            {allActionIds.filter(a => a !== 'ending_check').map(actionId => {
              const hasLogic = !!caseData.actions[actionId];
              const isExpanded = expandedAction === actionId;
              return (
                <div key={actionId} className="editor-card">
                  <div className="editor-card__header" onClick={() => { if (!hasLogic) addAction(actionId); else setExpandedAction(isExpanded ? null : actionId); }}>
                    <span>{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                    <span className="editor-card__title">{actionId}</span>
                    {hasLogic ? <span className="editor-badge editor-badge--success">✓ Skonfigurowana</span> : <span className="editor-badge">Kliknij aby dodać logikę</span>}
                  </div>
                  {isExpanded && hasLogic && (
                    <div className="editor-card__body">
                      <label className="editor-label">Domyślny tekst (gdy brak pasującego warunku) <input className="editor-input" value={caseData.actions[actionId].defaultLog || ''} onChange={e => update(d => { d.actions[actionId].defaultLog = e.target.value; return d; })} /></label>
                      {caseData.actions[actionId].branches.map((branch, bi) => (
                        <div key={bi} className="editor-branch">
                          <div className="editor-branch__header">
                            <span className="editor-branch__label">Gałąź #{bi + 1}</span>
                            <button className="editor-btn--delete" onClick={() => deleteBranch(actionId, bi)}><Trash2 size={12} /></button>
                          </div>
                          <div className="editor-branch__section">
                            <span className="editor-branch__sublabel">Warunki:</span>
                            {branch.conditions.map((cond, ci) => (
                              <div key={ci} className="editor-node">
                                <select className="editor-input editor-input--sm" value={cond.type} onChange={e => updateBranchCondition(actionId, bi, ci, 'type', e.target.value)}>
                                  <option value="noFlag">Flaga NIE ustawiona</option>
                                  <option value="hasFlag">Flaga ustawiona</option>
                                  <option value="hasItem">Ma przedmiot</option>
                                  <option value="noItem">Nie ma przedmiotu</option>
                                  <option value="selectedItem">Wybrany przedmiot</option>
                                </select>
                                <input className="editor-input editor-input--sm" value={cond.key} onChange={e => updateBranchCondition(actionId, bi, ci, 'key', e.target.value)} placeholder="Klucz flagi/przedmiotu" />
                                <button className="editor-btn--delete" onClick={() => deleteCondition(actionId, bi, ci)}><Trash2 size={10} /></button>
                              </div>
                            ))}
                            <button className="editor-btn editor-btn--sm" onClick={() => addCondition(actionId, bi)}><Plus size={12} /> Warunek</button>
                          </div>
                          <div className="editor-branch__section">
                            <span className="editor-branch__sublabel">Efekty:</span>
                            {branch.effects.map((eff, ei) => (
                              <div key={ei} className="editor-node">
                                <select className="editor-input editor-input--sm" value={eff.type} onChange={e => updateEffect(actionId, bi, ei, 'type', e.target.value)}>
                                  <option value="log">Tekst w dzienniku</option>
                                  <option value="addItem">Dodaj przedmiot</option>
                                  <option value="setFlag">Ustaw flagę</option>
                                  <option value="showCodepad">Pokaż klawiaturę</option>
                                </select>
                                <input className="editor-input editor-input--sm" value={eff.text || eff.key || ''} onChange={e => {
                                  const f = eff.type === 'log' ? 'text' : 'key';
                                  updateEffect(actionId, bi, ei, f, e.target.value);
                                }} placeholder={eff.type === 'log' ? 'Tekst...' : 'Klucz...'} style={{flex:2}} />
                                <button className="editor-btn--delete" onClick={() => deleteEffect(actionId, bi, ei)}><Trash2 size={10} /></button>
                              </div>
                            ))}
                            <button className="editor-btn editor-btn--sm" onClick={() => addEffect(actionId, bi)}><Plus size={12} /> Efekt</button>
                          </div>
                        </div>
                      ))}
                      <button className="editor-btn" onClick={() => addBranch(actionId)}><Plus size={14} /> Dodaj gałąź</button>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ---- TAB: COMBINES ---- */}
        {activeTab === 'combines' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <div className="editor-section__header">
              <h2 className="editor-section__title">Łączenie Przedmiotów ({caseData.combines.length})</h2>
              <button className="editor-btn" onClick={addCombine}><Plus size={14} /> Dodaj</button>
            </div>
            <p className="editor-hint">Gracz klika dwa przedmioty po kolei, aby je połączyć.</p>
            {caseData.combines.map((combo, i) => (
              <div key={i} className="editor-card">
                <div className="editor-node" style={{flexWrap:'wrap'}}>
                  <select className="editor-input editor-input--sm" value={combo.item1} onChange={e => updateCombine(i, 'item1', e.target.value)}>
                    <option value="">Przedmiot 1</option>
                    {itemKeys.map(k => <option key={k} value={k}>{caseData.items[k].name} ({k})</option>)}
                  </select>
                  <span style={{color:'var(--text-muted)'}}>+</span>
                  <select className="editor-input editor-input--sm" value={combo.item2} onChange={e => updateCombine(i, 'item2', e.target.value)}>
                    <option value="">Przedmiot 2</option>
                    {itemKeys.map(k => <option key={k} value={k}>{caseData.items[k].name} ({k})</option>)}
                  </select>
                  <span style={{color:'var(--text-muted)'}}>=</span>
                  <input className="editor-input editor-input--sm" value={combo.resultItem} onChange={e => updateCombine(i, 'resultItem', e.target.value)} placeholder="Wynik (klucz)" />
                  <input className="editor-input editor-input--sm" value={combo.log} onChange={e => updateCombine(i, 'log', e.target.value)} placeholder="Tekst" style={{flex:2}} />
                  <button className="editor-btn--delete" onClick={() => deleteCombine(i)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ---- TAB: VICTORY ---- */}
        {activeTab === 'victory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="editor-section">
            <h2 className="editor-section__title">Warunki Wygranej</h2>
            <p className="editor-hint">Gracz musi posiadać zaznaczone przedmioty i mieć ustawione flagi, aby wygrać (akcja "Wskaż mordercę").</p>
            <h3 className="editor-sub-title">Wymagane Przedmioty</h3>
            <div className="editor-checklist">
              {itemKeys.map(k => (
                <label key={k} className="editor-check">
                  <input type="checkbox" checked={caseData.victoryConditions.requiredItems.includes(k)} onChange={() => toggleVictoryItem(k)} />
                  <span>{caseData.items[k].name} ({k})</span>
                </label>
              ))}
              {itemKeys.length === 0 && <p className="editor-hint">Dodaj przedmioty w zakładce "Przedmioty".</p>}
            </div>
            <h3 className="editor-sub-title">Wymagane Flagi</h3>
            {caseData.victoryConditions.requiredFlags.map((f, i) => (
              <div key={i} className="editor-node">
                <input className="editor-input editor-input--sm" value={f} onChange={e => updateVictoryFlag(i, e.target.value)} placeholder="Nazwa flagi" />
                <button className="editor-btn--delete" onClick={() => deleteVictoryFlag(i)}><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="editor-btn editor-btn--sm" onClick={addVictoryFlag}><Plus size={12} /> Dodaj flagę</button>
          </motion.div>
        )}
      </main>

      <footer className="noir-footer">
        <p className="noir-footer__text">Edytor Spraw — Projekt Noir</p>
        <div className="noir-footer__divider" />
      </footer>
    </div>
  );
}
