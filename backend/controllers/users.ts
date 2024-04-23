import { Router } from 'express';
import 'express-async-errors';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import config from '../utils/config';

import User from '../models/user';

const populateQuery = [
  { path: 'booksRead' },
  { path: 'booksToRead' },
  { path: 'bookReviews' },
];
const usersRouter = Router();

// Get All Users
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate(populateQuery);
  res.json(users);
});

// Get User by Token
usersRouter.get('/:token', async (req, res) => {
  console.log('usersRouter get params:', req.params);
  try {
    const { token } = req.params;
    console.log('token:', token);
    const decoded = jwt.verify(token, config.SECRET as string) as JwtPayload;
    console.log('getByToken decoded:', decoded);

    const user = decoded;
    const { id } = user;

    const dbUser = await User.findById(id).populate(populateQuery);

    res.json({
      success: true,
      user: dbUser,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log('Token exists but is expired.');
    }
  }
});

// Get User Books by Username
usersRouter.get('/:username/books', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }).populate(
    populateQuery
  );

  if (user) {
    res.json({
      success: true,
      booksRead: user.booksRead,
      booksToRead: user.booksToRead,
      bookReviews: user.bookReviews,
    });
  } else {
    res.status(404).end();
  }
});

// Delete User
usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default usersRouter;
