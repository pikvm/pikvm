---
title: "KVMD 2.2: Improved HID modules for Arduino and OTG"
date: 2020-10-17
slug: kvmd-2-2-improved-hid-modules-for-arduino-and-otg
description: >
    We have made several important improvements in this release, including better HID modules for Arduino and OTG
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.2
comments: true
---

We have made several important improvements in this release.

<!-- more -->

* **Improved HID modules for Arduino and OTG**. Now, if the server is disabled, the event queue will not grow, and irrelevant events (such as keystrokes for a disabled server) will be deleted. 

* **Added an experimental service for configuring the USB network** (issuing addresses to the server, firewall, and so on): kvmd-otgnet. Now you can up the FTP server on Pi-KVM and share files with the server [using it](https://docs.pikvm.org/usb_ethernet/).

* For all KVMD daemons the **startup method has been changed**: the `--run` option is required to prevent accidental startup. Updated systemd services. Migration will be transparent for users.

* **Fixed a very rare VNC bug** that could cause the server to stop transmitting an image and require a restart.

* **Minor UI improvements** (more compact menubar, etc).

To update:

```console
rw
pacman -Syu
reboot
```