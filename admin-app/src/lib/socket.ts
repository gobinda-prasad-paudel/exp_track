import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:5001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Admin connected to server');
      this.socket?.emit('join-admin');
    });

    this.socket.on('disconnect', () => {
      console.log('Admin disconnected from server');
    });

    // Listen for real-time events
    this.socket.on('transaction-added', (data) => {
      this.notifyListeners('transaction-added', data);
    });

    this.socket.on('transaction-updated', (data) => {
      this.notifyListeners('transaction-updated', data);
    });

    this.socket.on('transaction-deleted', (data) => {
      this.notifyListeners('transaction-deleted', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  on(event: string, callback: (data: any) => void) {
    this.listeners.set(event, callback);
  }

  off(event: string) {
    this.listeners.delete(event);
  }

  private notifyListeners(event: string, data: any) {
    const listener = this.listeners.get(event);
    if (listener) {
      listener(data);
    }
  }
}

export const socketService = new SocketService();