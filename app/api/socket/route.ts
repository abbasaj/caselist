// app/api/socket/route.ts

import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

export default function handler(req, res) {
  // Only run this code once to initialize the socket server
  if (res.socket.server.io) {
    console.log('Socket.io server already running');
  } else {
    console.log('Starting Socket.io server...');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join a specific chat room (e.g., for a case)
      socket.on('join_room', (caseId) => {
        socket.join(caseId);
        console.log(`User ${socket.id} joined case room ${caseId}`);
      });

      // Handle new messages
      socket.on('send_message', (data) => {
        // Broadcast the message to all clients in the specific room
        io.to(data.caseId).emit('receive_message', data);
        // Persist the message to the database here (Prisma code)
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
}
