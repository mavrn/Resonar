import { User } from './User';
import { Album } from './Album';

export class Comment {
  content: string;
  created: Date;
  replies?: Comment[];
  rating?: number;
  release?: Album;
  user?: User;
  parent?: Comment;
  picture?: string;

  constructor(
    content: string,
    created_seconds: number,
    replies?: Comment[],
    rating?: number,
    release?: Album,
    user?: User,
    parent?: Comment,
    picture?: string
  ) {
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
