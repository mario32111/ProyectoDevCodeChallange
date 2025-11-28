import React from "react";
import { 
  Clock,
  AlertCircle
} from "lucide-react";

// --- DATOS MOCKUP (Específicos de Reportes) ---
const reportData = [
  { zona: "Centro Histórico", incidentes: 450, tipo: "Robo / Altercado", trend: "+12%" },
  { zona: "Villas del Guadiana", incidentes: 320, tipo: "Violencia Doméstica", trend: "+8%" },
  { zona: "Jardines de Durango", incidentes: 180, tipo: "Accidente Vial", trend: "-2%" },
  { zona: "Domingo Arrieta", incidentes: 115, tipo: "Ruido / Fiesta", trend: "0%" },
];

export default function Reportes() {
  return (
    <div className="reports-grid">
      
      {/* 1. TABLA PRINCIPAL */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>Zonas de Alto Riesgo (Top 10)</h3>
          <button style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}>
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
                <td>
                  <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    {row.tipo}
                  </span>
                </td>
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

      {/* 2. SIDEBAR DE MÉTRICAS */}
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
  );
}