import { useModal } from "./modalContext";
import { useState } from "react";
import { useEffect } from "react";
import BaseModal from "./baseModal";



export default function EditModal() {
const { modalState, closeModal } = useModal();
const [name, setName] = useState('');

// Initialize the form when the modal opens
useEffect(() => {
    if (modalState.data) {
    setName(modalState.data.name);
    }
}, [modalState.data]);

if (modalState.type !== 'edit') return null;

const handleSubmit = () => {
    closeModal();
};

return (
    <BaseModal title="Edit Item" onConfirm={handleSubmit}>
    <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
    />
    </BaseModal>
);
}