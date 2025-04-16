import { useModal } from "./modalContext";
import BaseModal from "./baseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarAsignatura } from "@/app/utils/asignaturas";


interface userIdProp {
  userId: string;
}

export default function DeleteAsigModal({ userId } : userIdProp) {
  const queryClient = useQueryClient()
  const { modalState, closeModal } = useModal();
  const id = modalState.data?.id;


  const createMutation = useMutation({
    mutationFn: () => borrarAsignatura({ id: id ?? '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas', userId] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error al editar la asignatura:', error);
    }
  });

  if (modalState.type !== 'delete-asig') return null;

  const handleDelete = () => {
    createMutation.mutate();

  };

return (
    <BaseModal title="Borrar Asignatura" onConfirm={handleDelete}>
    <p>Seguro que quieres eliminar {modalState.data?.name}?</p>
    </BaseModal>
);
}