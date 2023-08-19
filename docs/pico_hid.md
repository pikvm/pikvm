# Raspberry Pi Pico HID

!!! warning "This page is under construction"

The Pico HID is a part of DIY PiKVM V1 platform and performs keyboard and mouse emulation.
It has excellent compatibility, and by default emulates USB, including two mouse modes: absolute and relative.

The scope of the Pico HID is not limited to V1 platform, it can also be used with V2 and even V3 platform
if you need to emulate a PS/2 keyboard and mouse or use [legacy multiport KVM switch](https://github.com/pikvm/pikvm/issues/7)
which does not fully support USB standards.

This page explains how to build, connect and use all the features of the Pico HID.


-----
## Making the Pico HID

If you are building the PiKVM V1, then all the necessary components should already be at your fingertips.
If you are making the Pico HID for V2 or V3, then here is what you will need:

* Raspberry Pi Pico board with soldered pins. [An official green board](https://pico.pinout.xyz) is recommended.
* *x1* USB-A to Micro-USB cable.
* *x10* dupont wires female-female.
* Optional: *x1* 1N5819 diode. But any similar one will do.

!!! tip "Tip for soldering guru"
    If you know how to solder, you can buy the Pico without pins and no dupond wires, and just solder everything.

!!! warning
    The diode is needed to provide the power to the Pico HID regardless of the host state,
    and prevents backpowering problem. It will allow you to keep the keyboard buttons pressed
    during the host power cycle, which is important for MacOS to get into the boot menus, for example.

    Do not connect the red wire (the `VSYS (Pico) -> 5V (Pi)` line) without a diode.
    If you can't find the diode, don't connect this wire at all.

Connect all the parts according to the scheme:

??? example "Simple wiring diagram"
    <img src="basic_breadboard.png" />

??? example "Electrical schematic diagram for advanced users"
    <img src="basic_scheme.png" />


-----
## Configuring the HID modes

By default, Pico HID emulates a USB keyboard and an absolute or relative mouse
(read [here](mouse.md) about the difference between mouse modes).
For most cases, nothing needs to be changed here. However, if you need something special
(like Windows 98 support), you can do it without reflashing on the current firmware.

To achieve this, the Pico HID uses a runtime configuration, which is set by connecting
some GPIOs with Ground (`GND`) lines.

| Pin name on the Pico board | Description |
|----------|-------------|
| `GP2`    | Enable PS/2 keyboard & mouse support (see below). |
| `GP3`    | Prefer the PS/2 keyboard over USB when turning on the HID (if PS/2 enabled). |
| `GP4`    | Prefer the PS/2 mouse over USB (if PS/2 enabled) |
| `GP6`    | Disable USB keyboard & mouse support. This is useful if you only want to use PS/2. |
| `GP7`    | Enable the special USB absolute mouse for Windows 98. |
| `GP8`    | Prefer the relative USB mouse over the absolute one. |
| `GP9`    | Prefer the Windows 98 USB absolute mouse over the regular absolute one (if enabled). |

!!! example
    To enable Windows 98 absolute mouse, just connect pin `GP9` to any `GND` [on the Pico](https://pico.pinout.xyz).

!!! warning
    PS/2 is not implemented now. Soon (r) (c) (tm)


-----
## Flashing the firmware

To upload the firmware to Pico HID, you can use any computer with a USB port.

1. [Download](https://github.com/pikvm/kvmd/releases) the latest release of the firmware. The file is called `pico-hid.uf2`.
2. Press the white button on the Pico board and plug it using USB cable to the computer.
3. Release the button.
4. The Pico board appears as a flash drive on the host computer.
5. Copy the `pico-hid.uf2` file to this flash drive.
6. Safely disconnect the USB device.


-----
## The final steps

Connect the Pico HID to the host computer using the USB cable.

If you are building PiKVM V1, then no further action with the Pico HID is required.

If you are making the Pico HID for V2 or V3, add the following lines to the PiKVM configuration and reboot it.

!!! note "KVMD >= 3.241 is required for the Pico HID"

* `/boot/config.txt`
    ```ini
    dtoverlay=spi0-1cs
    ```

* `/etc/kvmd/override.yaml`:
    ```yaml
    kvmd:
        hid:
            type: spi
            chip: 0
            bus: 0
            sw_cs_pin: 7
            sw_cs_per_byte: true
            reset_pin: 25
            reset_inverted: true
            reset_self: true
            power_detect_pin: 16
            power_detect_pull_down: true
    ```


-----
## Replacing the Arduino HID

!!! warning
    **This section is intended for advanced users of the [legacy Arduino HID](arduino_hid.md).**

    It may seem tempting, but **don't to use the Arduino HID for new PiKVM builds**
    just because you have it at your fingertips. Connecting and flashing Arduino
    is much more time consuming than Pico. In addition, different Arduino board works
    with different voltages, may or may not have SPI (for the Pico, we use SPI to free up
    the UART on Raspberry Pi for the console and other useful things), etc.

    Using the Pico HID is the recommended fast and standard way in the PiKVM world.

The Pico HID can be used to replace the [legacy Arduino HID](arduino_hid.md).
Moreover, it can use both Serial (UART) port and SPI. The connection scheme is also noticeably simplified,
getting rid of the transistor for the Reset line and level shifter for RX/TX (MOSI/MISO).

??? example "For the Arduino HID over SPI"
    Throw away the Reset transistor and level shifter, and follow this guide
    from the very beginning, as if you were connecting Pico HID to PiKVM V2 or V3.

??? example "For the classic Serial (UART) HID"
    Get rid of the transistor and level shifter, and follow this guide
    from the very beginning, but the schemes and configs will be slightly different.

    * The `GP22` on the Pico is connected directly to the `GND`. This enables UART mode instead of default SPI.

    * In the good old PiKVM V0, `GPIO4` [on the Raspberry Pi](https://pinout.xyz) was used for the Reset line.
      Now we recommend to use `GPIO25` for consistency reasons.
      However, you can use `GPIO4` by changing the `reset_pin` value in the config example below.
      On the scheme, this is a yellow wire, the `RUN (Pico) -> GPIO25 (Pi)` line.

    ??? example "Simple wiring diagram"
        <img src="serial_breadboard.png" />

    ??? example "Electrical schematic diagram"
        <img src="serial_scheme.png" />

    ??? example "Configs"
        * Don't add line `dtoverlay=spi0-1cs` to the `/boot/config.txt` file. It's only needed for SPI.

        * `/etc/kvmd/override.yaml`:
            ```yaml
            kvmd:
                hid:
                    type: serial
                    device: /dev/kvmd-hid
                    reset_pin: 25
                    reset_inverted: true
                    reset_self: true
                    power_detect_pin: 16
                    power_detect_pull_down: true
            ```
