import { SyntheticEvent, useEffect, useState } from 'react';
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
  const [hasBeenRead, setHasBeenRead] = useState(false);
  const { volumeInfo } = book;

  useEffect(() => {
    console.log('useEffect book:', book);
    console.log('useEffect hasBeenRead:', hasBeenRead);
    if (
      userHasRead &&
      (userHasRead.map((b) => b.bookId).includes(book.bookId) ||
        (book.id && userHasRead.map((b) => b.bookId).includes(book.id)))
    ) {
      setHasBeenRead(true);
    } else {
      setHasBeenRead(false);
    }
  });

  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    addHasRead(book);
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
          {hasBeenRead ? (
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
