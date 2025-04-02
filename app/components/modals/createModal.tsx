'use client';

import { useState } from "react";
import BaseModal from "./baseModal";
import { useModal } from "./modalContext";
import ColorPicker from "./colorPicker";

export default function CreateModal() {
  const { modalState, closeModal } = useModal();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  if (modalState.type !== 'create') return null;

  const handleSubmit = () => {
    // For now, log the input values.
    console.log("Subject Name:", name, "Selected Color:", color);
    // Later, you can add your logic to send data to Supabase here.
    closeModal();
  };

  return (
    <BaseModal title="Create Subject" onConfirm={handleSubmit}>
      <div className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subject Name"
          className="border rounded px-2 py-1"
        />
        <ColorPicker selectedColor={color} onSelectColor={setColor} />
      </div>
    </BaseModal>
  );
}
