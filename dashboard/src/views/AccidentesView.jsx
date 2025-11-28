import React from 'react';
import { 
  Car, 
  AlertTriangle, 
  Ambulance, 
  Siren, 
  MapPin, 
  Activity, 
  Clock,
  TrendingUp
} from "lucide-react";

export default function AccidentesView() {
  
  // --- ESTILOS (Sin Tailwind) ---
  const styles = {
    // CAMBIO AQUÍ: Fondo normal (#f8fafc) en lugar de naranja (#fff7ed)
    container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    
    // Ajusté el borde del header para que sea más sutil
    header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' },
    
    // Grid KPI
    gridCards: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '24px', 
      marginBottom: '30px' 
    },
    
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0', // Borde base más neutro
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'all 0.3s ease'
    },
    
    // Bordes Temáticos (Se mantienen los colores para identificar la gravedad)
    cardAmber: { borderLeft: '6px solid #f59e0b' }, // Precaución
    cardRed: { borderLeft: '6px solid #ef4444' },   // Crítico
    cardBlue: { borderLeft: '6px solid #3b82f6' },  // Recursos

    // Textos
    labelBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    labelText: { fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }, // Texto gris neutro
    bigNumber: { fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', margin: '10px 0', lineHeight: 1 },
    
    iconBox: (bg, color) => ({ padding: '8px', borderRadius: '8px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
    
    pill: (bg, color, border) => ({
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '0.75rem', fontWeight: 'bold',
      padding: '6px 12px', borderRadius: '999px',
      background: bg, color: color, border: `1px solid ${border}`,
      width: 'fit-content'
    }),

    sectionTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#334155', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' },
    contentBox: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '20px' }
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* --- ANIMACIONES CSS --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }

        .hover-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.15); }

        /* Pulso Ámbar */
        @keyframes pulse-amber {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .radar-pulse-amber { animation: pulse-amber 2s infinite; }
        
        .progress-bar { transition: width 1s ease-out; }
      `}</style>

      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.iconBox('#ffedd5', '#ea580c')}>
          <Car size={28} />
        </div>
        <div>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0}}>Agente: Tránsito y Accidentes</h2>
          <p style={{fontSize: '0.9rem', color: '#64748b', margin: 0}}>Gestión de incidentes viales y asignación inteligente de unidades</p>
        </div>
      </header>

      {/* --- KPI CARDS --- */}
      <div style={styles.gridCards}>
        
        {/* 1. ACCIDENTES ACTIVOS */}
        <div style={{...styles.card, ...styles.cardAmber}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={styles.labelText}>ACCIDENTES EN CURSO</p>
              <div style={{...styles.bigNumber}}>4 Activos</div>
            </div>
            <div style={styles.iconBox('#ffedd5', '#f59e0b')}> <AlertTriangle size={20} /> </div>
          </div>
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
             <div style={styles.pill('#fff7ed', '#c2410c', '#fed7aa')}> <Activity size={12}/> 1 Grave </div>
             <div style={styles.pill('#fff7ed', '#ca8a04', '#fde047')}> <Car size={12}/> 3 Leves </div>
          </div>
        </div>

        {/* 2. RECURSOS EN CAMINO */}
        <div style={{...styles.card, ...styles.cardBlue}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={{...styles.labelText, color: '#1e40af'}}>UNIDADES ASIGNADAS</p>
              <div style={{...styles.bigNumber, color: '#1e3a8a'}}>6 Unidades</div>
            </div>
            <div style={styles.iconBox('#dbeafe', '#2563eb')}> <Ambulance size={20} /> </div>
          </div>
          <div style={styles.pill('#eff6ff', '#1d4ed8', '#bfdbfe')}>
             🤖 IA Optimización: Activa
          </div>
        </div>

        {/* 3. ZONA DE RIESGO */}
        <div style={{...styles.card, ...styles.cardRed}} className="hover-card">
          <div style={styles.labelBox}>
            <div>
              <p style={{...styles.labelText, color: '#991b1b'}}>PUNTO CRÍTICO</p>
              <div style={{...styles.bigNumber, display: 'flex', alignItems: 'center', gap: '10px', color: '#b91c1c', fontSize: '1.8rem'}}>
                Blvd. Domingo
                <span className="radar-pulse-amber" style={{height: '12px', width: '12px', background: '#ef4444', borderRadius: '50%'}}></span>
              </div>
            </div>
            <div style={styles.iconBox('#fee2e2', '#ef4444')}> <MapPin size={20} /> </div>
          </div>
          <div style={styles.pill('#fef2f2', '#b91c1c', '#fecaca')}>
            <TrendingUp size={12} /> Alta Recurrencia (18:00 hrs)
          </div>
        </div>

      </div>

      {/* --- DASHBOARD PRINCIPAL --- */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: MODELO DE RECURSOS */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          
          <div style={styles.contentBox} className="hover-card">
            <h3 style={styles.sectionTitle}> <Siren size={18} /> Modelo de Predicción de Recursos </h3>
            <p style={{fontSize: '0.9rem', color: '#64748b', marginBottom: '20px'}}>
              El sistema sugiere cuántas unidades enviar basado en la gravedad reportada.
            </p>

            {/* Simulación de Incidente Grave */}
            <div style={{background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '20px', marginBottom: '15px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{fontWeight: 'bold', color: '#c2410c'}}>INCIDENTE #4002: Choque Múltiple</span>
                <span style={{background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'}}>GRAVEDAD ALTA</span>
              </div>
              
              <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                {/* Visualización de recursos sugeridos */}
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a'}}>2</div>
                  <div style={{fontSize: '0.7rem', color: '#64748b'}}>AMBULANCIAS</div>
                </div>
                <div style={{fontSize: '1.5rem', color: '#cbd5e1'}}>+</div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a'}}>1</div>
                  <div style={{fontSize: '0.7rem', color: '#64748b'}}>PATRULLA VIAL</div>
                </div>
                <div style={{fontSize: '1.5rem', color: '#cbd5e1'}}>+</div>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a'}}>1</div>
                  <div style={{fontSize: '0.7rem', color: '#64748b'}}>GRÚA</div>
                </div>
                
                <div style={{marginLeft: 'auto'}}>
                   <button style={{background: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.3)'}}>
                     DESPACHAR UNIDADES
                   </button>
                </div>
              </div>
            </div>

            {/* Simulación de Incidente Leve */}
            <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', opacity: 0.8}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <span style={{fontWeight: 'bold', color: '#475569', fontSize: '0.9rem'}}>INCIDENTE #4003: Alcance Menor</span>
                 <span style={{background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold'}}>GRAVEDAD LEVE</span>
                 <span style={{fontSize: '0.8rem', color: '#64748b'}}>Sugerencia: 1 Motocicleta Vial</span>
              </div>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA: REPORTE DE ZONAS */}
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={styles.contentBox}>
            <h3 style={styles.sectionTitle}> <TrendingUp size={18} /> Histórico de Gravedad </h3>
            
            <div style={{marginTop: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem'}}>
                 <span>Colisiones Laterales</span> <span style={{fontWeight: 'bold'}}>45%</span>
              </div>
              <div style={{width: '100%', background: '#fefce8', height: '8px', borderRadius: '4px', marginBottom: '15px'}}>
                 <div className="progress-bar" style={{width: '45%', background: '#f59e0b', height: '100%', borderRadius: '4px'}}></div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem'}}>
                 <span>Atropellamientos</span> <span style={{fontWeight: 'bold', color: '#dc2626'}}>15% (Fatalidad Alta)</span>
              </div>
              <div style={{width: '100%', background: '#fef2f2', height: '8px', borderRadius: '4px', marginBottom: '15px'}}>
                 <div className="progress-bar" style={{width: '15%', background: '#ef4444', height: '100%', borderRadius: '4px'}}></div>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem'}}>
                 <span>Daños Materiales</span> <span style={{fontWeight: 'bold'}}>40%</span>
              </div>
              <div style={{width: '100%', background: '#f0f9ff', height: '8px', borderRadius: '4px'}}>
                 <div className="progress-bar" style={{width: '40%', background: '#3b82f6', height: '100%', borderRadius: '4px'}}></div>
              </div>
            </div>

            <div style={{marginTop: '25px', padding: '15px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a'}}>
               <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                 <Clock size={16} color="#d97706"/>
                 <div>
                   <div style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#92400e'}}>Hora Pico Detectada</div>
                   <div style={{fontSize: '0.75rem', color: '#b45309'}}>Evitar zona centro: 14:00 - 15:30</div>
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}