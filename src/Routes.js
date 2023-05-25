import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './register/Register';
import Login from './login/Login';
import Chat from './chat/Chat';

const AppRoute = () => {
  //const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
};

export default AppRoute;
