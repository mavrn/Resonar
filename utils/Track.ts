import { Album } from './Album';
import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

export class Release {
  albumUnresolved: DocumentReference;
  album: Album | null;
  title: string;
  score: number;
  discussion: DocumentReference[];

  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.title = docData.name;
      this.score = docData.score;
      this.discussion = [];
      this.albumUnresolved = docData.artist;
      this.album = null;
    }
  }

  async resolve() {
    getDoc(this.albumUnresolved).then((albumSnapshot) => {
      this.album = new Artist(albumSnapshot);
      return this;
    });
  }
}
