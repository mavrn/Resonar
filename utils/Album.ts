import { Artist } from './Artist';
import { User } from './User';
import { Comment } from './Comment';
import {
  DocumentReference,
  getDoc,
  Firestore,
  collection,
  query,
  getDocs,
  orderBy,
  doc,
} from 'firebase/firestore';
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
  rating: number;
  ratingCount: number;
  genres: string[];
  comments: Comment[];
  tracklist: { title: string; duration: string; index: number }[];

  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.cover = docData.cover;
      this.date = docData.date;
      this.title = docData.name;
      this.rating = docData.score;
      this.comments = [];
      this.tracklist = [];
      this.genres = docData.genres;
      this.artistUnresolved = docData.artist;
      this.ratingCount = docData.ratingCount;
      this.artist = null;
    }
  }

  async resolveArtist() {
    return new Promise((resolve, reject) => {
      getDoc(this.artistUnresolved)
        .then((artistSnapshot) => {
          this.artist = new Artist(artistSnapshot);
          resolve(this);
        })
        .catch(reject);
    });
  }

  async resolveComments(db: Firestore) {
    const comments = collection(db, 'albums/' + this.uid + '/comments');
    const commentsQuery = query(comments);
    getDocs(commentsQuery).then((commentsSnapshot) => {
      commentsSnapshot.forEach(async (comment) => {
        const commentData = comment.data();
        const replyIndex = collection(
          db,
          'albums/' + this.uid + '/comments/' + comment.id + '/replies'
        );
        const replyQuery = query(replyIndex, orderBy('created', 'asc'));
        const replyDocs = await getDocs(replyQuery);
        const replies: Comment[] = [];
        replyDocs.forEach(async (replyDoc) => {
          const replyData = replyDoc.data();
          const user = new User(await getDoc(replyData.user));
          replies.push(
            new Comment(
              replyData.content,
              replyData.created,
              undefined,
              undefined,
              undefined,
              user,
              undefined
            )
          );
        });
        replies.sort((a, b) => b.created.getSeconds() - a.created.getSeconds());
        const user = new User(await getDoc(commentData.user));
        const newComment = new Comment(
          commentData.content,
          commentData.created,
          replies,
          commentData.score,
          undefined,
          user,
          undefined
        );
        this.comments.push(newComment);
      });
    });
  }

  async resolveTracklist(db: Firestore) {
    const tracklistCollection = collection(
      db,
      'albums/' + this.uid + '/tracklist'
    );
    const tracklistQuery = query(tracklistCollection, orderBy('index', 'asc'));
    getDocs(tracklistQuery).then((tracklistSnapshot) => {
      tracklistSnapshot.forEach((track) => {
        const trackData = track.data();
        this.tracklist.push({
          title: trackData.title,
          duration: trackData.duration,
          index: trackData.index,
        });
      });
    });
  }

  resolveArtistLocal(artistName: string) {
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName);
  }

  resolveAllLocal(
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
    this.rating = score;
  }
}
