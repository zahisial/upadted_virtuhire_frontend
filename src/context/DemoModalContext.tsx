'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import DemoModal from '@/components/DemoModal';

interface DemoModalContextType {
  openModal: () => void;
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <DemoModalContext.Provider value={{ openModal }}>
      {children}
      <DemoModal isOpen={isOpen} onClose={closeModal} />
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const context = useContext(DemoModalContext);
  if (context === undefined) {
    throw new Error('useDemoModal must be used within a DemoModalProvider');
  }
  return context;
}