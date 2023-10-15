import { Server } from 'socket.io';

const io = new Server(8080, {
  cors: {
    origin: 'http://localhost:8081',
  }
});

const gamePlayers: string[] = [];

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  const connectionRoom = socket.request.headers.room as string ?? 'default';
  socket.join(connectionRoom);

  console.log("rooms", socket.rooms);

  // Send data to everyone who is connected

  socket.emit('connection', socket.id);

  socket.on('game', (data) => {
    socket.emit('game', data);
  })

  socket.on('join', (data: PlayerData) => {
    gamePlayers.push(data.player);
    socket.to(connectionRoom).emit('join', { player: data.player });
    socket.emit('join', { players: gamePlayers } as GameData);
  })

  socket.on('disconnect', () => {
    gamePlayers.splice(gamePlayers.indexOf(socket.id), 1);
    socket.to(connectionRoom).emit('player-left', { player: socket.id });
  });

  socket.on('set-position', (data: SetPositionData) => {
    socket.to(connectionRoom).emit('set-position', data);
  })

})

interface PlayerData {
  player: string;
}

interface GameData {
  players: string[];
}

interface SetPositionData {
  room: string;
  position: string;
}