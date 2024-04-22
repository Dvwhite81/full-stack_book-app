import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface ReqType extends Request {
  user: any;
  token: any;
}

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export interface UserType {
  _id: string;
  username: string;
  password: string;
}

export interface UserWithBooks {
  user: UserType;
  booksRead: BookType[];
  booksToRead: BookType[];
  bookReviews: BookReview[];
}

export interface BookInfo {
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
  searchInfo: {
    textSnippet: string;
  };
}

export interface BookType {
  bookId: string;
  volumeInfo: BookInfo;
}

export interface QueryType {
  kind: string;
  totalItems: number;
  items: BookType[];
}

export interface BookReview {
  book: BookType;
  score: number;
  reviewText?: string;
}
