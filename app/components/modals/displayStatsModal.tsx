'use client';

import { useModal } from './modalContext';
import { ArrowLeft, X, BarChart2 } from 'lucide-react';
import { Calendar, CircleHelp, LibraryBig } from 'lucide-react';


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


export default function ModalDisplayStats() {
  const { modalState, closeModal } = useModal();
  const quizData = modalState.data;

  if (!modalState.isOpen || modalState.type !== 'stats-test') return null;

  return (
    <div className="fixed mt-14 ml-52 inset-0 bg-yellow-2 px-8 flex flex-col gap-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-8">
        <h2 className="font-medium text-xl text-green-4">{quizData?.name}</h2>
        <button 
          onClick={closeModal}
          className="text-green-4 hover:text-green-1 transition-colors duration-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className='flex px-4 py-6 items-center justify-center gap-8 bg-yellow-1 border border-yellow-4 rounded-lg'>
        <div className='flex items-center gap-1'>
          <Calendar className='w-4 h-4'/>
          <p className='font-medium text-sm text-green-gray pt-[2px]'>{quizData.formated_date}</p>
        </div>
        <div className='flex items-center gap-1'>
          <CircleHelp className='w-4 h-4'/>
          <p className='font-medium text-sm text-green-gray'>{`${quizData.num_questions} preguntas`}</p>
        </div>
        <div className={`flex items-center gap-1 ${colorVariants[quizData.asignatura.color as ColorVariant]}`} >
          <LibraryBig className='w-4 h-4'/>
          <p className='font-medium text-sm'>{quizData.asignatura.name}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-1 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-green-4" />
            <h3 className="text-green-gray">Nota media</h3>
          </div>
          <p className="text-3xl font-medium">85%</p>
        </div>
        <div className="bg-yellow-1 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-green-4" />
            <h3 className="text-green-gray">Total intentos</h3>
          </div>
          <p className="text-3xl font-medium">12</p>
        </div>
      </div>

      {/* Attempts List */}
      <div className="bg-yellow-1 rounded-xl p-6">
        <h3 className="text-xl font-medium mb-4">Historial de intentos</h3>
        <div className="space-y-3">
          {[
            { date: '15 Abril 2025', score: 90 },
            { date: '10 Abril 2025', score: 85 },
            { date: '5 Abril 2025', score: 80 },
          ].map((attempt, index) => (
            <div 
              key={index}
              className="flex justify-between items-center bg-white rounded-lg p-4"
            >
              <span className="text-green-gray">{attempt.date}</span>
              <span className="font-medium">{attempt.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
