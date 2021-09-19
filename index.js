const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const bluetoothService = require("./src/ble");
const scrollController = new (require("scroll-controller"))();

const init = async () => {
  let gameNo = 0;
  let currentDirection = null;
  await scrollController.init();
  const gameInstance = game();

  await bluetoothService(
    (direction) => gameInstance.setDirection(direction),
    () => currentDirection
  );

  gameInstance.start();
  gameInstance.onStepUpdate((currentStep) => {
    currentDirection = currentStep.currentDirection;
    scrollController.display(matrixToArray(currentStep.matrix));
  });
};

init();
