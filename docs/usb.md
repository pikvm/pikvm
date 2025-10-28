---
title: USB configuration
description: How USB works on the PiKVM, what endpoints are available, and how to configure it
---

PiKVM V2+ emulates a small set of USB devices to ensure normal
operation: a keyboard, [mouse](mouse.md) and [mass storage
drive](msd.md). However, the possibilities are not limited to this.
Optionally, you can add a [USB ethernet](usb_ethernet.md), [serial
port](usb_serial.md), or (exclusive to [PiKVM V3](v3.md) and [V4
Mini/Plus](v4.md)) [a microphone to support two-way audio](audio.md).

In rare cases, the target host's BIOS/UEFI may not understand such a
large number of emulated devices on single USB port, and some of them
may need to be disabled.

A complete USB configuration changing (adding or removing devices)
requires a reboot, but it is possible to temporarily disable and then
re-enable existing emulated devices in preset.

-----
## Basics

Each emulated USB device consumes a limited hardware resource called **endpoints**.

Depending on the device, the number of required endpoints varies:

| Device | Endpoints |
|--------|-----------|
| Keyboard, mouse | 1 for each |
| Mass Storage Drive | 2 for each |
| USB Microphone | 2 |
| USB Ethernet, USB Serial | 3 for each |

**In total, PiKVM provides 9 endpoints for USB emulation**, some of which are used by default:

* PiKVM V2-V3 emulates one absolute mouse and one mass storage and uses 4 of 9 endpoints.

* PiKVM V4 Mini/Plus also adds a relative mouse by default so it uses 5 of 9 endpoints.

You can add other devices remaining endpoints, disable existing ones
at all to free some endpoints, or do this only temporarily.

Moreover, you can configure the preset with a large number of devices
(more than PiKVM allows by endpoints), and then dynamically enable only
the necessary ones.

If you have configured too many devices that consume more than
9 endpoints in total, the least important of them will be inactive.
You can enable them using dynamic configuration.

To configure additional devices, please refer to the corresponding pages:

* [USB Microphone](audio.md) - Two-way audio communication for voice
  applications on the target host. Exclusive to [PiKVM V3](v3.md) and [V4 Mini/Plus](v4.md).

* [Absolute and relative mouse](mouse.md) - The most convenient type
  of mouse is an absolute mouse, but some BIOSes may not understand it.
  In this case, the relative one will help you.

* [USB Ethernet](usb_ethernet.md) - An FTP or Samba server on PiKVM
  can be configured, and the target host will see this over the network.
  It is also possible that PiKVM can work as a router to connect a host
  to a big network.

* [USB Serial Port](usb_serial.md) - It can be used for terminal access
  from the target host to the PiKVM, or for any other purpose that
  requires a serial connection.

For information on how emulated devices are represented on the target host and how to change it, read [here](id.md).

-----
## Default preset

Device setup includes two stages: adding to config and starting.

When you add a device as described on the pages above, it automatically
turns on after PiKVM reboot and becomes available on the target device.
This behaviour can be changed: the device will be created, but not
active until you turn it on dynamically.

The `/etc/kvmd/override.yaml` file is used for such changes. In the following example,
there are [USB Serial Port](usb_serial.md) and [Microphone](audio.md) enabled,
but the serial port is not started by default:

```yaml
otg:
    devices:
        serial:
            enabled: true
            start: false
        audio:
            enabled: true
```

The `start` parameter is also available for all USB devices, see `kvmd -m` for the entire configuration tree.

## Dynamic configuration

### Command-line utility

The `kvmd-otgconf` utility allows you to view and modify the USB configuration on the fly.

It will also inform you about the number of endpoints used.

Changing requires root permissions.

Let's take a look at the configuration:

```console
[root@pikvm ~]# kvmd-otgconf 
# Endpoints used: 5 of 9
# Endpoints free: 4
+ hid.usb0  # [1]  Keyboard  # otg/devices/hid/keyboard/start
+ hid.usb1  # [1]  Absolute Mouse  # otg/devices/hid/mouse/start
+ hid.usb2  # [1]  Relative Mouse  # otg/devices/hid/mouse_alt/start
+ mass_storage.usb0  # [2]  Mass Storage Drive  # otg/devices/msd/start
```

Each line represents an emulated device, left to right:

* Plus or minus sign: the state (enabled or not).
* The device name (e.g., `hid.usb0`).
* The number of required endpoints (e.g., `[2]`).
* The description (e.g., `Absolute mouse`).
* Path to the relevant configuration parameter (e.g., `otg/devices/hid/mouse/start`) you can use to boot or not boot a service when `kvmd` launches.

Sometimes it's impossible to get into the UEFI/BIOS due to their bugs
in USB support, and you need to boot from the PiKVM mass storage.

In this case, you can disable all devices except keyboard and relative
mouse, and enter the BIOS:

```console
[root@pikvm ~]# kvmd-otgconf -d mass_storage.usb0 uac2.usb0 hid.usb1
# Endpoints used: 2 of 9
# Endpoints free: 7
+ hid.usb0  # [1]  Keyboard  # otg/devices/hid/keyboard/start
- hid.usb1  # [1]  Absolute Mouse  # otg/devices/hid/mouse/start
+ hid.usb2  # [1]  Relative Mouse  # otg/devices/hid/mouse_alt/start
- mass_storage.usb0  # [2]  Mass Storage Drive  # otg/devices/msd/start
```

Then change the boot order in the BIOS by setting the USB sticks
as first priority.

Exit the BIOS, and turn on mass storage again. Use it as usual to boot
the image from PiKVM mass storage:

```console
[root@pikvm ~]# kvmd-otgconf -e mass_storage.usb0
# Endpoints used: 4 of 9
# Endpoints free: 5
+ hid.usb0  # [1]  Keyboard  # otg/devices/hid/keyboard/start
- hid.usb1  # [1]  Absolute Mouse  # otg/devices/hid/mouse/start
+ hid.usb2  # [1]  Relative Mouse  # otg/devices/hid/mouse_alt/start
+ mass_storage.usb0  # [2]  Mass Storage Drive  # otg/devices/msd/start
```

You can also enable `uac2.usb0` and `hid.usb1` again.

### Web UI menu

Using the pseudo-GPIO driver, you can USB control devices via the menu in the web interface.
Read about GPIO basics [here](gpio.md).

To setup the menu, use `kvmd-otgconf --make-gpio-config` to generate the configuration, and merge it
with your existing one in `/etc/kvmd/override.yaml` in a usual way.

??? example "The example of `kvmd-otgconf --make-gpio-config` output"
    ```yaml
    # kvmd-otgconf --make-gpio-config
    kvmd:
        gpio:
            drivers:
                otgconf:
                    type: otgconf
            scheme:
                hid.usb0:
                    driver: otgconf
                    mode: output
                    pin: hid.usb0
                    pulse: false
                hid.usb1:
                    driver: otgconf
                    mode: output
                    pin: hid.usb1
                    pulse: false
                hid.usb2:
                    driver: otgconf
                    mode: output
                    pin: hid.usb2
                    pulse: false
                mass_storage.usb0:
                    driver: otgconf
                    mode: output
                    pin: mass_storage.usb0
                    pulse: false
            view:
                table:
                    - ["#Keyboard", "#hid.usb0", hid.usb0]
                    - ["#Absolute Mouse", "#hid.usb1", hid.usb1]
                    - ["#Relative Mouse", "#hid.usb2", hid.usb2]
                    - ["#Mass Storage Drive", "#mass_storage.usb0", mass_storage.usb0]
    ```

Please note that this menu is not dynamically generated, you need
to update the configuration if you added or deleted devices.
