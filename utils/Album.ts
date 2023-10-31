import { Artist } from './Artist';
import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

function toTitleCase(str: string) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) {
        return word; // Handle empty strings
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

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

  async resolveArtist() {
    return new Promise((resolve, reject) => {
      getDoc(this.artistUnresolved)
        .then((artistSnapshot) => {
          this.artist = new Artist(artistSnapshot);
          resolve(this); // Resolve the promise with 'this'
        })
        .catch(reject); // Reject the promise if there's an error
    });
  }

  resolveArtistLocal(artistName: string) {
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName);
  }

  resolveLocal(
    uid: number,
    artistName: string,
    title: string,
    cover: string,
    year: number,
    score: number
  ) {
    this.uid = uid;
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName);
    this.title = title;
    this.cover = cover;
    this.date = String(year);
    this.score = score;
  }
}
