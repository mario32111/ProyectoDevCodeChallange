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
  Clock,
  Headphones,
  Phone,
  Radio
} from "lucide-react";

// --- DATOS MOCKUP ---
const initialCalls = [
  { id: 101, time: "Hace 2s", phone: "618-123-XXXX", score: 92, status: "active", type: "Violencia", location: "Centro Histórico", transcript: "...está golpeando la puerta, tiene un cuchillo, ayuda...", aiResponse: "Patrón de estrés extremo confirmado.", keywords: ["Cuchillo", "Golpeando", "Ayuda"], voiceStatus: "Agitada / Gritos", audioLevel: "high" },
  { id: 102, time: "Hace 15s", phone: "618-555-XXXX", score: 45, status: "gray_zone", type: "Incierto", location: "Jardines de Durango", transcript: "(Silencio)... (Ruido de viento)... (Respiración agitada)...", aiResponse: "Posible situación de coacción detectada.", keywords: ["Silencio Positivo", "Viento"], voiceStatus: "Susurros / Silencio", audioLevel: "low" },
  { id: 103, time: "Hace 40s", phone: "618-333-XXXX", score: 15, status: "discard", type: "Broma", location: "Escuela Secundaria 4", transcript: "Jajaja, oiga, ¿a qué hora pasan por la basura? Jajaja...", aiResponse: "Incoherencia semántica detectada.", keywords: ["Risas", "Basura"], voiceStatus: "Risas / Normal", audioLevel: "med" },
];

