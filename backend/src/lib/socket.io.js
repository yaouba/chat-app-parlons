import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const userSockets = {};


io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSockets[userId] = socket.id;
  }

  io.emit('connected-users', Object.keys(userSockets));


  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
    delete userSockets[userId];
    io.emit('connected-users', Object.keys(userSockets));
  });
});

export { io, server, app };