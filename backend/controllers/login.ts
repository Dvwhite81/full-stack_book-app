import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import User from '../models/user';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log('loginRouter user:', user);
  const correctPassword =
    user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash as string);

  if (!user || !correctPassword) {
    console.log('loginRouter returning error');
    return res.send({
      status: 401,
      success: false,
      message: 'Invalid username or password',
    });
  }

  console.log('loginRouter after error');
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET as string, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({
    token,
    success: true,
    message: 'Logged in successfully',
    user: user,
    events: user.events,
    toDos: user.toDos,
  });
});

export default loginRouter;
