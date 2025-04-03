'use client';

import { useModal } from "./modalContext";


interface ModalTriggerButtonProps {
  type: 'create' | 'edit' | 'delete';
  data?: object | null
  children: React.ReactNode;
  className?: string;
}

export default function ModalTriggerButton({
  type,
  data,
  children,
  className,
}: ModalTriggerButtonProps) {
  const { openModal } = useModal();
  return (
    <button
      onClick={() => openModal(type, data)}
      className={className}
    >
      {children}
    </button>
  );
}
