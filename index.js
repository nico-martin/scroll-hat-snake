const events = require("events");
const em = new events.EventEmitter();
const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const bluetoothService = require("./src/ble");
const scrollController = new (require("scroll-controller"))();
const battery = require("./src/battery");

// todo: add restart option (writable characteristic with states 0 = stop, 1 = pause, 2 = running)
// todo: add gameStat Screen (start = game, stop = "SNAKE", pause = game but no steps running)

const init = async () => {
  const width = 17;
  const height = 7;
  const field = Array(height).fill(Array(width).fill(0));
  let intensity = 100;
  const setIntensity = (newIntensity) => {
    intensity = newIntensity;
    em.emit("INTENSITY_UPDATE", intensity);
  };
  await battery((values) => em.emit("BATTERY_UPDATE", values));

  const onIntensityUpdate = (listener) =>
    em.addListener("INTENSITY_UPDATE", listener);
  const onBatteryUpdate = (listener) =>
    em.addListener("BATTERY_UPDATE", listener);

  const generateMatrixFromGame = (gameState) =>
    field.map((col, colIndex) =>
      col.map((row, rowIndex) =>
        gameState.snake.find(
          (snakePixel) => rowIndex === snakePixel.x && colIndex === snakePixel.y
        ) !== undefined
          ? Math.floor(intensity / 2)
          : rowIndex === gameState.food.x && colIndex === gameState.food.y
          ? intensity
          : 0
      )
    );
  await scrollController.init();
  const gameInstance = game();

  await bluetoothService(
    gameInstance,
    [intensity, setIntensity, onIntensityUpdate],
    onBatteryUpdate
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
    scrollController.display(matrixToArray(generateMatrixFromGame(gameState)));
  });
};

init();
