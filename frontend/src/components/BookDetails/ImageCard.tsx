import { BookInDB, BookType } from '../../utils/types';
import BasicInfo from './BasicInfo';
import HideButton from './HideButton';

interface ImageCardProps {
  book: BookInDB | BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  setCurrentBook: (value: BookType | null) => void;
}

const ImageCard = ({
  book,
  showDescription,
  setShowDescription,
  setCurrentBook,
}: ImageCardProps) => {
  const { volumeInfo } = book;

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
          <button>Mark Read</button>
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
