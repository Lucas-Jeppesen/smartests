'use client';

import EditAsigModal from '../modals/editAsigModal';
import DeleteAsigModal from '../modals/deleteAsigModal';
import { fetchWholeTable } from '@/app/utils/fetches/fetchWholeTable';
import { useQuery } from '@tanstack/react-query';
import AsignaturaCard from './asignaturaCard';

interface asignaturasProps {
  userId: string; 
}


export default function Asignaturas( { userId } : asignaturasProps ) {

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['asignaturas', userId],
    queryFn: () => fetchWholeTable('asignatura'),
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  
  return (
      <div className="w-full">
        <div className="flex flex-col gap-2">
          {Array.isArray(data) && data.map(item => (
            <AsignaturaCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <EditAsigModal userId={userId} />
        <DeleteAsigModal userId={userId} />
      </div>
  );
}