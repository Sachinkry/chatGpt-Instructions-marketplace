'use client'

import { useState, FormEvent } from 'react'
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import InstructionForm from '@/components/InstructionForm';
import InstructionList from '@/components/InstructionList';
import { InstructionProvider } from '@/context/InstructionContext';

export default function Home() {

  return (
      <InstructionProvider>
          <div className="min-h-screen w-full px-4 flex flex-col items-center font-mono">
            <Header />
            <InstructionForm />
            <div className="w-full max-w-4xl mb-6">
              <hr className="border-gray-300 mb-4" />
            </div>
            <InstructionList />
            <Toaster />
          </div>
      </InstructionProvider> 
  )
}
