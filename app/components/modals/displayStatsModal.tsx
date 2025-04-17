'use client';

import { fetchAttemps } from '@/app/utils/attemps';
import { useModal } from './modalContext';
import { X, BarChart2 } from 'lucide-react';
import { Calendar, CircleHelp, LibraryBig } from 'lucide-react';
import { TestData } from '../Quiz/types';
import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/database.types';


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
type QuizAttempt = Tables<'quiz_attemp'>;

function isTestData(data: unknown): data is TestData {
  return !!data && typeof data === 'object' && 'id' in data;
}

export default function ModalDisplayStats() {
  const { modalState, closeModal } = useModal();

  const shouldShow =
    modalState.isOpen &&
    modalState.type === 'stats-test' &&
    isTestData(modalState.data);
  
    const quizDataIfShown = shouldShow ? (modalState.data as TestData) : undefined;
  
    const { data } = useQuery({
      queryKey: ['quiz-attemps', quizDataIfShown?.id],
      queryFn: () => quizDataIfShown?.id ? fetchAttemps(quizDataIfShown.id) : Promise.resolve([]),
      enabled: shouldShow && !!quizDataIfShown?.id,
    });
    
    if (!shouldShow) return null;
  
    // After this point, we know quizData exists and is TestData type
    const quizData = modalState.data as TestData;

  const attempts: QuizAttempt[] = Array.isArray(data) ? data : [];
  const totalAttempts = attempts.length;
  
  const averageScore =
    totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / totalAttempts
      : 0;

  const averageScoreRounded = Math.round(averageScore * 100) / 100;
  console.log('Total attempts:', totalAttempts);
  console.log('Average score:', averageScoreRounded);



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
          <p className="text-3xl font-medium">{averageScoreRounded}</p>
        </div>
        <div className="bg-yellow-1 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-green-4" />
            <h3 className="text-green-gray">Total intentos</h3>
          </div>
          <p className="text-3xl font-medium">{totalAttempts}</p>
        </div>
      </div>

      {/* Attempts List */}
      <div className="bg-yellow-1 rounded-xl p-6">
        <h3 className="text-xl font-medium mb-4">Historial de intentos</h3>
        <div className="space-y-3">
          {attempts.length === 0 ? (
            <div>No hay intentos.</div>
          ) : (
            attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex justify-between text-medium items-center bg-yellow-1 border-green-1 border rounded-lg p-4"
              >
                <span className="text-green-gray">
                  {new Date(attempt.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="font-medium">{Math.round((attempt.score ?? 0) * 100) / 100}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
