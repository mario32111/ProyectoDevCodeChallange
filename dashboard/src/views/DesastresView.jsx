import React from 'react';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Users, 
  AlertOctagon, 
  Map, 
  Radio, 
  Navigation,
  Waves
} from "lucide-react";

export default function DesastresView() {
  
  // --- ESTILOS VISUALES (Sin Tailwind) ---
  const styles = {
    container: { padding: '24px', backgroundColor: '#f0f9ff', minHeight: '100vh', fontFamily: 'sans-serif' },
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #bae6fd' },
    
    // Grid de Tarjetas Superiores
    gridCards: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '24px', 
      marginBottom: '30px' 
    },
    
    // Tarjeta Base
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e0f2fe',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'all 0.3s ease'
    },
    
    // Bordes temáticos
    cardBlue: { borderLeft: '6px solid #0ea5e9' },   // Clima
    cardIndigo: { borderLeft: '6px solid #6366f1' }, // Afectados
    cardRed: { borderLeft: '6px solid #ef4444' },    // Alerta

    // Textos y Etiquetas
    labelBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    labelText: { fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' },
    iconBox: (bg, color) => ({ padding: '8px', borderRadius: '8px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    bigNumber: { fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', margin: '10px 0', lineHeight: 1 },
    
    pill: (bg, color, border) => ({
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '0.75rem', fontWeight: 'bold',
      padding: '6px 12px', borderRadius: '999px',
      background: bg, color: color, border: `1px solid ${border}`,
      width: 'fit-content'
    }),

    // Secciones Inferiores
    sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#334155', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    contentBox: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e0f2fe', marginBottom: '20px' }
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* --- ANIMACIONES CSS --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }

        .hover-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(14, 165, 233, 0.15); }

        /* Pulso Rojo para Alerta */
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .radar-pulse-red { animation: pulse-red 1.5s infinite; }

        /* Pulso Azul para Agua */
        @keyframes pulse-blue {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        .water-pulse { animation: pulse-blue 3s infinite ease-in-out; }
      `}</style>

      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.iconBox('#e0f2fe', '#0284c7')}>
          <Waves size={28} />
        </div>
        <div>
          <h2 style={{...styles.title, fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e'}}>Agente: Protección Civil y Desastres</h2>
          <p style={{fontSize: '0.9rem', color: '#0284c7'}}>Predicción de riesgos naturales y gestión de evacuaciones (DN-III)</p>
        </div>
      </header>

      {/* --- KPI CARDS (SUPERIOR) --- */}
      <div style={styles.gridCards}>
        
        {/* 1. CLIMA / API */}
        <div style={{...styles.card, ...styles.cardBlue}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={styles.labelText}>MONITOREO CLIMÁTICO</p>
              <div style={{...styles.bigNumber, color: '#0284c7'}}>LLUVIA</div>
            </div>
            <div style={styles.iconBox('#e0f2fe', '#0284c7')}> <CloudRain size={20} /> </div>
          </div>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
             <div style={styles.pill('#f0f9ff', '#0369a1', '#bae6fd')}> <Wind size={12}/> 45 km/h </div>
             <div style={styles.pill('#f0f9ff', '#0369a1', '#bae6fd')}> <Thermometer size={12}/> 9°C </div>
          </div>
        </div>

        {/* 2. PREDICCIÓN AFECTADOS */}
        <div style={{...styles.card, ...styles.cardIndigo}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={styles.labelText}>RIESGO INCOMUNICACIÓN</p>
              <div style={{...styles.bigNumber, fontSize: '2rem'}}>320 Familias</div>
            </div>
            <div style={styles.iconBox('#e0e7ff', '#4338ca')}> <Users size={20} /> </div>
          </div>
          <div style={styles.pill('#e0e7ff', '#4338ca', '#c7d2fe')}>
             ⚠️ Zona Sierra / Valles
          </div>
        </div>

        {/* 3. ALERTA PC */}
        <div style={{...styles.card, ...styles.cardRed}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={styles.labelText}>NIVEL DE ALERTA</p>
              <div style={{...styles.bigNumber, display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626'}}>
                ROJA
                <span className="radar-pulse-red" style={{height: '14px', width: '14px', background: '#ef4444', borderRadius: '50%'}}></span>
              </div>
            </div>
            <div style={styles.iconBox('#fee2e2', '#dc2626')}> <AlertOctagon size={20} /> </div>
          </div>
          <div style={styles.pill('#fee2e2', '#b91c1c', '#fecaca')}>
            <Radio size={12} /> Protocolo Evacuación
          </div>
        </div>
      </div>

      {/* --- DASHBOARD PRINCIPAL (INFERIOR) --- */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: MAPA */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          
          {/* MAPA DE RIESGO HIDROLÓGICO */}
          <div style={styles.contentBox} className="hover-card">
            <h3 style={styles.sectionTitle}> <Map size={18} /> Mapa de Riesgo: Presas y Cauces </h3>
            
            <div style={{ height: '350px', background: '#e2e8f0', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
              
              <p style={{zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '8px 15px', borderRadius: '20px', fontSize: '0.85rem', color: '#475569', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}}>
                📍 Presa Guadalupe Victoria (Nivel: 98%)
              </p>
              
              {/* Zona Inundada Animada */}
              <div style={{
                position: 'absolute', bottom: '20%', right: '30%', 
                width: '180px', height: '140px', 
                background: '#0ea5e9', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
              }} className="water-pulse"></div>
            </div>

            {/* Rutas de Evacuación (Dijkstra) */}
            <div style={{marginTop: '25px'}}>
              <h4 style={{fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                <Navigation size={16}/> Rutas de Evacuación (Algoritmo Dijkstra)
              </h4>
              
              <div style={{display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px'}}>
                {/* Ruta Segura */}
                <div style={{background: '#ecfdf5', padding: '15px', borderRadius: '12px', border: '1px solid #6ee7b7', minWidth: '160px', flex: 1}}>
                   <div style={{fontSize: '0.7rem', color: '#047857', fontWeight: 'bold', marginBottom: '5px'}}>RUTA A (Recomendada)</div>
                   <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#064e3b'}}>Hacia Albergue 1</div>
                   <div style={{fontSize: '0.8rem', color: '#059669', marginTop: '5px'}}>⏱️ 12 min (Vía Libre)</div>
                </div>
                
                {/* Ruta Bloqueada */}
                <div style={{background: '#fef2f2', padding: '15px', borderRadius: '12px', border: '1px solid #fca5a5', minWidth: '160px', flex: 1, opacity: 0.7}}>
                   <div style={{fontSize: '0.7rem', color: '#b91c1c', fontWeight: 'bold', marginBottom: '5px'}}>RUTA B (Peligro)</div>
                   <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: '#7f1d1d'}}>Blvd. Dolores</div>
                   <div style={{fontSize: '0.8rem', color: '#dc2626', marginTop: '5px'}}>⛔ BLOQUEADO (Agua)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FEED */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={styles.contentBox}>
            <h3 style={styles.sectionTitle}> <Radio size={18} /> Alertas en Tiempo Real </h3>

            {/* Alerta Azul (CONAGUA) */}
            <div style={{background: '#eff6ff', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '15px'}} className="hover-card">
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px'}}>
                <span>CONAGUA</span> <span>HACE 5m</span>
              </div>
              <p style={{fontSize: '0.9rem', margin: '0', color: '#334155', lineHeight: '1.4'}}>
                "Aumento súbito en nivel de Presa. Desfogue preventivo de 50m³/s iniciado."
              </p>
            </div>
            
            {/* Alerta Roja (Sensor) */}
             <div style={{background: '#fff1f2', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #f43f5e', marginBottom: '15px'}} className="hover-card">
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: '#e11d48', marginBottom: '8px'}}>
                <span>SENSOR PLUVIAL #402</span> <span>HACE 12m</span>
              </div>
              <p style={{fontSize: '0.9rem', margin: '0', color: '#334155', lineHeight: '1.4'}}>
                Obstrucción crítica en alcantarillado zona Centro Histórico.
              </p>
            </div>

            {/* Estadísticas de Albergues */}
            <div style={{marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '20px'}}>
               <h4 style={{fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: '10px'}}>Capacidad de Albergues</h4>
               
               <div style={{marginBottom: '10px'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem'}}>
                   <span>Albergue Municipal</span> <span style={{fontWeight: 'bold'}}>85%</span>
                 </div>
                 <div style={{width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '5px'}}>
                    <div style={{width: '85%', background: '#f59e0b', height: '100%', borderRadius: '5px'}}></div>
                 </div>
               </div>

               <div>
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem'}}>
                   <span>Escuela Secundaria 4</span> <span style={{fontWeight: 'bold'}}>20%</span>
                 </div>
                 <div style={{width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '5px'}}>
                    <div style={{width: '20%', background: '#10b981', height: '100%', borderRadius: '5px'}}></div>
                 </div>
               </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}