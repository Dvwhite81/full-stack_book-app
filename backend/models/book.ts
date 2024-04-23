import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  searchInfo: {
    type: Object,
    required: true,
  },
  volumeInfo: {
    type: Object,
    required: true,
  },
  userHasRead: {
    type: Boolean,
    required: true,
    default: false,
  },
  userToRead: {
    type: Boolean,
    required: true,
    default: false,
  },
  userReview: {
    score: {
      type: Number,
      required: false,
    },
    reviewText: {
      type: String,
      required: false,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

bookSchema.set('toJSON', {
  transform: (document, returnedBook) => {
    returnedBook.id = returnedBook._id.toString();
    delete returnedBook._id;
    delete returnedBook.__v;
  },
});

const BookModel = mongoose.model('BookModel', bookSchema);
export default BookModel;
