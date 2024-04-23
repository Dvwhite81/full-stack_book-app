import { SyntheticEvent, useEffect, useState } from 'react';
import { BookInDB, BookType } from '../../utils/types';
import BasicInfo from './BasicInfo';
import HideButton from './HideButton';

interface ImageCardProps {
  book: BookInDB | BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  setCurrentBook: (value: BookType | null) => void;
  markRead: (value: BookType) => void;
  markNotRead: (value: string) => void;
  userHasRead: BookInDB[];
}

const ImageCard = ({
  book,
  showDescription,
  setShowDescription,
  setCurrentBook,
  markRead,
  markNotRead,
  userHasRead,
}: ImageCardProps) => {
  const [hasBeenRead, setHasBeenRead] = useState(false);
  const { volumeInfo } = book;

  useEffect(() => {
    console.log('useEffect book:', book);
    console.log('useEffect hasBeenRead:', hasBeenRead);
    if (
      userHasRead.map((b) => b.bookId).includes(book.bookId) ||
      (book.id && userHasRead.map((b) => b.bookId).includes(book.id))
    ) {
      setHasBeenRead(true);
    } else {
      setHasBeenRead(false);
    }
  }, [userHasRead]);

  const handleRead = (e: SyntheticEvent) => {
    e.preventDefault();
    markRead(book);
  };

  const handleNotRead = (e: SyntheticEvent) => {
    e.preventDefault();
    markNotRead(book.bookId);
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
            <button className="btn" onClick={handleNotRead}>
              Mark Not Read
            </button>
          ) : (
            <button className="btn" onClick={handleRead}>
              Mark Read
            </button>
          )}
          <button className="btn">Review</button>
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
