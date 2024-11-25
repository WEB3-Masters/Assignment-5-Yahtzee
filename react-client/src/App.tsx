import React from 'react';
import AppRouter from './router/AppRouter';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';

const App: React.FC = () => {
  return (
    <div>
      <ConnectionStatus />
      <AppRouter />
    </div>
  );
};

export default App;
