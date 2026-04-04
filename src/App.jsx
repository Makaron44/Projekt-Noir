import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, DoorClosed, BookOpen, Map, 
  Settings, FileText, Lock, ChevronLeft, 
  Smartphone, Flashlight, Battery, Zap, 
  PenTool, Key, Ticket, Image as ImageIcon, 
  Camera, Book, Library, Footprints, Home,
  AlertCircle, CheckCircle2, ChevronRight,
  Volume2, VolumeX, RotateCcw, ArrowLeft, Clock, Target, Package, Edit3, Trash2
} from 'lucide-react';
import { useGame } from './hooks/useGame';
import { builtInCases, getCustomCases, getCompletedCases, markCaseCompleted, deleteCustomCase } from './cases/index.js';
import { toggleMute, getMuted, playKeypadBeep, playErrorSound } from './sounds.js';
import CaseEditor from './CaseEditor.jsx';

const IconMap = {
  Search, DoorClosed, BookOpen, Map, 
  Settings, FileText, Lock, ChevronLeft, 
  Smartphone, Flashlight, Battery, Zap, 
  PenTool, Key, Ticket, ImageIcon, 
  Camera, Book, Library, Footprints, Home,
  AlertCircle, CheckCircle2, ChevronRight
};

/* ============================================
   ITEM TOOLTIP
   ============================================ */
