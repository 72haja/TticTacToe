import { Server } from 'socket.io';

import { SetPositionData } from '../src/models/SetPositionData';
import { SetGameFieldData } from '../src/models/SetGameFieldData';
import { ResetPlayerState } from '../src/models/ResetPlayerState';

const io = new Server(8080, {
  cors: {
    origin: 'http://localhost:8081',
    // origin: 'http://192.168.10.236:8081',
    // origin: 'http://127.0.0.1:8081',
  },
});

console.log("Server started");

const gamePlayers: string[] = [];

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  const connectionRoom = socket.request.headers.room as string ?? 'default';
  socket.join(connectionRoom);

  console.log("rooms", socket.rooms);

  // Send data to everyone who is connected

  socket.on("self-join", () => {
    setTimeout(() => {
      socket.emit("self-join", socket.id);
    }, 200);
  })

  socket.on('game', (data) => {
    socket.emit('game', data);
  })

  socket.on('join', (data: PlayerData) => {
    if (!gamePlayers.includes(data.player)) {
      gamePlayers.push(data.player);
    }
    socket.to(connectionRoom).emit('join', { player: data.player });

    if (gamePlayers.length === 1) {
      socket.emit('your-are-player1');
    } else {
      socket.emit('your-are-player2');
    }

    const player2 = gamePlayers.find(player => player !== socket.id);
    if (!player2) return;

    socket.emit('set-player2', { player: player2 });
  })

  socket.on('disconnect', () => {
    gamePlayers.splice(gamePlayers.indexOf(socket.id), 1);
    socket.to(connectionRoom).emit('player-left', { player: socket.id });
  });

  socket.on('reset-player-state', (data: ResetPlayerState) => {
    socket.to(data.room).emit('reset-player-state', data);
  });

  socket.on('set-position', (data: SetPositionData) => {
    socket.to(data.room).emit('set-position', data);
  })

  socket.on("set-active-player", (data: SetActivePlayerData) => {
    socket.to(data.room).emit("set-active-player", data.player);
  })

  socket.on("set-game-field", (data: SetGameFieldData) => {
    socket.to(data.room).emit("set-game-field", data);
  })

  socket.on("new-game", (room: string) => {
    socket.to(room).emit("new-game");
  })
})

interface PlayerData {
  player: string;
}

interface SetActivePlayerData {
  room: string;
  player: string;
}
