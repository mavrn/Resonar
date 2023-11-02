import { DocumentReference, getDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
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

  constructor(
    content: string,
    created_seconds: number,
    replies?: Comment[],
    rating?: number,
    release?: Album,
    user?: User,
    parent?: Comment
  ) {
    this.content = content;
    this.created = new Date(created_seconds*1000)
    this.replies = replies;
    this.rating = rating;
    this.user = user;
    this.parent = parent;
  }
}
