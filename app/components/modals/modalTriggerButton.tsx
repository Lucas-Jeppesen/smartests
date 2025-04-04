'use client';

import { useModal } from "./modalContext";
import { ModalType } from "./types";


interface ModalTriggerButtonProps {
  type: ModalType;
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
