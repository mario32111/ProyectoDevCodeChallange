import React from 'react';
import Tarjeta from './Tarjeta';
import { Search } from 'lucide-react';

const Filtros = () => {
  return (
    <Tarjeta className="pb-6 pt-4 px-6 mb-6">
      <h2 className="text-blue-900 font-bold text-lg mb-4">Emergencias por municipio</h2>
      <div className="flex flex-wrap gap-4 items-end">
        {['Municipio', 'Día', 'Mes', 'Año'].map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-blue-900 font-medium text-sm ml-1">{label}</label>
            <input 
              type="text" 
              className="bg-gray-100 border-none rounded-full px-4 py-1 w-32 focus:ring-2 focus:ring-blue-400 outline-none shadow-inner" 
            />
          </div>
        ))}
        <button className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition mb-0.5 shadow-lg">
          <Search size={20} />
        </button>
      </div>
    </Tarjeta>
  );
};

export default Filtros;