const events = require("events");
const { randomIntFromInterval, wait } = require("./helpers");

const UPDATE_EVENT = "UpdateEvent";

const DIRECTIONS = {
  UP: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
};

const GAME_STATES = {
  START: "START",
  STOP: "STOP",
  PAUSE: "PAUSE",
};

const hasColision = (pixel, snake) =>
  snake.find(
    (snakePixel) => snakePixel.x === pixel.x && snakePixel.y === pixel.y
  ) !== undefined;

const game = (config) => {
  const { height, width, fps } = {
    width: 17,
    height: 7,
    fps: 5,
    ...config,
  };
  const em = new events.EventEmitter();
  const indexYMax = height - 1;
  const indexXMax = width - 1;

  const generateStartSnake = () => [
    {
      x: 1,
      y: 1,
    },
  ];

  const generateFood = (snake = null) => {
    let food = {
      x: randomIntFromInterval(0, indexXMax),
      y: randomIntFromInterval(0, indexYMax),
    };
    return;
    let validPositionFound = false;
    while (validPositionFound) {
      food = {
        x: randomIntFromInterval(0, indexXMax),
        y: randomIntFromInterval(0, indexYMax),
      };
      if (!hasColision(food, snake)) {
        validPositionFound = true;
      }
    }
    return food;
  };

  let gameState = {
    direction: DIRECTIONS.RIGHT,
    snake: generateStartSnake(),
    food: generateFood(),
    gameCount: 0,
    gameState: GAME_STATES.START,
  };

  const updateGameState = (partialState) => {
    gameState = { ...gameState, ...partialState };
    em.emit(UPDATE_EVENT, gameState);
  };

  let gameInterval = null;

  const setUpNewGame = () => {
    const newSnake = generateStartSnake();
    const newFood = generateFood(newSnake);
    updateGameState({
      direction: DIRECTIONS.RIGHT,
      snake: newSnake,
      food: newFood,
      gameCount: gameState.gameCount + 1,
    });
  };

  const startGame = () => {
    gameInterval = setInterval(generateNextStap, 1000 / fps);
  };

  const stopGame = (pause = false) => {
    clearInterval(gameInterval);
    updateGameState({
      gameState: pause ? GAME_STATES.PAUSE : GAME_STATES.STOP,
    });
  };

  /*
  const blinkCurrentScreen = () =>
    new Promise((resolve) => {
      let i = 0;

      const blinkInterval = setInterval(async () => {
        i++;
        if (i === 3) {
          clearInterval(blinkInterval);
          resolve();
        }
        em.emit(STEP_EVENT, {
          matrix: offScreen,
          currentDirection,
          snakeLength: snake.length,
          gameCount,
        });
        await wait(700);
        em.emit(STEP_EVENT, {
          matrix: currentGameScreen,
          currentDirection,
          snakeLength: snake.length,
          gameCount,
        });
        await wait(700);
      }, 1400);
    });*/

  const getNextPixel = ({ x, y }, direction) => {
    switch (direction) {
      case DIRECTIONS.UP:
        return {
          x,
          y: y - 1 < 0 ? indexYMax : y - 1,
        };
      case DIRECTIONS.DOWN:
        return {
          x,
          y: y + 1 > indexYMax ? 0 : y + 1,
        };
      case DIRECTIONS.LEFT:
        return {
          x: x - 1 < 0 ? indexXMax : x - 1,
          y,
        };
      case DIRECTIONS.RIGHT:
        return {
          x: x + 1 > indexXMax ? 0 : x + 1,
          y,
        };
    }
  };

  const generateNextStap = async () => {
    if (gameState.gameState === GAME_STATES.STOP) {
      stopGame();
    }
    const nextPixel = getNextPixel(gameState.snake[0], gameState.direction);
    const oldSnakeWithoutFood = gameState.snake.filter(
      (pixel, i, full) => i !== full.length - 1
    );
    const newSnake = [nextPixel, ...gameState.snake];
    const snakeWithoutFood = [nextPixel, ...oldSnakeWithoutFood];

    if (hasColision(nextPixel, oldSnakeWithoutFood)) {
      return updateGameState({
        gameState: GAME_STATES.STOP,
      });
    }

    const foundFood =
      nextPixel.x === gameState.food.x && nextPixel.y === gameState.food.y;

    const snake = foundFood ? newSnake : snakeWithoutFood;

    updateGameState({
      snake,
      food: foundFood ? generateFood() : gameState.food,
    });
  };

  return {
    start: (reset = true) => {
      reset && setUpNewGame();
      startGame();
    },
    stop: () => stopGame(),
    pause: () => stopGame(true),
    onStepUpdate: (listener) => em.on(UPDATE_EVENT, listener),
    setDirection: (dirIndex) => {
      const directions = Object.values(DIRECTIONS);
      if (!Object.values(DIRECTIONS)[dirIndex]) {
        console.error(`invalid direction index ${dirIndex}`);
      } else if (
        (gameState.direction === DIRECTIONS.UP &&
          dirIndex === directions.indexOf(DIRECTIONS.DOWN)) ||
        (gameState.direction === DIRECTIONS.DOWN &&
          dirIndex === directions.indexOf(DIRECTIONS.UP)) ||
        (gameState.direction === DIRECTIONS.LEFT &&
          dirIndex === directions.indexOf(DIRECTIONS.RIGHT)) ||
        (gameState.direction === DIRECTIONS.RIGHT &&
          dirIndex === directions.indexOf(DIRECTIONS.LEFT))
      ) {
        // can't change to the opposite
      } else {
        updateGameState({
          direction: directions[dirIndex],
        });
      }
    },
  };
};

module.exports = game;
