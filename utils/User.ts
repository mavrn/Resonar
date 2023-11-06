import {
  getDoc,
  getDocs,
  Firestore,
  query,
  collection,
  orderBy,
  addDoc,
  setDoc,
  doc,
  Timestamp,
  updateDoc,
  increment,
  where,
  deleteDoc,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { Release } from './Release';

export class User {
  uid: string;
  username: string;
  location: string;
  email: string;
  picture: string;
  created: string;
  comments: { content: string; created: Date; release: Release }[];
  ratings: { rating: number; release: Release; created: Date }[];

  constructor(doc?: DocumentData) {
    if (doc) {
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

  async update(db: Firestore, fields: Object) {
    updateUser(db, this.uid, fields);
  }

  async addRating(db: Firestore, release: Release, rating: number) {
    setDoc(doc(db, 'users/' + this.uid + '/ratings', release.uid), {
      created: Timestamp.now(),
      rating: rating,
    });
    const releaseDoc = await getDoc(doc(db, 'albums', release.uid));

    if (release && releaseDoc.data()) {
      const { ratingCount, score } = releaseDoc.data();
      let newRating = 0;
      if (ratingCount == 0) {
        newRating = rating;
      } else {
        const newTotalRating = ratingCount * score + rating;
        const newRatingCount = ratingCount + 1;
        newRating = parseFloat((newTotalRating / newRatingCount).toFixed(1));
      }
      await updateDoc(doc(db, 'albums', release.uid), {
        ratingCount: increment(1),
        score: newRating,
      });
      return newRating;
    } else {
      console.error('No release found with ID', release.uid);
    }
  }

  async removeRating(db: Firestore, release: Release) {
    const ratingDoc = await getDoc(
      doc(db, 'users/' + this.uid + '/ratings', release.uid)
    );
    const oldRating = ratingDoc.data().rating;
    deleteDoc(ratingDoc.ref);

    const releaseDoc = await getDoc(doc(db, 'albums', release.uid));
    if (release && releaseDoc.data()) {
      const { ratingCount, score } = releaseDoc.data();
      let newRating = 0;

      const newTotalRating = ratingCount * score - oldRating;
      const newRatingCount = ratingCount - 1;
      if (newRatingCount != 0) {
        newRating = parseFloat((newTotalRating / newRatingCount).toFixed(1));
      }
      await updateDoc(doc(db, 'albums', release.uid), {
        ratingCount: increment(-1),
        score: newRating,
      });
      return newRating;
    } else {
      console.error('No release found with ID', release.uid);
    }
  }

  async resolve(db: Firestore) {
    this.ratings = [];
    this.comments = [];
    const ratings = collection(db, 'users/' + this.uid + '/ratings');
    const comments = collection(db, 'users/' + this.uid + '/comments');
    const ratingsQuery = query(ratings, orderBy('created', 'desc'));
    const commentsQuery = query(comments, orderBy('created', 'desc'));

    const [ratingsSnapshot, commentsSnapshot] = await Promise.all([
      getDocs(ratingsQuery),
      getDocs(commentsQuery),
    ]);

    await Promise.all(
      ratingsSnapshot.docs.map(async (rating) => {
        const data = rating.data();
        const release = new Release(
          await getDoc(doc(db, 'albums/', rating.id))
        );
        await release.resolveArtist();
        this.ratings.push({
          rating: data.rating,
          release: release,
          created: new Date(data.created.seconds * 1000),
        });
      })
    );

    await Promise.all(
      commentsSnapshot.docs.map(async (comment) => {
        const data = comment.data();
        const release = new Release(await getDoc(data.release));
        await release.resolveArtist();
        this.comments.push({
          content: data.content,
          release: release,
          created: new Date(data.created.seconds * 1000),
        });
      })
    );
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

  resolveAllLocal(uid: string, username: string, picture: string) {
    this.uid = uid;
    this.username = username;
    this.picture = picture;
  }
}
