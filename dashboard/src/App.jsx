import React, { useState } from "react";
// Al inicio de tu archivo:
import mapaImg from './assets/img/mapa-incidencia.png'; // Ajusta la ruta según donde la guardaste
import { 
  Phone, 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  Users, 
  Mic, 
  PhoneOff,
  Search,
  Bell,
  TrendingUp,
  Tag,
  Volume2,
  Headphones,
  FileText, // Icono para reportes
  Clock,
  AlertCircle
} from "lucide-react";

// --- ESTILOS CSS (INTEGRADOS) ---
const styles = `
:root {
  --bg-color: #f1f5f9;
  --card-bg: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --color-bajo: #22c55e;
  --color-medio: #eab308;
  --color-alto: #f97316;
  --color-maximo: #ef4444;
}

body {
  background-color: var(--bg-color);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #0f172a;
  gap: 10px;
}

.nav-buttons { display: flex; gap: 10px; }
.nav-btn {
  background: none; border: none; font-size: 0.95rem; font-weight: 600;
  color: var(--text-secondary); padding: 10px 20px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px;
}
.nav-btn:hover { background-color: #f1f5f9; color: #2563eb; }
.nav-btn.active { background-color: #2563eb; color: white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }

/* Grids */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
.stats-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}
.reports-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* Cards */
.card {
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}
.card.highlight { border-top: 4px solid #3b82f6; }

/* Lista de Llamadas */
.call-item {
  padding: 15px;
  border-radius: 12px;
  background: white;
  border: 1px solid #f1f5f9;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 10px;
  position: relative; 
}
.call-item:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.call-item.selected { background-color: #eff6ff; border-color: #bfdbfe; }
.border-red { border-left-color: var(--color-maximo); }
.border-orange { border-left-color: var(--color-alto); }
.border-yellow { border-left-color: var(--color-medio); }
.border-green { border-left-color: var(--color-bajo); }

/* Badges & Chat */
.badge { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
.badge.gray { background: #fef9c3; color: #854d0e; }
.badge.live { background: #dbeafe; color: #1e40af; }

.transcript-box {
  background: #f8fafc; border-radius: 12px; padding: 15px; flex-grow: 1;
  overflow-y: auto; border: 1px solid #e2e8f0; display: flex; flex-direction: column;
  gap: 10px; min-height: 200px;
}
.chat-bubble { padding: 10px 14px; border-radius: 10px; font-size: 0.9rem; max-width: 90%; line-height: 1.4; }
.chat-bubble.user { background: white; border: 1px solid #e2e8f0; align-self: flex-start; color: #334155; }

/* Nueva Sección de Análisis (Contexto) */
.analysis-panel {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 15px; margin-bottom: 15px;
}
.analysis-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
}
.info-block {
  background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;
}
.info-label {
  font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase;
  margin-bottom: 8px; display: flex; align-items: center; gap: 5px;
}
.keyword-tag {
  display: inline-flex; align-items: center; gap: 4px;
  background: #fee2e2; color: #991b1b; font-size: 0.75rem; font-weight: 700;
  padding: 4px 8px; border-radius: 4px; margin-right: 5px; border: 1px solid #fecaca;
}
.ai-diagnosis {
  font-size: 0.85rem; color: #334155; line-height: 1.4; font-weight: 500;
  border-left: 3px solid #3b82f6; padding-left: 10px;
}

/* Botones de Acción (Sidebar y Lista) */
.action-row {
  display: flex; gap: 5px; margin-top: 10px;
}
.icon-btn {
  border: 1px solid #e2e8f0; background: white; border-radius: 6px;
  padding: 6px 10px; font-size: 0.75rem; font-weight: 600; color: #475569;
  cursor: pointer; display: flex; align-items: center; gap: 5px; flex: 1; justify-content: center;
  transition: all 0.1s;
}
.icon-btn:hover { background: #f1f5f9; color: #1e293b; border-color: #cbd5e1; }
.icon-btn.red:hover { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
.icon-btn.blue:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }

/* KPIs */
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.metric-value { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 5px 0; }
.metric-label { font-size: 0.85rem; color: #64748b; font-weight: 600; }

/* Nueva Sección Estadística (Tipología) */
.stat-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid #f1f5f9;
}
.stat-row:last-child { border-bottom: none; }
.stat-label { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #475569; }
.stat-dot { width: 10px; height: 10px; border-radius: 50%; }
.stat-val { font-weight: 800; color: #1e293b; }

.donut-container {
  position: relative; width: 180px; height: 180px; margin: 0 auto 20px auto;
  border-radius: 50%;
  background: conic-gradient(#ef4444 0% 52%, #f97316 52% 72%, #3b82f6 72% 86%, #e2e8f0 86% 100%);
  display: flex; justify-content: center; align-items: center;
}
.donut-inner {
  width: 140px; height: 140px; background: white; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}

/* Estilos para Tablas de Reportes */
.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.data-table th { text-align: left; padding: 10px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 0.8rem; text-transform: uppercase; }
.data-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }
.data-table tr:last-child td { border-bottom: none; }
.trend-up { color: #ef4444; font-weight: bold; font-size: 0.8rem; }
.trend-down { color: #22c55e; font-weight: bold; font-size: 0.8rem; }
.report-metric-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
.report-metric-val { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
.report-metric-desc { font-size: 0.8rem; color: #64748b; }
`;

