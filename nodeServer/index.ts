import { Server } from 'socket.io';

import { SetPositionData } from '../src/models/SetPositionData';
import { SetGameFieldData } from '../src/models/SetGameFieldData';
import { ResetPlayerState } from '../src/models/ResetPlayerState';
import { Game, OuterGameField, OuterGameFieldPosition, Position } from '../src/models/GameField';
import { PlayerData } from '../src/models/PlayerData';
import { initOuterGameField } from '@/utils/initGameField';
import { getAllowedOuterGameField } from '@/utils/getAllowedOuterGameField';
import { handleSetPosition } from '@/utils/gameFunctions';

const io = new Server(8080, {
  cors: {
    origin: 'http://localhost:3000',
    // origin: 'http://192.168.10.236:8081',
    // origin: 'https://ttictactoe.onrender.com',
  },
});

console.log("Server started");

const gameRooms: {[roomName: string]: string[]} = {};
const outerGameFields: {[roomName: keyof typeof gameRooms]: Game } = {};

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  // const connectionRoom = socket.request.headers.room as string ?? 'default';
  
  console.log("rooms", socket.rooms);
  
  // Send data to everyone who is connected
  
  socket.on("self-join", (room: string) => {
    if(!room) return;

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
    if(!data.room) return;

    if (
      gameRooms[data.room] 
      && gameRooms[data.room].length >= 2
      && !gameRooms[data.room].includes(data.player)
    ) {
      socket.emit('room-full');
      socket.disconnect();
      return;
    }
    if(!gameRooms[data.room]) {
      gameRooms[data.room] = [];
      outerGameFields[data.room] = {
        gameFields: initOuterGameField(),
        activePlayer: data.player,
        allowedOuterGameField: null,
        winner: null,
      }
    }
    if (!gameRooms[data.room].includes(data.player)) {
      gameRooms[data.room].push(data.player);
    }
    const dataToSend: PlayerData = {
      player: data.player,
      room: data.room,
      gameRoom: gameRooms[data.room],
      game: outerGameFields[data.room]
    }
    console.log('dataToSend', dataToSend);
    socket.to(data.room).emit('join', dataToSend);
    socket.emit('join', dataToSend);
  })

  socket.on('disconnect', () => {
    const connectionRoom = Object.entries(gameRooms)
      .find(([room, players]) => players.indexOf(socket.id) !== -1)?.[0]
      ?? '';
    if(!gameRooms[connectionRoom] || gameRooms[connectionRoom].indexOf(socket.id) === -1) return;
    gameRooms[connectionRoom].splice(gameRooms[connectionRoom].indexOf(socket.id), 1);
    socket.to(connectionRoom).emit('player-left', { player: socket.id });
  });

  socket.on('set-position', (data: SetPositionData) => {
    const nextOuterGameField = handleSetPosition(data, outerGameFields[data.room], gameRooms);
    outerGameFields[data.room] = nextOuterGameField;

    socket.to(data.room).emit('set-game', nextOuterGameField);
    socket.emit('set-game', nextOuterGameField);
  })

  socket.on("set-active-player", (data: PlayerData) => {
    socket.to(data.room).emit("set-active-player", data.player);
  })

  socket.on("new-game", (room: string) => {
    const nextActivePlayer = outerGameFields[room].winner === gameRooms[room][0]
      ? gameRooms[room][1]
      : gameRooms[room][0];
    outerGameFields[room] = {
      gameFields: initOuterGameField(),
      activePlayer: nextActivePlayer,
      allowedOuterGameField: null,
      winner: null,
    }
    socket.to(room).emit("set-game", outerGameFields[room]);
    socket.emit("set-game", outerGameFields[room]);
  })

  socket.onAnyOutgoing(() => {
    console.log('gameRooms', gameRooms);
  })
  socket.onAny(() => {
    console.log('gameRooms', gameRooms);
  })
})

