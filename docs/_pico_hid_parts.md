---
search:
    exclude: true
---


* *x1* [Raspberry Pi Pico board](https://www.raspberrypi.com/products/raspberry-pi-pico/) with soldered pins. Pico 2 is not supported right now.

* *x1* USB-A to Micro-USB cable.

* *x10* dupont wires female-female.

* *x1* 1N5819 diode. It's optional but strongly recommended. Any similar one will do.

    !!! warning
        The diode is needed to provide power to the Pico HID regardless of the target host state,
        which prevents the backpowering problem. It will allow you to keep the keyboard buttons pressed
        during the target host power cycle, which is, for example, important for MacOS to get into the boot menu.

        Do not connect the red wire (the `VSYS (Pico) -> 5V (Pi)` line) without a diode.
        If you can't find a diode, don't connect this wire at all.
