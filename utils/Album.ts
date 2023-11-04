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
  addDoc,
  Timestamp,
  where,
  deleteDoc,
  setDoc,
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
  uid: string;
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
    const commentsSnapshot = await getDocs(commentsQuery);

    const commentPromises = commentsSnapshot.docs.map(async (comment) => {
      const commentData = comment.data();
      const replyIndex = collection(
        db,
        'albums/' + this.uid + '/comments/' + comment.id + '/replies'
      );
      const replyQuery = query(replyIndex, orderBy('created', 'asc'));
      const replyDocs = await getDocs(replyQuery);
      const replies: Comment[] = [];

      const userPromises: Promise<void>[] = [];

      replyDocs.forEach((replyDoc) => {
        const replyData = replyDoc.data();
        const userPromise = (async () => {
          const user = new User(await getDoc(replyData.user));
          const imageData = await loadImage(user.picture);
          const ratingDoc = await getDoc(
            doc(db, 'users/' + user.uid + '/ratings', this.uid)
          );
          let rating;
          if (ratingDoc.exists()) {
            rating = ratingDoc.data().rating;
          } else {
            rating = undefined;
          }
          const replyComment = new Comment(
            replyData.content,
            replyData.created.seconds,
            undefined,
            rating,
            undefined,
            user,
            undefined,
            imageData
          );
          replies.push(replyComment);
        })();
        userPromises.push(userPromise);
      });

      await Promise.all(userPromises);
      replies.sort((a, b) => {
        return a.created.getTime() - b.created.getTime();
      });
      const user = new User(await getDoc(commentData.user));
      const imageData = await loadImage(user.picture);
      const ratingDoc = await getDoc(
        doc(db, 'users/' + user.uid + '/ratings', this.uid)
      );
      let rating;
      if (ratingDoc.exists()) {
        rating = ratingDoc.data().rating;
      } else {
        rating = undefined;
      }
      const newComment = new Comment(
        commentData.content,
        commentData.created.seconds,
        replies,
        rating,
        undefined,
        user,
        undefined,
        imageData
      );

      this.comments.push(newComment);
    });

    await Promise.all(commentPromises);
    this.comments.sort((a, b) => {
      return b.created.getTime() - a.created.getTime();
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

  async addComment(db: Firestore, content: string, user: User) {
    console.log(content, user);
    const releaseRef = doc(db, 'albums/', this.uid);
    const docRef = await addDoc(
      collection(db, 'users/' + user.uid + '/comments'),
      {
        created: Timestamp.now(),
        content: content,
        release: releaseRef,
      }
    );
    const commentID = docRef.id;

    const userRef = doc(db, 'users/', user.uid);
    setDoc(doc(db, 'albums/' + this.uid + '/comments', commentID), {
      created: Timestamp.now(),
      content: content,
      user: userRef,
    });

    const imageData = await loadImage(user.picture);
    const ratingDoc = await getDoc(
      doc(db, 'users/' + user.uid + '/ratings', this.uid)
    );
    let rating;
    if (ratingDoc.exists()) {
      rating = ratingDoc.data().rating;
    } else {
      rating = undefined;
    }

    return new Comment(
      content,
      Date.now() + 1000,
      [],
      rating,
      undefined,
      user,
      undefined,
      imageData
    );
  }

  async removeComment(db: Firestore, commentID: string) {
    const commentToDelete = await getDoc(
      doc(db, 'albums/' + this.uid + '/comments', commentID)
    );
    const commentUserID = commentToDelete.data().user.id;
    deleteDoc(commentToDelete.ref);
    deleteDoc(
      (await getDoc(doc(db, 'users/' + commentUserID + '/comments', commentID)))
        .ref
    );
  }

  resolveArtistLocal(artistName: string) {
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName);
  }

  resolveAllLocal(
    uid: string,
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
