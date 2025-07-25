---
title: "KVMD 2.6: Completely rewritten the Arduino HID subsystem"
date: 2020-12-11
slug: kvmd-2-6-completely-rewritten-arduino-hid
description: >
    This is a very big release with a lot of changes, which took me a whole month.
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.6
comments: true
---

This is a very big release with a lot of changes, which took me a whole month.

<!-- more -->

Here is what's new:

* **Completely rewritten the Arduino HID subsystem**. Now you can switch between relative and absolute mouse modes directly from the web interface. Arduino HID can be used with both v0 and v2, in which case it provides improved compatibility with strange devices and BIOSes. Some BIOSes don't understand absolute mouse and they need relative mouse: https://github.com/pikvm/pikvm/blob/master/pages/mouse.md

* Now **Arduino HID is compatible with Mac UEFI** and is able to provide access to its menu at boot. If you need full Mac UEFI support, use Arduino HID. This is the recommended method.

* **Implemented an alternative way to connect the Arduino HID to the Raspberry using SPI**. This is not yet documented and little bit tricky, but this method will free up the UART for other needs.

* **Migrated to Python 3.9**. A big task which required patching and rebuilding of many packages.


```console
rw
pacman -Syu
pacman -S tailscale-pikvm
reboot
```

To use the new features of the Arduino HID, you will need to perform a flash. However, if you don't do this, nothing will break, the new KVMD is fully compatible with all older firmware versions. [See here](https://github.com/pikvm/pikvm/blob/master/pages/flashing_hid.md) for more informaiton.