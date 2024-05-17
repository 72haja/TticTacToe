import { Server } from 'socket.io';

import { SetPositionData } from '../src/models/SetPositionData';
import { SetGameFieldData } from '../src/models/SetGameFieldData';
import { ResetPlayerState } from '../src/models/ResetPlayerState';
import { Game, OuterGameField, OuterGameFieldPosition, Position } from '../src/models/GameField';
import { PlayerData } from '../src/models/PlayerData';
import { initOuterGameField } from '@/utils/initGameField';
import { getAllowedOuterGameField } from '@/utils/getAllowedOuterGameField';

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
    const nextOuterGameField = handleSetPosition(data, outerGameFields[data.room]);
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

function getFieldWinner(
  outerGameFieldPosition: OuterGameFieldPosition,
  tmpOuterGameField: OuterGameField
) {
  const winningPositions: Position[][] = [
    ["0.0", "0.1", "0.2"],
    ["1.0", "1.1", "1.2"],
    ["2.0", "2.1", "2.2"],
    ["0.0", "1.0", "2.0"],
    ["0.1", "1.1", "2.1"],
    ["0.2", "1.2", "2.2"],
    ["0.0", "1.1", "2.2"],
    ["0.2", "1.1", "2.0"],
  ];

  const relevantField = tmpOuterGameField[outerGameFieldPosition].gameField

  const fieldWon = winningPositions.find((winningPosition) => {
    const [pos1, pos2, pos3] = winningPosition;
    const field1 = relevantField[pos1];
    const field2 = relevantField[pos2];
    const field3 = relevantField[pos3];
    return field1 === field2 && field2 === field3 && field1 !== "";
  });

  if (fieldWon) {
    // setPosInOuterGameFieldWinner(outerGameFieldPosition, relevantField[fieldWon[0]]);
    return relevantField[fieldWon[0]];
  }
  return undefined;
};


function getGameWinner(
  outerGameField: OuterGameField,
): boolean  | string {
  const winningPositionsOuterGameField: OuterGameFieldPosition[][] = [
    ["top-left", "top-center", "top-right"],
    ["center-left", "center-center", "center-right"],
    ["bottom-left", "bottom-center", "bottom-right"],
    ["top-left", "center-left", "bottom-left"],
    ["top-center", "center-center", "bottom-center"],
    ["top-right", "center-right", "bottom-right"],
    ["top-left", "center-center", "bottom-right"],
    ["top-right", "center-center", "bottom-left"],
  ];
  const gameWon = winningPositionsOuterGameField.some((winningPosition) => {
    const [outerGameFieldPos1, outerGameFieldPos2, outerGameFieldPos3] = winningPosition;
    const field1 = outerGameField[outerGameFieldPos1].fieldWinner;
    const field2 = outerGameField[outerGameFieldPos2].fieldWinner;
    const field3 = outerGameField[outerGameFieldPos3].fieldWinner;
    return field1 === field2 && field2 === field3 && field1 !== null;
  })

  const gameDraw = !gameWon && Object.values(outerGameField).every(
    (field) => field.gameField
      && Object.values(field.gameField).every((value) => value !== "")
  );

  if (gameDraw) {
    return "draw";
  }

  return gameWon;
}

function handleSetPosition(data: SetPositionData, game: Game) {
  const localGameField: Game = JSON.parse(JSON.stringify(game));
  localGameField.gameFields[data.outerGameFieldPosition].gameField[data.position] = data.player;

  const fieldWinner = getFieldWinner(
    data.outerGameFieldPosition,
    localGameField.gameFields
  );
  if(fieldWinner) {
    localGameField.gameFields[data.outerGameFieldPosition].fieldWinner = fieldWinner;
  }

  const gameWinner = getGameWinner(
    localGameField.gameFields
  );
  if(gameWinner === true) {
    localGameField.winner = localGameField.activePlayer;
    return localGameField;
  } else if (gameWinner === "draw") {
    localGameField.winner = "draw";
    return localGameField;
  }
  
  const allowedOuterGameField = getAllowedOuterGameField(data.position);
  if(localGameField.gameFields[allowedOuterGameField].fieldWinner) {
    localGameField.allowedOuterGameField = null;
  } else {
    localGameField.allowedOuterGameField = allowedOuterGameField;
  }

  localGameField.activePlayer = data.player === gameRooms[data.room][0] 
    ? gameRooms[data.room][1]
    : gameRooms[data.room][0];

  return localGameField;
}
