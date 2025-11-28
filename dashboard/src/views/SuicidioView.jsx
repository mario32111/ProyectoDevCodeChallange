import React from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Phone,
  ShieldAlert
} from "lucide-react";

export default function SuicidioView() {
  
  // --- ESTILOS VISUALES (Inline) ---
  const styles = {
    container: { padding: '24px', backgroundColor: '#fdf2f8', minHeight: '100vh', fontFamily: 'sans-serif' },
    
    // Header
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #fbcfe8' },
    title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#831843', margin: 0 },
    subtitle: { fontSize: '0.9rem', color: '#be185d', margin: 0 },
    
    // Grid KPI
    gridCards: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '24px', 
      marginBottom: '30px' 
    },
    
    // Tarjetas
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #fce7f3',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'all 0.3s ease'
    },
    
    // Bordes de Color
    cardPink: { borderLeft: '6px solid #db2777' },
    cardOrange: { borderLeft: '6px solid #f97316' },
    cardGreen: { borderLeft: '6px solid #10b981' },

    // Elementos de Texto
    labelBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    labelText: { fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9d174d' },
    bigNumber: { fontSize: '2.25rem', fontWeight: '800', color: '#831843', margin: '10px 0', lineHeight: 1 },
    
    iconBox: (bg, color) => ({ padding: '8px', borderRadius: '8px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    
    pill: (bg, color, border) => ({
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '0.75rem', fontWeight: 'bold',
      padding: '6px 12px', borderRadius: '999px',
      background: bg, color: color, border: `1px solid ${border}`,
      width: 'fit-content'
    }),

    sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#831843', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    contentBox: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #fce7f3', marginBottom: '20px' }
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* --- ANIMACIONES CSS --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }

        .hover-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(219, 39, 119, 0.15); }

        /* Pulso Verde (IA) */
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .radar-pulse { animation: pulse-green 2s infinite; }
        
        /* Pulso Hotspot (Mapa) */
        @keyframes pulse-hotspot {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        .hotspot-anim { animation: pulse-hotspot 3s infinite ease-in-out; }

        .progress-bar { transition: width 1s ease-out; }
      `}</style>

      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.iconBox('#fce7f3', '#db2777')}>
          <Brain size={28} />
        </div>
        <div>
          <h2 style={styles.title}>Agente: Prevención de Suicidio y Crisis</h2>
          <p style={styles.subtitle}>Monitoreo psicosocial y predicción de riesgo en tiempo real</p>
        </div>
      </header>

      {/* --- TARJETAS KPI (SUPERIOR) --- */}
      <div style={styles.gridCards}>
        
        {/* 1. RIESGO HISTÓRICO */}
        <div style={{...styles.card, ...styles.cardPink}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={styles.labelText}>RIESGO HISTÓRICO (HOY)</p>
              <div style={{...styles.bigNumber}}>ALTO</div>
            </div>
            <div style={styles.iconBox('#fce7f3', '#db2777')}> <TrendingUp size={20} /> </div>
          </div>
          <div style={styles.pill('#fce7f3', '#be185d', '#fbcfe8')}>
            <AlertTriangle size={14} /> Factor: Invierno + Aislamiento
          </div>
        </div>

        {/* 2. ZONA DE RIESGO (Antes Hotspot) */}
        <div style={{...styles.card, ...styles.cardOrange}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              {/* CAMBIO DE TEXTO AQUÍ PARA MAYOR CLARIDAD */}
              <p style={{...styles.labelText, color: '#ea580c'}}>ZONA DE RIESGO DETECTADA</p>
              <div style={{...styles.bigNumber, fontSize: '1.8rem', marginTop: '10px', color: '#9a3412'}}>Puente Baluartito</div>
            </div>
            <div style={styles.iconBox('#ffedd5', '#ea580c')}> <MapPin size={20} /> </div>
          </div>
          <div style={styles.pill('#ffedd5', '#c2410c', '#fed7aa')}>
            <Activity size={14} /> 3 reportes en 48hrs
          </div>
        </div>

        {/* 3. VALIDACIÓN IA */}
        <div style={{...styles.card, ...styles.cardGreen}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={{...styles.labelText, color: '#15803d'}}>VALIDACIÓN IA</p>
              <div style={{...styles.bigNumber, display: 'flex', alignItems: 'center', gap: '10px', color: '#14532d'}}>
                ACTIVA
                <span className="radar-pulse" style={{height: '12px', width: '12px', background: '#22c55e', borderRadius: '50%'}}></span>
              </div>
            </div>
            <div style={styles.iconBox('#dcfce7', '#16a34a')}> <CheckCircle size={20} /> </div>
          </div>
          <div style={styles.pill('#dcfce7', '#15803d', '#bbf7d0')}>
            <Brain size={14} /> NLP analizando voz
          </div>
        </div>
      </div>

      {/* --- DASHBOARD INFERIOR --- */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: MAPA Y CORRELACIÓN */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          
          {/* MAPA DE CALOR */}
          <div style={styles.contentBox} className="hover-card">
            <h3 style={styles.sectionTitle}> <MapPin size={18} /> Mapa de Incidencia Psicológica </h3>
            
            <div style={{ height: '300px', background: '#e2e8f0', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#831843 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
              
              <p style={{color: '#831843', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '5px 10px', borderRadius: '5px'}}>
                 Visualización de Zonas de Riesgo
              </p>
              
              {/* Hotspot Animado */}
              <div style={{
                 position: 'absolute', top: '30%', left: '45%', 
                 width: '100px', height: '100px', 
                 background: '#db2777', borderRadius: '50%', filter: 'blur(35px)'
              }} className="hotspot-anim"></div>
            </div>
          </div>

          {/* MODELO DE CORRELACIÓN */}
          <div style={styles.contentBox} className="hover-card">
            <h3 style={styles.sectionTitle}> <TrendingUp size={18} /> Factores de Correlación Detectados </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '500'}}>
                <span>Estrés Económico</span> <span style={{color: '#db2777'}}>85% corr.</span>
              </div>
              <div style={{width: '100%', background: '#fce7f3', height: '10px', borderRadius: '5px', overflow: 'hidden'}}>
                <div className="progress-bar" style={{width: '85%', background: '#db2777', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>

            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '500'}}>
                <span>Aislamiento Social</span> <span style={{color: '#ea580c'}}>60% corr.</span>
              </div>
              <div style={{width: '100%', background: '#fff7ed', height: '10px', borderRadius: '5px', overflow: 'hidden'}}>
                <div className="progress-bar" style={{width: '60%', background: '#ea580c', height: '100%', borderRadius: '5px'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FEED EN VIVO */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={styles.contentBox}>
            <h3 style={styles.sectionTitle}> <Phone size={18} /> Análisis en Vivo </h3>

            {/* Alerta Roja */}
            <div style={{background: '#fdf2f8', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #db2777', marginBottom: '15px'}} className="hover-card">
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#be185d', marginBottom: '5px'}}>
                <span>LLAMADA #9921</span> <span>HACE 2m</span>
              </div>
              <p style={{fontSize: '0.9rem', margin: '5px 0', color: '#334155'}}> "Usuario menciona pastillas, voz letárgica..." </p>
              <div style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#be185d', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                 <ShieldAlert size={14}/> RIESGO INMINENTE
              </div>
            </div>

            {/* Alerta Gris */}
            <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #94a3b8'}} className="hover-card">
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px'}}>
                <span>LLAMADA #9920</span> <span>HACE 15m</span>
              </div>
              <p style={{fontSize: '0.9rem', margin: '5px 0', color: '#334155'}}> "Risas de fondo. Ubicación: Secundaria..." </p>
              <div style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b', marginTop: '8px'}}>
                 POSIBLE BROMA (89%)
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}