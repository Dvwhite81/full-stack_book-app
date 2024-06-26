import { SyntheticEvent, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import {
  AuthResult,
  BookReview,
  BookInDB,
  UserType,
  BookType,
} from './utils/types';
import authService from './services/authService';
import userService from './services/userService';

import BookDetails from './components/BookDetails/BookDetails';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [userHasRead, setUserHasRead] = useState<BookInDB[]>([]);
  const [userToRead, setUserToRead] = useState<BookInDB[]>([]);
  const [userReviews, setUserReviews] = useState<BookReview[]>([]);
  const [currentBook, setCurrentBook] = useState<BookType | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkedLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const result = await authService.getUserByToken(token);
        //console.log('checkLogged result:', result);
        if (result) {
          const { success, user } = result;
          //console.log('checkLogged success:', success);

          if (success && user) {
            const { user } = result;
            //console.log('checkLogged user:', user);

            setLoggedInUser(user);
            navigate('/');
          } else {
            localStorage.removeItem('token');
          }
        }
      }
    };

    checkedLoggedIn();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const getUserBooks = async () => {
      if (token && loggedInUser) {
        const result = await userService.getUserBooks(
          loggedInUser.username,
          token
        );

        if (result) {
          const { success, booksRead, booksToRead, bookReviews } = result;
          //console.log('USEEFFECT RESULT:', result);
          if (success) {
            setUserHasRead(booksRead);
            setUserToRead(booksToRead);
            setUserReviews(bookReviews);
          }
        }
      }
    };

    getUserBooks();
  }, [loggedInUser, setUserHasRead, setUserToRead, setUserReviews]);

  const handleRegister = async (
    username: string,
    password: string,
    confirmation: string
  ) => {
    if (username === '' || password === '' || confirmation === '') {
      toast.error('All fields are required');
      return;
    }

    if (password !== confirmation) {
      toast.error('Passwords must match');
      return;
    }

    const result: AuthResult | undefined = await authService.register(
      username,
      password
    );

    if (result) {
      const { success, message } = result;
      if (success) {
        handleLogin(username, password);
      } else {
        toast.error(message);
      }
    }
  };

  const handleLogin = async (username: string, password: string) => {
    if (username === '' || password === '') {
      toast.error('All fields are required');
      return;
    }

    const result: AuthResult | undefined = await authService.login(
      username,
      password
    );

    console.log('handleLogin result:', result);

    if (result) {
      const { success, message } = result;
      if (success) {
        const { user, token } = result;
        console.log('login USER:', user);
        if (user && token) {
          setLoggedInUser(user);
          localStorage.setItem('token', token);
          setUserHasRead(user.booksRead);
          setUserToRead(user.booksToRead);
          setUserReviews(user.bookReviews);
          navigate('/');
        }

        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  };

  const handleLogOut = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('handleLogout e:', e);
    localStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/login');
    toast.success('Logged out');
  };

  const markRead = async (book: BookType) => {
    console.log('App markRead book:', book);
    const token = localStorage.getItem('token');

    if (!loggedInUser || !token) return;

    const result = await userService.addHasRead(loggedInUser, token, book);

    if (result) {
      const { success, message } = result;
      console.log('markRead result:', result);
      if (success) {
        toast.success(message);
        console.log('markRead result.hasRead:', result.hasRead);
        setUserHasRead(result.hasRead);
      } else {
        toast.error(message);
      }
    }
  };

  const markNotRead = async (bookId: string) => {
    console.log('App markNotRead bookId:', bookId);
    const token = localStorage.getItem('token');

    if (!loggedInUser || !token) return;

    const result = await userService.removeHasRead(token, bookId);

    if (result) {
      const { success, message } = result;
      console.log('markNot result:', result);
      if (success) {
        toast.success(message);
        console.log('markNot result.hasRead:', result.hasRead);
        setUserHasRead(result.hasRead);
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div id="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              loggedInUser={loggedInUser}
              userHasRead={userHasRead}
              userToRead={userToRead}
              userReviews={userReviews}
              handleLogOut={handleLogOut}
              setCurrentBook={setCurrentBook}
            />
          }
        />
        <Route
          path="/register"
          element={<RegisterPage handleRegister={handleRegister} />}
        />
        <Route
          path="/login"
          element={<LoginPage handleLogin={handleLogin} />}
        />
      </Routes>
      {currentBook && (
        <BookDetails
          book={currentBook}
          setCurrentBook={setCurrentBook}
          markRead={markRead}
          markNotRead={markNotRead}
          userHasRead={userHasRead}
        />
      )}
      <ToastContainer theme="colored" autoClose={2000} newestOnTop />
    </div>
  );
}

export default App;
