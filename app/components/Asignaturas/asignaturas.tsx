'use client';

import { useState, useEffect } from 'react';
import { ModalProvider } from '../modals/modalContext';
import ModalTriggerButton from '../modals/modalTriggerButton';
import CreateModal from '../modals/createModal';
import EditModal from '../modals/editModal';
import DeleteModal from '../modals/deleteModal';
import { fetchWholeTable } from '@/app/utils/fetches/fetchWholeTable';
import { Tables } from '@/database.types';


export default function Asignaturas() {
  // const [items, setItems] = useState([
  //   { id: '1', name: 'Item 1' },
  //   { id: '2', name: 'Item 2' }
  // ]);
  const [asignaturas, setAsignaturas] = useState<Tables<'asignatura'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWholeTable('asignatura');
        console.log("asignaturas fetched data", data);
        setAsignaturas(data);
      } catch (error) {
        console.error("Failed to load asignaturas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  
  return (
    <ModalProvider>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Asignaturas</h1>
        
        <ModalTriggerButton
          type="create"
          className='bg-blue-500 text-white px-4 py-2 rounded mb-4'
        >
          Crear nueva
        </ModalTriggerButton>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asignaturas.map(item => (
            <div key={item.id} className="border p-4 rounded">
              <h2>{item.name}</h2>
              <div className="mt-2 flex gap-4">
                <ModalTriggerButton
                  type="edit"
                  className='bg-blue-300 text-white px-4 py-2 rounded mb-4'
                >
                  Editar
                </ModalTriggerButton>
                <ModalTriggerButton
                  type="delete"
                  className='bg-red-500 text-white px-4 py-2 rounded mb-4'
                >
                  Borrar
                </ModalTriggerButton>
              </div>
            </div>
          ))}
        </div>
        
        {/* Include all modal components */}
        <CreateModal />
        <EditModal />
        <DeleteModal />
      </div>
    </ModalProvider>
  );
}