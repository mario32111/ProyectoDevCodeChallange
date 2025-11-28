import React from 'react';
import { TrendingUp, AlertCircle, Map } from "lucide-react";

export default function SuicidioView() {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{color: '#ec4899'}}>●</span> Agente: Prevención de Suicidio y Crisis
      </h2>

      {/* Grid Superior: Estadísticas Base (INEGI/Durango) */}
      <div className="dashboard-grid" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="metric-label">Riesgo Histórico (Hoy)</div>
          <div className="metric-value" style={{color: '#ec4899'}}>ALTO</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Basado en: Fines de semana + Clima</div>
        </div>
        <div className="card">
           <div className="metric-label">Zona "Hotspot" Activa</div>
           <div className="metric-value">Puente Baluartito</div>
           <div style={{ fontSize: '0.8rem', color: '#ec4899' }}>3 reportes en últimas 48hrs</div>
        </div>
        <div className="card">
           <div className="metric-label">Validación IA</div>
           <div className="metric-value">Activa</div>
           <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>Conectado a Base de Datos C5</div>
        </div>
      </div>

      {/* Área Principal: Mapa vs Datos en Vivo */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Mapa Específico de Salud Mental */}
        <div className="card">
          <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>Mapa de Calor: Incidencia Psicológica</h3>
          <div style={{ 
            background: '#e2e8f0', height: '400px', borderRadius: '8px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' 
          }}>
            <p>Aquí va el mapa filtrado solo por suicidio/crisis</p>
            {/* Simulación de puntos calientes */}
            <div style={{position: 'absolute', top: '40%', left: '50%', width: '60px', height: '60px', background: '#ec4899', borderRadius: '50%', filter: 'blur(30px)', opacity: 0.6}}></div>
          </div>
        </div>

        {/* Feed de Validación en Tiempo Real */}
        <div className="card">
          <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>Análisis de Llamadas Entrantes</h3>
          
          <div style={{background: '#fdf2f8', padding: '15px', borderRadius: '8px', border: '1px solid #fbcfe8', marginBottom: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#db2777'}}>
              <span>LLAMADA #9921</span>
              <span>DETECTADO HACE 2m</span>
            </div>
            <p style={{fontSize: '0.9rem', margin: '5px 0'}}>
              "Usuario menciona pastillas, voz letárgica. Ubicación coincide con domicilio con antecedentes."
            </p>
            <div style={{marginTop: '5px', padding: '5px', background: 'white', borderRadius: '4px', border: '1px solid #fbcfe8', fontSize: '0.8rem', color: '#be185d', fontWeight: 'bold'}}>
              ✅ VALIDADO: RIESGO INMINENTE
            </div>
          </div>

          <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b'}}>
              <span>LLAMADA #9920</span>
              <span>DETECTADO HACE 15m</span>
            </div>
            <p style={{fontSize: '0.9rem', margin: '5px 0'}}>
              "Gritos incongruentes, risas de fondo. Ubicación: Escuela Secundaria."
            </p>
            <div style={{marginTop: '5px', padding: '5px', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold'}}>
              ⚠️ ALERTA: POSIBLE BROMA (89%)
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}