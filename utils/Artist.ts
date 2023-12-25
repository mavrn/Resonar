import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

export class Artist {
  avatar: string;
  name: string;
  uid: string;

  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.avatar = docData.picture;
      this.name = docData.name;
    }
  }

  resolveAllLocal(uid: string, avatar: string, name: string) {
    this.uid = uid;
    this.avatar = avatar;
    this.name = name;
  }
}
