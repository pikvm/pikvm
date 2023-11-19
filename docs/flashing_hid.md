# Flashing the Arduino HID

## Serial Firmware (the default option)

This operation can be done using your RPi (except Pi Zero W). Here the common steps:

1. Disconnect the RESET wire from the Arduino board.

2. Connect the Arduino and RPi with a suitable USB cable.

3. [Log in to the Raspberry Pi using SSH](https://docs.pikvm.org/first_steps/#getting-access-to-pikvm).

4. Upload the firmware (USB keyboard & mouse is used by default, on this step [you can choose PS/2 keyboard](arduino_hid.md#ps2-keyboard)):

    ```
    # rw
    # systemctl stop kvmd
    # cp -r /usr/share/kvmd/hid/arduino ~
    # cd ~/hid
    # make
    # make install
    # reboot
    ```

5. Connect the RESET wire, disconnect the USB cable, and reboot the RPi.

With a Pi Zero W, you may consider building the firmware on a faster system and programming using USB or booting from another SD card and following the build steps using a clone of the [KVMD repo](https://github.com/pikvm/kvmd).


## SPI Firmware

This operation can be done using your Raspberry Pi without disconnecting any wires:

1. Connect the Arduino and RPi with a suitable USB cable.

2. [Log in to the Raspberry Pi using SSH](https://docs.pikvm.org/first_steps/#getting-access-to-pikvm).

3. Execute `rw`, add line `dtoverlay=spi0-1cs` to `/boot/config.txt` and perform `reboot`.

4. Build and upload the firmware (USB keyboard & mouse is used by default)

    ```shell
    # rw
    # systemctl stop kvmd
    # cp -r /usr/share/kvmd/hid/arduino ~
    # cd ~/hid
    # make spi
    # make install
    # reboot
    ```

## Common Errors

### Circuit Issues

#### Common - Reset Wire
Different pins are used for the reset wire but serve a similar function. For programming the TTL firmware over USB, the reset wire should be disconnected. When programming using SPI, the reset wire needs to be connected through a transistor circuit and connected to GPIO25 (pin 22 on the GPIO header)


#### SPI-specific Wiring
The 3v3, ground, Reset (GPIO25), MISO, MOSI, SCLK, and CS1 need to be connected appropriately. SPIO_CS0 and SPIO_CS1 can both be used but the default configuration uses SPIO_CS1 for the Arduino Microcontroller (CS0 is used for another device on the V3). These generally follow a block as follows:

```
Pin  0        2         4
      2        0         0
      .........GR.C.......
Row # 12345678901234567890
      ........3MMS........
Pin   0       1          3
       1       7          9
```

The most common error is an "off-by-one" error where pins are shifted by a row. Some cases have non-standard GPIO layouts so please be careful when following these instructions using a case that has a modified pinout.
