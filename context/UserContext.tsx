'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface User {
  id: string;
  email: string;
  username: string;
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabaseBrowser().auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
      } else if (data?.user) {
        const { id, email = '', app_metadata, user_metadata } = data.user;
        let username = '';

        if (app_metadata?.provider === 'google') {
          username = user_metadata?.user_name || email;
        } else if (app_metadata?.provider === 'twitter' || app_metadata?.provider === 'github') {
          username = user_metadata?.user_name;
        }
        setUser({ id, email, username });
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
