import { Artist } from './Artist';
import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

export class Album {
  uid: number;
  artistUnresolved: DocumentReference;
  artist: Artist | null;
  title: string;
  cover: string;
  date: string;
  score: number;
  discussion: DocumentReference[];

  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.cover = docData.cover;
      this.date = docData.date;
      this.title = docData.name;
      this.score = docData.score;
      this.discussion = [];
      this.artistUnresolved = docData.artist;
      this.artist = null;
    }
  }

  async resolve() {
    return new Promise((resolve, reject) => {
      getDoc(this.artistUnresolved)
        .then((artistSnapshot) => {
          this.artist = new Artist(artistSnapshot);
          resolve(this); // Resolve the promise with 'this'
        })
        .catch(reject); // Reject the promise if there's an error
    });
  }
}
