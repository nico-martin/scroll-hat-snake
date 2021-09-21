const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

module.exports = (
  gameInstance,
  [intensity, setIntensity, onIntensityUpdate]
) => {
  let direction = "";
  gameInstance.onStepUpdate((gameState) => {
    direction = gameState.direction;
  });
  onIntensityUpdate((newIntensity) => {
    intensity = newIntensity;
  });

  return {
    uuid: "75c7c8d271214267b885eb3f4a21faf5",
    characteristics: [
      new Characteristic({
        uuid: "35a1022cfdd311eb9a030242ac130003",
        properties: ["write", "read"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "95aefc76cf554673967cbeb2e0463311",
            value:
              "direction characteristic (UP: 0, LEFT: 1, RIGHT: 2, DOWN: 3)",
          }),
        ],
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const direction = data.readUInt8(0);

          if (data.length !== 1) {
            console.log("ERROR: invalid data", data);
            callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
            return;
          }

          if (direction > 4) {
            console.log("ERROR: value has to be between 0, 1, 2 or 3");
            callback(Characteristic.RESULT_UNLIKELY_ERROR);
            return;
          }

          gameInstance.setDirection(direction);
          callback(Characteristic.RESULT_SUCCESS);
        },
        onReadRequest: (offset, callback) => {
          const result = Characteristic.RESULT_SUCCESS;
          const data = new Buffer(direction);

          callback(result, data);
        },
      }),
      new Characteristic({
        uuid: "b7d1871e766f4382831f525d14c32d1e",
        properties: ["notify"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "1c9e2bd81c1b41ada180dc262793e355",
            value: "snakeLangth value",
          }),
        ],
        onSubscribe: (maxValueSize, updateValueCallback) =>
          gameInstance.onStepUpdate((data) =>
            updateValueCallback(new Buffer(data.snake.length))
          ),
      }),
      new Characteristic({
        uuid: "0144e26e849f415da9c0db05e4a37230",
        properties: ["notify"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "c709728039bc4e939bc025bcf3e5951a",
            value: "gameCount value",
          }),
        ],
        onSubscribe: (maxValueSize, updateValueCallback) =>
          gameInstance.onStepUpdate((data) =>
            updateValueCallback(new Buffer(data.gameCount))
          ),
      }),
      new Characteristic({
        uuid: "0e5781c5d5b5402c82f8307e4350f5ce",
        properties: ["notify", "write", "read"],
        descriptors: [
          new bleno.Descriptor({
            uuid: "5e22577957a14bcabf7ec7f7a6a529ba",
            value: "LED intensity (0-255)",
          }),
        ],
        onReadRequest: (offset, callback) => {
          const result = Characteristic.RESULT_SUCCESS;
          const data = new Buffer(intensity.toString(16));

          callback(result, data);
        },
        onSubscribe: (maxValueSize, updateValueCallback) =>
          onIntensityUpdate((intensity) =>
            updateValueCallback(new Buffer(intensity.toString(16)))
          ),
        onWriteRequest: (data, offset, withoutResponse, callback) => {
          const intensity = data.readUInt8(0);

          if (data.length !== 1) {
            console.log("ERROR: invalid data", data);
            callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
            return;
          }

          setIntensity(intensity);
          callback(Characteristic.RESULT_SUCCESS);
        },
      }),
    ],
  };
};
