const bleno = require("bleno");
const Characteristic = bleno.Characteristic;
const pkg = require("../../package.json");
const battery = require("../battery");

// standard service and characertistic UUIDs
// https://btprodspecificationrefs.blob.core.windows.net/assigned-values/16-bit%20UUID%20Numbers%20Document.pdf

module.exports = (onBatteryUpdate) => {
  let level = 0;
  onBatteryUpdate((battery) => {
    level = parseInt(battery.level, 10);
  });

  return {
    uuid: "180f",
    characteristics: [
      new Characteristic({
        uuid: "2a19", // battery level
        properties: ["read", "notify"],
        onReadRequest: (offset, callback) => {
          const result = Characteristic.RESULT_SUCCESS;
          const data = new Buffer([level]);

          callback(result, data);
        },
        onSubscribe: (maxValueSize, updateValueCallback) =>
          onBatteryUpdate((battery) =>
            updateValueCallback(new Buffer([parseInt(battery.level, 10)]))
          ),
      }),
    ],
  };
};
