import {
  DocumentReference,
  getDoc,
  getDocs,
  Firestore,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { Album } from './Album';

export class User {
  uid: number;
  username: string;
  location: string;
  email: string;
  picture: string;
  created: string;
  comments: { content: string; created: Date; release: Album }[];
  ratings: { rating: number; release: Album; created: Date }[];

  constructor(doc?: DocumentData) {
    if (doc) {
      console.log(doc);
      const docData = doc.data();
      this.uid = doc.id;
      this.username = docData.username;
      this.location = docData.location;
      this.picture = docData.picture;
      this.created = docData.created;
      this.email = docData.email;
      this.comments = [];
      this.ratings = [];
    }
  }

  async resolve(db: Firestore) {
    const ratings = collection(db, 'users/' + this.uid + '/ratings');
    const comments = collection(db, 'users/' + this.uid + '/comments');
    const ratingsQuery = query(ratings, orderBy('created', 'desc'));
    const commentsQuery = query(comments, orderBy('created', 'desc'));
    getDocs(ratingsQuery).then((ratingsSnapshot) => {
      ratingsSnapshot.forEach(async (rating) => {
        const data = rating.data();
        const release = new Album(await getDoc(data.release));
        await release.resolveArtist();
        this.ratings.push({
          rating: data.rating,
          release: release,
          created: new Date(data.created.seconds * 1000),
        });
      });
    });
    getDocs(commentsQuery).then((commentsSnapshot) => {
      commentsSnapshot.forEach(async (comment) => {
        const data = comment.data();
        const release = new Album(await getDoc(data.parentRelease));
        await release.resolveArtist();
        this.comments.push({
          content: data.content,
          release: release,
          created: new Date(data.created.seconds * 1000),
        });
      });
    });
  }

  getAverageRating() {
    if (this.ratings.length > 0) {
      const averageRating =
        this.ratings.reduce((acc, current) => acc + current.rating, 0) /
        this.ratings.length;
      return averageRating.toFixed(1);
    } else {
      return 'No ratings yet.';
    }
  }
}
