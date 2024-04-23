import axios from 'axios';
import { BookType, UserType } from '../utils/types';

const baseUrl = 'http://localhost:7000/api';

const login = async (username: string, password: string) => {
  const user = { username, password };
  console.log('userService login user:', user);
  const response = await axios.post(`${baseUrl}/login`, user);

  console.log('userService login response:', response);
  const { data } = response;
  console.log('userService login data:', data);
  if (data.success) {
    return {
      success: true,
      message: data.message,
      user: data.user,
      token: data.token,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

const register = async (username: string, password: string) => {
  const user = { username, password };

  const { data } = await axios.post(`${baseUrl}/register`, user);
  console.log('userService register data:', data);
  if (data.success) {
    return login(username, password);
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

const getEventById = async (id: string) => {
  const { data } = await axios.get(`${baseUrl}/events/${id}`);
  console.log('getEventById data:', data);

  if (data) {
    const { success } = data;
    console.log('getEventById success:', success);

    if (success) {
      const { event } = data;
      return {
        success: true,
        event: event,
      };
    }
  }
};

const getUserBooks = async (username: string, token: string) => {
  const { data } = await axios.get(`${baseUrl}/users/${username}/books`, {
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
    `${baseUrl}/books/has-read`,
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

const deleteUserEvent = async (token: string, eventId: string) => {
  const { user } = await getUserByToken(token);
  console.log('deleteUserEvent eventId:', eventId);
  const { username } = user;

  const { data } = await axios.put(
    `${baseUrl}/users/${username}/events/${eventId}`
  );
  console.log('deleteUserEvent data:', data);
  if (data.success) {
    return {
      success: true,
      message: 'Deleted event',
      events: data.events,
    };
  }
};

const getUserByToken = async (token: string) => {
  const { data } = await axios.get(`${baseUrl}/users/${token}`);

  if (data.success) {
    return {
      success: true,
      user: data.user,
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
  deleteUserEvent,
  getUserByToken,
  getEventById,
  getUserBooks,
  login,
  register,
};
