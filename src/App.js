import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Header from './components/layouts/Header';
import { AuthContext } from './helpers/authContext';
import Profile from './components/user/Profile';
import axios from 'axios';
import { BASE_URL } from './helpers/url';
import { getConfig } from './helpers/config';

function App() {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem("accessToken")));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
      try {
          const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken));
          setCurrentUser(response.data.user);
      } catch (error) {
          if (error.response.status === 401) {
              localStorage.removeItem('accessToken');
              setCurrentUser(null);
              setAccessToken('');
          }
          console.log(error);
      }
  }

  return (
    <AuthContext.Provider value={{accessToken, setAccessToken, currentUser, setCurrentUser}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
