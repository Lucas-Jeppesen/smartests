'use client';


import { ModalProvider } from '../modals/modalContext';
import ModalTriggerButton from '../modals/modalTriggerButton';
import CreateModal from '../modals/createModal';
import EditModal from '../modals/editModal';
import DeleteModal from '../modals/deleteModal';
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
    <ModalProvider>
      <div className="p-4 w-full">
        <div className='flex justify-between'>
          <h1 className="text-2xl font-bold mb-4">Asignaturas</h1>
          <ModalTriggerButton
            type="create"
            className='bg-gray-50 text-gray-950 px-4 py-2 rounded mb-4 cursor-pointer border-1 border-gray-400'
          >
            Crear nueva
          </ModalTriggerButton>
        </div>
        <div className="flex flex-col gap-4">
          {data.map(item => (
            <AsignaturaCard key={item.id} item={item} />
          ))}
        </div>
        {/* Including all modal components */}
        <CreateModal />
        <EditModal />
        <DeleteModal />
      </div>
    </ModalProvider>
  );
}