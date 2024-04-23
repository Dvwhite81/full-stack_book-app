import axios from 'axios';
import { BookType, UserType } from '../utils/types';

const bookUrl = 'http://localhost:7000/api/books';
const userUrl = 'http://localhost:7000/api/users';

const getBookById = async (id: string) => {
  const { data } = await axios.get(`${bookUrl}/${id}`);
  console.log('getBookById data:', data);

  if (data) {
    const { success } = data;
    console.log('getBookById success:', success);

    if (success) {
      const { book } = data;
      return {
        success: true,
        book: book,
      };
    }
  }
};

const getUserBooks = async (username: string, token: string) => {
  const { data } = await axios.get(`${userUrl}/${username}/books`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log('getUserBooks data:', data);
  if (data.success) {
    const booksRead = data.booksRead;
    const booksToRead = data.booksToRead;
    const bookReviews = data.bookReviews;

    return {
      success: true,
      booksRead,
      booksToRead,
      bookReviews,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

const addHasRead = async (user: UserType, token: string, book: BookType) => {
  const alreadyRead = (await getUserBooks(user.username, token)).booksRead;
  console.log('addHasRead alreadyRead:', alreadyRead);
  const readBooks = alreadyRead.map((b: BookType) => b.bookId);
  console.log('addHasRead readBooks:', readBooks);
  console.log('addHasRead book.bookId:', book.id);
  if (
    alreadyRead &&
    alreadyRead.map((b: BookType) => b.bookId).includes(book.id)
  ) {
    return {
      success: false,
      message: 'Book already saved!',
    };
  }

  const { data } = await axios.post(
    `${bookUrl}/has-read`,
    {
      token,
      book,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log('addHasRead data:', data);
  if (data.success) {
    return {
      success: true,
      message: data.message,
      newBook: book,
      hasRead: data.hasRead,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

const removeHasRead = async (token: string, bookId: string) => {
  console.log('removeHasRead bookId:', bookId);

  const { data } = await axios.put(
    `${bookUrl}/has-read`,
    {
      token,
      bookId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log('removeHasRead data:', data);
  if (data.success) {
    return {
      success: true,
      message: 'Marked book not read',
      hasRead: data.hasRead,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

export default {
  addHasRead,
  getBookById,
  getUserBooks,
  removeHasRead,
};
