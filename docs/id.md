---
title: Identifying PiKVM on the target host
description: How PiKVM is presented to the target host's operating system, and how this can be changed
---

This page explains how PiKVM is presented to the target host's operating
system, and how this can be changed. This is useful for developers,
testers and system administrators who need PiKVM to emulate a specific
USB device or monitor.

!!! tip

    Before exploring this page, we recommend to read the [PiKVM configuration guide](config.md)
    so that you understand the terminology and how exactly the parameters described below change.


-----
## Basics

PiKVM is a combined emulator of several devices for user interaction.
Simply put, your host sees the connected PiKVM not just as a single device, but as a set of multiple devices.

In the most default case out of the box, these are the following:

- HDMI video display;
- USB keyboard;
- USB mouse (two mice for [PiKVM V4](v4.md));
- USB mass storage drive (ejectable);

Thus, PiKVM emulates two types of devices: HDMI and USB. Each of them has a specific set of identifiers.
For example, if you go to monitor settings on the host, you will see something like `PiKVM V4 Plus`.
It works in a similar way with USB.


-----
## Replicating setups

Using PiKVM utilities, you can replicate the entire IDs of peripheral devices in automatic or manual way.

* [PiKVM V4 Plus](v4.md) is able to import and adopt both EDID and USB IDs directly from your physical display and some USB device.
* [PiKVM V4 Mini](v4.md) doesn't have HDMI output and extra USB, but you can change configuration manually.
* [PiKVM V3](v3.md) or [DIY V2](v2.md) is able to import USB IDs, but not EDID.

**Both automatic and manual paths are fully described later on this page.**


-----
## HDMI Identifiers

The EDID (Extended Display Identification Data) is responsible for presenting the display.
It also provides the host with information about the resolutions that PiKVM supports.
More information about this is written on the [EDID guide](edid.md), and here we will provide brief information.

Please note that this applies to [PiKVM V3](v3.md), [V4](v4.md) and DIY based on CSI bridge.
It is impossible to change the EDID for the HDMI-USB dongle.

{!_edidconf_options.md!}

For a detailed guide on customizing EDID identifiers, please visit the [EDID guide](edid.md).


-----
## USB Identifiers

What is described here concerns only the USB identifiers, not the device structure.
Your typical PiKVM setup is recognized as a keyboard with a built-in mouse and flash drive.
If you encounter USB compatibility issues due to legacy OS or buggy drivers on the target host,
there are two things you can do:

  * Change USB identifiers (described further);
  * [Disable some of emulated devices to simplify the device structure](usb.md).
    For example, keep only keyboard and one mouse (for example, this is useful for buggy UEFI on DELL and HP),
    and disable Mass Storage and other devices.

Please note that this applies to PiKVM V2+. Identifiers on V1 and/or the [Pico HID](pico_hid.md) can't be changed
without recompilation and reflashing of the firmware.

!!! tip "Quick USB IDs changing"

    All PiKVMs (except DIY based on Zero W) have a simple way to read and adopt USB identifiers
    from a physical USB keyboard or mouse connected to any USB port. This way, the target host
    will recognize PiKVM as your regular USB device.

    To adopt USB identifiers, connect a keyboard or mouse to PiKVM and run these commands:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# kvmd-otgconf --import-usb-ids
    [root@pikvm ~]# reboot
    ```

    Now the device can be unplugged. PiKVM will remember the new settings (in `/etc/kvmd/override.yaml`)
    and apply them after reboot (the last command).

As you may have found out from the [PiKVM configuration guide](config.md) (if you haven't read it yet, now is the time),
you can get the list of all configuration parameters using the `kvmd -m` command.

Below is a listing of all the parameters, from which the unrelated and those USB parameters
that should not be changed have been removed. In the context of identifiers, we are interested in the following:

```yaml
[root@pikvm ~]# kvmd -m
otg:
    vendor_id: 7531
    product_id: 260
    manufacturer: PiKVM
    product: PiKVM Composite Device
    serial: CAFEBABE
    device_version: -1
    max_power: 250

    devices:
        drives:
            default:
                inquiry_string:
                    cdrom:
                        vendor: PiKVM
                        product: Optical Drive
                        revision: '1.00'

                    flash:
                        vendor: PiKVM
                        product: Flash Drive
                        revision: '1.00'

        msd:
            default:
                inquiry_string:
                    cdrom:
                        vendor: PiKVM
                        product: Optical Drive
                        revision: '1.00'

                    flash:
                        vendor: PiKVM
                        product: Flash Drive
                        revision: '1.00'
```

Pay attention to the nesting levels. The parameters are always located in certain sections.
All numeric values are displayed in decimal form, but in the config you can use a hex form.
The generally accepted names from the USB specifications are shown too.

| Parameter | USB Spec | Description |
|-----------|----------|-------------|
| `vendor_id`      | `idVendor`               | Unique [vendor ID](https://usb.org/sites/default/files/vendor_ids051920_0.pdf) assigned by USB.org. |
| `product_id`     | `idProduct`              | Just an ID for the product assigned by this vendor. |
| `manufacturer`   | `iManufacturer` to 0x409 | ASCII name of the vendor. |
| `product`        | `iProduct` to 0x409      | ASCII name of the product. |
| `serial`         | `iSerialNumber` to 0x409 | ASCII serial number of the product. |
| `device_version` | `bcdDevice`              | Kinda the revision of the device. Assigned automatically. It can be changed to 256, 257, 258 or something like this |

These IDs are also used for the [microphone](audio.md#microphone-outgoing-audio) on PiKVM V4.

The strings under `otg/drives` and `otg/msd` sections deserve a special description.
They relate to virtual media emulation and are separate parts of the SCSI inquiry string, the drive identifier used by the OS driver.
All three parameters `vendor`, `product`, and `revision` are short ASCII strings responsible for CD/DVD or Flash representation.

The `msd` refers to a virtual drive accessible from the Web UI,
and the `drives` describes all additional drives if you have configured them (disabled by default).
Note that mass storage drive can be [completely disabled](msd.md#disabling-mass-storage).

To change the parameters, use the `/etc/kvmd/override.yaml`, for example, like this:

```yaml
otg:
    vendor_id: 0x6940
    product_id: 0x6973
    manufacturer: Corsair
    product: Gaming RGB
    serial: 1000

    devices:
        msd:
            default:
                inquiry_string:
                    cdrom:
                        vendor: Corsair
                        product: DVD
                        revision: '1.00'

                    flash:
                        vendor: Corsair
                        product: STICK
                        revision: '1.00'
```

After changing validate the config using `kvmd -M`. You will see a list with your changes and default values,
or a message about configuration error.

If everything is fine, perform the soft `reboot` command.
