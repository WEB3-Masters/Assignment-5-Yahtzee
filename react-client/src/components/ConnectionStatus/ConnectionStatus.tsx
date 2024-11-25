import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../slices/store';
import './ConnectionStatus.css';

const ConnectionStatus: React.FC = () => {
  const { error } = useSelector((state: RootState) => state.ui);

  if (!error) {
    return null;
  }

  return (
    <div className="connection-status">
      {error && (
        <div className="connection-indicator error">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 