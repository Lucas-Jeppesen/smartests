import { useModal } from "./modalContext";
import BaseModal from "./baseModal";

export default function DeleteModal() {
const { modalState, closeModal } = useModal();

if (modalState.type !== 'delete') return null;

const handleDelete = () => {
    closeModal();
};

return (
    <BaseModal title="Delete Item" onConfirm={handleDelete}>
    <p>Are you sure you want to delete {modalState.data?.name}?</p>
    </BaseModal>
);
}