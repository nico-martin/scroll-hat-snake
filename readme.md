# Scroll Hat Snake
A NodeJS Snake Game on a RaspberryPi Zero W controlled over bluetooth.

## Software
This project is written in NodeJS and based on a headless implementation of the classic computer game "Snake". Each score is transferred to a pixel matrix and sent to the display. 
As a core element, various values (game state, brightness, battery) are mapped via Bluetooth Low Energy GATT Characteristics, which can thus be read or written to.

There is also a web-based UI than consumes those Bluetooth services and provides controls:  
[https://snake-ble.nico.dev/](https://snake-ble.nico.dev/)  
[https://github.com/nico-martin/scroll-hat-snake-ui](https://github.com/nico-martin/scroll-hat-snake-ui)

## Hardware
![Scroll Hat Snake Hardware](https://uploads.nico.dev/scroll-hat-snake.jpg)
- [RaspberryPi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/)
- [Waveshare UPS HAT](https://www.waveshare.com/ups-hat-c.htm) with a INA219 sensor
- [Pimoroni Scroll HAT Mini](https://shop.pimoroni.com/products/scroll-hat-mini)