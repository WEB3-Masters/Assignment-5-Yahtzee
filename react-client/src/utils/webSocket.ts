import { BehaviorSubject } from 'rxjs';

const wsSubject = new BehaviorSubject<any>(null); // This will hold the latest WebSocket message

export const wsConnection = new WebSocket('ws://localhost:9090/publish');

wsConnection.onopen = () => {
  console.log('WebSocket connected');
  wsConnection.send(JSON.stringify({ type: 'subscribe' }));
};

wsConnection.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received data:', data); // Debugging: check the data being received
  wsSubject.next(data); // Emit data to subscribers
};

wsConnection.onerror = (error) => {
  console.error('WebSocket error:', error);
};

wsConnection.onclose = () => {
  console.log('WebSocket closed');
  wsSubject.complete(); // Complete the subject on WebSocket close
};

// Export the subject so we can subscribe to it in the app
export const gameMessages$ = wsSubject.asObservable();
