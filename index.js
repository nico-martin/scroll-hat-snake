const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const scrollController = new (require("scroll-controller"))();

const init = async () => {
  let gameNo = 0;
  await scrollController.init();

  const startGame = () => {
    gameNo++;
    const newGame = game((currentGame) => {
      scrollController.display(matrixToArray(currentGame.matrix));
    });
    newGame.start();
  };

  startGame();
};

init();
