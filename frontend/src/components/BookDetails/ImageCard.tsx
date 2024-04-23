import { SyntheticEvent, useState } from 'react';
import { BookInDB, BookType } from '../../utils/types';
import BasicInfo from './BasicInfo';
import HideButton from './HideButton';

interface ImageCardProps {
  book: BookInDB | BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  setCurrentBook: (value: BookType | null) => void;
  addHasRead: (value: BookType) => void;
  userHasRead: BookInDB[];
}

const ImageCard = ({
  book,
  showDescription,
  setShowDescription,
  setCurrentBook,
  addHasRead,
  userHasRead,
}: ImageCardProps) => {
  const { volumeInfo } = book;
  const [tempHasBeenRead, setTempHasBeenRead] = useState(false);

  const bookHasBeenRead =
    tempHasBeenRead ||
    (userHasRead &&
      (userHasRead.map((b) => b.bookId).includes(book.bookId) ||
        (book.id && userHasRead.map((b) => b.bookId).includes(book.id))));

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    addHasRead(book);
    if (!tempHasBeenRead) {
      setTempHasBeenRead(true);
    }
  };

  return (
    <div className="book-details with-image">
      <div className="column">
        <BasicInfo
          book={book}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
        />
      </div>
      {volumeInfo.imageLinks && (
        <div className="column">
          <HideButton setCurrentBook={setCurrentBook} />
          {bookHasBeenRead ? (
            <p>Read!</p>
          ) : (
            <button onClick={handleClick}>Mark Read</button>
          )}
          <button>Review</button>
          <img
            className="small-thumbnail"
            src={volumeInfo.imageLinks.smallThumbnail}
            alt="book cover"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCard;
