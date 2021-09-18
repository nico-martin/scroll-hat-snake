const { arrayToLength } = require("./helpers");

const fixedMatrixSize = (matrix, height, width) =>
  arrayToLength(matrix, height, []).map((row) => arrayToLength(row, width));

const matrixToArray = (rows, height = 7, width = 17) => {
  let arr = [];
  let i = 0;
  rows.map((x) =>
    x.map((y) => {
      arr[i] = y;
      i = i + 1;
    })
  );
  return arr;

  /*
  const cleanSizeMatrix = fixedMatrixSize(rows, height, width);

  return cleanSizeMatrix.reduce(
    (acc, rows) => [...acc, ...rows.map((value) => value)],
    []
  );*/
};

module.exports = {
  matrixToArray,
};
