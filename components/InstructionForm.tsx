"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useInstructionContext } from '@/context/InstructionContext';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { useToast } from './ui/use-toast';

const InstructionForm: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [user, setUser] = useState<any>(null); // Using 'any' for simplicity, adjust as needed
  const { addInstruction } = useInstructionContext();
  const supabase = supabaseBrowser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data?.user);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      addInstruction(input);
      setInput('');
    }

  };

  return (
    <div className="w-full max-w-4xl px-3 sm:px-0">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1 px-3">
            Add your own ChatGPT instruction
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-black text-xs"
            rows={4}
            placeholder="How would you like ChatGPT to respond?"
          />
        </div>
        <div className="flex flex-row justify-end w-full">
          <button
            type="submit"
            className={`w-20 text-xs p-2 rounded ${user ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!user || !input}
            title={`${!user ? "Sign In to Submit": " "}`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructionForm;
