'use client';

import ModalTriggerButton from '../modals/modalTriggerButton';
import { Tables } from '@/database.types';

const colorVariants = {
  red: 'text-red-700',
  orange: 'text-orange-700',
  amber: 'text-amber-700',
  yellow: 'text-yello-700',
  lime: 'text-lime-700',
  green: 'text-green-700',
  emerald: 'text-emerald-700',
  teal: 'text-teal-700',
  cyan: 'text-cyan-700',
  sky: 'text-sky-700',
  blue: 'text-blue-700',
  indigo: 'text-indigo-700',
  violet: 'text-violet-700',
  purple: 'text-purple-700',
  fuchsia: 'text-fuchsia-700',
  pink: 'text-pink-700',
  rose: 'text-rose-700',
  slate: 'text-slate-700',
};
type ColorVariant = keyof typeof colorVariants;


type TestCardProps = {
  item: Tables<'asignatura'>;
};


export default function AsignaturaCard({ item }: TestCardProps) {
  
  let color: string | null = item.color;
  if (color === null) {
    color = 'sky';
  }

  return (
    <div key={item.id} className={`flex justify-between items-center w-full border p-4 rounded  transition-all duration-300 ease-in-out`}>
      <h2 className={`font-medium text-xl ${colorVariants[color as ColorVariant]}`}>{item.name}</h2>
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