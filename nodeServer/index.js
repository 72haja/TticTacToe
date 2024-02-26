import { Server } from 'socket.io';
const io = new Server(8080, {
    cors: {
        // origin: 'http://localhost:8081',
        // origin: 'http://192.168.10.236:8081',
        origin: 'https://ttictactoe.onrender.com',
    },
});
console.log("Server started");
const gameRooms = {};
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    // Send data to everyone who is connected
    socket.on("self-join", (room) => {
        socket.join(room);
        console.log("rooms", socket.rooms);
        setTimeout(() => {
            socket.emit("self-join", socket.id);
        }, 200);
    });
    socket.on('game', (data) => {
        socket.emit('game', data);
    });
    socket.on('join', (data) => {
        if (gameRooms[data.room] && gameRooms[data.room].length >= 2) {
            socket.emit('room-full');
            socket.disconnect();
            return;
        }
        if (!gameRooms[data.room]) {
            gameRooms[data.room] = [];
        }
        if (!gameRooms[data.room].includes(data.player)) {
            gameRooms[data.room].push(data.player);
        }
        socket.to(data.room).emit('join', { player: data.player });
        if (gameRooms[data.room].length === 1) {
            socket.emit('your-are-player1');
        }
        else {
            socket.emit('your-are-player2');
        }
        const player2 = gameRooms[data.room].find(player => player !== socket.id);
        if (!player2)
            return;
        socket.emit('set-player2', { player: player2 });
    });
    socket.on("request-join", (room) => {
        if (!gameRooms[room]) {
            socket.emit("room-not-found");
            return;
        }
        if (gameRooms[room].length >= 2) {
            socket.emit("room-full");
            return;
        }
        socket.emit("joined", room);
    });
    socket.on('disconnect', () => {
        const connectionRoom = getConnectionRoom(socket.id);
        if (!connectionRoom
            || !gameRooms[connectionRoom]
            || gameRooms[connectionRoom].indexOf(socket.id) === -1)
            return;
        gameRooms[connectionRoom].splice(gameRooms[connectionRoom].indexOf(socket.id), 1);
        socket.to(connectionRoom).emit('player-left', { player: socket.id });
    });
    socket.on('reset-player-state', (data) => {
        if (!gameRooms[data.room] || gameRooms[data.room].indexOf(socket.id) === -1)
            return;
        socket.to(data.room).emit('reset-player-state', data);
    });
    socket.on('set-position', (data) => {
        socket.to(data.room).emit('set-position', data);
    });
    socket.on("set-active-player", (data) => {
        socket.to(data.room).emit("set-active-player", data.player);
    });
    socket.on("set-game-field", (data) => {
        socket.to(data.room).emit("set-game-field", data);
    });
    socket.on("new-game", (room) => {
        socket.to(room).emit("new-game");
    });
});
function getConnectionRoom(player) {
    return Object.entries(gameRooms).find(([_, players]) => players.includes(player))?.[0];
}
