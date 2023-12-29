import type { DocumentData } from 'firebase/firestore';
import { User } from '../utils/User';
import { Firestore } from 'firebase/firestore';

/**
 * Pinia store for managing the currently logged in user.
 * State management necessary, as this is accessed from many parts of the app.
 */
export const useUserStore = defineStore('currentUser', {
  state: () => ({
    currentUser: null as User | null,
  }),
  actions: {
    setUser(newUser: User | null) {
      this.currentUser = newUser;
    },
  },
});
