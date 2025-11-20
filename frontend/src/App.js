import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Feed from './components/Feed';
import Opportunities from './components/Opportunities';
import Profile from './components/Profile';
import Communities from './components/Communities';
import CommunityDetails from './components/CommunityDetails';
import API from './api';
import AchievementWall from './components/achievements/AchievementWall';
import EventsPage from './components/events/EventsPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityDetails />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/achievements" element={<AchievementWall user={user} />} />
          <Route path="/events" element={<EventsPage user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
