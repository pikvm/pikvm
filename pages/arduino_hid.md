# Hardware Arduino HID instead of the OTG
Using Arduino HID on non-v0 platforms is useful if you need a simple and primitive keyboard/mouse emulation device. For example, when used with a hardware KVM switch wich [does not recognize composite HID](https://github.com/pikvm/pikvm/issues/7). You can use the Arduino HID firmware to emulate (at your choice):
* [USB keyboard & mouse](#usb-keyboard--mouse)
* [PS/2 keyboard only](#ps2-keyboard)
* [PS/2 keyboard & USB mouse](#ps2-keyboard--usb-mouse)
* [SPI connection to Arduino Micro](#arduino-spi-hid)

## USB keyboard & mouse
* Build and connect HID according to the [diagram](../README.md#setting-up-the-v0) (the bottom part with transistor, level-shifter and Arduino).
* Switch to RW-mode using command `rw`.
* Add these lines to `/etc/kvmd/override.yaml` (remove `{}` in the file before):
  ```yaml
  kvmd:
      hid:
          type: serial
          reset_pin: 4
          device: /dev/kvmd-hid
  ```
* Create file `/etc/udev/rules.d/99-kvmd-extra.rules`:
  ```udev
  KERNEL=="ttyAMA0", SYMLINK+="kvmd-hid"
  ```
* Run `systemctl disable getty@ttyAMA0.service`.
* Remove `console=ttyAMA0,115200` and `kgdboc=ttyAMA0,115200` from `/boot/cmdline.txt`.
* [Flash the Arduino HID](flashing_hid.md).
* Run `reboot`.

## PS/2 keyboard
Using the PS/2 firmware currently has the following limitations:
* The possibility of using USB HID is excluded.
* PS/2 mouse is not supported due to features of the [PS/2 protocol](https://wiki.osdev.org/PS/2_Mouse).

Both of these problems will be solved one way or another in the future and the two different firmware versions will be combined into one universal one.

To select the PS/2 firmware, you need to follow the instructions for USB, but with one exception. At the device firmware stage instead of commands:
```
# make
# make install
```
Use commands:
```
# make ps2
# make install
```

Next, you need to connect the Arduino pins to the female PS/2 port of your motherboard. Choose the purple port. If your motherboard only have one port, it's probably universal and can be used either for the keyboard or for the mouse. Most likely, it is painted in two colors: green and purple. You can use it either.

Follow this diagram:
| Female PS/2 port (front view) | Pinout |
|-------------------------------|--------|
| <img src="/img/ps2_kbd.png" alt="drawing" width="200"/> | Arduino pin 7 <-> PS/2 CLOCK<br>Arduino pin 5 <-> PS/2 DATA<br>Arduino GND pin <-> PS/2 GND |

**Connect VIN pin of Arduino to any Raspberry's 5v pin.**


## PS/2 keyboard & USB mouse
This is a mixed mode of HID which is a compromise for old computers. Connections are made simultaneously by both USB and PS/2 pins, as shown in the diagram above. Follow the [PS/2 instructions](#ps2-keyboard), but use these commands to build and install the firmware:
```
# make mixed
# make install
```

**You don't need to connect the Arduino VIN pin if you connected USB (the Arduino will get power through it)**.

## SPI connection to Arduino Micro
Using an SPI connection, an Arduino Micro or compatible can be flashed from the Pi and used as an HID keyboard and mouse. Unlike UART, SPI does not share pins with Bluetooth on the Raspberry Pi so the Bluetooth radio does not need to be disabled.

<img src="/img/arduino_spi_hid.png" alt="Diagram of the Arduino SPI wiring for HID keyboard and mouse." width="1308"/>

Before powering either device, double-check the connections. The following should be wired from the Pi to either the level shifter or the Arduino. While the Arduino tolerates 3.3v logic input, 5v outputs from the Arduino can damage or destroy the Raspberry Pi and must not be connected directly to 3.3v GPIO pins directly.

* 5V to HV and Arduino VCC if USB is not connected to the Arduino
* Pi 3v3 to LV on the level shifter
* Pi Ground to LV GND, HV GND, and Arduino GND
* GPIO 10 to MOSI on the Arduino
* GPIO 9 to LV3 or Channel 2 RX on the level shifter
* GPIO 25 to RST on the Arduino
* GPIO 11 to SCK on the Arduino
* HV3 or Channel 2 RX to MISO on the Arduino
* GPIO 7 to SS or RX_LED on the Arduino

There is a smaller Pro Micro board available in 3.3v and 5v versions but the SS pin is absent on these boards. It is possible to solder a lead to the RX LED but damage to the LED or the board may occur. Even on the 3.3v board, 5v exists on the RAW pin. Please take care not to connect this to either the Raspberry Pi or short to any pins on the Pro Micro board as damage will occur.

### Preparing the installation for SPI devices and programming

As of the latest package release, the kdmd service supports SPI. It should be sufficient to ensure the packages are up-to-date with the latest release, the programmer is installed, and the SPI device overlay is loaded at boot.

* Switch the filesystem to read-write mode with `rw`
* Update the system with `pacman -Syu` for the latest packages
* Install the avrdude programmer with `pacman -S avrdude-svn`
* Add `dtoverlay=spi0-1cs` to `/boot/config.txt`
* Reboot with `reboot` or `systemctl reboot`

### Flashing the Arduino microcontroller

Instructions on flashing the microcontroller can be found on the page [Flash the Arduino HID](flashing_hid.md).

If programming fails, ensure the Arduino is powered and check the wiring again. If there is a misconfiguration, power off the Pi and the Arduino, correct the wiring, and try again. Help is available via chat on Discord at https://discord.gg/bpmXfz5.

### Enable the SPI configuration and restart kvmd

Once the installation has completed, all that should remain is to add the following configuration to `/etc/kvmd/override.yaml` and restart the kvmd service. If the first line exists due to existing overrides, omit that line and either add or update the hid section as appropriate.
```yaml
kvmd:
    hid:
        type: spi
        chip: 0
        bus: 0
        sw_cs_pin: 7
        reset_pin: 25
        reset_inverted: true
```

After saving the changes to `/etc/kvmd/override.yaml`, restart `kvmd` and clear your browser cache. The command to restart `kvmd` is

```sh
systemctl restart kvmd
```

If your device is still in read-write mode, `ro` will put the SD back in read-only mode.

If you have any problems or questions, there is an active user chat community on Discord at https://discord.gg/bpmXfz5.
