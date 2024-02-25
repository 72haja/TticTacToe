import { Server } from 'socket.io';

const io = new Server(8080, {
  cors: {
    // origin: 'http://localhost:8081',
    // origin: 'http://192.168.10.236:8081',
    origin: 'https://3.75.158.163:8081',
  },
});

console.log("Server started");

const gamePlayers = [];

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  const connectionRoom = socket.request.headers.room  ?? 'default';
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

  socket.on('join', (data) => {
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

  socket.on('reset-player-state', (data) => {
    socket.to(data.room).emit('reset-player-state', data);
  });

  socket.on('set-position', (data) => {
    socket.to(data.room).emit('set-position', data);
  })

  socket.on("set-active-player", (data) => {
    socket.to(data.room).emit("set-active-player", data.player);
  })

  socket.on("set-game-field", (data) => {
    socket.to(data.room).emit("set-game-field", data);
  })

  socket.on("new-game", (room) => {
    socket.to(room).emit("new-game");
  })
})
