'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import useInstructions from '@/hooks/useInstructions';


// Define the props interface for InstructionProvider
interface InstructionProviderProps {
  children: ReactNode;
}

// Create context with the type from useInstructions
const InstructionContext = createContext({} as ReturnType<typeof useInstructions>);

export const InstructionProvider: React.FC<InstructionProviderProps> = ({ children }) => {
  const instructions = useInstructions();

  return (
    <InstructionContext.Provider value={instructions}>
      {children}
    </InstructionContext.Provider>
  );
};

export const useInstructionContext = () => {
  const context = useContext(InstructionContext);
  if (context === undefined) {
    throw new Error('useInstructionContext must be used within an InstructionProvider');
  }
  return context;
};