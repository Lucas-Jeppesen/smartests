'use client'; 

import { createContext, useState, useContext, ReactNode } from 'react';

type ModalType = 'create' | 'edit' | 'delete' | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  data?: any;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    data: null,
  });
  
  const openModal = (type: ModalType, data?: any) => {
    setModalState({ isOpen: true, type, data });
  };
  
  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
  };
  
  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};