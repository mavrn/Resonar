import type { DocumentData } from 'firebase/firestore';
import { User } from '../utils/User';
import { Firestore } from 'firebase/firestore';

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
