import { Artist } from './Artist';
import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

export class Release {
  artistUnresolved: DocumentReference;
  artist: Artist | null;
  title: string;
  cover: string;
  date: string;
  score: number;
  discussion: DocumentReference[];

  constructor(doc: DocumentData) {
    console.log(doc);
    const docData = doc.data();
    console.log(docData);
    this.cover = docData.cover;
    this.date = docData.date;
    this.title = docData.name;
    this.score = docData.score;
    this.discussion = [];
    this.artistUnresolved = docData.artist;
    this.artist = null;
    return this;
  }

  async resolve() {
    getDoc(this.artistUnresolved).then((artistSnapshot) => {
      this.artist = new Artist(artistSnapshot);
      return this;
    });
  }
}