// --- COMPONENTES AUXILIARES ---
const ScoreGauge = ({ score }) => {
  const color = score > 70 ? "#ef4444" : score > 30 ? "#eab308" : "#22c55e";
  return (
    <div style={{ position: 'relative', width: '100px', height: '50px', display: 'flex', justifyContent: 'center' }}>
       <svg viewBox="0 0 100 50" width="100%" height="100%">
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray="126" strokeDashoffset={126 - (score / 100) * 126} style={{ transition: 'stroke-dashoffset 1s ease' }} />
       </svg>
       <div style={{ position: 'absolute', bottom: '-5px', textAlign: 'center' }}>
         <span style={{ fontSize: '1.4rem', fontWeight: '800', color: color, lineHeight: 1 }}>{score}</span>
         <div style={{ fontSize: '0.5rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>RIESGO</div>
       </div>
    </div>
  );
};

const AudioWave = ({ level }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '24px' }}>
    {[...Array(12)].map((_, i) => (
      <div key={i} className="wave-bar" style={{ 
          width: '3px', backgroundColor: level === 'high' ? '#ef4444' : '#3b82f6', borderRadius: '2px', 
          height: level === 'high' ? '100%' : '40%', 
          animationDelay: `${i * 0.05}s` 
      }} />
    ))}
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function CentroMando() {
  const [selectedCall, setSelectedCall] = useState(initialCalls[0]);

  // Estilos
  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', fontFamily: 'Inter, sans-serif' },
    
    topSection: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' },
    bottomSection: { display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px', flexGrow: 1 },

    cardBase: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' },

    callCard: (isActive, score) => ({
      background: isActive ? '#eff6ff' : 'white',
      border: isActive ? '1px solid #3b82f6' : '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      boxShadow: isActive ? '0 10px 15px -3px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
    }),

    actionBtn: (type) => ({
      width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: '600',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s',
      background: type === 'hangup' ? '#fee2e2' : '#f1f5f9',
      color: type === 'hangup' ? '#ef4444' : '#475569',
    }),

    label: { fontSize: '0.7rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* CSS Animaciones */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }

        @keyframes pulse-live { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
        .live-indicator { animation: pulse-live 1.5s infinite ease-in-out; }

        @keyframes wave { 0%, 100% { height: 30%; } 50% { height: 100%; } }
        .wave-bar { animation: wave 0.8s ease-in-out infinite; }

        /* NUEVA ANIMACIÓN DE PULSO GRIS */
        @keyframes pulse-gray {
          0% { box-shadow: 0 0 0 0 rgba(100, 116, 139, 0.4); } /* Color Gris */
          70% { box-shadow: 0 0 0 6px rgba(100, 116, 139, 0); }
          100% { box-shadow: 0 0 0 0 rgba(100, 116, 139, 0); }
        }
        .pulse-monitoring { animation: pulse-gray 2s infinite; }

        /* Onda de audio gris para la zona de monitoreo */
        @keyframes wave-mini { 0%, 100% { height: 4px; } 50% { height: 12px; } }
        .wave-bar-gray { width: 3px; background: #64748b; border-radius: 1px; animation: wave-mini 1s ease-in-out infinite; }

        .call-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08); border-color: #cbd5e1; }
        .btn-hover:hover { filter: brightness(0.95); transform: scale(1.02); }
      `}</style>

      {/* --- SECCIÓN SUPERIOR: ENTRANTES --- */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
          <div style={{ background: '#ef4444', padding: '6px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(239,68,68,0.3)' }}>
             <Phone size={20} color="white" />
          </div>
          <div>
             <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>Llamadas Entrantes</h3>
             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold' }}>
               <span className="live-indicator" style={{ width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%' }}></span>
               SISTEMA EN VIVO
             </div>
          </div>
        </div>

        <div style={styles.topSection}>
          {initialCalls.map((call, idx) => (
            <div 
              key={call.id}
              onClick={() => setSelectedCall(call)}
              style={styles.callCard(selectedCall.id === call.id, call.score)}
              className="call-card-hover"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                 <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>{call.phone}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                       <Clock size={14} /> {call.time}
                    </div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: call.score > 70 ? '#ef4444' : '#eab308' }}>{call.score}%</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8' }}>SCORE</div>
                 </div>
              </div>

              {/* Badges (Zona Gris ahora es gris) */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                 {call.type === 'Violencia' && <span style={{ background:'#fee2e2', color:'#b91c1c', padding:'4px 8px', borderRadius:'6px', fontSize:'0.7rem', fontWeight:'bold' }}>VIOLENCIA</span>}
                 {/* CAMBIO AQUÍ: Badge de Zona Gris en tonos Grises */}
                 {call.status === 'gray_zone' && <span style={{ background:'#f3f4f6', color:'#4b5563', padding:'4px 8px', borderRadius:'6px', fontSize:'0.7rem', fontWeight:'bold', border: '1px solid #e5e7eb' }}>ZONA GRIS</span>}
              </div>

              <button style={styles.actionBtn('hangup')} className="btn-hover" onClick={(e) => { e.stopPropagation(); alert('Colgando...'); }}>
                 <PhoneOff size={16} /> Colgar Llamada
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div style={styles.bottomSection}>
        
        {/* IZQUIERDA: DETALLE DE LLAMADA (Intacto) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ ...styles.cardBase, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
                 <div>
                    <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{selectedCall.phone}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginTop: '5px' }}>
                       <MapPin size={18} /> {selectedCall.location}
                    </div>
                 </div>
                 <ScoreGauge score={selectedCall.score} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                 <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                    <div style={styles.label}><Volume2 size={14}/> ANÁLISIS DE VOZ</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <AudioWave level={selectedCall.audioLevel} />
                       <div style={{ fontWeight: 'bold', color: '#334155' }}>{selectedCall.voiceStatus}</div>
                    </div>
                 </div>
                 <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
                    <div style={styles.label}><Tag size={14}/> PALABRAS CLAVE</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                       {selectedCall.keywords.map((k, i) => (
                          <span key={i} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{k}</span>
                       ))}
                    </div>
                 </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '20px' }}>
                 <div style={{ ...styles.label, color: '#1e40af' }}><Activity size={14}/> DIAGNÓSTICO IA EN TIEMPO REAL</div>
                 <div style={{ color: '#1e3a8a', fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedCall.aiResponse}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                 <button className="btn-hover" style={{ flex: 1, background: selectedCall.score > 70 ? '#ef4444' : '#eab308', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    {selectedCall.score > 70 ? 'DESPACHAR UNIDAD (S.O.S)' : 'MANTENER EN OBSERVACIÓN'}
                 </button>
                 <button className="btn-hover" style={{ flex: 1, background: 'white', border: '2px solid #e2e8f0', color: '#64748b', padding: '14px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    DESCARTAR EVENTO
                 </button>
              </div>
           </div>

           <div style={{ ...styles.cardBase, padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={styles.label}>TRANSCRIPCIÓN EN VIVO</div>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', color: '#334155', fontStyle: 'italic', lineHeight: '1.6', flexGrow: 1 }}>
                 "{selectedCall.transcript}"
              </div>
           </div>
        </div>

        {/* DERECHA: ZONA GRIS Y HERRAMIENTAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           
           {/* ZONA GRIS (Color Gris - Neutral) */}
           {/* Cambio de fondo amarillo (#fffbeb) a gris muy claro (#f9fafb) y bordes grises */}
           <div style={{ ...styles.cardBase, background: '#f9fafb', border: '1px solid #e5e7eb' }}>
              <div style={{ padding: '20px 20px 10px 20px' }}>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#374151', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Icono Gris con Pulso Gris */}
                    <div className="pulse-monitoring" style={{ background: '#e5e7eb', padding: '6px', borderRadius: '50%' }}>
                        <Radio size={16} color="#4b5563"/>
                    </div>
                    Zona Gris Activa
                 </h3>
                 <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '5px' }}>3 llamadas en monitoreo silencioso.</p>
              </div>

              <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {[1, 2, 3].map((n, i) => (
                    <div key={n} className="btn-hover" style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #f3f4f6' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: '#475569' }}>618-22-00{n}</span>
                          {/* Mini visualizador de audio GRIS */}
                          <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px' }}>
                             <div className="wave-bar-gray" style={{ animationDelay: `${i*0.1}s` }}></div>
                             <div className="wave-bar-gray" style={{ animationDelay: `${i*0.2}s` }}></div>
                             <div className="wave-bar-gray" style={{ animationDelay: `${i*0.3}s` }}></div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ ...styles.actionBtn(), background: '#f3f4f6', color: '#4b5563', padding: '6px', fontSize: '0.75rem' }}><Headphones size={14}/> Monitor</button>
                          <button style={{ ...styles.actionBtn(), background: '#fef2f2', color: '#ef4444', padding: '6px', fontSize: '0.75rem' }}><PhoneOff size={14}/> Cortar</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* HERRAMIENTAS */}
           <div style={{ ...styles.cardBase, padding: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: 'bold', color: '#1e293b' }}>Herramientas Rápidas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <button className="btn-hover" style={{ ...styles.actionBtn(), border: '1px solid #e2e8f0', background: 'white', justifyContent: 'flex-start', padding: '12px' }}>
                    <PhoneOff size={16}/> Colgar Masivas (Zona Gris)
                 </button>
                 <button className="btn-hover" style={{ ...styles.actionBtn(), border: '1px solid #e2e8f0', background: 'white', justifyContent: 'flex-start', padding: '12px' }}>
                    <Search size={16}/> Búsqueda Avanzada
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}