const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const bluetoothService = require("./src/ble");
const scrollController = new (require("scroll-controller"))();

// todo: brightness should be adjustable (writable characteristic between 0 and 255 (snake is half brighnes, food full))
// todo: add restart option (writable characteristic with states 0 = stop, 1 = pause, 2 = running)
// todo: add gameStat Screen (start = game, stop = "SNAKE", pause = game but no steps running)

const init = async () => {
  let currentDirection = null;
  const width = 17;
  const height = 7;
  const field = Array(height).fill(Array(width).fill(0));
  const generateMatrixFromGame = (gameState) =>
    field.map((col, colIndex) =>
      col.map((row, rowIndex) =>
        gameState.snake.find(
          (snakePixel) => rowIndex === snakePixel.x && colIndex === snakePixel.y
        ) !== undefined
          ? 50
          : rowIndex === gameState.food.x && colIndex === gameState.food.y
          ? 100
          : 0
      )
    );
  await scrollController.init();
  const gameInstance = game();

  await bluetoothService(
    (direction) => gameInstance.setDirection(direction),
    () => currentDirection.toString(),
    () => gameInstance.start(),
    gameInstance.onStepUpdate
  );

  /*
  const setStartScreen = () => {
    const snakeScreen = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    scrollController.display(
      matrixToArray(snakeScreen).map((led) => (led === 1 ? 100 : 0))
    );
  };

  setStartScreen();*/
  gameInstance.start(true);
  gameInstance.onStepUpdate((gameState) => {
    //console.log(gameState);
    currentDirection = gameState.direction;
    scrollController.display(matrixToArray(generateMatrixFromGame(gameState)));
  });
};

init();
