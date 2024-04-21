import { Router } from 'express';
import 'express-async-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../utils/config';

import User from '../models/user';

const usersRouter = Router();

const populateQuery = [
  { path: 'events', select: 'title' },
  { path: 'toDos', select: 'description' },
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

// Get User Events by Username
usersRouter.get('/:username/events', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  console.log('backend get user events user:', user);
  if (user) {
    res.json({
      success: true,
      events: user.events,
    });
  } else {
    res.status(404).end();
  }
});

// Get User ToDos by Username
usersRouter.get('/:username/toDos', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });

  if (user) {
    res.json({
      toDos: user.toDos,
    });
  } else {
    res.status(404).end();
  }
});

// Delete Event
usersRouter.put('/:username/events/:eventId', async (req, res) => {
  const { username, eventId } = req.params;
  console.log('usersRouter put eventId:', eventId);
  const user = await User.findOne({ username: username });

  if (user) {
    const { events } = user;
    const newEvents = events.filter(
      (event) => event._id.toString() !== eventId
    );

    user.events = newEvents;
    await user.save();

    res.json({
      success: true,
      events: newEvents,
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
