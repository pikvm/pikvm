# Hardware Arduino HID instead of the OTG
Using Arduino HID on non-v0 platforms is useful if you need a simple and primitive keyboard emulation device. For example, when used with a hardware KVM switch. You can use the firmware to emulate:
* [USB keyboard & mouse](#usb-keyboard--mouse)
* [PS/2 keyboard only](#ps2-keyboard)
* [PS/2 keyboard & USB mouse](#ps2-keyboard--usb-mouse)

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
