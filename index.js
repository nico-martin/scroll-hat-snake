const game = require("./src/game");
const { matrixToArray } = require("./src/matrix");
const scrollController = new (require("scroll-controller"))();

const init = async () => {
  let gameNo = 0;
  await scrollController.init();

  const startGame = () => {
    gameNo++;
    const newGame = game((gameMatrix) => {
      //console.log(gameMatrix);
      scrollController.display(matrixToArray(gameMatrix));
    });
    newGame.start();
  };

  startGame();
};

init();
