// components/BaseModal.tsx
'use client';

import { ReactNode } from 'react';
import { useModal } from './modalContext';

interface BaseModalProps {
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
}

export default function BaseModal({ title, children, onConfirm }: BaseModalProps) {
  const { modalState, closeModal } = useModal();
  
  if (!modalState.isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">{children}</div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Confirmar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}