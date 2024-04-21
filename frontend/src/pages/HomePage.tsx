import { SyntheticEvent, useEffect, useState } from 'react';

import { EventType, UserType } from '../utils/types';
import AddEventForm from '../components/AddEventForm';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  loggedInUser: UserType | null;
  userEvents: EventType[];
  addEvent: (
    description: string,
    allDay: boolean,
    start: string,
    end: string
  ) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleLogOut: (e: SyntheticEvent) => void;
}

const HomePage = ({
  loggedInUser,
  userEvents,
  addEvent,
  handleDeleteEvent,
  handleLogOut,
}: HomePageProps) => {
  const [showEvents, setShowEvents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect loggedInUser:', loggedInUser);

    if (!loggedInUser) {
      navigate('/login');
    }
  });

  return (
    <div className="page home-page">
      <h2>Logged In User: {loggedInUser?.username}</h2>
      <button type="button" onClick={handleLogOut}>
        Log Out
      </button>

      {!showEvents && (
        <button type="button" onClick={() => setShowEvents(true)}>
          Show Events
        </button>
      )}

      {showEvents && (
        <div>
          <button type="button" onClick={() => setShowEvents(false)}>
            Hide Events
          </button>
          <ul>
            {userEvents.map((event) => (
              <li key={event._id}>
                <p>{event.description}</p>
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <AddEventForm addEvent={addEvent} />
    </div>
  );
};

export default HomePage;
