import axios from 'axios';
import { BookType } from '../utils/types';

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

const getUserEvents = async (username: string, token: string) => {
  const { data } = await axios.get(`${baseUrl}/users/${username}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getUserEvents data:', data);
  if (data.success) {
    const eventIds = data.events;
    const userEvents = [];

    for (const id of eventIds) {
      const event = getEventById(id);
      userEvents.push(event);
    }
    return {
      success: true,
      events: userEvents,
    };
  } else {
    return {
      success: false,
      message: data.message,
    };
  }
};

const addHasRead = async (token: string, book: BookType) => {
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
  getUserEvents,
  login,
  register,
};
