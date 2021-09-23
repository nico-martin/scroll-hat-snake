const bleno = require("bleno");
const Characteristic = bleno.Characteristic;
const pkg = require("../../package.json");
const battery = require("../battery");

// standard service and characertistic UUIDs
// https://btprodspecificationrefs.blob.core.windows.net/assigned-values/16-bit%20UUID%20Numbers%20Document.pdf

module.exports = (onBatteryUpdate) => {
  let level = 0;
  onBatteryUpdate((battery) => {
    level = battery.level;
  });

  return {
    uuid: "180f",
    characteristics: [
      new Characteristic({
        uuid: "2a19", // battery level
        properties: ["read"],
        onReadRequest: (offset, callback) => {
          const result = Characteristic.RESULT_SUCCESS;
          const data = new Buffer(level);
          data.writeUInt8(0x3, 0);
          console.log("LEVEL", level);

          callback(result, data);
        },
      }),
    ],
  };
};
