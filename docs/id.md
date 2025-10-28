---
title: Identifying PiKVM on the target host
description: How PiKVM is presented to the target host's operating system, and how this can be changed
---

This page explains how PiKVM is presented to the target host's operating
system, and how this can be changed. This is useful for developers,
testers and system administrators who need PiKVM to emulate a specific
USB device or monitor.

!!! info

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
## HDMI Identifiers

!!! info

    This applies to [PiKVM V3](v3.md), [V4](v4.md) and DIY based on CSI bridge.
    It is impossible to change the EDID for the HDMI-USB dongle.

The EDID (Extended Display Identification Data) is responsible for presenting the display.
It also provides the host with information about the resolutions that PiKVM supports.
More information about this is written on [this page](edid.md), and here we will provide brief information.

{!_edidconf_options.md!}

For a detailed guide on customizing EDID, please visit [this page](edid.md). There you can also find out how to set the EDID from a real monitor, or quickly adopt your real monitor IDs with PiKVM V4 Plus.


-----
## USB Identifiers

!!! info

    This applies to PiKVM V2+. Identifiers on V1 and/or the [Pico HID](pico_hid.md) can't be changed
    without recompilation and reflashing of the firmware.


USB is a much more complex subsystem and another part of PiKVM is responsible for it.
Be careful when changing the settings here, it may cause the USB to fail.

For information on how to control emulated devices see [here](usb.md).
The identification is described below.

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

After changing validate the config using `kvmd -m`. You will see the full config list with changed and default values,
or a message about configuration error.

If everything is fine, perform the soft reboot.

## Replicating setups

You can use `kvmd-edidconf` and `kvmd-otgconf` to replicate an entire host configuration for testing or other purposes. What you can do will vary depending on the PiKVM device you have:

- V4 Plus: you can import both EDID and USB IDs.
- V4 Mini: you must manually edit `override.yaml`, as there is neither a second HDMI Out or additional USB ports on your PiKVM.
- V3: you can import USB IDs only, as there is no second HDMI output on your PiKVM.

Assuming you have PiKVM V4 Plus, follow these steps:

1. Connect the host's display to one of the two HDMI Out ports on the rear panel of your PiKVM.
2. Connect the host's USB keyboard and mouse to USB ports on the front and the rear panel of you PiKVM.
3. Run `rw` to switch to read-write mode.
4. Run `kvmd-edidconf --import-display-ids --apply` as root on the PiKVM. This will fetch EDID information from the connected physical display and place it into the `/etc/kvmd/override.yaml` configuration file.
5. Run `kvmd-otgconf --import-usb-ids` as root on the PiKVM. This will fetch IDs of the connected physical USB devices and place them into the `/etc/kvmd/override.yaml` configuration file.
6. Run `ro` to switch to read-only mode.
7. Run `reboot` to reboot your PiKVM and apply newly the added customization.
8. Reconnect the host's display and keyboard/mouse back to the host.