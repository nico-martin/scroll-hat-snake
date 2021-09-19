const events = require("events");
const { randomIntFromInterval } = require("./helpers");

const STEP_EVENT = "StepEvent";

const DIRECTIONS = {
  UP: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
};

const game = (config) => {
  const { height, width, fps } = {
    width: 17,
    height: 7,
    fps: 5,
    ...config,
  };
  const em = new events.EventEmitter();
  const field = Array(height).fill(Array(width).fill(0));
  const indexYMax = height - 1;
  const indexXMax = width - 1;

  let gameCount = 0;
  let gameInterval = null;
  let currentDirection = DIRECTIONS.RIGHT;
  let snake = [
    {
      x: 1,
      y: 1,
    },
  ];
  let food = {
    x: randomIntFromInterval(0, indexXMax),
    y: randomIntFromInterval(0, indexYMax),
  };

  const startGame = () => {
    step();
    gameInterval = setInterval(step, 1000 / fps);
  };

  const stopGame = () => clearInterval(gameInterval);

  const movePixel = ({ x, y }, direction) => {
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

  const hasColision = (pixel) =>
    snake.find(
      (snakePixel) => snakePixel.x === pixel.x && snakePixel.y === pixel.y
    ) !== undefined;

  const step = () => {
    const nextPixel = movePixel(snake[0], currentDirection);

    if (hasColision(nextPixel)) {
      stopGame();
      return;
    }

    snake = [nextPixel, ...snake];

    if (nextPixel.x === food.x && nextPixel.y === food.y) {
      food = {
        x: randomIntFromInterval(0, indexXMax),
        y: randomIntFromInterval(0, indexYMax),
      };
    } else {
      snake.pop();
    }

    const fieldMatrix = field.map((col, colIndex) =>
      col.map((row, rowIndex) =>
        snake.find(
          (snakePixel) => rowIndex === snakePixel.x && colIndex === snakePixel.y
        ) !== undefined
          ? 100
          : rowIndex === food.x && colIndex === food.y
          ? 200
          : 0
      )
    );

    em.emit(STEP_EVENT, {
      matrix: fieldMatrix,
      currentDirection,
      snakeLength: snake.length,
      gameCount,
    });
  };

  return {
    start: startGame,
    stop: stopGame,
    onStepUpdate: (listener) => em.on(STEP_EVENT, listener),
    setDirection: (dirIndex) => {
      const directions = Object.values(DIRECTIONS);
      if (!Object.values(DIRECTIONS)[dirIndex]) {
        console.error(`invalid direction index ${dirIndex}`);
      } else if (
        (currentDirection === DIRECTIONS.UP &&
          dirIndex === directions.indexOf(DIRECTIONS.DOWN)) ||
        (currentDirection === DIRECTIONS.DOWN &&
          dirIndex === directions.indexOf(DIRECTIONS.UP)) ||
        (currentDirection === DIRECTIONS.LEFT &&
          dirIndex === directions.indexOf(DIRECTIONS.RIGHT)) ||
        (currentDirection === DIRECTIONS.RIGHT &&
          dirIndex === directions.indexOf(DIRECTIONS.LEFT))
      ) {
        // can't change to the opposite
      } else {
        console.log(`${currentDirection} === ${DIRECTIONS.UP}`);
        console.log(`${dirIndex} === ${directions.indexOf(DIRECTIONS.UP)}`);
        currentDirection = directions[dirIndex];
      }
    },
  };
};

module.exports = game;
