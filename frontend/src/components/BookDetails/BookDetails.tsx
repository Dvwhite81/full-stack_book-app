import { useState } from 'react';
import { BookInDB, BookType } from '../../utils/types';
import ImageCard from './ImageCard';
import NoImageCard from './NoImageCard';

interface BookDetailsProps {
  book: BookInDB | BookType;
  setCurrentBook: (value: BookType | null) => void;
}

const BookDetails = ({ book, setCurrentBook }: BookDetailsProps) => {
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
        />
      ) : (
        <NoImageCard
          book={book}
          showDescription={showDescription}
          setShowDescription={setShowDescription}
          setCurrentBook={setCurrentBook}
        />
      )}
    </div>
  );
};

export default BookDetails;
