import React, { useState } from "react";
import { 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Users, 
  PhoneOff,
  Search,
  Tag,
  Volume2,
  Headphones
} from "lucide-react";

// --- DATOS MOCKUP (Solo llamadas) ---
const initialCalls = [
  { id: 101, time: "Hace 2s", phone: "618-123-XXXX", score: 92, status: "active", type: "Violencia", location: "Centro Histórico", transcript: "...está golpeando la puerta, tiene un cuchillo, ayuda...", aiResponse: "Patrón de estrés extremo confirmado.", keywords: ["Cuchillo", "Golpeando", "Ayuda"], voiceStatus: "Agitada / Gritos", audioLevel: "high" },
  { id: 102, time: "Hace 15s", phone: "618-555-XXXX", score: 45, status: "gray_zone", type: "Incierto", location: "Jardines de Durango", transcript: "(Silencio)... (Ruido de viento)... (Respiración agitada)...", aiResponse: "Posible situación de coacción detectada.", keywords: ["Silencio Positivo", "Viento"], voiceStatus: "Susurros / Silencio", audioLevel: "low" },
  { id: 103, time: "Hace 40s", phone: "618-333-XXXX", score: 15, status: "discard", type: "Broma", location: "Escuela Secundaria 4", transcript: "Jajaja, oiga, ¿a qué hora pasan por la basura? Jajaja...", aiResponse: "Incoherencia semántica detectada.", keywords: ["Risas", "Basura"], voiceStatus: "Risas / Normal", audioLevel: "med" },
];

// --- COMPONENTES AUXILIARES ---
const ScoreGauge = ({ score }) => {
  const color = score > 70 ? "#ef4444" : score > 30 ? "#eab308" : "#22c55e";
  return (
    <div style={{ position: 'relative', width: '120px', height: '60px', display: 'flex', justifyContent: 'center' }}>
       <svg viewBox="0 0 100 50" width="100%" height="100%">
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray="126" strokeDashoffset={126 - (score / 100) * 126} style={{ transition: 'stroke-dashoffset 1s ease' }} />
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
      <div key={i} style={{ width: '4px', backgroundColor: '#3b82f6', borderRadius: '2px', height: level === 'high' ? `${Math.random() * 100}%` : '30%', transition: 'height 0.1s ease' }} />
    ))}
  </div>
);

// --- COMPONENTE PRINCIPAL (Solo Centro de Mando) ---
export default function CentroMando() {
  const [selectedCall, setSelectedCall] = useState(initialCalls[0]);

  return (
    /* Usamos directamente el Grid global definido en App.css */
    <div className="dashboard-grid">
      
      {/* 1. COLUMNA IZQUIERDA: LISTA DE LLAMADAS */}
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
              <button className="icon-btn red" style={{ width: '100%', padding: '4px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); alert(`Colgando llamada ${call.phone}`); }}>
                  <PhoneOff size={12}/> Colgar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. COLUMNA CENTRAL: DETALLE (COCKPIT) */}
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

      {/* 3. COLUMNA DERECHA: SIDEBAR (ZONA GRIS Y HERRAMIENTAS) */}
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
  );
}