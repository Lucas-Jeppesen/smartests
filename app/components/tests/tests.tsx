'use client';


import { ModalProvider } from '../modals/modalContext';
import { fetchQuizesExtended } from '@/app/utils/fetches/fetchQuizesExtended';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
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
      <div className="p-4 w-full">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-bold mb-4">Tests</h1>
          <Link href="/crear-test" className='bg-gray-50 text-gray-950 px-4 py-2 rounded mb-4 cursor-pointer border-1 border-gray-400'>Crear nuevo</Link>
        </div>
        <div className="flex flex-col gap-4">
          {data.map(item => (
            <TestCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <DeleteTestModal />
      </div>
    </ModalProvider>
  );
}