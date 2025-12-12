import { useState, useEffect } from 'react';
import { userService } from '@/services/UserService';
import type { User } from '@/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    setIsLoading(true);
    const loadedUser = userService.getUser();
    setUser(loadedUser);
    setIsLoading(false);
  };

  const createUser = (name: string) => {
    const newUser = userService.createUser(name);
    setUser(newUser);
    return newUser;
  };

  const updateUserName = (name: string) => {
    const updatedUser = userService.updateUserName(name);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const clearUser = () => {
    userService.clearUser();
    setUser(null);
  };

  return {
    user,
    isLoading,
    createUser,
    updateUserName,
    clearUser,
    hasUser: user !== null,
  };
}


