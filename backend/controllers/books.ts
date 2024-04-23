import { Response, Router } from 'express';
import BookModel from '../models/book';
import User from '../models/user';

const populateQuery = [
  { path: 'booksRead' },
  { path: 'booksToRead' },
  { path: 'bookReviews' },
];

const booksRouter = Router();

booksRouter.get('/', async (req, res: Response) => {
  console.log('GET');
  const books = await BookModel.find({}).populate('user', { username: 1 });
  console.log('books:', books);
  res.json(books);
});

booksRouter.get('/:id', async (req, res: Response) => {
  const book = await BookModel.findById(req.params.id);
  if (book) res.json(book);
  else res.status(404).end();
});

// Not Sure if needed
booksRouter.post('/reviews', async (req, res: Response) => {
  console.log('POST REVIEWS');
  const { body, user } = req;

  const dbUser = await User.findById(user.id);
  console.log('dbUser:', dbUser);
  if (!dbUser) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  const { book, score, reviewText } = body;
  const { bookId, volumeInfo } = book;

  console.log('BOOK:', book);
  console.log('SCORE', score);
  console.log('REVIEWTEXT:', reviewText);

  const newBookModel = new BookModel({
    bookId,
    volumeInfo,
    userHasRead: true,
    userReview: {
      score,
      reviewText: reviewText || '',
    },
    user: dbUser.id,
  });

  const savedBookModel = await newBookModel.save();
  dbUser.bookReviews = dbUser.bookReviews.concat(savedBookModel._id);
  await dbUser.save();
  res.status(201).json(savedBookModel);
});

booksRouter.post('/:type', async (req, res: Response) => {
  console.log('POST TYPE');
  const { type } = req.params;
  const { body, user } = req;

  const { book } = body;
  const { id, searchInfo, volumeInfo } = book;

  const dbUser = await User.findOne({ username: user.username }).populate(
    populateQuery
  );

  if (!user || !dbUser) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  if (type === 'has-read') {
    const existingBook = await BookModel.findOne({ bookId: book.bookId });
    console.log('existing book:', existingBook);
    if (existingBook && existingBook.userHasRead) {
      return res.json({
        success: false,
        message: 'Book Already Saved!',
      });
    }
  }

  const newBookModel = new BookModel({
    bookId: id,
    searchInfo,
    volumeInfo,
    userHasRead: type === 'has-read',
    user: dbUser.id,
  });

  const savedBookModel = await newBookModel.save();

  if (type === 'has-read') {
    dbUser.booksRead = dbUser.booksRead.concat(savedBookModel._id);
  } else if (type === 'to-read') {
    dbUser.booksToRead = dbUser.booksToRead.concat(savedBookModel._id);
  }

  await dbUser.save();
  res.status(201).json({
    success: true,
    message: 'Marked book read!',
    book: savedBookModel,
    hasRead: dbUser.booksRead,
  });
});

booksRouter.delete('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({
      error: 'missing or invalid token',
    });
  }

  const bookToDelete = await BookModel.findById(id);

  if (bookToDelete?.user?.toString() !== user.id.toString()) {
    res.status(401).end();
  } else {
    await BookModel.findByIdAndDelete(id);
    res.status(204).end();
  }
});

booksRouter.put('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { bookId, volumeInfo } = req.body;

  const book = {
    bookId,
    volumeInfo,
  };

  const updatedBookModel = await BookModel.findByIdAndUpdate(id, book, {
    new: true,
  });
  res.json(updatedBookModel);
});

export default booksRouter;