// --- DATOS MOCKUP ---
const initialCalls = [
  { 
    id: 101, 
    time: "Hace 2s", 
    phone: "618-123-XXXX", 
    score: 92, 
    status: "active", 
    type: "Violencia", 
    location: "Centro Histórico", 
    transcript: "...está golpeando la puerta, tiene un cuchillo, ayuda...", 
    aiResponse: "Patrón de estrés extremo confirmado.",
    keywords: ["Cuchillo", "Golpeando", "Ayuda"],
    voiceStatus: "Agitada / Gritos",
    audioLevel: "high" 
  },
  { 
    id: 102, 
    time: "Hace 15s", 
    phone: "618-555-XXXX", 
    score: 45, 
    status: "gray_zone", 
    type: "Incierto", 
    location: "Jardines de Durango", 
    transcript: "(Silencio)... (Ruido de viento)... (Respiración agitada)...", 
    aiResponse: "Posible situación de coacción detectada.",
    keywords: ["Silencio Positivo", "Viento"],
    voiceStatus: "Susurros / Silencio",
    audioLevel: "low" 
  },
  { 
    id: 103, 
    time: "Hace 40s", 
    phone: "618-333-XXXX", 
    score: 15, 
    status: "discard", 
    type: "Broma", 
    location: "Escuela Secundaria 4", 
    transcript: "Jajaja, oiga, ¿a qué hora pasan por la basura? Jajaja...", 
    aiResponse: "Incoherencia semántica detectada.",
    keywords: ["Risas", "Basura"],
    voiceStatus: "Risas / Normal",
    audioLevel: "med" 
  },
];

const statsData = {
  totalCalls: 2150,
  real: 301, 
  fake: 1849, 
  savedMoney: "$924,500 MXN", 
};

const reportData = [
  { zona: "Centro Histórico", incidentes: 450, tipo: "Robo / Altercado", trend: "+12%" },
  { zona: "Villas del Guadiana", incidentes: 320, tipo: "Violencia Doméstica", trend: "+8%" },
  { zona: "Jardines de Durango", incidentes: 180, tipo: "Accidente Vial", trend: "-2%" },
  { zona: "Domingo Arrieta", incidentes: 115, tipo: "Ruido / Fiesta", trend: "0%" },
];

// --- COMPONENTES AUXILIARES ---

const ScoreGauge = ({ score }) => {
  const color = score > 70 ? "#ef4444" : score > 30 ? "#eab308" : "#22c55e";
  return (
    <div style={{ position: 'relative', width: '120px', height: '60px', display: 'flex', justifyContent: 'center' }}>
       <svg viewBox="0 0 100 50" width="100%" height="100%">
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
         <path 
           d="M 10 50 A 40 40 0 0 1 90 50" 
           fill="none" 
           stroke={color} 
           strokeWidth="8" 
           strokeLinecap="round"
           strokeDasharray="126"
           strokeDashoffset={126 - (score / 100) * 126}
           style={{ transition: 'stroke-dashoffset 1s ease' }}
         />
       </svg>
       <div style={{ position: 'absolute', bottom: '0', textAlign: 'center' }}>
         <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{score}</span>
         <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 'bold' }}>RIESGO</div>
       </div>
    </div>
  );
};

const AudioWave = ({ level }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        width: '4px',
        backgroundColor: '#3b82f6',
        borderRadius: '2px',
        height: level === 'high' ? `${Math.random() * 100}%` : '30%',
        transition: 'height 0.1s ease'
      }} />
    ))}
  </div>
);

