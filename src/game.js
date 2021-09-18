const { randomIntFromInterval } = require("./helpers");

const DIRECTIONS = {
  UP: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
};

const game = (onStepUpdated, config) => {
  const { height, width, fps } = {
    width: 17,
    height: 7,
    fps: 5,
    ...config,
  };
  const field = Array(height).fill(Array(width).fill(0));
  const indexYMax = height - 1;
  const indexXMax = width - 1;

  let gameInterval = null;
  let currentDirection = DIRECTIONS.LEFT;
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

  const step = () => {
    const nextPixel = movePixel(snake[0], currentDirection);
    snake = [nextPixel, ...snake];

    if (nextPixel.x === food.x && nextPixel.y === food.y) {
      food = {
        x: randomIntFromInterval(0, indexXMax),
        y: randomIntFromInterval(0, indexYMax),
      };
    } else {
      snake.pop();
    }

    // checkForSnakeColision();

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

    onStepUpdated({
      matrix: fieldMatrix,
      currentDirection,
      snakeLength: snake.length,
    });
  };

  return {
    start: () => {
      step();
      gameInterval = setInterval(step, 1000 / fps);
    },
    stop: () => clearInterval(gameInterval),
    setDirection: (dir) => {
      if (Object.values(DIRECTIONS).indexOf(dir) === -1) {
        console.error(`invalid direction ${dir}`);
      } else if (
        (currentDirection === DIRECTIONS.UP && dir === DIRECTIONS.DOWN) ||
        (currentDirection === DIRECTIONS.DOWN && dir === DIRECTIONS.UP) ||
        (currentDirection === DIRECTIONS.LEFT && dir === DIRECTIONS.RIGHT) ||
        (currentDirection === DIRECTIONS.RIGHT && dir === DIRECTIONS.LEFT)
      ) {
        // can't change to the opposite
      } else {
        currentDirection = dir;
      }
    },
  };
};

module.exports = game;
