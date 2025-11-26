import React from 'react';
import { Activity } from 'lucide-react';

const Encabezado = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white p-4 flex items-center shadow-sm mb-6 rounded-b-lg">
      <div className="flex items-center gap-2 mr-10">
        {/* Logo Simulado */}
        <div className="text-blue-900 font-bold text-xl flex items-center">
          <Activity className="mr-2 text-blue-500" />
          SECURITY <span className="text-blue-400 ml-1">ACTION IA</span>
        </div>
      </div>
      
      {/* Navegación */}
      <nav className="flex gap-6 text-sm font-medium text-slate-600">
        <button 
          onClick={() => setActiveTab('emergencias')}
          className={`pb-1 ${activeTab === 'emergencias' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-500'}`}
        >
          Emergencias
        </button>
        <button 
          onClick={() => setActiveTab('estadisticas')}
          className={`pb-1 ${activeTab === 'estadisticas' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-500'}`}
        >
          Estadísticas
        </button>
      </nav>
    </header>
  );
};

export default Encabezado;