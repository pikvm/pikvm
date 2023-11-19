# Dynamic USB configuration

PiKVM emulates a number of USB devices to ensure normal operation: keyboards, mouse and mass storage drive.
Also an additional [relative mouse](mouse.md) may be present (like on PiKVM V4 by default),
or a user configured [USB Ethernet](usb_ethernet.md) or [Serial port](usb_serial.md).

In rare cases, the host BIOS/UEFI may not understand such a large number of emulated devices on single USB port,
so some of them may need to be disabled. USB reconfiguration usually requires a reboot, but it is possible
to temporarily disable already configured existing emulated devices.

!!! warning
    This feature is experimental. Due to the imperfections of the kernel modules, rarely a dynamic configuration change
    can lead to a kernel panic and reboot.

    For PiKVM V3 and V4 this is considered more secure because they have two independent watchdog systems
    that can bring devices back to life after a timeout of a few minutes.


-----
## Command-line utility

The `kvmd-otgconf` utility allows you to view and modify the USB configuration on the fly.
It requires root permission and can be used for example from a web terminal.

View the config:
```
# kvmd-otgconf
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
+ hid.usb2  # Relative Mouse
+ mass_storage.usb0  # Mass Storage Drive
```
Each line represents a device (function). First comes plus or minus sign (the device on or off), then the name of the device and its description.

Disabling the device:
```
[root@pikvm ~]# kvmd-otgconf --disable-function mass_storage.usb0
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
+ hid.usb2  # Relative Mouse
- mass_storage.usb0  # Mass Storage Drive
```

Enabling the device:
```
[root@pikvm ~]# kvmd-otgconf --enable-function mass_storage.usb0
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
+ hid.usb2  # Relative Mouse
+ mass_storage.usb0  # Mass Storage Drive
```


-----
## Web UI menu

Using the pseudo-GPIO driver, you can also control devices via the menu in the web interface.
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
