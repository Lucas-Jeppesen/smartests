import { useModal } from "./modalContext";
import BaseModal from "./baseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarAsignatura } from "@/app/utils/asignaturas";

export default function DeleteModal() {
  const queryClient = useQueryClient()
  const { modalState, closeModal } = useModal();
  const id = modalState.data?.id;


  const createMutation = useMutation({
    mutationFn: () => borrarAsignatura({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obtener-tabla', 'asignatura'] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error al editar la asignatura:', error);
    }
  });

  if (modalState.type !== 'delete') return null;

  const handleDelete = () => {
    createMutation.mutate();

  };

return (
    <BaseModal title="Borrar Asignatura" onConfirm={handleDelete}>
    <p>Seguro que quieres eliminar {modalState.data?.name}?</p>
    </BaseModal>
);
}