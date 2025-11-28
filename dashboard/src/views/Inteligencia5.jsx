import React from "react";
// Asegúrate de que la ruta de la imagen sea correcta o usa un placeholder si no la tienes
import mapaImg from "../assets/img/mapa-incidencia.png"; 

import { 
  TrendingUp,
  MapPin,
  PhoneOff,
  Phone,
  Activity
} from "lucide-react";


// --- DATOS MOCKUP ---
const statsData = { 
  totalCalls: 2150, 
  real: 301, 
  fake: 1849 
};

export default function InteligenciaC5() {
  
  // --- ESTILOS EN LÍNEA (CSS INYECTADO) ---
  const styles = {
    // Layout Principal
    container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    
    // Grid KPI
    gridKPI: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '24px', 
      marginBottom: '30px' 
    },
    
    // Tarjetas
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'relative',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    },
    
    // Grid Principal (Mapa + Gráfica)
    gridMain: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px'
    },
    
    // Textos
    label: { fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
    value: { fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: 1, margin: '10px 0' },
    subtext: (color) => ({ fontSize: '0.8rem', fontWeight: 'bold', color: color, display: 'flex', alignItems: 'center', gap: '4px' })
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* --- ANIMACIONES CSS --- */}
      <style>{`
        /* Entrada suave */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }

        /* Hover en tarjetas */
        .hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

        /* Animación de la Dona (Giro suave) */
        @keyframes spin-in {
          from { transform: rotate(-90deg) scale(0.8); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .donut-anim { animation: spin-in 1s ease-out forwards; }

        /* Barra de progreso animada */
        @keyframes grow-width { from { width: 0; } }
        .bar-anim { animation: grow-width 1s ease-out forwards; }
      `}</style>

      {/* 1. KPIs SUPERIORES */}
      <div style={styles.gridKPI}>
         
         {/* Total Llamadas */}
         <div style={{...styles.card, borderLeft: '6px solid #64748b'}} className="hover-card">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
               <div>
                  <div style={styles.label}>Total Llamadas</div>
                  <div style={styles.value}>{statsData.totalCalls}</div>
                  <div style={styles.subtext('#22c55e')}> <TrendingUp size={14}/> ↑ 12% vs ayer</div>
               </div>
               <div style={{padding: '10px', background: '#f1f5f9', borderRadius: '12px', height: 'fit-content'}}>
                  <Activity size={24} color="#64748b"/>
               </div>
            </div>
         </div>

         {/* Llamadas Falsas */}
         <div style={{...styles.card, borderLeft: '6px solid #ef4444'}} className="hover-card">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
               <div>
                  <div style={styles.label}>Llamadas Falsas</div>
                  <div style={{...styles.value, color: '#ef4444'}}>{statsData.fake}</div>
                  <div style={styles.subtext('#94a3b8')}>86% del total</div>
               </div>
               <div style={{padding: '10px', background: '#fee2e2', borderRadius: '12px', height: 'fit-content'}}>
                  <PhoneOff size={24} color="#ef4444"/>
               </div>
            </div>
         </div>

         {/* Emergencias Reales */}
         <div style={{...styles.card, borderLeft: '6px solid #3b82f6'}} className="hover-card">
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
               <div>
                  <div style={{...styles.label, color: '#2563eb'}}>Emergencias Reales</div>
                  <div style={{...styles.value, color: '#2563eb'}}>{statsData.real}</div>
                  <div style={styles.subtext('#64748b')}>14% filtrado exitoso</div>
               </div>
               <div style={{padding: '10px', background: '#dbeafe', borderRadius: '12px', height: 'fit-content'}}>
                  <Phone size={24} color="#2563eb"/>
               </div>
            </div>
         </div>
      </div>

      {/* 2. GRID PRINCIPAL (MAPA Y TIPOLOGÍA) */}
      <div style={styles.gridMain}>
         
         {/* COLUMNA IZQUIERDA: MAPA */}
         <div style={styles.card} className="hover-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
               <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} /> Mapa de Incidencia
               </h3>
               <select style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '8px', color: '#475569', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                  <option>Tiempo Real</option>
                  <option>Histórico (24h)</option>
                  <option>Predicción IA</option>
               </select>
            </div>
            
            {/* Contenedor del Mapa */}
            <div style={{ height: '350px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {mapaImg ? (
                  <img 
                    src={mapaImg} 
                    alt="Mapa de la zona" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
               ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <MapPin size={48} style={{margin: '0 auto 10px auto', opacity: 0.5}}/>
                      <p style={{fontSize: '0.9rem'}}>Visualización de Mapa no disponible</p>
                  </div>
               )}
               {/* Overlay de etiqueta (Estético) */}
               <div style={{position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  Durango, Centro
               </div>
            </div>
         </div>

         {/* COLUMNA DERECHA: GRÁFICA DE DONA */}
         <div style={styles.card} className="hover-card">
            <h3 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>Tipología de Llamadas</h3>
            
            {/* Gráfico de Dona CSS Puro */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
               <div className="donut-anim" style={{
                  position: 'relative', width: '180px', height: '180px', borderRadius: '50%',
                  background: 'conic-gradient(#ef4444 0% 86%, #e2e8f0 86% 100%)', // Rojo 86%, Gris resto
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
               }}>
                  <div style={{
                     width: '140px', height: '140px', background: 'white', borderRadius: '50%',
                     display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                     <span style={{fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: 1}}>86%</span>
                     <span style={{fontSize: '0.7rem', color: '#ef4444', fontWeight: 'bold', letterSpacing: '0.05em'}}>IMPROCEDENTES</span>
                  </div>
               </div>
            </div>

            {/* Leyenda y Datos */}
            <div style={{ marginBottom: '25px' }}>
               {/* Barra 1 */}
               <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '500'}}>
                     <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8'}}></span> Llamadas Mudas</span>
                     <span>52%</span>
                  </div>
                  <div style={{width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px'}}>
                     <div className="bar-anim" style={{width: '52%', background: '#94a3b8', height: '100%', borderRadius: '4px'}}></div>
                  </div>
               </div>
               
               {/* Barra 2 */}
               <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '500'}}>
                     <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444'}}></span> Bromas</span>
                     <span>20%</span>
                  </div>
                  <div style={{width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px'}}>
                     <div className="bar-anim" style={{width: '20%', background: '#ef4444', height: '100%', borderRadius: '4px', animationDelay: '0.1s'}}></div>
                  </div>
               </div>

               {/* Barra 3 */}
               <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '500'}}>
                     <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6'}}></span> Otros</span>
                     <span>14%</span>
                  </div>
                  <div style={{width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px'}}>
                     <div className="bar-anim" style={{width: '14%', background: '#3b82f6', height: '100%', borderRadius: '4px', animationDelay: '0.2s'}}></div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '15px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
               <TrendingUp size={20} color="#2563eb" />
               <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: '500' }}>Sugerencia IA: Aumento de personal recomendado para fin de semana.</span>
            </div>
         </div>
      </div>
    </div>
  );
}