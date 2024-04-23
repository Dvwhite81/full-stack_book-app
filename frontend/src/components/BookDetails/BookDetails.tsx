import { useState } from 'react';
import { BookInDB, BookType } from '../../utils/types';
import ImageCard from './ImageCard';
import NoImageCard from './NoImageCard';

interface BookDetailsProps {
  book: BookInDB | BookType;
  setCurrentBook: (value: BookType | null) => void;
  addHasRead: (value: BookType) => void;
  userHasRead: BookInDB[];
}

const BookDetails = ({
  book,
  setCurrentBook,
  addHasRead,
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
          addHasRead={addHasRead}
          userHasRead={userHasRead}
        />
      ) : (
        <NoImageCard
          book={book}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          setCurrentBook={setCurrentBook}
          addHasRead={addHasRead}
          userHasRead={userHasRead}
        />
      )}
    </div>
  );
};

export default BookDetails;
