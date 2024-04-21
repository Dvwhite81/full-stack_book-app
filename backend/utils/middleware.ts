import { NextFunction, Request, Response } from 'express';
import jwt, { type Secret } from 'jsonwebtoken';
import logger from './logger';
import User from '../models/user';
import { CustomJwtPayload, ReqType } from './interfaces';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log('logger');
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({
    error: 'unknown endpoint',
  });
};

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(error.message);

  console.log('name:', error.name);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  console.log('authorization:', authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    console.log('yes');
    return authorization.replace('Bearer ', '');
  }
  console.log('no');

  next();
};

const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = tokenExtractor(req, res, next);
  console.log('FIRST token:', token);
  if (!token) {
    return next();
  }

  console.log('userExtractor token:', token);
  console.log('req:', req);

  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as CustomJwtPayload;
  console.log('decodedToken:', decodedToken);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' });
  }

  const userId = decodedToken.id;
  const user = await User.findById(userId);
  if (user) {
    req.user = user;
  }

  next();
};

export default {
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
};
