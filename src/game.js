const DIRECTIONS = {
  UP: "UP",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
};

const game = (onFieldUpdate, config) => {
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
  let currentDirection = DIRECTIONS.RIGHT;
  let snake = [
    {
      x: 1,
      y: 1,
    },
  ];

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
          x: x - 1 < 0 ? indexXMax : y - 1,
          y,
        };
      case DIRECTIONS.RIGHT:
        return {
          x: x + 1 > indexXMax ? 0 : x + 1,
          y,
        };
    }
  };

  let i = 0;

  const step = () => {
    i++;
    console.log("step", i);
    if (i === 5) {
      //currentDirection = DIRECTIONS.RIGHT;
    } else if (i === 10) {
      //currentDirection = DIRECTIONS.UP;
    } else if (i === 15) {
      //currentDirection = DIRECTIONS.LEFT;
    }
    snake = snake.map((snakePixel) => movePixel(snakePixel, currentDirection));
    const fieldMatrix = field.map((col, colIndex) =>
      col.map((row, rowIndex) =>
        snake.find(
          (snakePixel) => rowIndex === snakePixel.x && colIndex === snakePixel.y
        ) === undefined
          ? 0
          : 100
      )
    );

    onFieldUpdate(fieldMatrix);
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
      } else {
        currentDirection = dir;
      }
    },
  };
};

module.exports = game;
