const events = require("events");
const { randomIntFromInterval, wait } = require("./helpers");

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
    gameCount++;
    setStartScreen();
    //step();
    //gameInterval = setInterval(step, 1000 / fps);
  };

  const stopGame = () => clearInterval(gameInterval);

  const blinkCurrentScreen = () =>
    new Promise((resolve) => {
      const offScreen = field.map((col, colIndex) =>
        col.map((row, rowIndex) => 0)
      );
      const currentGameScreen = field.map((col, colIndex) =>
        col.map((row, rowIndex) =>
          snake.find(
            (snakePixel) =>
              rowIndex === snakePixel.x && colIndex === snakePixel.y
          ) !== undefined
            ? 50
            : rowIndex === food.x && colIndex === food.y
            ? 100
            : 0
        )
      );

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
    });

  const setStartScreen = () => {
    const snakeScreen = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    em.emit(STEP_EVENT, {
      matrix: snakeScreen,
      currentDirection,
      snakeLength: snake.length,
      gameCount,
    });
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

  const hasColision = (pixel) =>
    snake.find(
      (snakePixel) => snakePixel.x === pixel.x && snakePixel.y === pixel.y
    ) !== undefined;

  const step = async () => {
    const nextPixel = movePixel(snake[0], currentDirection);

    if (hasColision(nextPixel)) {
      stopGame();
      await blinkCurrentScreen();
      setStartScreen();
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
          ? 50
          : rowIndex === food.x && colIndex === food.y
          ? 100
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
        currentDirection = directions[dirIndex];
      }
    },
  };
};

module.exports = game;
