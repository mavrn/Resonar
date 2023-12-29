import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

/**
 * Generic Artist helper class for unifying the app
 * @date 12/29/2023 - 3:36:29 AM
 *
 * @export
 * @class Artist
 * @typedef {Artist}
 */
export class Artist {
  avatar: string;
  name: string;
  uid: string;

  /**
   * Creates an instance of Artist.
   * @date 12/29/2023 - 3:38:13 AM
   *
   * @constructor
   * @param {?DocumentData} [doc] Takes in a Firestore Document. For manual creation, look for resolveAllLocal.
   */
  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.avatar = docData.picture;
      this.name = docData.name;
    }
  }
  /**
   * Resolves artist maunally
   * @param uid Unique ID of the Artist
   * @param avatar Avatar URL
   * @param name Artist name
   */
  resolveAllLocal(uid: string, avatar: string, name: string) {
    this.uid = uid;
    this.avatar = avatar;
    this.name = name;
  }
}
