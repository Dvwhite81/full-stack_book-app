import { BookType } from '../../utils/types';

interface BasicInfoProps {
  book: BookType;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
}

const BasicInfo = ({
  book,
  showDescription,
  setShowDescription,
}: BasicInfoProps) => {
  const { searchInfo, volumeInfo } = book;
  const { title, authors, publishedDate, description, pageCount, categories } =
    volumeInfo;
  const { textSnippet } = searchInfo;

  return (
    <>
      <h2>{title}</h2>
      <p> by {authors && authors.join(', ')}</p>
      <p>
        Published {publishedDate}, {pageCount} pages
      </p>
      <p>Genres: {categories.join(', ')}</p>
      {showDescription ? (
        <>
          <div className="book-description">
            <p>{description}</p>
          </div>
          <button type="button" onClick={() => setShowDescription(false)}>
            hide description
          </button>
        </>
      ) : (
        <>
          <div className="book-description">
            <p>{textSnippet}</p>
          </div>
          <button type="button" onClick={() => setShowDescription(true)}>
            show description
          </button>
        </>
      )}
    </>
  );
};

export default BasicInfo;
