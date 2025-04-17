'use client';

import ModalTriggerButton from '../modals/modalTriggerButton';
import { QuizWithAsignatura } from '../Quiz/types';
import { formatDate } from '@/app/utils/general-helpers';
import Link from 'next/link';
import { Calendar, CircleHelp, LibraryBig } from 'lucide-react';
import { BarChart2 } from 'lucide-react';


type TestCardProps = {
  item: QuizWithAsignatura;
};

const colorVariants = {
  red: 'text-red-700',
  orange: 'text-orange-700',
  amber: 'text-amber-700',
  yellow: 'text-yellow-700',
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


export default function TestCard({ item } : TestCardProps) {
  
  const formatedDate = formatDate(item.created_at);

  let asignatura_name = "";
  let asignatura_color = "";
  if (item.asignatura_id) {
    asignatura_name = item.asignatura.name;
    asignatura_color = item.asignatura.color;
  } else {
    asignatura_name = "sin asignatura";
  }

  return (
    <div key={item.id} className={`flex justify-between items-stretch w-full border border-yellow-4 p-5 px-8 rounded-xl transition-all duration-300 ease-in-out bg-yellow-1`}>
      <div className='flex flex-col gap-4 py-1'>
        <h2 className='font-medium text-xl'>{item.name}</h2>
        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-1'>
            <Calendar className='w-4 h-4'/>
            <p className='font-medium text-sm text-green-gray pt-[2px]'>{formatedDate}</p>
          </div>
          <div className='flex items-center gap-1'>
            <CircleHelp className='w-4 h-4'/>
            <p className='font-medium text-sm text-green-gray'>{`${item.num_questions} preguntas`}</p>
          </div>
          <div className={`flex items-center gap-1 ${colorVariants[asignatura_color as ColorVariant]}`} >
            <LibraryBig className='w-4 h-4'/>
            <p className='font-medium text-sm'>{asignatura_name}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <ModalTriggerButton
          type="delete-test"
          className='text-red-600 cursor-pointer text-sm underline text-right' 
          data={{ id: item.id }}
        >
          Borrar
        </ModalTriggerButton>
        <div className='flex gap-2'>
          <ModalTriggerButton
            type="stats-test"
            data={{
              id: item.id,
              name: item.name,
              formated_date: formatedDate,
              num_questions: item.num_questions,
              asignatura: item.asignatura,
            }}
            className="flex items-center cursor-pointer gap-2 text-green-gray hover:text-green-4 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
          </ModalTriggerButton>
          <Link href={`/escritorio/test/${item.id}`} className='bg-green-4 hover:bg-green-2 text-white px-12 py-1 rounded cursor-pointer text-sm transition-all duration-300 ease-in-out'>Iniciar</Link>
        </div>
      </div>
    </div>
  );
}



