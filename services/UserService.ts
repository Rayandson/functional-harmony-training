import { getItem, setItem, removeItem } from '@/lib/storage';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/constants/storage';
import { generateId } from '@/utils/id';

class UserService {
  private readonly storageKey = STORAGE_KEYS.USER;

  getUser(): User | null {
    return getItem<User>(this.storageKey);
  }

  createUser(name: string): User {
    const user: User = {
      id: generateId(),
      name: name.trim(),
      createdAt: Date.now(),
    };
    setItem(this.storageKey, user);
    return user;
  }

  updateUserName(name: string): User | null {
    const user = this.getUser();
    if (!user) {
      return null;
    }
    const updatedUser: User = {
      ...user,
      name: name.trim(),
    };
    setItem(this.storageKey, updatedUser);
    return updatedUser;
  }

  hasUser(): boolean {
    return this.getUser() !== null;
  }

  clearUser(): void {
    removeItem(this.storageKey);
  }
}

export const userService = new UserService();


