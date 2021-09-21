process.env["BLENO_DEVICE_NAME"] = "Scroll Hat Snake";

const bleno = require("bleno");
const deviceInfoService = require("./ble/deviceInfoService");
const gameService = require("./ble/gameService");

const bluetoothService = async (gameInstance, intensity) => {
  const device = deviceInfoService();
  const game = gameService(gameInstance, intensity);

  bleno.on("stateChange", (state) => {
    if (state === "poweredOn") {
      bleno.startAdvertising("Scroll Hat Snake", [device.uuid, game.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on("advertisingStart", (err) => {
    if (err) {
      console.log("advertisingStart error", err);
      return;
    }

    bleno.setServices([device, game]);
  });

  bleno.on("disconnect", () => {
    console.log("disconnected from client");
  });
};

module.exports = bluetoothService;
