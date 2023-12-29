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
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

//converts string to proper title case (hello world -> Hello World)
function toTitleCase(str: string) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Generic utility class for Releases
 */
export class Release {
  uid: string;
  artistUnresolved: DocumentReference;
  artist: Artist | null;
  name: string;
  cover: string;
  date: Date;
  rating: number;
  ratingCount: number;
  genres: string[];
  comments: Comment[];
  type: string;
  tracklist: { title: string; duration: string; index: number }[];

  /**
   * Creates an instance of Release.
   * @date 12/29/2023 - 4:01:42 AM
   *
   * @constructor
   * @param {?DocumentData} [doc] Firestore release doc
   */
  constructor(doc?: DocumentData) {
    if (doc) {
      const docData = doc.data();
      this.uid = doc.id;
      this.cover = docData.cover;
      this.date = docData.date;
      this.name = docData.name;
      this.rating = docData.rating;
      this.comments = [];
      this.tracklist = docData.tracklist;
      this.genres = docData.genres;
      this.artistUnresolved = docData.artist;
      this.ratingCount = docData.ratingCount;
      this.type = docData.type;
      this.artist = null;
    }
  }

  /**
   * Resolves artist information. Only done if necessary, as this is an extra DB call.
   * Resolves artist name and picture
   */
  async resolveArtist() {
    if (this.artistUnresolved) {
      return new Promise((resolve, reject) => {
        getDoc(this.artistUnresolved)
          .then((artistSnapshot) => {
            this.artist = new Artist(artistSnapshot);
            resolve(this);
          })
          .catch(reject);
      });
    } else {
      this.artist = new Artist();
      this.artist.name = '';
    }
  }

  /**
   * Resolves all comments and replies of a release, including users, ratings and pictures. Only necessary if viewing the release page.
   * @param db Firestore instance
   */
  async resolveComments(db: Firestore) {
    const comments = collection(db, 'releases/' + this.uid + '/comments');
    const commentsQuery = query(comments);
    const commentsSnapshot = await getDocs(commentsQuery);

    commentsSnapshot.docs.forEach(async (comment) => {
      const commentData = comment.data();
      const replyIndex = collection(
        db,
        'releases/' + this.uid + '/comments/' + comment.id + '/replies'
      );
      const replyQuery = query(replyIndex, orderBy('created', 'asc')); //newer comments first
      const replyDocs = await getDocs(replyQuery);
      const replies: Comment[] = [];

      const userPromises: Promise<void>[] = [];

      replyDocs.forEach((replyDoc) => {
        // for each comments, replies are also resolved
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
            replyDoc.id,
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
        comment.id,
        commentData.content,
        commentData.created.seconds,
        replies,
        rating,
        undefined,
        user,
        undefined,
        imageData
      );

      let inserted = false;
      for (let i = 0; i < this.comments.length; i++) {
        if (
          newComment.created.getTime() >= this.comments[i].created.getTime()
        ) {
          this.comments.splice(i, 0, newComment);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        this.comments.push(newComment);
      }
    });
  }

  /**
   * Creates a new comment under this release, uploads to DB: /releases/id/comments
   * @param db Firestore instance
   * @param content Content of new comment
   * @param user User instance of author
   * @returns Newly created comment, only after uploading to DB
   */
  async addComment(db: Firestore, content: string, user: User) {
    const releaseRef = doc(db, 'releases/', this.uid);
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
    setDoc(doc(db, 'releases/' + this.uid + '/comments', commentID), {
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
      commentID,
      content,
      (Date.now() - 1000) / 1000,
      [],
      rating,
      undefined,
      user,
      undefined,
      imageData
    );
  }

  /**
   * Removes a comment under this release by its ID
   * @param db Firestore instance
   * @param commentID Comment ID
   */
  async removeComment(db: Firestore, commentID: string) {
    const commentToDelete = await getDoc(
      doc(db, 'releases/' + this.uid + '/comments', commentID)
    );
    const commentUserID = commentToDelete.data().user.id;
    deleteDoc(commentToDelete.ref);
    deleteDoc(
      (await getDoc(doc(db, 'users/' + commentUserID + '/comments', commentID)))
        .ref
    );
  }

  /**
   * Removes a reply under this release by its ID and parent ID
   * @param db Firestore instance
   * @param replyID ID of reply to delete
   * @param parentID ID of reply's parent comment
   */
  async removeReply(db: Firestore, replyID: string, parentID: string) {
    const commentToDelete = await getDoc(
      doc(
        db,
        'releases/' + this.uid + '/comments/' + parentID + '/replies',
        replyID
      )
    );
    const commentUserID = commentToDelete.data().user.id;
    deleteDoc(commentToDelete.ref);
    deleteDoc(
      (await getDoc(doc(db, 'users/' + commentUserID + '/comments', replyID)))
        .ref
    );
  }

  /**
   * Adds a reply under a specific comment under this release. Uploads to DB: /releases/this.uid/comments/parentID/replies/
   * @param db Firestore instance
   * @param parentID ID of of parent comment
   * @param newContent Content of new reply
   * @param newUser Author of reply
   * @returns Newly created reply as Comment instance, only after uploading to DB
   */
  async addReply(
    db: Firestore,
    parentID: string,
    newContent: string,
    newUser: User
  ) {
    const userRef = doc(db, 'users/', newUser.uid);
    const releaseRef = doc(db, 'releases/', this.uid);
    const comment = await addDoc(
      collection(
        db,
        'releases/' + this.uid + '/comments/' + parentID + '/replies'
      ),
      { content: newContent, created: Timestamp.now(), user: userRef }
    );
    await setDoc(doc(db, 'users/' + newUser.uid + '/comments', comment.id), {
      content: newContent,
      created: Timestamp.now(),
      release: releaseRef,
    });
    const ratingDoc = await getDoc(
      doc(db, 'users/' + newUser.uid + '/ratings', this.uid)
    );
    let rating;
    if (ratingDoc.exists()) {
      rating = ratingDoc.data().rating;
    } else {
      rating = undefined;
    }
    const imageData = await loadImage(newUser.picture);
    return new Comment(
      comment.id,
      newContent,
      (Date.now() - 1000) / 1000,
      undefined,
      rating,
      undefined,
      newUser,
      undefined,
      imageData
    );
  }

  /**
   * Resolves artist details manually, done when displaying releases with index.json
   * @param artistName Artist name
   * @param artistID Unique artist ID
   */
  resolveArtistLocal(artistName: string, artistID: string) {
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName || '');
    this.artist.uid = artistID;
  }

  /**
   * Resolves all release details manually, matches all fields of index.json
   * @param uid Unique release ID
   * @param artistID Unique artist ID
   * @param title Release title
   * @param cover Release cover URL
   * @param year Release date year
   * @param rating Release rating
   * @param type Release type
   * @param genres All genres
   * @param artistName Name of artist
   */
  resolveAllLocal(
    uid: string | null | undefined,
    artistID: string | null | undefined,
    title: string | null | undefined,
    cover: string | null | undefined,
    year: number,
    rating: number | null | undefined,
    type: string | null | undefined,
    genres: string[] | null | undefined,
    artistName: string
  ) {
    this.uid = uid || '';
    this.artist = new Artist();
    this.artist.name = toTitleCase(artistName || '');
    this.artist.uid = artistID;
    this.name = title || '';
    this.cover = cover || '';
    this.date = new Date(year, 0, 1);
    this.rating = rating || 0;
    this.type = type || '';
    this.genres = genres || [];
  }
}
