import { SyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { BookReview, BookInDB, UserType, BookType } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import bookService from '../services/bookService';
import BookDisplay from '../components/BookDisplay';

interface HomePageProps {
  loggedInUser: UserType | null;
  userHasRead: BookInDB[];
  userToRead: BookInDB[];
  userReviews: BookReview[];
  handleLogOut: (e: SyntheticEvent) => void;
  setCurrentBook: (book: BookType) => void;
}

const HomePage = ({
  loggedInUser,
  userHasRead,
  handleLogOut,
  setCurrentBook,
}: HomePageProps) => {
  const [bookResults, setBookResults] = useState<BookType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    //console.log('useEffect loggedInUser:', loggedInUser);
    //console.log('useEffect userHasRead:', userHasRead);

    if (!loggedInUser) {
      navigate('/login');
    }
  });

  const handleSearch = async (searchTerm: string) => {
    const result = await bookService.searchBooks(searchTerm);
    const { success, books, message } = result;

    console.log('BOOKS:', books);
    if (success) {
      setBookResults(books);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="page home-page">
      <h2>Logged In User: {loggedInUser?.username}</h2>
      <button type="button" onClick={handleLogOut}>
        Log Out
      </button>

      <SearchForm handleSearch={handleSearch} />
      {bookResults.length > 0 ? (
        <BookDisplay books={bookResults} setCurrentBook={setCurrentBook} />
      ) : (
        <BookDisplay books={userHasRead} setCurrentBook={setCurrentBook} />
      )}
    </div>
  );
};

export default HomePage;
