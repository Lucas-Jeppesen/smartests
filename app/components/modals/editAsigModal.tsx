import { useModal } from "./modalContext";
import { useState, useEffect } from "react";
import BaseModal from "./baseModal";
import { editAsignatura } from "@/app/utils/asignaturas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ColorPicker from "./colorPicker";

interface userIdProp {
  userId: string;
}

export default function EditAsigModal( { userId } : userIdProp ) {
  const queryClient = useQueryClient()
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState(modalState.data?.name || '');
  const [color, setColor] = useState(modalState.data?.color || '');


  useEffect(() => {
    if (modalState.data) {
      setName(modalState.data.name || '');
      setColor(modalState.data.color || '');
    }
  }, [modalState.data]);

  const id = modalState.data?.id;
  console.log("Name:", name);


  const createMutation = useMutation({
    mutationFn: () => editAsignatura({ id, name, color }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas', userId] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error al editar la asignatura:', error);
    }
  });

  if (modalState.type !== 'edit-asig') return null;

  const handleSubmit = () => {
    if (!name.trim() || !color) {
      return;
    }
    createMutation.mutate();

  };

  return (
    <BaseModal 
      title="Editar asignatura" 
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
          <p className="text-red-500">Error creando la asignatura</p>
        )}
      </div>
    </BaseModal>
  );
}