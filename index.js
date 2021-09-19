const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const bluetoothService = require("./src/ble");
const scrollController = new (require("scroll-controller"))();

const init = async () => {
  let gameNo = 0;
  await scrollController.init();
  const gameInstance = game();

  await bluetoothService((direction) => gameInstance.setDirection(direction));

  gameInstance.start();
  gameInstance.onStepUpdate((currentStep) => {
    scrollController.display(matrixToArray(currentStep.matrix));
  });
};

init();
