import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { getToken } from '../utils/tokenUtils';

let connection = null;
let startPromise = null;
const listeners = {
  ReceiveMessage: new Set(),
  ReceiveNotification: new Set(),
  UserTyping: new Set(),
};

const getHubUrl = () => {
  if (import.meta.env.VITE_HUBS_URL) {
    return import.meta.env.VITE_HUBS_URL;
  }
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${base}/hubs/chat`;
};

function wireConnection(conn) {
  conn.on('ReceiveMessage', (msg) => {
    listeners.ReceiveMessage.forEach((cb) => cb(msg));
  });
  conn.on('ReceiveNotification', (payload) => {
    listeners.ReceiveNotification.forEach((cb) => cb(payload));
  });
  conn.on('UserTyping', (userId) => {
    listeners.UserTyping.forEach((cb) => cb(userId));
  });
}

export async function getChatHubConnection() {
  const token = getToken();
  if (!token) return null;

  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        accessTokenFactory: () => getToken() || '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.Warning)
      .build();
    wireConnection(connection);
  }

  if (connection.state === 'Disconnected') {
    startPromise = startPromise || connection.start().catch((err) => {
      startPromise = null;
      console.error('SignalR connection failed:', err);
      throw err;
    });
    await startPromise;
    startPromise = null;
  }

  return connection;
}

export function subscribeChatHub(event, callback) {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(callback);
  return () => listeners[event].delete(callback);
}

export async function stopChatHub() {
  if (connection) {
    await connection.stop();
    connection = null;
    startPromise = null;
  }
}
