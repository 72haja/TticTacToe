import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

const io = new Server(8080, {
  cors: {
    origin: 'http://localhost:8081',
  }
});

const connectionId = uuid();

const gamePlayers: string[] = [];

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
  console.log('socket', socket.request.headers.room);

  const connectionRoom = socket.request.headers.room as string ?? 'default';
  socket.join(connectionRoom);

  console.log("rooms", socket.rooms);

  // Send data to everyone who is connected

  socket.emit('connection', connectionId);

  socket.on('game', (data) => {
    socket.emit('game', data);
  })

  socket.on('join', (data: PlayerData) => {
    gamePlayers.push(data.player);
    socket.to(connectionRoom).emit('join', { player: data.player });
    socket.emit('join', { players: gamePlayers } as GameData);
  })

  socket.on('leave', (data: PlayerData) => {
    console.log('🚀 ~ file: index.ts:32 ~ socket.on ~ data:', data);
    gamePlayers.splice(gamePlayers.indexOf(data.player), 1);
    socket.emit('disconnect', gamePlayers);
    console.log('🚀 ~ file: index.ts:27 ~ socket.on ~ gamePlayers:', gamePlayers);
  })
})

interface PlayerData {
  player: string;
}

interface GameData {
  players: string[];
}