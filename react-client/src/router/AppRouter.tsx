import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from '../views/login/LoginComponent';
import GameComponent from '../views/game/GameComponent';
import PendingComponent from '../views/pending/PendingComponent';
import LobbyComponent from '../views/lobby/LobbyComponent';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LobbyComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/game/:id" element={<GameComponent />} />
        <Route path="/pending/:id" element={<PendingComponent />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