function ItemTooltip({ data, children, isSelected, onClick }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {children}
      <AnimatePresence>
        {show && data && (
          <motion.div 
            className="tooltip-popup"
            style={{ left: pos.x, top: pos.y - 10, transform: 'translate(-50%, -100%)' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.12 }}
          >
            <p className="tooltip-popup__name">{data.name}</p>
            <p className="tooltip-popup__desc">{data.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   CODEPAD MODAL
   ============================================ */
function CodepadModal({ type, onSubmit, onClose }) {
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);
  const maxLen = 4;
  const titles = { safe: 'Kod Sejfu', phone: 'PIN Telefonu', drawer: 'Kod Szuflady', min_safe: 'Sejf Ministra' };
  const icons = { safe: <Lock size={32} />, phone: <Smartphone size={32} />, drawer: <Lock size={32} />, min_safe: <Lock size={32} /> };

  const handleDigit = (d) => { if (code.length < maxLen) { playKeypadBeep(); setCode(prev => prev + d); } };
  const handleDelete = () => setCode(prev => prev.slice(0, -1));
  const handleSubmit = () => {
    const ok = onSubmit(type, code);
    if (!ok) { setShake(true); setCode(''); setTimeout(() => setShake(false), 500); }
  };

  return (
    <div className="codepad-overlay" onClick={onClose}>
      <motion.div 
        className={`codepad-modal ${shake ? 'codepad-modal--shake' : ''}`}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="codepad-modal__icon">{icons[type]}</div>
        <h3 className="codepad-modal__title">{titles[type]}</h3>
        <p className="codepad-modal__subtitle">Wprowadź {maxLen}-cyfrowy kod</p>
        <div className="codepad-modal__display">
          {Array.from({ length: maxLen }).map((_, i) => (
            <div key={i} className={`codepad-dot ${i < code.length ? 'codepad-dot--filled' : ''}`} />
          ))}
        </div>
        <div className="codepad-grid">
          {[1,2,3,4,5,6,7,8,9].map(d => (
            <button key={d} className="codepad-key" onClick={() => handleDigit(String(d))}>{d}</button>
          ))}
          <button className="codepad-key codepad-key--action" onClick={handleDelete}>←</button>
          <button className="codepad-key" onClick={() => handleDigit('0')}>0</button>
          <button className="codepad-key codepad-key--submit" onClick={handleSubmit}>✓</button>
        </div>
        <button className="codepad-modal__cancel" onClick={onClose}>Anuluj</button>
      </motion.div>
    </div>
  );
}

/* ============================================
   CINEMATIC INTRO
   ============================================ */
function IntroScreen({ onDismiss }) {
  const [visible, setVisible] = useState(true);
  const raindrops = useMemo(() => 
    Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${15 + Math.random() * 30}px`,
      duration: `${0.6 + Math.random() * 0.8}s`,
      delay: `${Math.random() * 2}s`,
      opacity: 0.2 + Math.random() * 0.4
    })), []);

  const handleClick = () => {
    setVisible(false);
    setTimeout(onDismiss, 600);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="intro-screen" 
          onClick={handleClick}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated rain */}
          <div className="intro-rain">
            {raindrops.map(d => (
              <div
                key={d.id}
                className="intro-raindrop"
                style={{
                  left: d.left,
                  height: d.height,
                  animationDuration: d.duration,
                  animationDelay: d.delay,
                  opacity: d.opacity
                }}
              />
            ))}
          </div>

          {/* Vignette overlay */}
          <div className="intro-vignette" />
          
          {/* Scanlines */}
          <div className="intro-scanlines" />

          {/* Content */}
          <motion.div 
            className="intro-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5 }}
          >
            <motion.p 
              className="intro-badge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Interaktywna gra detektywistyczna
            </motion.p>
            
            <motion.h1 
              className="intro-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Projekt Noir
            </motion.h1>
            
            <motion.p 
              className="intro-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              „W tym mieście każdy ma tajemnicę. Twoja robota — je odkryć."
            </motion.p>

            <motion.div 
              className="intro-divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            />

            <motion.p 
              className="intro-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Kliknij aby rozpocząć
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   VICTORY SCREEN (with stats)
   ============================================ */
function VictoryScreen({ caseData, steps, startTime, inventoryCount, onRestart, onMenu }) {
  useEffect(() => { markCaseCompleted(caseData.id); }, [caseData.id]);

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const totalItems = Object.keys(caseData.items).length;
  const pct = Math.round((inventoryCount / totalItems) * 100);

  return (
    <motion.div className="victory-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="victory-card" initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.2, type: 'spring' }}>
        <CheckCircle2 size={64} className="victory-card__icon" />
        <h1 className="victory-card__title">Sprawa Rozwiązana!</h1>

        <div className="victory-stats">
          <div className="victory-stat">
            <div className="victory-stat__value">{timeStr}</div>
            <div className="victory-stat__label">Czas</div>
          </div>
          <div className="victory-stat">
            <div className="victory-stat__value">{steps}</div>
            <div className="victory-stat__label">Kroki</div>
          </div>
          <div className="victory-stat">
            <div className="victory-stat__value">{pct}%</div>
            <div className="victory-stat__label">Dowody</div>
          </div>
        </div>

        <p className="victory-card__text">{caseData.victoryText}</p>
        <p className="victory-card__rank">
          Ranga: {pct >= 90 ? 'Legendarny Detektyw ★★★★★' : pct >= 70 ? 'Detektyw Pierwszej Klasy ★★★★' : pct >= 50 ? 'Inspektor ★★★' : 'Początkujący ★★'}
        </p>
        <div className="victory-card__actions">
          <button className="victory-card__button" onClick={onRestart}><RotateCcw size={16} /> Zagraj Ponownie</button>
          <button className="victory-card__button victory-card__button--secondary" onClick={onMenu}><ArrowLeft size={16} /> Wybór Spraw</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   MAIN MENU
   ============================================ */
function MainMenu({ onSelectCase, onOpenEditor }) {
  const completed = getCompletedCases();
  const customCases = getCustomCases();
  const allCases = [...builtInCases, ...customCases];

  const handleDeleteCustom = (e, id) => {
    e.stopPropagation();
    if (confirm('Usunąć tę sprawę?')) {
      deleteCustomCase(id);
      window.location.reload();
    }
  };

  return (
    <div className="noir-container">
      <div className="menu-screen">
        <motion.div className="menu-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="menu-header__title">Projekt Noir</h1>
          <p className="menu-header__subtitle">Wybierz sprawę do rozwiązania</p>
          <div className="menu-header__line" />
        </motion.div>

        <div className="case-grid">
          {allCases.map((c, i) => {
            const isCompleted = completed.includes(c.id);
            const isCustom = !!c.isCustom;
            return (
              <motion.button
                key={c.id}
                className={`case-card ${isCompleted ? 'case-card--completed' : ''} ${isCustom ? 'case-card--custom' : ''}`}
                onClick={() => onSelectCase(c)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="case-card__number">
                  #{i + 1}
                  {isCustom && <span className="editor-badge" style={{marginLeft:'0.5rem'}}>WŁASNA</span>}
                  {isCustom && <span className="case-card__delete" onClick={e => handleDeleteCustom(e, c.id)}><Trash2 size={12} /></span>}
                </div>
                <h2 className="case-card__title">{c.title || 'Bez tytułu'}</h2>
                <p className="case-card__subtitle">{c.subtitle || ''}</p>
                <div className="case-card__meta">
                  <span className="case-card__difficulty">{c.difficulty}</span>
                  <span className="case-card__time">{c.estimate}</span>
                </div>
                {isCompleted && (
                  <div className="case-card__badge"><CheckCircle2 size={14} /> Rozwiązana</div>
                )}
              </motion.button>
            );
          })}

          {/* Create new case card */}
          <motion.button
            className="case-card case-card--editor"
            onClick={onOpenEditor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: allCases.length * 0.1 }}
          >
            <div className="case-card__number"><Edit3 size={14} /></div>
            <h2 className="case-card__title">Edytor Spraw</h2>
            <p className="case-card__subtitle">Stwórz własną zagadkę detektywistyczną</p>
            <div className="case-card__meta">
              <span className="case-card__difficulty">KREATOR</span>
            </div>
          </motion.button>
        </div>

        <footer className="noir-footer">
          <p className="noir-footer__text">© 1947 Blackwood Investigations</p>
          <div className="noir-footer__divider" />
        </footer>
      </div>
    </div>
  );
}

/* ============================================
   GAME SCREEN
   ============================================ */
function GameScreen({ caseData, onBackToMenu }) {
  const { 
    currentRoom, inventory, logs,
    selectedItem, setSelectedItem, 
    showCodepad, setShowCodepad,
    gameWon, steps, startTime,
    handleMove, handleAction, handleCombine, handleCodeSubmit, handleItemUse
  } = useGame(caseData);

  const [muted, setMuted] = useState(getMuted());

  const handleMuteToggle = () => { const m = toggleMute(); setMuted(m); };

  const handleItemClick = (itemKey) => {
    if (handleItemUse(itemKey)) return;
    if (selectedItem && selectedItem !== itemKey) {
      if (handleCombine(selectedItem, itemKey)) { setSelectedItem(null); return; }
    }
    setSelectedItem(selectedItem === itemKey ? null : itemKey);
  };

  const safeInventory = useMemo(() => {
    return inventory.map(key => ({ key, data: caseData.items[key] })).filter(i => i.data);
  }, [inventory, caseData]);

  if (gameWon) {
    return <VictoryScreen caseData={caseData} steps={steps} startTime={startTime} inventoryCount={inventory.length} onRestart={() => window.location.reload()} onMenu={onBackToMenu} />;
  }

  if (!currentRoom) {
    return (
      <div className="noir-container" style={{justifyContent:'center', alignItems:'center'}}>
        <div className="glass-panel" style={{textAlign:'center'}}>
          <h1>Błąd</h1>
          <button onClick={onBackToMenu} className="btn-noir" style={{marginTop:'2rem'}}>Powrót do Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="noir-container">
      <header className="noir-header">
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <button className="sound-toggle" onClick={onBackToMenu} title="Powrót do menu">
            <ArrowLeft size={16} />
          </button>
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="noir-header__title">
              {caseData.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="noir-header__subtitle">
              {caseData.subtitle}
            </motion.p>
          </div>
        </div>
        <div style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
          <button className="sound-toggle" onClick={handleMuteToggle} title={muted ? 'Włącz dźwięk' : 'Wycisz'}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="noir-header__badge">
            <div className="noir-header__badge-dot" />
            <span className="noir-header__badge-text">{currentRoom.name}</span>
          </motion.div>
        </div>
      </header>

      <main className="noir-main">
        <div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentRoom.name}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel scene-panel"
            >
              <div>
                <p className="scene-description">{currentRoom.description}</p>
                <div className="actions-grid">
                  {(currentRoom.nodes || []).map((node) => {
                    const Icon = IconMap[node.icon] || Search;
                    return (
                      <button key={node.id} onClick={() => node.target ? handleMove(node.target) : handleAction(node.action)} className="btn-noir">
                        <span className="btn-noir__content"><Icon size={16} className="btn-noir__icon" /><span>{node.label}</span></span>
                        <ChevronRight size={14} className="btn-noir__chevron" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="inventory-bar">
                <div className="inventory-bar__label">Ekwipunek ({safeInventory.length})</div>
                <div className="inventory-bar__items">
                  {safeInventory.length === 0 && <p className="inventory-bar__empty">Brak dowodów w kieszeni...</p>}
                  {safeInventory.map(({ key, data }) => {
                    const Icon = IconMap[data.icon] || Settings;
                    const isSelected = selectedItem === key;
                    return (
                      <ItemTooltip key={key} data={data} isSelected={isSelected} onClick={() => handleItemClick(key)}>
                        <button className={`inventory-slot ${isSelected ? 'active' : ''}`}>
                          <Icon size={22} className="inventory-slot__icon" />
                        </button>
                      </ItemTooltip>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="sidebar-column">
          <div className="glass-panel log-panel">
            <h2 className="log-panel__header"><FileText size={14} /> Dziennik Śledztwa</h2>
            <div className="log-panel__entries">
              {logs.map((log, i) => (
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} key={`log-${i}`} className={`log-entry ${i === 0 ? 'log-entry--latest' : ''}`}>
                  <span className="log-entry__dash">—</span>{log}
                </motion.p>
              ))}
            </div>
            {selectedItem && caseData.items[selectedItem] && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="evidence-card">
                <div className="evidence-card__badge">
                  <span className="evidence-card__badge-label">Wybrany dowód</span>
                  <div className="evidence-card__badge-icon"><Zap size={10} style={{color: 'var(--accent-amber)'}} /></div>
                </div>
                <p className="evidence-card__name">{caseData.items[selectedItem].name}</p>
                <p className="evidence-card__desc">{caseData.items[selectedItem].desc}</p>
                <div className="evidence-card__hint">
                  <p className="evidence-card__hint-label">Wskazówka</p>
                  <p className="evidence-card__hint-text">Kliknij inny przedmiot, by połączyć, lub akcję w pokoju.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showCodepad && <CodepadModal type={showCodepad} onSubmit={handleCodeSubmit} onClose={() => setShowCodepad(null)} />}
      </AnimatePresence>

      <footer className="noir-footer">
        <p className="noir-footer__text">© 1947 Blackwood Investigations</p>
        <div className="noir-footer__divider" />
      </footer>
    </div>
  );
}

/* ============================================
   APP ROOT
   ============================================ */
function App() {
  const [activeCase, setActiveCase] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  if (showIntro) {
    return <IntroScreen onDismiss={() => setShowIntro(false)} />;
  }

  if (showEditor) {
    return <CaseEditor onBack={() => setShowEditor(false)} onTestCase={(c) => { setShowEditor(false); setActiveCase(c); }} />;
  }

  if (!activeCase) {
    return <MainMenu onSelectCase={setActiveCase} onOpenEditor={() => setShowEditor(true)} />;
  }

  return <GameScreen key={activeCase.id} caseData={activeCase} onBackToMenu={() => setActiveCase(null)} />;
}

export default App;
