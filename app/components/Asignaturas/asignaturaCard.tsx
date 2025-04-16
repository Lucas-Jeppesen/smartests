'use client';

import ModalTriggerButton from '../modals/modalTriggerButton';
import { Tables } from '@/database.types';
import { ArrowDown, ChartLine } from 'lucide-react';
import { Edit } from 'lucide-react';


const colorVariants = {
  red: 'text-red-500 border-red-500',
  orange: 'text-orange-500 border-orange-500',
  amber: 'text-amber-500 border-amber-500',
  yellow: 'text-yellow-500 border-yellow-500',
  lime: 'text-lime-500 border-lime-500',
  green: 'text-green-500 border-green-500',
  emerald: 'text-emerald-500 border-emerald-500',
  teal: 'text-teal-500 border-teal-500',
  cyan: 'text-cyan-500 border-cyan-500',
  sky: 'text-sky-500 border-sky-500',
  blue: 'text-blue-500 border-blue-500',
  indigo: 'text-indigo-500 border-indigo-500',
  violet: 'text-violet-500 border-violet-500',
  purple: 'text-purple-500 border-purple-500',
  fuchsia: 'text-fuchsia-500 border-fuchsia-500',
  pink: 'text-pink-500 border-pink-500',
  rose: 'text-rose-500 border-rose-500',
  slate: 'text-slate-500 border-slate-500',
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
    <div key={item.id} className={`flex justify-between items-stretch w-full border py-2 px-5 rounded-xl transition-all duration-300 ease-in-out bg-yellow-1 ${colorVariants[color as ColorVariant]}`}>
      <div className='flex flex-col gap-2 py-1'>
        <h2 className='font-medium text-xl'>{item.name}</h2>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-1'>
            <ArrowDown className='w-4 h-4 text-green-gray'/>
            <p className='font-medium text-sm text-green-gray pt-[2px]'>12 tests</p>
          </div>
          <div className='flex items-center gap-1'>
            <ChartLine className='w-4 h-4 text-green-gray'/>
            <p className='font-medium text-sm text-green-gray'>Nota media: 9,7</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end pb-1.5">
        <ModalTriggerButton
          type="delete-asig"
          className='text-red-500 cursor-pointer text-sm underline text-right pt-1 pr-1' 
          data={{ id: item.id }}
        >
          Borrar
        </ModalTriggerButton>
        <ModalTriggerButton
          type="edit-asig"
          className='bg-green-3 hover:bg-green-1 p-1 rounded cursor-pointer w-6 h-6 duration-200'
          data={{
            id: item.id,
            name: item.name,
            color: item.color
          }}
        >
          <Edit className='w-4 h-4 text-yellow-1 text-center'/>
        </ModalTriggerButton>
      </div>
    </div>
  );
}









// <div key={item.id} className={`flex justify-between bg-yellow-1 items-center w-full border  p-4 rounded  transition-all duration-300 ease-in-out`}>
// <h2 className={`font-medium text-xl ${colorVariants[color as ColorVariant]}`}>{item.name}</h2>
// <div className="my-2 flex gap-2 text-sm">
//   <ModalTriggerButton
//     type="edit-asig"
//     className='bg-black text-white px-4 py-2 rounded cursor-pointer'
//     data={{
//       id: item.id,
//       name: item.name,
//       color: item.color
//     }}
//   >
//     Editar
//   </ModalTriggerButton>
//   <ModalTriggerButton
//     type="delete-asig"
//     className='bg-black text-white px-4 py-2 rounded cursor-pointer' 
//     data={{ id: item.id }}
//   >
//     Borrar
//   </ModalTriggerButton>
// </div>
// </div>