const DurangoHeatmap = () => (
  <div style={{ 
    background: '#e2e8f0', height: '300px', borderRadius: '12px', position: 'relative', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    <div style={{ width: '120px', height: '120px', background: 'red', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6, position: 'absolute', top: '30%', left: '40%' }}></div>
    <div style={{ width: '80px', height: '80px', background: 'orange', borderRadius: '50%', filter: 'blur(30px)', opacity: 0.5, position: 'absolute', bottom: '30%', left: '25%' }}></div>
    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      📍 Mapa de Calor: Durango
    </div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  const [activeTab, setActiveTab] = useState("emergencias");
  const [selectedCall, setSelectedCall] = useState(initialCalls[0]);

  return (
    <div className="container">
      <style>{styles}</style>
      
      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <div style={{ background: '#2563eb', padding: '6px', borderRadius: '6px', color: 'white', display: 'flex' }}>
            <Activity size={20} />
          </div>
          <div>SECURITY <span style={{ color: '#2563eb' }}>ACTION IA</span></div>
        </div>

        <nav className="nav-buttons">
          <button onClick={() => setActiveTab("emergencias")} className={`nav-btn ${activeTab === "emergencias" ? "active" : ""}`}>
            <Phone size={18} /> Centro de Mando
          </button>
          <button onClick={() => setActiveTab("estadisticas")} className={`nav-btn ${activeTab === "estadisticas" ? "active" : ""}`}>
            <BarChart3 size={18} /> Inteligencia C5
          </button>
          <button onClick={() => setActiveTab("reportes")} className={`nav-btn ${activeTab === "reportes" ? "active" : ""}`}>
            <FileText size={18} /> Reportes
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Bell size={20} color="#64748b" />
           <div style={{ width: '32px', height: '32px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569' }}>OP</div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main>
        {activeTab === "emergencias" && (
          <div className="dashboard-grid">
            
            {/* 1. LISTA DE LLAMADAS */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>Entrantes</h3>
                <span className="badge live">LIVE</span>
              </div>
              
              {initialCalls.map((call) => (
                <div 
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className={`call-item ${selectedCall.id === call.id ? 'selected' : ''} ${
                    call.score > 70 ? 'border-red' : call.score > 30 ? 'border-yellow' : 'border-green'
                  }`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{call.phone}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{call.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#64748b' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: call.score > 70 ? '#ef4444' : '#eab308' }}></div>
                        Score: {call.score}
                     </div>
                     {call.status === 'gray_zone' && <span className="badge gray">ZONA GRIS</span>}
                  </div>
                  
                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '8px', paddingTop: '8px' }}>
                    <button 
                        className="icon-btn red" 
                        style={{ width: '100%', padding: '4px', fontSize: '0.75rem' }}
                        onClick={(e) => { e.stopPropagation(); alert(`Colgando llamada ${call.phone}`); }}
                    >
                        <PhoneOff size={12}/> Colgar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DETALLE (COCKPIT) */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
              <div className="card highlight">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                   <div>
                      <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#1e293b' }}>{selectedCall.phone}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.9rem' }}>
                         <MapPin size={16} /> {selectedCall.location}
                      </div>
                   </div>
                   <ScoreGauge score={selectedCall.score} />
                </div>

                <div className="analysis-grid">
                  <div className="info-block">
                    <div className="info-label"><Volume2 size={14}/> Biometría de Voz</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <AudioWave level={selectedCall.audioLevel} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: selectedCall.score > 70 ? '#ef4444' : '#64748b' }}>
                        {selectedCall.voiceStatus}
                      </span>
                    </div>
                  </div>

                  <div className="info-block">
                    <div className="info-label"><Tag size={14}/> Palabras Clave</div>
                    <div>
                      {selectedCall.keywords.map((kw, idx) => (
                        <span key={idx} className="keyword-tag">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '15px', background: '#eff6ff', padding: '10px', borderRadius: '8px' }}>
                  <div className="info-label" style={{ color: '#1e40af' }}><Activity size={14}/> Diagnóstico IA en Vivo</div>
                  <div className="ai-diagnosis">
                    {selectedCall.aiResponse}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                   {selectedCall.score > 70 ? (
                        <button style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>DESPACHAR UNIDAD</button>
                      ) : selectedCall.score > 30 ? (
                        <button style={{ flex: 1, background: '#eab308', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>MANTENER EN ZONA GRIS</button>
                      ) : (
                        <button style={{ flex: 1, background: '#cbd5e1', color: '#475569', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>DESCARTAR</button>
                   )}
                </div>
              </div>

              <div className="card" style={{ flexGrow: 1 }}>
                <div className="transcript-box">
                   <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', position: 'sticky', top: 0 }}>Transcripción de Audio</div>
                   <div className="chat-bubble user">
                      <Users size={14} style={{ display: 'inline', marginRight: '5px' }} />
                      {selectedCall.transcript}
                   </div>
                </div>
              </div>
            </div>

            {/* 3. SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div className="card" style={{ background: '#fefce8', borderColor: '#fef08a' }}>
                  <h3 style={{ fontSize: '1rem', color: '#854d0e', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <AlertTriangle size={18} /> Zona Gris Activa
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#a16207', marginBottom: '15px' }}>
                     3 llamadas en monitoreo silencioso.
                  </div>
                  {[1,2,3].map(i => (
                     <div key={i} style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #fef08a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: '#475569' }}>618-22-00{i}</span>
                            <span style={{ fontSize: '0.7rem', color: '#ca8a04', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>ESCUCHANDO...</span>
                        </div>
                        <div className="action-row">
                            <button className="icon-btn blue"><Headphones size={14}/> Escuchar</button>
                            <button className="icon-btn red"><PhoneOff size={14}/> Colgar</button>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 15px 0' }}>Herramientas</h3>
                  <button style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', marginBottom: '10px', cursor: 'pointer' }}>
                     <PhoneOff size={16}/> Colgar Masivas
                  </button>
                  <button style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', cursor: 'pointer' }}>
                     <Search size={16}/> Buscar Registro
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* VISTA 2: ESTADÍSTICAS (Sin Ahorro) */}
        {activeTab === "estadisticas" && (
          <div>
            <div className="kpi-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
               <div className="card">
                  <div className="metric-label">Total Llamadas</div>
                  <div className="metric-value">{statsData.totalCalls}</div>
                  <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>↑ 12% vs ayer</div>
               </div>
               <div className="card">
                  <div className="metric-label">Llamadas Falsas</div>
                  <div className="metric-value" style={{ color: '#ef4444' }}>{statsData.fake}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>86% del total</div>
               </div>
               <div className="card">
                  <div className="metric-label" style={{color: '#3b82f6'}}>Emergencias Reales</div>
                  <div className="metric-value" style={{ color: '#2563eb' }}>{statsData.real}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>14% filtrado exitoso</div>
               </div>
            </div>

            <div className="stats-grid">
               <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                     <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Mapa de Incidencia</h3>
                     <select style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: '6px', color: '#475569' }}>
                        <option>Tiempo Real</option>
                        <option>Histórico</option>
                     </select>
                  </div>
                  <img 
                    src={mapaImg} 
                    alt="Mapa de la zona" 
                    style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px',
                        objectFit: 'cover' 
                    }} 
                  />
                  
               
               </div>

               <div className="card">
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>Tipología de Llamadas</h3>
                  
                  <div className="donut-container">
                    <div className="donut-inner">
                      <span style={{fontSize: '2rem', fontWeight: '800', color: '#1e293b'}}>86%</span>
                      <span style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold'}}>IMPROCEDENTES</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div className="stat-row">
                      <div className="stat-label"><div className="stat-dot" style={{background: '#e2e8f0'}}></div> Llamadas Mudas</div>
                      <div className="stat-val">52%</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label"><div className="stat-dot" style={{background: '#ef4444'}}></div> Bromas</div>
                      <div className="stat-val">20%</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label"><div className="stat-dot" style={{background: '#3b82f6'}}></div> Otros</div>
                      <div className="stat-val">14%</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <TrendingUp size={18} color="#2563eb" />
                    <span style={{ fontSize: '0.8rem', color: '#1e40af' }}>Sugerencia de aumento de personal para fin de semana.</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* VISTA 3: REPORTES TÉCNICOS (NUEVA) */}
        {activeTab === "reportes" && (
          <div className="reports-grid">
            
            {/* Tabla Principal */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>Zonas de Alto Riesgo (Top 10)</h3>
                <button style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <Clock size={14}/> Últimos 30 Días
                </button>
              </div>
              
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zona / Colonia</th>
                    <th>Total Incidentes</th>
                    <th>Tipo Frecuente</th>
                    <th>Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 'bold', color: '#334155' }}>{row.zona}</div>
                      </td>
                      <td>{row.incidentes}</td>
                      <td><span style={{background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem'}}>{row.tipo}</span></td>
                      <td>
                        <span className={row.trend.includes('+') ? 'trend-up' : 'trend-down'}>
                          {row.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sidebar Métricas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px' }}>Métricas Operativas</h3>
                
                <div className="report-metric-box">
                  <div className="report-metric-val">3m 12s</div>
                  <div className="report-metric-desc">Tiempo Promedio de Respuesta</div>
                </div>
                
                <div className="report-metric-box">
                  <div className="report-metric-val" style={{color: '#ef4444'}}>18:00 - 20:00</div>
                  <div className="report-metric-desc">Hora Pico de Llamadas Falsas</div>
                </div>

                <div className="report-metric-box">
                  <div className="report-metric-val" style={{color: '#3b82f6'}}>1.2%</div>
                  <div className="report-metric-desc">Tasa de Abandono (Mejorado)</div>
                </div>
              </div>

              <div className="card" style={{ background: '#fff7ed', borderColor: '#ffedd5' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                  <AlertCircle size={20} color="#c2410c" />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#9a3412', marginBottom: '5px' }}>Alerta de Patrón</div>
                    <div style={{ fontSize: '0.85rem', color: '#c2410c' }}>
                      Se detecta un incremento del 15% en bromas provenientes de la zona escolar "Lomas del Parque" entre 2pm y 3pm.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}