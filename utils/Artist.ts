import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { Release } from './Release';

export class Artist {
  avatar: string;
  name: string;
  uid: number;

  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.avatar = docData.avatar;
      this.name = docData.name;
    }
  }
}
