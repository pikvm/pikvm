# Hardware Arduino HID instead of the OTG
Using Arduino HID on non-v0 platforms is useful if you need a simple and primitive keyboard/mouse emulator device. For example when used with a hardware KVM switch which [does not recognize composite HID](https://github.com/pikvm/pikvm/issues/7). You can also use the Arduino HID to emulate the PS/2 keyboard.

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
* The possibility of using the switchable USB HID is excluded.
* PS/2 mouse is not supported right now (but it will).

Both of these problems will be solved in the nearest future and the two different firmware versions will be combined into one universal one.

To select the PS/2 firmware, you need to follow the instructions for USB, but with one exception. Before `make` you need to edit file `platformio.ini`. Open it and find these lines:
```ini
[_common]
build_flags =
    -DHID_PS2_KBD_CLOCK_PIN=7
    -DHID_PS2_KBD_DATA_PIN=5
    -DHID_USB_CHECK_ENDPOINT
# ----- The default config with dynamic switching -----
    -DHID_DYNAMIC
    -DHID_WITH_USB
    -DHID_SET_USB_KBD
    -DHID_SET_USB_MOUSE_ABS
# ----- PS2 keyboard only -----
#   -DHID_WITH_PS2
#   -DHID_SET_PS2_KBD
# ----- PS2 keyboard + USB absolute mouse -----
#   -DHID_WITH_USB
#   -DHID_WITH_PS2
#   -DHID_SET_PS2_KBD
#   -DHID_SET_USB_MOUSE_ABS
# ----- PS2 keyboard + USB relative mouse -----
#   -DHID_WITH_USB
#   -DHID_WITH_PS2
#   -DHID_SET_PS2_KBD
#   -DHID_SET_USB_MOUSE_REL
```

By default, the firmware works with USB HID and supports dynamic mode switching. You can choose one of the other modes by commenting some lines and uncommenting others. This example to use a USB mouse and PS/2 keyboard:
```ini
...
# ----- The default config with dynamic switching -----
#   -DHID_DYNAMIC
#   -DHID_WITH_USB
#   -DHID_SET_USB_KBD
#   -DHID_SET_USB_MOUSE_ABS
# ----- PS2 keyboard only -----
...
# ----- PS2 keyboard + USB absolute mouse -----
    -DHID_WITH_USB
    -DHID_WITH_PS2
    -DHID_SET_PS2_KBD
    -DHID_SET_USB_MOUSE_ABS
# ----- PS2 keyboard + USB relative mouse -----
...
```

Next, you need to connect Arduino pins to the female PS/2 port of your motherboard. Choose the purple port. If your motherboard only have one port, it's probably universal and can be used either for the keyboard or for the mouse. Most likely, it is painted in two colors: green and purple. You can use it either.

Follow this diagram:
| Female PS/2 port (front view) | Pinout |
|-------------------------------|--------|
| <img src="/img/ps2_kbd.png" alt="drawing" width="200"/> | Arduino pin 7 <-> PS/2 CLOCK<br>Arduino pin 5 <-> PS/2 DATA<br>Arduino GND pin <-> PS/2 GND |

**Connect VIN pin of Arduino to [any Raspberry's 5v pin](https://pinout.xyz/pinout/5v_power) for PS/2 only device. But you don't need to connect the Arduino VIN pin if you connected USB (Arduino will get power through it).**

## SPI connection to Arduino Micro
Using an SPI connection, an Arduino Micro or compatible can be flashed from the Pi and used as an HID keyboard and mouse. Unlike UART, SPI does not share pins with Bluetooth on the Raspberry Pi so the Bluetooth radio does not need to be disabled.

<img src="/img/arduino_spi_hid.png" alt="Diagram of the Arduino SPI wiring for HID keyboard and mouse." width="654"/>

Before powering either device, double-check the connections. The following should be wired from the Pi to either the level shifter or the Arduino. While the Arduino tolerates 3.3V logic input, 5V outputs from the Arduino can damage or destroy the Raspberry Pi and must not be connected directly to 3.3V GPIO pins directly.

### Parts List

There are very few parts needed besides the Raspberry Pi to build the solution. Some parts may be purchased with or without headers, if headers are not pre-soldered, it may be necessary to order some breakaway header strips and solder them to the boards prior to assembly unless the wires will be soldered directly to the boards.

* Raspberry Pi Zero W or Pi 4 are the most popular boards for this solution, pre-soldered headers recommended
* Arduino Micro (or compatible) microcontroller board with pre-soldered headers recommended
* Logic Level Converter. This may be RX/TX, Bidirectional, or Single Supply
* Dupont wires (female to male pin) recommended for breadboard or other suitable means of making the connections
* ***Optional:*** Breakaway headers for the logic level converter
* ***Optional:*** Breadboard large enough to accomodate the parts
* ***Optional:*** Header pins for connection to a breadboard

***Note:*** A smaller "Pro Micro" board is available in a 3.3V model but the SS connection (RX_LED) is not available as a separate pin or solderable hole. If using this board, a jumper wire can be soldered to the resistor for the RX_LED but there is risk of burning the resistor, the LED, the board, or other components in the process. Advantages of this board include not requiring a logic level converter and reduced breadboard or board space for building the solution.

### List of connections to be made

There are a total of 9 connections to be made for the typical setup, not including any jumpers that may need to be made from the 3.3V, 5V, or ground rails on the breadboard. A few connections to pay particular attention to have been ***emphasized*** with a different font below.

* ***Optional: 5V to HV and Arduino VCC, for programming the microcontroller without an active USB connection***
* Pi 3v3 to LV on the level shifter
* Pi Ground to LV GND, HV GND, and Arduino GND
* GPIO10 (MOSI) to MOSI on the Arduino
* ***GPIO9 (MISO) to LV3 or Channel 2 RX on the logic level shifter***
* GPIO25 to RST on the Arduino
* GPIO11 (SPIO_SCLK) to SCK on the Arduino
* ***HV3 or Channel 2 RX on the logic level shifter to MISO on the Arduino***
* GPIO7 (SPIO_CE1_N) to SS or RX_LED on the Arduino

Pictures of this setup are also available in full resolution for download to assist for both the Raspberry Pi and the microcontroller board. A smaller version of the images has been included on this page and can be downloaded.

| Raspberry Pi Closeup | Breadboard with Arduino |
|------------|--------|
| <img src="/img/arduino_spi_hid_rpi.jpg" alt="A closeup of the Raspberry Pi wired to the breadboard." width=300/> | <img src="/img/arduino_spi_hid_bb.jpg" alt="Arduino on a breadboard fully wired to the Pi." width=300/> |

If the microcontroller will be powered by USB for programming, the 5V connection is not required and should be disconnected unless the Arduino will be programmed using the Raspberry Pi's power before connecting it to a host. While leaving this wire may not cause damage, the Raspberry Pi does not have backcurrent protection so it is recommended the 5V connection in the diagram and pictures be removed prior to host connection.

### Preparing the installation for SPI devices and programming

As of the latest package release, the kdmd service supports SPI. It should be sufficient to ensure the packages are up-to-date with the latest release, the programmer is installed, and the SPI device overlay is loaded at boot.

* Switch the filesystem to read-write mode with `rw`
* Update the system with `pacman -Syu` for the latest packages
* Install the avrdude programmer with `pacman -S avrdude-svn`
* Add `dtoverlay=spi0-1cs` to `/boot/config.txt`
* Reboot with `reboot` or `systemctl reboot`

### Flashing the Arduino microcontroller

Instructions on flashing the microcontroller can be found on the page [Flash the Arduino HID](flashing_hid.md).

If programming fails, ensure the Arduino is powered and check the wiring again. If there is a misconfiguration, power off the Pi and the Arduino, correct the wiring, and try again. Note it is not recommended or required to supply 5V power from the Raspberry Pi if the microcontroller is USB powered, if the issue appears to be power related it may be removed from the solution and replaced with a powered USB connection if it will aid in troubleshooting but check all other wires first to ensure there are no shorts.

Wiring problems are a common issue but there could be other reasons for programming not to complete. While it is not possible to list every possible problem and solution here, there is an active user community on Discord at https://discord.gg/bpmXfz5 with others familiar with the solution and willing to help.

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
