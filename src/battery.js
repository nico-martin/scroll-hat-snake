const Ina219 = require("@nico-martin/ina219");

const battery = async (listener, timeoutInterval = 2000) => {
  const battery = Ina219(0x43);
  let percentage = 0;
  let isLoading = false;

  await battery.calibrate32V2A();

  const checkStatus = async () => {
    const shuntVoltage = await battery.getShuntVoltage_mV();
    const busVoltage = await battery.getBusVoltage_V();
    let newPercentage = ((busVoltage - 3) / 1.2) * 100;
    if (newPercentage > 100) {
      newPercentage = 100;
    } else if (p < 0) {
      newPercentage = 0;
    }
    newPercentage = Math.round(newPercentage);
    const newIsLoading = shuntVoltage > 0;

    if (newPercentage !== percentage || newIsLoading !== isLoading) {
      isLoading = newIsLoading;
      percentage = newPercentage;
      listener({
        isLoading,
        percentage,
      });
    }
  };

  setInterval(checkStatus, timeoutInterval);
};

module.exports = battery;
