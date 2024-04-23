import { BookInDB, BookType } from '../../utils/types';
import BasicInfo from './BasicInfo';
import HideButton from './HideButton';

interface NoImageCardProps {
  book: BookInDB | BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  setCurrentBook: (value: BookType | null) => void;
  addHasRead: (value: BookType) => void;
  userHasRead: BookInDB[];
}

const NoImageCard = ({
  book,
  showDescription,
  setShowDescription,
  setCurrentBook,
  addHasRead,
  userHasRead,
}: NoImageCardProps) => {
  return (
    <div className="book-details no-image">
      <HideButton setCurrentBook={setCurrentBook} />
      {userHasRead.map((b) => b.bookId).includes(book.bookId) ? (
        <p>Read!</p>
      ) : (
        <button className="btn" onClick={() => addHasRead(book)}>
          Mark Read
        </button>
      )}
      <button className="btn">Review</button>
      <BasicInfo
        book={book}
        showDescription={showDescription}
        setShowDescription={setShowDescription}
      />
    </div>
  );
};

export default NoImageCard;
