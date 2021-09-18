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
    fps: 10,
    ...config,
  };
  const field = Array(height).fill(Array(width).fill(0));
  const indexYMax = height - 1;
  const indexXMax = width - 1;

  let gameInterval = null;
  let currentDirection = DIRECTIONS.RIGHT;
  let snake = [[1, 1]];

  const movePixel = ([x, y], direction) => {
    switch (direction) {
      case DIRECTIONS.UP:
        return [x, y - 1 < 0 ? indexYMax : y - 1];
      case DIRECTIONS.DOWN:
        return [x, y + 1 > indexYMax ? 0 : y + 1];
      case DIRECTIONS.LEFT:
        return [x - 1 < 0 ? indexXMax : y - 1, y];
      case DIRECTIONS.RIGHT:
        return [x + 1 > indexXMax ? 0 : x + 1, y];
    }
  };

  const step = () => {
    snake = snake.map((snakePixel) => movePixel(snakePixel, currentDirection));
    const fieldMatrix = field.map((row, rowIndex) =>
      row.map((col, colIndex) =>
        snake.find(
          (snakePixel) =>
            rowIndex === snakePixel[0] && colIndex === snakePixel[1]
        ) === undefined
          ? 0
          : 100
      )
    );
    onFieldUpdate(fieldMatrix);
  };

  return {
    start: () => {
      gameInterval = setInterval(step, 1000 / fps);
    },
    stop: () => {
      clearInterval(gameInterval);
    },
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
