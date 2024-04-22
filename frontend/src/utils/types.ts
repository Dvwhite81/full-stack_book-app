export interface UserType {
  _id: string;
  username: string;
  password: string;
  booksRead: BookInDB[];
  booksToRead: BookInDB[];
  bookReviews: BookReview[];
}

export interface InputField {
  name: string;
  label: string;
  inputType: string;
  value: string;
  setValue: (value: string) => void;
}

export interface CheckboxField {
  name: string;
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserType;
  token?: string;
}

export interface UserResult {
  success: boolean;
  message: string;
}

export interface BookInfo {
  title: string;
  authors?: string[];
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface BookType {
  id?: string;
  bookId: string;
  searchInfo: {
    textSnippet: string;
  };
  volumeInfo: BookInfo;
  userHasRead: boolean;
  userReview?: {
    score?: number;
    reviewText?: string;
  };
}

export interface BookInDB extends BookType {
  _id: string;
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
