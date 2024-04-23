import { BookInDB, BookType } from '../utils/types';

interface BookDisplayProps {
  books: BookType[] | BookInDB[];
  setCurrentBook: (book: BookType) => void;
}

const BookDisplay = ({ books, setCurrentBook }: BookDisplayProps) => {
  //console.log('BookDisplay books:', books);
  return (
    <div className="book-display">
      {books.map((book) => (
        <div
          key={book.id || book.bookId}
          className="book-card"
          onClick={() => setCurrentBook(book)}
        >
          {book.volumeInfo.imageLinks && (
            <img
              className="small-thumbnail"
              src={book.volumeInfo.imageLinks.smallThumbnail}
              alt="book cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BookDisplay;
