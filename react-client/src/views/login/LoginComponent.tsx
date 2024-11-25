import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { setPlayer } from '../../slices/playerSlice'; // Adjust path to playerSlice
import { RootState } from '../../slices/store'; // Import RootState for proper typing

const LoginComponent = () => {
  // Access the player state directly from Redux
  const playerFromStore = useSelector((state: RootState) => state.player.player); // Access player from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const location = useLocation(); // useLocation hook to get the current location and query params

  const enabled = playerFromStore !== ''; // Check if player name is not empty

  // Wrap login in useCallback to avoid recreation on every render
  const login = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const game = searchParams.get('game');
    const pending = searchParams.get('pending');

    if (pending) {
      navigate(`/pending/${pending}`);
    } else if (game) {
      navigate(`/game/${game}`);
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const loginKeyListener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && enabled) {
        e.preventDefault();
        login();
      }
    };

    window.addEventListener('keydown', loginKeyListener);
    return () => window.removeEventListener('keydown', loginKeyListener);
  }, [enabled, login]);

  return (
    <div>
      <h1>Login</h1>
      <label>
        Username:
        <input
          value={playerFromStore || ''} // Use the Redux state directly for the input value
          onChange={(e) => dispatch(setPlayer(e.target.value))} // Update the Redux state on input change
          onKeyPress={(e) => {
            if (e.key === 'Enter' && enabled) {
              e.preventDefault();
              login();
            }
          }}
        />
      </label>
      <button disabled={!enabled} onClick={login}>Login</button>
    </div>
  );
};

export default LoginComponent;
