"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { FaSignOutAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Using 'any' for simplicity, adjust as needed
  const router = useRouter();
  const supabase = supabaseBrowser();

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      setUser(null);
      router.push('/auth');
    }
  };

  return (
    <header className="mb-3 sm:my-3 flex flex-row justify-between w-full py-3 max-w-4xl bg-purple-100 mb-6 ">
      <h1 className="text-sm px-3 font-bold font-lato">ChatGPT Instructions Marketplace</h1>
      {user ? (
        <div className="flex items-center">
          <span className="text-xs px-3 font-semibold text-purple-500/70">@{user.email.split('@')[0]}</span>
          <button onClick={handleSignOut} className="text-xs pr-3 text-neutral-400 hover:underline hover:text-red-600">
            <FaSignOutAlt />
          </button>
        </div>
      ) : (
        <a href="/auth" className="text-xs px-3 text-purple-600 hover:underline">
          Sign In
        </a>
      )}
    </header>
  );
};

export default Header;
