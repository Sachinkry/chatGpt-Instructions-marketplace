'use client'
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/Header';
import InstructionForm from '@/components/InstructionForm';
import { InstructionProvider } from '@/context/InstructionContext';
import Footer from "@/components/Footer";

const InstructionList = dynamic(
  () => import('@/components/InstructionList'), {
    loading: () => <p>Loading...</p>,
  }
)

export default function Home() {

  return (
      <InstructionProvider>
          <div className="min-h-screen w-full flex flex-col items-center font-mono">
            <Header />
            <InstructionForm />
            <div className="w-full max-w-4xl mb-3">
              <hr className="border-gray-300 mb-4 mx-3 sm:mx-6" />
            </div>
            <InstructionList />
            <Toaster />
            <Footer />
          </div>
      </InstructionProvider> 
  )
}
