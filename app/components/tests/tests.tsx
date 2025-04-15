'use client';


import { ModalProvider } from '../modals/modalContext';
import { fetchQuizesExtended } from '@/app/utils/fetches/fetchQuizesExtended';
import { useQuery } from '@tanstack/react-query';
import TestCard from './testCard';
import DeleteTestModal from '../modals/deleteTestModal';


export default function Tests() {

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['obtener-tabla', 'quiz'],
    queryFn: () => fetchQuizesExtended('quiz'),
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  
  return (
    <ModalProvider>
        <div className="flex flex-col gap-2">
          {Array.isArray(data) && data.map(item => (
            <TestCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <DeleteTestModal />
    </ModalProvider>
  );
}