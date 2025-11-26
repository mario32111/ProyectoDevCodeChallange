import React from 'react';
import Tarjeta from './Tarjeta';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PanelControl = () => {
  const prioridades = ['Bajo', 'Medio', 'Alto', 'Máximo'];
  const estados = ['Sin atender', 'En proceso', 'Resueltas'];
  
  // Datos simulados para la gráfica pequeña lateral
  const dataReales = [
    { name: 'Falsas', value: 70, color: '#0f3460' },
    { name: 'Reales', value: 30, color: '#fbbf24' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Columna Principal (Izquierda) */}
      <div className="col-span-9 space-y-6">
        
        {/* Nivel de Prioridad */}
        <div>
          <h2 className="text-blue-900 font-bold text-lg mb-3">Nivel de prioridad.</h2>
          <div className="grid grid-cols-4 gap-4">
            {prioridades.map((nivel) => (
              <Tarjeta key={nivel} className="min-h-[250px] p-0 overflow-hidden flex flex-col">
                <div className={`p-2 text-white font-bold text-sm uppercase ${
                  nivel === 'Bajo' ? 'bg-green-500' :
                  nivel === 'Medio' ? 'bg-yellow-400' :
                  nivel === 'Alto' ? 'bg-orange-400' : 'bg-red-600'
                }`}>
                  {nivel}
                </div>
                <div className="p-3 bg-gray-50 flex-grow space-y-2">
                  {/* Aquí irían tus items arrastrables */}
                  <div className="bg-white p-2 rounded shadow-sm border text-xs text-gray-600">
                     Llamada de emergencia
                  </div>
                </div>
              </Tarjeta>
            ))}
          </div>
        </div>

        {/* Estado */}
        <div>
          <h2 className="text-blue-900 font-bold text-lg mb-3">Estado</h2>
          <div className="grid grid-cols-3 gap-4">
            {estados.map((estado) => (
              <Tarjeta key={estado} className="min-h-[250px] p-0 overflow-hidden">
                 <div className={`p-2 text-white font-bold text-sm ${
                  estado === 'Sin atender' ? 'bg-amber-400' :
                  estado === 'En proceso' ? 'bg-sky-400' : 'bg-blue-600'
                }`}>
                  {estado}
                </div>
                <div className="p-3 bg-gray-50 h-full"></div>
              </Tarjeta>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Lateral (Gráficas) */}
      <div className="col-span-3 space-y-6">
        <Tarjeta className="h-[280px] flex flex-col items-center justify-center">
          <h3 className="text-blue-900 font-semibold mb-2 text-sm">Llamadas falsas y reales</h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataReales} innerRadius={40} outerRadius={60} dataKey="value">
                  {dataReales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Tarjeta>
      </div>
    </div>
  );
};

export default PanelControl;