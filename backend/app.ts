import config from './utils/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import logger from './utils/logger';
import middleware from './utils/middleware';
import usersRouter from './controllers/users';
import registerRouter from './controllers/register';
import loginRouter from './controllers/login';
import eventsRouter from './controllers/events';
import toDosRouter from './controllers/toDos';

const app = express();

mongoose.set('strictQuery', false);
logger.info(`connecting to ${config.DB_URL}`);
mongoose
  .connect(config.DB_URL as string)
  .then(() => {
    logger.info('connected to DB');
  })
  .catch((err) => {
    logger.error(`error connecting to DB: ${err.message}`);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
// app.use(middleware.tokenExtractor);
app.use(middleware.requestLogger);

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/events', middleware.userExtractor, eventsRouter);
app.use('/api/toDos', middleware.userExtractor, toDosRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
