'use client';

import { useState } from "react";
import BaseModal from "./baseModal";
import { useModal } from "./modalContext";
import ColorPicker from "./colorPicker";
import { crearAsignatura } from "@/app/utils/asignaturas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface createAsignProps {
  userId: string;
}

export default function CreateAsigModal( {userId}: createAsignProps ) {
  const queryClient = useQueryClient()
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const createMutation = useMutation({
    mutationFn: () => crearAsignatura({ name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas', userId]});

      closeModal();
    },
    onError: (error) => {
      console.error('Failed to create subject:', error);
    }
  });

  if (modalState.type !== 'create-asig') return null;

  const handleSubmit = () => {
    if (!name.trim() || !color) {
      return;
    }

    createMutation.mutate();

  };

  return (
    <BaseModal 
      title="Create Subject" 
      onConfirm={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="border rounded px-2 py-1"
        />
        <ColorPicker selectedColor={color} onSelectColor={setColor} />
        {createMutation.isError && (
          <p className="text-red-500">Error creating subject</p>
        )}
      </div>
    </BaseModal>
  );
}
