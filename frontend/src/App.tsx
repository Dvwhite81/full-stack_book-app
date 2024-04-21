import { SyntheticEvent, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

import { AuthResult, EventType, UserType } from './utils/types';
import userService from './services/userService';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [userEvents, setUserEvents] = useState<EventType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const checkedLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        const result = await userService.getUserByToken(token);
        console.log('checkLogged result:', result);
        if (result) {
          const { success, user } = result;
          console.log('checkLogged success:', success);

          if (success && user) {
            const { user } = result;
            console.log('checkLogged user:', user);

            setLoggedInUser(user);
            setUserEvents(user.events);
            navigate('/');
          } else {
            localStorage.removeItem('token');
          }
        }
      }
    };

    checkedLoggedIn();
  }, [navigate]);

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

    const result: AuthResult | undefined = await userService.register(
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

    const result: AuthResult | undefined = await userService.login(
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
          setUserEvents(user.events);
          navigate('/');
        }

        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  };

  const addEvent = async (
    description: string,
    allDay: boolean,
    start: string,
    end: string
  ) => {
    const token = localStorage.getItem('token');

    if (!loggedInUser || !token) return;

    const newEvent = {
      description,
      allDay,
      start: moment(start).format('yyyy-MM-DD'),
      end: moment(end).format('yyyy-MM-DD'),
    };

    const result = await userService.addUserEvent(token, newEvent);

    if (result) {
      const { success, message } = result;

      if (success) {
        toast.success(message);
        setUserEvents(result.events);
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log('handleDeleteEvent eventId:', eventId);
    if (!loggedInUser) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const result = await userService.deleteUserEvent(token, eventId);
    console.log('handleDelete result:', result);
    if (result) {
      const { success, events, message } = result;

      if (success) {
        setUserEvents(events);
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

  return (
    <div id="main-container">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              loggedInUser={loggedInUser}
              userEvents={userEvents}
              addEvent={addEvent}
              handleDeleteEvent={handleDeleteEvent}
              handleLogOut={handleLogOut}
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
      <ToastContainer theme="colored" newestOnTop />
    </div>
  );
}

export default App;
