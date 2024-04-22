import { BookType } from '../../utils/types';

interface HideButtonProps {
  setCurrentBook: (value: BookType | null) => void;
}

const HideButton = ({ setCurrentBook }: HideButtonProps) => {
  return (
    <button
      className="btn hide-btn"
      type="button"
      onClick={() => setCurrentBook(null)}
    >
      x
    </button>
  );
};

export default HideButton;
