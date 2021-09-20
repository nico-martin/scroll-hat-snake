const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const bluetoothService = require("./src/ble");
const scrollController = new (require("scroll-controller"))();

// todo: brightness should be adjustable (writable characteristic between 0 and 255 (snake is half brighnes, food full))
// todo: add restart option (writable characteristic with states 0 = stop, 1 = pause, 2 = running)
// todo: add gameStat Screen (start = game, stop = "SNAKE", pause = game but no steps running)

const init = async () => {
  let currentDirection = null;
  await scrollController.init();
  const gameInstance = game();

  await bluetoothService(
    (direction) => gameInstance.setDirection(direction),
    () => currentDirection.toString(),
    gameInstance.onStepUpdate
  );

  gameInstance.start();
  gameInstance.onStepUpdate((currentStep) => {
    console.log("step", currentStep);
    currentDirection = currentStep.currentDirection;
    scrollController.display(matrixToArray(currentStep.matrix));
  });
};

init();
