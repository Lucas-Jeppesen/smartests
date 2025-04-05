import { useModal } from "./modalContext";
import BaseModal from "./baseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { borrarTest } from "@/app/utils/tests";

export default function DeleteTestModal() {
  const queryClient = useQueryClient()
  const { modalState, closeModal } = useModal();
  const id = modalState.data?.id;


  const createMutation = useMutation({
    mutationFn: () => borrarTest({ id: id ?? ''  }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obtener-tabla', 'quiz'] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error al editar la asignatura:', error);
    }
  });

  if (modalState.type !== 'delete-test') return null;

  const handleDelete = () => {
    createMutation.mutate();

  };

return (
    <BaseModal title="Borrar Test" onConfirm={handleDelete}>
    <p>Seguro que quieres eliminar {modalState.data?.name}?</p>
    </BaseModal>
);
}