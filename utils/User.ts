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

/**
 * User utility class for unified source code
 */
export class User {
  uid: string;
  username: string;
  location: string;
  email: string;
  picture: string;
  created: string;
  comments: { content: string; created: Date; release: Release }[];
  ratings: { rating: number; release: Release; created: Date }[];
  bio: string;

  /**
   * Creates an instance of User.
   * @date 12/29/2023 - 4:14:32 AM
   *
   * @constructor
   * @param {?DocumentData} [doc] Firestore user doc
   */
  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.username = docData.username;
      this.location = docData.location;
      this.picture = docData.picture;
      this.bio = docData.bio;
      this.created = docData.created;
      this.email = docData.email;
      this.comments = [];
      this.ratings = [];
    }
  }

  /**
   * Updates this user with any fields
   * @param db Firestore instance
   * @param fields Any fields to update
   */
  async update(db: Firestore, fields: Object) {
    updateUser(db, this.uid, fields);
  }

  /**
   * Adds a rating to this user, uploads to DB: users/this.uid/ratings
   * Also recalculates average rating and ratingCount of release, updates to DB at: releases/release.uid
   * @param db Firestore instance
   * @param release Release instance
   * @param ratingToAdd Rating number, 0-10
   * @returns New average rating calculated
   */
  async addRating(db: Firestore, release: Release, ratingToAdd: number) {
    setDoc(doc(db, 'users/' + this.uid + '/ratings', release.uid), {
      created: Timestamp.now(),
      rating: ratingToAdd,
    });
    const releaseDoc = await getDoc(doc(db, 'releases', release.uid));

    if (release && releaseDoc.data()) {
      const { ratingCount, rating } = releaseDoc.data();
      const newRatingCount = ratingCount + 1;
      let newRating = 0;
      if (ratingCount == 0) {
        newRating = rating;
      } else {
        const newTotalRating = ratingCount * rating + ratingToAdd;
        newRating = newTotalRating / newRatingCount;
      }
      console.log(
        'Adding rating, current rating is',
        rating,
        'current ct is',
        ratingCount
      );

      await updateDoc(doc(db, 'releases', release.uid), {
        ratingCount: newRatingCount,
        rating: newRating,
      });
      console.log(
        'Added rating, current rating is',
        newRating,
        'current ct is',
        newRatingCount
      );
      return newRating;
    } else {
      console.error('No release found with ID', release.uid);
    }
  }

  /**
   * Removes a rating from this user, deletes from DB: users/this.uid/ratings
   * Also recalculates average rating and ratingCount of release, updates to DB at: releases/release.uid
   * @param db Firestore instance
   * @param release Release instance
   * @returns New average rating calculated
   */
  async removeRating(db: Firestore, release: Release) {
    const ratingDoc = await getDoc(
      doc(db, 'users/' + this.uid + '/ratings', release.uid)
    );
    const oldRating = ratingDoc.data().rating;
    deleteDoc(ratingDoc.ref);

    const releaseDoc = await getDoc(doc(db, 'releases', release.uid));
    if (release && releaseDoc.data()) {
      const { ratingCount, rating } = releaseDoc.data();
      let newRating = 0;
      console.log(
        'Removing Rating, current rating is',
        rating,
        'current ct is',
        ratingCount
      );
      const newTotalRating = ratingCount * rating - oldRating;
      const newRatingCount = ratingCount - 1;
      if (newRatingCount != 0) {
        newRating = newTotalRating / newRatingCount;
      }
      await updateDoc(doc(db, 'releases', release.uid), {
        ratingCount: newRatingCount,
        rating: newRating,
      });
      console.log(
        'Removed Rating, current rating is',
        newRating,
        'current ct is',
        newRatingCount
      );
      return newRating;
    } else {
      console.error('No release found with ID', release.uid);
    }
  }

  /**
   * Resolves all relevant fields neccesary for user page (ratings and comments)
   * @param db Firestore instance
   */
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
          await getDoc(doc(db, 'releases/', rating.id))
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

  /**
   * @returns The average rating that this user has given.
   */
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

  /**
   * Manually resolves all fields necessary to display user on index page. Matches fields in index.json
   * @param uid Unique User ID
   * @param username Username
   * @param picture Avatar URL
   */
  resolveAllLocal(uid: string, username: string, picture: string) {
    this.uid = uid;
    this.username = username;
    this.picture = picture;
  }
}
