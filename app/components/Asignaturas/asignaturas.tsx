'use client';

import EditAsigModal from '../modals/editAsigModal';
import DeleteAsigModal from '../modals/deleteAsigModal';
import { fetchWholeTable } from '@/app/utils/fetches/fetchWholeTable';
import { useQuery } from '@tanstack/react-query';
import AsignaturaCard from './asignaturaCard';


export default function Asignaturas() {

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['obtener-tabla', 'asignatura'],
    queryFn: () => fetchWholeTable('asignatura'),
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  
  return (
      <div className="p-4 w-full">
        <div className="flex flex-col gap-4">
          {Array.isArray(data) && data.map(item => (
            <AsignaturaCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <EditAsigModal />
        <DeleteAsigModal />
      </div>
  );
}