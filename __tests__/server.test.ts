import { getFieldWinner, getGameWinner, handleSetPosition } from '@/utils/gameFunctions';
import { Game, OuterGameField } from '@/models/GameField';
import { initOuterGameField } from '@/utils/initGameField';
import { describe, expect, it } from 'vitest';
import { SetPositionData } from '@/models/SetPositionData';

const sampleInitGameField = initOuterGameField();

describe('getFieldWinner', () => {
  it('should return the winner of the field', () => {
    // Arrange
    const outerGameFieldPosition = "center-center";
    const tmpOuterGameField: OuterGameField = {
      ...sampleInitGameField,
      "center-center": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: null
      }
    };

    // Act
    const result = getFieldWinner(outerGameFieldPosition, tmpOuterGameField);

    // Assert
    expect(result).toBe("X");
  });

  it('should return undefined if there is no winner', () => {
    // Arrange
    const outerGameFieldPosition = "center-center";
    const tmpOuterGameField: OuterGameField = {
      ...sampleInitGameField,
      "center-center": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "",
          "2.1": "",
          "2.2": "",
        },
        fieldWinner: null
      }
    };

    // Act
    const result = getFieldWinner(outerGameFieldPosition, tmpOuterGameField);

    // Assert
    expect(result).toBeUndefined();
  });
});

describe('getGameWinner', () => {
  it('should return the true if someOne won the game', () => {
    // Arrange
    const tmpOuterGameField: OuterGameField = {
      "top-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "top-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "top-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "center-left": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "center-center": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "center-right": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "bottom-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "bottom-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
    };

    // Act
    const result = getGameWinner(tmpOuterGameField);

    // Assert
    expect(result).toBe(true);
  });

  it('should return "draw" if no one won the game but all fields are set', () => {
    // Arrange
    const tmpOuterGameField: OuterGameField = {
      "top-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "top-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "top-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "center-left": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "center-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "center-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-center": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-right": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
    };

    // Act
    const result = getGameWinner(tmpOuterGameField);

    // Assert
    expect(result).toBe("draw");
  });
});

describe('handleSetPosition', () => {
  it('should return the updated game field', () => {
    // Arrange
    const data: SetPositionData = {
      outerGameFieldPosition: "center-center",
      position: "0.0",
      player: "X",
      room: "room1"
    };

    const game: Game = {
      gameFields: {
        ...sampleInitGameField,
        "center-center": {
          gameField: {
            "0.0": "",
            "0.1": "",
            "0.2": "",
            "1.0": "",
            "1.1": "",
            "1.2": "",
            "2.0": "",
            "2.1": "",
            "2.2": "",
          },
          fieldWinner: null
        }
      },
      activePlayer: "X",
      allowedOuterGameField: null,
      winner: null
    };

    const gameRooms: Record<string, string[]> = {
      "room1": ["X", "O"]
    };

    // Act
    const result = handleSetPosition(data, game, gameRooms);

    // Assert
    expect(result.gameFields["center-center"].gameField["0.0"]).toBe("X");
    expect(result.gameFields["center-center"].fieldWinner).toBeNull();
    expect(result.activePlayer).toBe("O");
    expect(result.allowedOuterGameField).toBe("top-left");
  });

  it('should return the updated game field with field winner', () => {
    // Arrange
    const data: SetPositionData = {
      outerGameFieldPosition: "center-center",
      position: "1.1",
      player: "X",
      room: "room1"
    };

    const game: Game = {
      gameFields: {
        ...sampleInitGameField,
        "center-center": {
          gameField: {
            "0.0": "X",
            "0.1": "O",
            "0.2": "X",
            "1.0": "",
            "1.1": "",
            "1.2": "",
            "2.0": "X",
            "2.1": "O",
            "2.2": "X",
          },
          fieldWinner: null
        }
      },
      activePlayer: "X",
      allowedOuterGameField: null,
      winner: null
    };

    const gameRooms: Record<string, string[]> = {
      "room1": ["X", "O"]
    };

    // Act
    const result = handleSetPosition(data, game, gameRooms);

    // Assert
    expect(result.gameFields["center-center"].gameField["0.0"]).toBe("X");
    expect(result.gameFields["center-center"].fieldWinner).toBe("X");
    expect(result.activePlayer).toBe("O");
    expect(result.allowedOuterGameField).toBeNull();
  });

  it('should return the updated game field with game winner', () => {
    // Arrange
    const data: SetPositionData = {
      outerGameFieldPosition: "center-center",
      position: "1.1",
      player: "X",
      room: "room1"
    };

    const game: Game = {
      gameFields: {
        ...sampleInitGameField,
        "top-left": {
          gameField: {
            "0.0": "X",
            "0.1": "O",
            "0.2": "X",
            "1.0": "",
            "1.1": "X",
            "1.2": "",
            "2.0": "X",
            "2.1": "O",
            "2.2": "X",
          },
          fieldWinner: "X"
        },
        "center-center": {
          gameField: {
            "0.0": "X",
            "0.1": "O",
            "0.2": "X",
            "1.0": "",
            "1.1": "",
            "1.2": "",
            "2.0": "X",
            "2.1": "O",
            "2.2": "X",
          },
          fieldWinner: null
        },
        "bottom-right": {
          gameField: {
            "0.0": "X",
            "0.1": "O",
            "0.2": "X",
            "1.0": "",
            "1.1": "X",
            "1.2": "",
            "2.0": "X",
            "2.1": "O",
            "2.2": "X",
          },
          fieldWinner: "X"
        
        },
      },
      activePlayer: "X",
      allowedOuterGameField: null,
      winner: null
    };

    const gameRooms: Record<string, string[]> = {
      "room1": ["X", "O"]
    };

    // Act
    const result = handleSetPosition(data, game, gameRooms);

    // Assert
    expect(result.gameFields["center-center"].gameField["0.0"]).toBe("X");
    expect(result.gameFields["center-center"].fieldWinner).toBe("X");
    expect(result.activePlayer).toBe("X");
    expect(result.allowedOuterGameField).toBeNull();
    expect(result.winner).toBe("X");
  });

  it('should return the updated game field with draw', () => {
    // Arrange
    const data: SetPositionData = {
      outerGameFieldPosition: "center-center",
      position: "1.2",
      player: "X",
      room: "room1"
    };

    const game: Game = {
      gameFields: {
      "top-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "top-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "top-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "center-left": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
      "center-center": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: null
      },
      "center-right": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-left": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-center": {
        gameField: {
          "0.0": "X",
          "0.1": "O",
          "0.2": "X",
          "1.0": "O",
          "1.1": "X",
          "1.2": "O",
          "2.0": "X",
          "2.1": "O",
          "2.2": "X",
        },
        fieldWinner: "X"
      },
      "bottom-right": {
        gameField: {
          "0.0": "O",
          "0.1": "X",
          "0.2": "O",
          "1.0": "X",
          "1.1": "O",
          "1.2": "X",
          "2.0": "O",
          "2.1": "X",
          "2.2": "O",
        },
        fieldWinner: "O"
      },
    },
      activePlayer: "X",
      allowedOuterGameField: null,
      winner: null
    };

    const gameRooms: Record<string, string[]> = {
      "room1": ["X", "O"]
    };

    // Act
    const result = handleSetPosition(data, game, gameRooms);

    // Assert
    expect(result.gameFields["center-center"].gameField["1.2"]).toBe("X");
    expect(result.gameFields["center-center"].fieldWinner).toBeNull();
    expect(result.activePlayer).toBe("X");
    expect(result.allowedOuterGameField).toBeNull();
    expect(result.winner).toBe("draw");
  });
});