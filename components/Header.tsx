"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { FaSignOutAlt } from 'react-icons/fa';
import useInstructions from '@/hooks/useInstructions';

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null); 
  const supabase = supabaseBrowser();
  const router = useRouter();
  const { handleRickRoll, totalRickRollCount } = useInstructions();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data?.user);
        console.log("dfdf", data?.user)
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
    <header className="mb-3 sm:px-6 sm:my-3  w-full  max-w-4xl  mb-6 ">
      <div className="py-3 bg-purple-100 w-full flex flex-row justify-between">
      <h1 className="text-xs sm:text-sm px-3 font-bold font-sans">ChatGPT Instructions Marketplace</h1>
      
      <div className="flex items-center">
          {user ? (
            <a
              className="text-xs px-3 text-purple-400 underline  cursor-pointer"
              onClick={handleRickRoll}
            >
              surprise!<span>{totalRickRollCount ? `(${totalRickRollCount})`:''}</span>
            </a>
          ) : (
            <span title="sign in anon" className="text-xs px-3 text-purple-400 cursor-not-allowed">
              surprise!
            </span>
          )}
      </div>

      {user ? (
        <div className="flex items-center">
          <span className="text-xs px-3 font-semibold text-purple-500/70">@{user.user_metadata.user_name || user.email.split('@')[0]}</span>
          <button onClick={handleSignOut} className="text-xs pr-3 text-neutral-400 hover:underline hover:text-red-600">
            <FaSignOutAlt />
          </button>
        </div>
      ) : (
        <a href="/auth" className="text-xs px-3 text-purple-600 underline">
          Sign In
        </a>
      )}
      </div>
    </header>
  );
};

export default Header;
