import { useState } from 'react';
import { BookInDB, BookType } from '../../utils/types';
import ImageCard from './ImageCard';
import NoImageCard from './NoImageCard';

interface BookDetailsProps {
  book: BookInDB | BookType;
  setCurrentBook: (value: BookType | null) => void;
  markRead: (value: BookType) => void;
  markNotRead: (value: string) => void;
  userHasRead: BookInDB[];
}

const BookDetails = ({
  book,
  setCurrentBook,
  markRead,
  markNotRead,
  userHasRead,
}: BookDetailsProps) => {
  const [showDescription, setShowDescription] = useState(false);

  const { volumeInfo } = book;

  return (
    <div className="overlay">
      {volumeInfo.imageLinks ? (
        <ImageCard
          book={book}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          setCurrentBook={setCurrentBook}
          markRead={markRead}
          markNotRead={markNotRead}
          userHasRead={userHasRead}
        />
      ) : (
        <NoImageCard
          book={book}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          setCurrentBook={setCurrentBook}
          markRead={markRead}
          markNotRead={markNotRead}
          userHasRead={userHasRead}
        />
      )}
    </div>
  );
};

export default BookDetails;
