import { User } from './User';
import { Release } from './Release';



/**
 * Description placeholder
 * @date 12/29/2023 - 3:40:03 AM
 * Generic helper class for user comments.
 * @export
 * @class Comment
 * @typedef {Comment}
 */
export class Comment {
  uid: string;
  content: string;
  created: Date;
  replies?: Comment[];
  rating?: number;
  release?: Release;
  user?: User;
  parent?: Comment;
  picture?: string;
  /**
   * Creates a comment with all fields necessary to display it
   * @param uid Unique Comment ID
   * @param content Comment content
   * @param created_seconds Creation time in seconds
   * @param replies List of Reply comments, optional
   * @param rating If the comment author has rated the comment release, rating, optional
   * @param release Parent release of comment
   * @param user Author of comment
   * @param parent If comment is a reply, parent comment
   * @param picture Author picture
   */
  constructor(
    uid: string,
    content: string,
    created_seconds: number,
    replies?: Comment[],
    rating?: number,
    release?: Release,
    user?: User,
    parent?: Comment,
    picture?: string
  ) {
    this.uid = uid;
    this.content = content;
    this.created = new Date(created_seconds * 1000);
    this.replies = replies;
    this.rating = rating;
    this.release = release;
    this.user = user;
    this.parent = parent;
    this.picture = picture;
  }
}
