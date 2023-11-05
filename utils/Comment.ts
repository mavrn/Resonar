import { User } from './User';
import { Release } from './Release';

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
