import { Router } from 'express';
import 'express-async-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../utils/config';

import User from '../models/user';

const usersRouter = Router();

const populateQuery = [
  { path: 'booksRead', select: 'bookId' },
  { path: 'booksToRead', select: 'bookId' },
  { path: 'bookReviews', select: 'bookId' },
];

// Get All Users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate(populateQuery);
  res.json(users);
});

// Get User by Token
usersRouter.get('/:token', async (req, res) => {
  console.log('usersRouter get params:', req.params);
  const { token } = req.params;
  console.log('token:', token);
  const decoded = jwt.verify(token, config.SECRET as string) as JwtPayload;
  console.log('getByToken decoded:', decoded);

  const user = decoded;
  const { id } = user;

  const dbUser = await User.findById(id);

  res.json({
    success: true,
    user: dbUser,
  });
});

// Get User Books by Username
usersRouter.get('/:username/books', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });

  if (user) {
    res.json({
      booksRead: user.booksRead,
      booksToRead: user.booksToRead,
      bookReviews: user.bookReviews,
    });
  } else {
    res.status(404).end();
  }
});

// Add Read Book or Book To Read
usersRouter.post('/:username', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });

  if (user) {
    const { book, type } = req.body;

    if (type === 'hasRead') {
      user.booksRead = user.booksRead.concat(book);
    } else if (type === 'toRead') {
      user.booksToRead = user.booksToRead.concat(book);
    }

    await user.save();
    res.json(user);
  }
});

// Delete User
usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default usersRouter;
