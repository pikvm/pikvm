---
title: The Pico HID
description: How to perform keyboard and mouse emulation on DIY PiKVM V1 with Pico HID
---

!!! tip "A fast way to get PS/2 on PiKVM V2+"
    If you need PS/2 keyboard & mouse on [PiKVM V2](v2.md), [V3](v3.md) and [V4 Plus](v4.md)
    (but not V4 Mini or DIY based on Zero 2 W boards),
    you can use a faster and easier way: [The Pico HID Bridge](pico_hid_bridge.md).

!!! note "Pico requirements"
    [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/)
    (the first model) based on RP2040 microcontroller is required.
    [Pico 2](https://www.raspberrypi.com/products/raspberry-pi-pico-2/) is not supported right now.

The Pico HID is a part of [DIY PiKVM V1](v1.md) platform that performs
keyboard and mouse emulation. It has excellent compatibility, and
emulates USB by default, including two mouse modes: absolute and
relative.

Full list of features:

| Feature | Enabled by default |
|---------|--------------------|
| USB Keyboard, absolute & relative mouse | Yes |
| USB Absolute Mouse for Windows 95 | No |
| PS/2 Keyboard & mouse | No |

The scope of the Pico HID is not limited to [V1](v1.md) platform, it can also be used with [V2](v2.md) and [V3](v3.md),
if you need to emulate a PS/2 keyboard and mouse or use a [legacy multiport KVM switch](https://github.com/pikvm/pikvm/issues/7)
which does not fully support USB standards.

This page explains how to build, connect and use all the features of the Pico HID.

!!! note "Software requirements"
    KVMD >= 3.241 is required for the Pico HID.
    For new builds, this will be the case, but if you want to use the Pico HID on the old PiKVM, you will need to update OS.


-----
## Making the Pico HID

If you are building [PiKVM V1](v1.md), then the hardware should already be assembled. Skip this step unless you need PS/2 support.

But if you are making the Pico HID for [V2](v2.md) or [V3](v3.md), then follow this guide:

??? example "The Pico HID from scratch"

    Parts list:

    {!_pico_hid_parts.md!}

    Connect all the parts according to this scheme:

    ??? example "Simple wiring diagram"
        <img src="basic_breadboard.png" />

    ??? example "Electrical schematic diagram for advanced users"
        <img src="basic_scheme.png" />


### PS/2 Keyboard & Mouse

??? example "Additional steps for PS/2 support"

    If you need PS/2 keyboard and mouse support, you will need a few additional components.
    Soldering skills will also come in handy.

    * *x1* 3.3V/5V bi-directional logic level shifter [like this](https://learn.sparkfun.com/tutorials/bi-directional-logic-level-converter-hookup-guide/).
    * *x2* PS/2 cable with male connector (can be salvaged from the an keyboard or mouse).

    Make sure that the level shifter pinout matches the scheme, and connect everything according to the [Pico pinout](https://pico.pinout.xyz).

    ```
                                       >>> To the PC <<<
                     _________________
                    |                 |
    Pico GP11 ______| LV1         HV1 |______ PS/2 keyboard data
    Pico GP12 ______| LV2         HV2 |______ PS/2 keyboard clock
    Pico GP13 ______| LV          HV  |______ PS/2 5V
    Pico  GND ______| GND         GND |______ PS/2 GND
    Pico GP14 ______| LV3         HV3 |______ PS/2 mouse data
    Pico GP15 ______| LV4         HV4 |______ PS/2 mouse clock
                    |_________________|

    ```

    You can take the 5V power line from one of the PS/2, for example from the keyboard,
    or from both at once, but use a multimeter to make sure that both PS/2 female 
    connectors have the same line.

    <img src="ps2_pinout.png" />

    PS/2 female socket pinout on the motherboard is the same for the keyboard and the mouse.
    A purple socket usually corresponds to the keyboard, and a green one to the mouse.
    If your motherboard only has one port, it's probably universal and can be used for both
    the keyboard and the mouse. Most likely, it will be painted both colors.

    Use a multimeter to determine the purpose of the wires in your PS/2 cables.

    A good idea is to mount the level shifter on top of the Pico, as in this photo:

    <img src="ps2_level_shifter_soldering.png" width="300" />

    !!! note
        Don't forget to enable PS/2 mode support as described in the next paragraph

    ??? example "Optional: PS/2 passthrough"

        This optional addon allows to use a real PS/2 keyboard and mouse together with emulated by PiKVM.

        These two ports work as PS/2 inputs and are passed through to the PS/2 output ports.

        ```
                                           >>> To the REAL keyboard and mouse <<<
        				 _________________
        				|                 |
        Pico GP26 ______| LV1         HV1 |______ PS/2 keyboard data
        Pico GP27 ______| LV2         HV2 |______ PS/2 keyboard clock
        Pico GP13  _____| LV          HV  |______ PS/2 5V
        Pico  GND ______| GND         GND |______ PS/2 GND
        Pico GP16 ______| LV3         HV3 |______ PS/2 mouse data
        Pico GP17 ______| LV4         HV4 |______ PS/2 mouse clock
        				|_________________|

        ```


-----
## Configuring the HID modes

By default, Pico HID emulates a USB keyboard and an absolute or relative mouse
(read [here](mouse.md) about the difference between mouse modes).
For most cases, nothing needs to be changed here. However, if you need something special
(like Windows 98 support), you can do it without reflashing the current firmware.

To achieve this, the Pico HID uses a runtime configuration, which is set by connecting
some GPIOs with Ground (`GND`) lines.

| Pin name on the Pico board | Description |
|----------|-------------|
| `GP2`    | Enable PS/2 keyboard & mouse support (see below). |
| `GP3`    | Prefer the PS/2 keyboard over USB when turning on the HID (if PS/2 is enabled). |
| `GP4`    | Prefer the PS/2 mouse over USB (if PS/2 is enabled) |
| `GP6`    | Disable USB keyboard & mouse support. This is useful if you only want to use PS/2. |
| `GP7`    | Enable the special USB absolute mouse for Windows 98. |
| `GP8`    | Prefer the relative USB mouse over the absolute one. |
| `GP9`    | Prefer the Windows 98 USB absolute mouse over the regular absolute one (if enabled). |

!!! example
    To enable Windows 98 absolute mouse, just connect pin `GP9` to any `GND` [on the Pico](https://pico.pinout.xyz).


-----
## Flashing the firmware

{!_pico_hid_flashing.md!}


-----
## The final steps

Connect the Pico HID to the target host using the USB cable.

If you are building PiKVM [V1](v1.md), no further action with the Pico HID is required.

If you are making the Pico HID for [V2](v2.md) or [V3](v3.md), add the following lines to the PiKVM configuration and reboot it:

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
    is much more time consuming than Pico. In addition, different Arduino board work
    with different voltages, they may or may not have SPI (for the Pico, we use SPI to 
    free up the UART on Raspberry Pi for the console and other useful things), etc.

    Using the Pico HID is the recommended fast and standard way in the PiKVM world.

The Pico HID can be used to replace the [legacy Arduino HID](arduino_hid.md).
It can use both Serial (UART) port and the SPI. The connection scheme is also much simpler,
getting rid of the transistor for the Reset line and the level shifter for RX/TX (MOSI/MISO).

??? example "For the Arduino HID over SPI"
    Throw away the Reset transistor and level shifter, and follow this guide
    from the very beginning, as if you were connecting Pico HID to PiKVM [V2](v2.md) or [V3](v3.md).

??? example "For the classic Serial (UART) HID"
    Get rid of the transistor and level shifter, and follow this guide
    from the very beginning, but the schemes and configs will be slightly different.

    * The `GP22` on the Pico is connected directly to the `GND`. This enables UART mode instead of the default SPI.

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
