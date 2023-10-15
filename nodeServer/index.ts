import { Server } from 'socket.io';

const io = new Server(3000);
io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  // Send data to everyone who is connected

  socket.on('chat', (data) => {
    socket.emit('chat', data);
  })
})