import { BookInDB, BookType } from '../../utils/types';
import BasicInfo from './BasicInfo';
import HideButton from './HideButton';

interface NoImageCardProps {
  book: BookInDB | BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  setCurrentBook: (value: BookType | null) => void;
}

const NoImageCard = ({
  book,
  showDescription,
  setShowDescription,
  setCurrentBook,
}: NoImageCardProps) => {
  return (
    <div className="book-details no-image">
      <HideButton setCurrentBook={setCurrentBook} />
      <BasicInfo
        book={book}
        showDescription={showDescription}
        setShowDescription={setShowDescription}
      />
    </div>
  );
};

export default NoImageCard;
