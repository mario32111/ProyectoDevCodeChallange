import React, { useState } from "react";
import "./App.css";

// --- DATOS MOCKUP ---
const dataPrioridad = [
  { name: "Baja", value: 35, color: "#22c55e" },
  { name: "Media", value: 25, color: "#eab308" },
  { name: "Alta", value: 15, color: "#f97316" },
  { name: "Máxima", value: 10, color: "#ef4444" },
];

const dataReales = [
  { name: "Falsas", value: 70, color: "#0f3460" },
  { name: "Reales", value: 30, color: "#fbbf24" },
];

// --- COMPONENTE DE GRÁFICA SIN LIBRERÍA ---
// Usa "conic-gradient" de CSS para dibujar el pastel
const GraficaCircular = ({ data, isDonut = false }) => {
  // Calculamos el total para los porcentajes
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  let currentAngle = 0;
  const gradientParts = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${item.color} ${start}% ${end}%`;
  });

  const gradientString = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="chart-container">
        <div 
          className="pie-chart" 
          style={{ background: gradientString }} 
        />
        {isDonut && <div className="donut-hole"></div>}
      </div>
      
      {/* Leyenda Manual */}
      <div className="legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="dot" style={{ backgroundColor: item.color }}></span>
            <span>{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ICONOS SVG (Para no usar lucide-react) ---
const IconLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// --- APP PRINCIPAL ---
function App() {
  const [activeTab, setActiveTab] = useState("emergencias");

  return (
    <div className="container">
      {/* Encabezado */}
      <header className="header">
        <div className="logo-section">
          <IconLogo />
          SECURITY <span style={{ color: '#60a5fa', marginLeft: '5px' }}>ACTION IA</span>
        </div>
        <nav className="nav-buttons">
          <button 
            className={activeTab === 'emergencias' ? 'active' : ''} 
            onClick={() => setActiveTab('emergencias')}
          >
            Emergencias
          </button>
          <button 
            className={activeTab === 'estadisticas' ? 'active' : ''} 
            onClick={() => setActiveTab('estadisticas')}
          >
            Estadísticas
          </button>
        </nav>
      </header>

      {/* Contenido */}
      {activeTab === "emergencias" ? (
        <div className="dashboard-grid">
          {/* Panel Izquierdo */}
          <div className="left-panel">
            {/* Prioridades */}
            <div>
              <h2 className="title">Nivel de prioridad.</h2>
              <div className="columns-grid">
                {['Bajo', 'Medio', 'Alto', 'Máximo'].map(p => (
                  <div key={p} className="kanban-col">
                    <div className="column-header" style={{
                      backgroundColor: 
                        p === 'Bajo' ? '#22c55e' : 
                        p === 'Medio' ? '#eab308' : 
                        p === 'Alto' ? '#f97316' : '#ef4444'
                    }}>
                      {p}
                    </div>
                    <div className="column-body">
                      {/* Aquí irían las tarjetitas arrastrables */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div>
              <h2 className="title">Estado</h2>
              <div className="columns-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {['Sin atender', 'En proceso', 'Resueltas'].map(e => (
                   <div key={e}>
                    <div className="column-header" style={{
                      backgroundColor: 
                        e === 'Sin atender' ? '#fbbf24' : 
                        e === 'En proceso' ? '#38bdf8' : '#2563eb'
                    }}>
                      {e}
                    </div>
                    <div className="column-body" style={{ minHeight: '150px' }}></div>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Derecho (Lateral) */}
          <div className="right-panel">
            <div className="card">
              <h3 className="title" style={{ fontSize: '0.9rem', textAlign: 'center' }}>Llamadas falsas y reales</h3>
              <GraficaCircular data={dataReales} isDonut={true} />
            </div>
          </div>
        </div>
      ) : (
        // VISTA ESTADÍSTICAS
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Filtros */}
            <div className="card">
              <h2 className="title">Emergencias por municipio</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                 {['Municipio', 'Día', 'Mes', 'Año'].map(label => (
                   <div key={label}>
                     <label style={{ display: 'block', fontSize: '0.8rem', color: '#1e3a8a', marginLeft: '5px' }}>{label}</label>
                     <input type="text" style={{ 
                       background: '#f1f5f9', border: 'none', borderRadius: '20px', 
                       padding: '5px 15px', outline: 'none' 
                      }} />
                   </div>
                 ))}
                 <button style={{ 
                   background: '#1e3a8a', border: 'none', borderRadius: '50%', 
                   width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                  }}>
                   <IconSearch />
                 </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="card">
                  <h3 className="title">Tipos de emergencias</h3>
                  <GraficaCircular data={dataPrioridad} />
                </div>
                <div className="card">
                  <h3 className="title">Índice de llamadas reales</h3>
                  <GraficaCircular data={dataReales} isDonut={true} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;