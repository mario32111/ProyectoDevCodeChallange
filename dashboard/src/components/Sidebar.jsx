import React from 'react';
import { 
  Phone, Activity, AlertTriangle, CloudRain, 
  HeartPulse, ShieldAlert, BarChart3, FileText 
} from "lucide-react";

export default function Sidebar({ currentView, setView }) {
  
  const menuItems = [
    { id: 'centro', label: 'Centro de Mando', icon: <Phone size={20}/>, category: 'gral' },
    { id: 'stats', label: 'Inteligencia C5', icon: <BarChart3 size={20}/>, category: 'gral' },
    { id: 'reportes', label: 'Reportes', icon: <FileText size={20}/>, category: 'gral' },
  ];

  const agentItems = [
    { id: 'suicidio', label: 'Suicidio / Psico', icon: <HeartPulse size={20}/>, color: '#ec4899' }, // Rosa/Morado
    { id: 'violencia', label: 'Violencia', icon: <ShieldAlert size={20}/>, color: '#ef4444' }, // Rojo
    { id: 'accidentes', label: 'Accidentes', icon: <Activity size={20}/>, color: '#f59e0b' }, // Naranja
    { id: 'desastres', label: 'Desastres Nat.', icon: <CloudRain size={20}/>, color: '#3b82f6' }, // Azul
  ];

  return (
    // Agregamos minWidth y flexShrink: 0 para que NADA lo pueda aplastar
    <div className="sidebar-container" style={{ width: '260px', minWidth: '260px', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ background: '#2563eb', padding: '6px', borderRadius: '6px', color: 'white' }}>
          <Activity size={20} />
        </div>
        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
          SECURITY <span style={{ color: '#2563eb' }}>ACTION</span>
        </div>
      </div>

      {/* Menú General */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '10px' }}>GENERAL</p>
        {menuItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
            style={{ width: '100%', marginBottom: '5px' }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* Menú Agentes */}
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '10px' }}>AGENTES ESPECIALIZADOS</p>
        {agentItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
            style={{ 
              width: '100%', marginBottom: '5px',
              backgroundColor: currentView === item.id ? `${item.color}20` : 'transparent', // Fondo tenue del color
              color: currentView === item.id ? item.color : '#64748b'
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}