import React, { useState } from "react";
import "./App.css"; // Importa los estilos limpios

// Componentes
import Sidebar from "./components/Sidebar";

// Vistas
import CentroMando from "./views/CentroMando";
import SuicidioView from "./views/SuicidioView";
import InteligenciaC5 from "./views/Inteligencia5";
import ReportesView from "./views/ReportesView";
import ViolenciaView from "./views/ViolenciaView"; 
// (Crea los archivos vacíos para que no de error o comenta los imports)

// Datos Mockup (Puedes moverlos a un archivo src/data/mockData.js)
const initialCalls = [
  {
    id: 101, 
    time: "Hace 2s", 
    phone: "618-123-XXXX", 
    score: 92, 
    status: "active", 
    type: "Violencia", 
    location: "Centro Histórico", 
    transcript: "...está golpeando la puerta, tiene un cuchillo, ayuda...", 
    aiResponse: "Patrón de estrés extremo confirmado.",
    keywords: ["Cuchillo", "Golpeando", "Ayuda"],
    voiceStatus: "Agitada / Gritos",
    audioLevel: "high" 
  },
  { 
    id: 102, 
    time: "Hace 15s", 
    phone: "618-555-XXXX", 
    score: 45, 
    status: "gray_zone", 
    type: "Incierto", 
    location: "Jardines de Durango", 
    transcript: "(Silencio)... (Ruido de viento)... (Respiración agitada)...", 
    aiResponse: "Posible situación de coacción detectada.",
    keywords: ["Silencio Positivo", "Viento"],
    voiceStatus: "Susurros / Silencio",
    audioLevel: "low" 
  },
  { 
    id: 103, 
    time: "Hace 40s", 
    phone: "618-333-XXXX", 
    score: 15, 
    status: "discard", 
    type: "Broma", 
    location: "Escuela Secundaria 4", 
    transcript: "Jajaja, oiga, ¿a qué hora pasan por la basura? Jajaja...", 
    aiResponse: "Incoherencia semántica detectada.",
    keywords: ["Risas", "Basura"],
    voiceStatus: "Risas / Normal",
    audioLevel: "med" 
  },
];

const statsData = {
  totalCalls: 2150,
  real: 301, 
  fake: 1849, 
  savedMoney: "$924,500 MXN", 
};

const reportData = [
  { zona: "Centro Histórico", incidentes: 450, tipo: "Robo / Altercado", trend: "+12%" },
  { zona: "Villas del Guadiana", incidentes: 320, tipo: "Violencia Doméstica", trend: "+8%" },
  { zona: "Jardines de Durango", incidentes: 180, tipo: "Accidente Vial", trend: "-2%" },
  { zona: "Domingo Arrieta", incidentes: 115, tipo: "Ruido / Fiesta", trend: "0%" },
];

// --- COMPONENTES AUXILIARES ---

const ScoreGauge = ({ score }) => {
  const color = score > 70 ? "#ef4444" : score > 30 ? "#eab308" : "#22c55e";
  return (
    <div style={{ position: 'relative', width: '120px', height: '60px', display: 'flex', justifyContent: 'center' }}>
       <svg viewBox="0 0 100 50" width="100%" height="100%">
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
         <path 
           d="M 10 50 A 40 40 0 0 1 90 50" 
           fill="none" 
           stroke={color} 
           strokeWidth="8" 
           strokeLinecap="round"
           strokeDasharray="126"
           strokeDashoffset={126 - (score / 100) * 126}
           style={{ transition: 'stroke-dashoffset 1s ease' }}
         />
       </svg>
       <div style={{ position: 'absolute', bottom: '0', textAlign: 'center' }}>
         <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{score}</span>
         <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 'bold' }}>RIESGO</div>
       </div>
    </div>
  );
};

const AudioWave = ({ level }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{
        width: '4px',
        backgroundColor: '#3b82f6',
        borderRadius: '2px',
        height: level === 'high' ? `${Math.random() * 100}%` : '30%',
        transition: 'height 0.1s ease'
      }} />
    ))}
  </div>
);

const DurangoHeatmap = () => (
  <div style={{ 
    background: '#e2e8f0', height: '300px', borderRadius: '12px', position: 'relative', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    <div style={{ width: '120px', height: '120px', background: 'red', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.6, position: 'absolute', top: '30%', left: '40%' }}></div>
    <div style={{ width: '80px', height: '80px', background: 'orange', borderRadius: '50%', filter: 'blur(30px)', opacity: 0.5, position: 'absolute', bottom: '30%', left: '25%' }}></div>
    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'white', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      📍 Mapa de Calor: Durango
    </div>
  </div>
);

// --- APP PRINCIPAL ---
export default function App() {
  // Estado para controlar qué vista se muestra
  const [currentView, setView] = useState("centro"); 

  // Función para renderizar el contenido dinámico
  const renderContent = () => {
    switch (currentView) {
      case "centro":
        return <CentroMando initialCalls={initialCalls} />;
      case "stats":
        return <InteligenciaC5 />;
      case "reportes":
        return <ReportesView />;
      case "suicidio":
        return <SuicidioView />;
      case "violencia":
        return <div>Vista Agente Violencia (En construcción)</div>;
      case "desastres":
        return <div>Vista Agente Desastres (En construcción)</div>;
      case "accidentes":
        return <div>Vista Agente Accidentes (En construcción)</div>;
      default:
        return <CentroMando initialCalls={initialCalls} />;
    }
  };

  return (
    <div className="main-layout">
      {/* 1. Sidebar Fijo a la izquierda */}
      <Sidebar currentView={currentView} setView={setView} />

      {/* 2. Área de Contenido Dinámico */}
      <main className="content-area">
        {/* Header simple (o muévelo a un componente Header.jsx) */}
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
            {currentView === 'centro' ? 'Centro de Mando 911' : 
             currentView === 'suicidio' ? 'Inteligencia: Salud Mental' : 'Panel de Control'}
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Durango, Dgo. | 🟢 Sistema Operativo</div>
        </header>

        {/* Renderiza la vista seleccionada */}
        {renderContent()}
      </main>
    </div>
  );
}