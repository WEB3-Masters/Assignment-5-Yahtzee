import { BehaviorSubject, Observable, Subject, retry, catchError, filter, map, share } from 'rxjs';
import { IndexedYahtzee, IndexedYahtzeeSpecs } from '../model/game';

// Create subjects for different message types
const wsSubject = new BehaviorSubject<any>(null);
const errorSubject = new Subject<Event>();
const connectionStatusSubject = new BehaviorSubject<boolean>(false);

// WebSocket connection
export const wsConnection = new WebSocket('ws://localhost:9090/publish');

// Connection status observable
export const connectionStatus$ = connectionStatusSubject.asObservable();

wsConnection.onopen = () => {
  console.log('WebSocket connected');
  connectionStatusSubject.next(true);
  wsConnection.send(JSON.stringify({ type: 'subscribe' }));
};

wsConnection.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    wsSubject.next(data);
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
    errorSubject.next(new ErrorEvent('parse', { error }));
  }
};

wsConnection.onerror = (error) => {
  console.error('WebSocket error:', error);
  errorSubject.next(error);
  connectionStatusSubject.next(false);
};

wsConnection.onclose = () => {
  console.log('WebSocket closed');
  connectionStatusSubject.next(false);
  wsSubject.complete();
};

// Create separate observables for different game types
export const gameMessages$ = wsSubject.pipe(
  filter((message): message is IndexedYahtzee | IndexedYahtzeeSpecs => 
    message !== null && ('pending' in message)
  ),
  retry(3), // Retry failed operations 3 times
  catchError((error) => {
    console.error('Error in game messages stream:', error);
    return [];
  }),
  share() // Share the subscription among multiple subscribers
);

// Observable for pending games
export const pendingGames$ = gameMessages$.pipe(
  filter((game): game is IndexedYahtzeeSpecs => game.pending === true),
  map(game => ({ ...game, timestamp: Date.now() }))
);

// Observable for ongoing games
export const ongoingGames$ = gameMessages$.pipe(
  filter((game): game is IndexedYahtzee => game.pending === false),
  map(game => ({ ...game, timestamp: Date.now() }))
);

// Error observable
export const errors$ = errorSubject.asObservable();

// Reconnection logic
connectionStatus$.pipe(
  filter(status => !status)
).subscribe(() => {
  console.log('Attempting to reconnect...');
  setTimeout(() => {
    const newWs = new WebSocket('ws://localhost:9090/publish');
    // Update the connection with new WebSocket
    Object.assign(wsConnection, newWs);
  }, 5000);
});
