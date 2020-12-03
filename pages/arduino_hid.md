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

To select the PS/2 firmware, you need to follow the instructions for USB, but with one exception. Befor `make` you need to edit file `platformio.ini`. Open it and find these lines:
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

By default, the firmware works with USB HID and supports dynamic mode switching. You can choose one of the other modes by commenting some lines and uncomenting others. This example to use a USB mouse and PS/2 keyboard:
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
