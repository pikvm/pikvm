---
title: "KVMD 2.0: Redfish support and HID driver improvements"
date: 2020-10-04
slug: kvmd-2-0-redfish-support-hid-driver-improvements
description: >
    This is a major new release with Redfish support and HID driver improvements
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.0
comments: true
---

This is a major new release with important improvements.

<!-- more -->

Let's take a look at the changes:

- The first and most important change is updating the kernel to 5.4.69. **Fixed the critical Linux bug with USB** that could cause the Pi to reboot when using the keyboard and mouse on a rebooting host. I spent a few days debugging this problem and now it is solved in the Raspbian upstream.

- **The kernel update is also unlocked for ZeroW boards**. The new kernel fixed an old bug that caused the kernel to hang on CSI HDMI at Zero. Yea, another kernel bug that I was directly involved in solving.

- On the Pi-KVM side, the **HID driver has been significantly improved**, and now it clearly detects the USB state: the yellow color in web ui clearly shows when the cable is disconnected. Also added support for the NonUs and AltGr keys, **fixed Win key in VNC**.

- Implemented **basic support for Redfish as an improved and secure IPMI replacement** for enterprise use ([see here](https://docs.pikvm.org/ipmi/) for documentation. Redfish requires no additional configuration and is available directly in KVMD. It uses the same authorization mechanism as the rest of the Pi-KVM. The only handle available /redfish/v1 without authorization produces a small static document for service discovery required by standard.

- Added the ability to request confirmation for actions on custom GPIO buttons and switches (see [View rules](https://docs.pikvm.org/gpio/)).

- Now you can create **USB Ethernet for direct communication between the Pi-KVM and the server** ([see here](https://docs.pikvm.org/usb_ethernet/) for more information). This release does not include a tool for address configuration and firewall, expect soon.

- Improved the **Web Socket API** which no longer makes unnecessary broadcasts when connecting new clients. This is now convenient to use for getting the entire state of the Pi-KVM by the batch.

- Config sections `otg/msd`, `otg/acm` and `otg/drives` were moved to `otg/devices/msd`, `otg/devices/serial` and `otg/devices/drives`. Of course, the old config will continue to work.

- ... And many minor changes.

Note: **Before upgrading ZeroW**, you will probably need to remove the `IgnorePkg = linux-raspberrypi and linux-raspberrypi-headers` parameter from `/etc/pacman.conf`, if you added it earlier.

To update, follow:

```console
rw
pacman -Syu
```

If you changed the file `/etc/kvmd/override.yaml`, you will see a new file: `/etc/kvmd/override.yaml.pacnew`. You can simply delete it or merge its contents with your own configuration. The new file contains commented-out usage examples and no longer contains (and requires) the `{}` row for an empty config.

After all perform reboot. 