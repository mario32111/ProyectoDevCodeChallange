import React from "react";
import { 
  Clock,
  AlertCircle,
  FileText,
  Timer,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

// --- DATOS MOCKUP (Exactamente los mismos) ---
const reportData = [
  { zona: "Centro Histórico", incidentes: 450, tipo: "Robo / Altercado", trend: "+12%" },
  { zona: "Villas del Guadiana", incidentes: 320, tipo: "Violencia Doméstica", trend: "+8%" },
  { zona: "Jardines de Durango", incidentes: 180, tipo: "Accidente Vial", trend: "-2%" },
  { zona: "Domingo Arrieta", incidentes: 115, tipo: "Ruido / Fiesta", trend: "0%" },
];

export default function ReportesView() {

  // --- ESTILOS EN LÍNEA (Para diseño profesional sin App.css) ---
  const styles = {
    container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    
    // Header
    header: { marginBottom: '30px' },
    title: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 },
    subtitle: { fontSize: '0.9rem', color: '#64748b', margin: 0 },

    // Grid Layout
    mainGrid: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    colLeft: { flex: '2', minWidth: '600px' }, // La tabla ocupa más espacio
    colRight: { flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },

    // Tarjetas Base
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },

    // Estilos de Tabla
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '12px 8px', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' },
    td: { padding: '16px 8px', fontSize: '0.9rem', color: '#334155', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },

    // Botones y Badges
    btnSecondary: {
      background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '8px', 
      fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', 
      display: 'flex', gap: '6px', alignItems: 'center', cursor: 'pointer', transition: '0.2s'
    },
    
    // Métricas del Sidebar
    metricBox: { paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9' },
    metricLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '5px' },
    metricValue: { fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* --- ANIMACIONES CSS --- */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        
        .hover-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
        .table-row:hover { background-color: #f8fafc; }
      `}</style>

      {/* HEADER */}
      <div style={styles.header}>
         <h2 style={styles.title}>Reportes y Estadística</h2>
         <p style={styles.subtitle}>Análisis detallado de incidentes y métricas operativas</p>
      </div>

      <div style={styles.mainGrid}>
        
        {/* 1. TABLA PRINCIPAL (Izquierda) */}
        <div style={styles.colLeft}>
          <div style={styles.card} className="hover-card">
            
            {/* Cabecera de la Tarjeta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#64748b"/> Zonas de Alto Riesgo (Top 10)
              </h3>
              <button style={styles.btnSecondary}>
                <Clock size={14}/> Últimos 30 Días
              </button>
            </div>
            
            {/* Tabla Mejorada */}
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ZONA / COLONIA</th>
                    <th style={styles.th}>TOTAL INCIDENTES</th>
                    <th style={styles.th}>TIPO FRECUENTE</th>
                    <th style={styles.th}>TENDENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, idx) => (
                    <tr key={idx} className="table-row" style={{transition: 'background 0.2s'}}>
                      <td style={{...styles.td, fontWeight: '600'}}>{row.zona}</td>
                      <td style={styles.td}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                           <span style={{width: '30px'}}>{row.incidentes}</span>
                           {/* Barra visual de cantidad */}
                           <div style={{flex: 1, maxWidth: '80px', height: '6px', background: '#f1f5f9', borderRadius: '3px'}}>
                              <div style={{width: `${(row.incidentes / 500) * 100}%`, background: '#3b82f6', height: '100%', borderRadius: '3px'}}></div>
                           </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', border: '1px solid #dbeafe' }}>
                          {row.tipo}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ 
                           fontWeight: 'bold', 
                           color: row.trend.includes('+') ? '#ef4444' : row.trend.includes('-') ? '#22c55e' : '#94a3b8',
                           display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                          {row.trend.includes('+') ? <ArrowUpRight size={16}/> : row.trend.includes('-') ? <ArrowDownRight size={16}/> : <Minus size={16}/>}
                          {row.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. SIDEBAR DE MÉTRICAS (Derecha) */}
        <div style={styles.colRight}>
          
          {/* Tarjeta de Métricas */}
          <div style={styles.card} className="hover-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px', color: '#334155' }}>Métricas Operativas</h3>
            
            {/* Métrica 1 */}
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>
                 <div style={{padding:'6px', background:'#f0f9ff', borderRadius:'6px'}}><Timer size={16} color="#0ea5e9"/></div> 
                 Tiempo Promedio Respuesta
              </div>
              <div style={styles.metricValue}>3m 12s</div>
            </div>
            
            {/* Métrica 2 */}
            <div style={styles.metricBox}>
              <div style={styles.metricLabel}>
                 <div style={{padding:'6px', background:'#fef2f2', borderRadius:'6px'}}><AlertCircle size={16} color="#ef4444"/></div> 
                 Hora Pico (Falsas)
              </div>
              <div style={{...styles.metricValue, color: '#ef4444'}}>18:00 - 20:00</div>
            </div>

            {/* Métrica 3 */}
            <div style={{marginBottom: '0'}}>
              <div style={styles.metricLabel}>
                 <div style={{padding:'6px', background:'#f0fdf4', borderRadius:'6px'}}><Users size={16} color="#22c55e"/></div> 
                 Tasa de Abandono
              </div>
              <div style={{...styles.metricValue, color: '#3b82f6'}}>1.2%</div>
              <div style={{fontSize:'0.75rem', color:'#22c55e', marginTop:'5px', fontWeight:'600'}}>Mejorado vs mes anterior</div>
            </div>
          </div>

          {/* Tarjeta de Alerta (Con el texto original) */}
          <div style={{...styles.card, background: '#fff7ed', borderColor: '#fed7aa', borderLeft: '4px solid #f97316' }} className="hover-card">
            <div style={{ display: 'flex', gap: '15px', alignItems: 'start' }}>
              <div style={{marginTop: '2px'}}><AlertCircle size={24} color="#ea580c" /></div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#9a3412', marginBottom: '5px' }}>Alerta de Patrón</div>
                <div style={{ fontSize: '0.85rem', color: '#c2410c', lineHeight: '1.5' }}>
                  Se detecta un incremento del <span style={{fontWeight:'bold'}}>15% en bromas</span> provenientes de la zona escolar "Lomas del Parque" entre 2pm y 3pm.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}