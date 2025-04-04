'use client';

import ModalTriggerButton from '../modals/modalTriggerButton';

const colorVariants = {
  red: 'bg-red-200 hover:bg-red-100 text-red-800',
  orange: 'bg-orange-200 hover:bg-orange-100 text-orange-800',
  amber: 'bg-amber-200 hover:bg-amber-100 text-amber-800',
  yellow: 'bg-yellow-200 hover:bg-yellow-100 text-yellow-800',
  lime: 'bg-lime-200 hover:bg-lime-100 text-lime-800',
  green: 'bg-green-200 hover:bg-green-100 text-green-800',
  emerald: 'bg-emerald-200 hover:bg-emerald-100 text-emerald-800',
  teal: 'bg-teal-200 hover:bg-teal-100 text-teal-800',
  cyan: 'bg-cyan-200 hover:bg-cyan-100 text-cyan-800',
  sky: 'bg-sky-200 hover:bg-sky-100 text-sky-800',
  blue: 'bg-blue-200 hover:bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-200 hover:bg-indigo-100 text-indigo-800',
  violet: 'bg-violet-200 hover:bg-violet-100 text-violet-800',
  purple: 'bg-purple-200 hover:bg-purple-100 text-purple-800',
  fuchsia: 'bg-fuchsia-200 hover:bg-fuchsia-100 text-fuchsia-800',
  pink: 'bg-pink-200 hover:bg-pink-100 text-pink-800',
  rose: 'bg-rose-200 hover:bg-rose-100 text-rose-800',
  slate: 'bg-slate-200 hover:bg-slate-100 text-slate-800',
};


export default function AsignaturaCard({ item }) {
  
  const color: string = item.color;
  return (
    <div key={item.id} className={`flex justify-between items-center w-full border p-4 rounded ${colorVariants[color]} transition-all duration-300 ease-in-out`}>
      <h2 className='font-bold'>{item.name}</h2>
      <div className="my-2 flex gap-2 text-sm">
        <ModalTriggerButton
          type="edit-asig"
          className='bg-black text-white px-4 py-2 rounded cursor-pointer'
          data={{
            id: item.id,
            name: item.name,
            color: item.color
          }}
        >
          Editar
        </ModalTriggerButton>
        <ModalTriggerButton
          type="delete-asig"
          className='bg-black text-white px-4 py-2 rounded cursor-pointer' 
          data={{ id: item.id }}
        >
          Borrar
        </ModalTriggerButton>
      </div>
    </div>
  );
}