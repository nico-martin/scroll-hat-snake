const bleno = require("bleno");
const Characteristic = bleno.Characteristic;

module.exports = (setDirection = () => {}, getDirection = () => {}) => ({
  uuid: "75c7c8d271214267b885eb3f4a21faf5",
  characteristics: [
    new Characteristic({
      uuid: "35a1022cfdd311eb9a030242ac130003",
      properties: ["write", "read"],
      descriptors: [
        new bleno.Descriptor({
          uuid: "95aefc76cf554673967cbeb2e0463311",
          value: "direction characteristic (UP: 0, LEFT: 1, RIGHT: 2, DOWN: 3)",
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

        setDirection(direction);
        callback(Characteristic.RESULT_SUCCESS);
      },
      onReadRequest: (offset, callback) => {
        const result = Characteristic.RESULT_SUCCESS;
        const data = new Buffer(getDirection());

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
      onSubscribe: (maxValueSize, updateValueCallback) => {
        console.log("onsubscribe");
        let i = 0;
        setInterval(() => {
          i++;
          console.log("new i", i);
          updateValueCallback(new Buffer(i));
        }, 1000);
      },
    }),
  ],
});
