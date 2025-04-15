'use client';


import { ModalProvider } from '../modals/modalContext';
import { fetchQuizesExtended } from '@/app/utils/fetches/fetchQuizesExtended';
import { useQuery } from '@tanstack/react-query';
import TestCard from './testCard';
import DeleteTestModal from '../modals/deleteTestModal';


export default function Tests() {

  const { isError, data, error } = useQuery({
    queryKey: ['obtener-tabla', 'quiz'],
    queryFn: () => fetchQuizesExtended('quiz'),
  })


  if (isError) {
    return <span>Error: {error.message}</span>
  }

  
  return (
    <ModalProvider>
      <div className="p-4 w-full">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-bold mb-4">Tests</h1>
        </div>
        <div className="flex flex-col gap-4">
          {Array.isArray(data) && data.map(item => (
            <TestCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <DeleteTestModal />
      </div>
    </ModalProvider>
  );
}