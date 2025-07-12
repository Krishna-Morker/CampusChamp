import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'socket.io';


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Set up the socket server
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('notification', (data) => {
      console.log('Notification data:', data);
      io.emit('new-notification', data); // Broadcasting data to all clients
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Handling all routes through Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
