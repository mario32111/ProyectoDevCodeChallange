import React from "react";
// Asegúrate de que la ruta sea correcta respecto a donde guardes este archivo.
// Si este archivo está en 'src/views/', esta ruta es correcta:
import mapaImg from "../assets/img/mapa-incidencia.png"; 

import { 
  TrendingUp,
  MapPin
} from "lucide-react";


// --- DATOS MOCKUP ---
const statsData = { 
  totalCalls: 2150, 
  real: 301, 
  fake: 1849 
};

export default function InteligenciaC5() {
  return (
    <div className="c5-wrapper">
      
      {/* 1. KPIs SUPERIORES */}
      <div className="kpi-grid">
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

      {/* 2. GRID PRINCIPAL (MAPA Y TIPOLOGÍA) */}
      <div className="stats-grid">
         
         {/* COLUMNA IZQUIERDA: MAPA */}
         <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
               <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>Mapa de Incidencia</h3>
               <select style={{ background: '#f1f5f9', border: 'none', padding: '5px 10px', borderRadius: '6px', color: '#475569' }}>
                  <option>Tiempo Real</option>
                  <option>Histórico</option>
               </select>
            </div>
            
            {/* Renderizado de Imagen o Placeholder si falla */}
            {mapaImg ? (
                <img 
                  src={mapaImg} 
                  alt="Mapa de la zona" 
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} 
                />
            ) : (
                <div style={{ height: '300px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#64748b' }}>
                    <div style={{textAlign: 'center'}}>
                        <MapPin size={48} color="#94a3b8" style={{margin: '0 auto'}}/>
                        <p>Imagen no encontrada</p>
                    </div>
                </div>
            )}
         </div>

         {/* COLUMNA DERECHA: GRÁFICA Y DATOS */}
         <div className="card">
            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>Tipología de Llamadas</h3>
            
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
  );
}