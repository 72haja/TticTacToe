import { Server } from 'socket.io';

import { SetPositionData } from '../src/models/SetPositionData';
import { SetGameFieldData } from '../src/models/SetGameFieldData';
import { ResetPlayerState } from '../src/models/ResetPlayerState';
import { PlayerData } from '../src/models/PlayerData';

const io = new Server(8080, {
  cors: {
    origin: 'http://localhost:3000',
    // origin: 'http://192.168.10.236:8081',
    // origin: 'https://ttictactoe.onrender.com',
  },
});

console.log("Server started");

const gameRooms: {[roomName: string]: string[]} = {};

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  // const connectionRoom = socket.request.headers.room as string ?? 'default';
  
  console.log("rooms", socket.rooms);
  
  // Send data to everyone who is connected
  
  socket.on("self-join", (room: string) => {
    socket.join(room);
    setTimeout(() => {
      const playerData: PlayerData = {
        player: socket.id,
        room: room,
        gameRoom: gameRooms[room]
      };
      socket.emit("self-join", playerData);
    }, 200);
  })

  socket.on('game', (data) => {
    socket.emit('game', data);
  })

  socket.on('join', (data: PlayerData) => {
    if (
      gameRooms[data.room] 
      && gameRooms[data.room].length >= 2
      && !gameRooms[data.room].includes(data.player)
    ) {
      socket.emit('room-full');
      socket.disconnect();

      console.log("gameRooms", gameRooms);
      return;
    }
    if(!gameRooms[data.room]) {
      gameRooms[data.room] = [];
    }
    if (!gameRooms[data.room].includes(data.player)) {
      gameRooms[data.room].push(data.player);
    }
    socket.to(data.room).emit('join', { player: data.player, gameRoom: gameRooms[data.room]});
    socket.emit('join', { player: data.player, gameRoom: gameRooms[data.room]});
  })

  socket.on('disconnect', () => {
    const connectionRoom = Object.entries(gameRooms)
      .find(([room, players]) => players.indexOf(socket.id) !== -1)?.[0]
      ?? '';
    if(!gameRooms[connectionRoom] || gameRooms[connectionRoom].indexOf(socket.id) === -1) return;
    gameRooms[connectionRoom].splice(gameRooms[connectionRoom].indexOf(socket.id), 1);
    socket.to(connectionRoom).emit('player-left', { player: socket.id });
  });

  socket.on('reset-player-state', (data: ResetPlayerState) => {
    if(!gameRooms[data.room] || gameRooms[data.room].indexOf(socket.id) === -1) return;
    socket.to(data.room).emit('reset-player-state', data);
  });

  socket.on('set-position', (data: SetPositionData) => {
    socket.to(data.room).emit('set-position', data);
  })

  socket.on("set-active-player", (data: PlayerData) => {
    socket.to(data.room).emit("set-active-player", data.player);
  })

  socket.on("set-game-field", (data: SetGameFieldData) => {
    socket.to(data.room).emit("set-game-field", data);
  })

  socket.on("new-game", (room: string) => {
    socket.to(room).emit("new-game");
  })
})

