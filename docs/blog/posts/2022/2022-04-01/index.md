---
title: "KVMD 3.73: Experimental dynamic USB configuration"
date: 2022-04-01
slug: kvmd-3-73-experimental-dynamic-usb-configuration
description: >
    the idea is that now you can change the configuration of the USB emulator on the fly
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.73
comments: true
---

First of all, although the release is experimental, it is NOT unstable. The new utility does not affect the performance of the system in any way if you do not use.

<!-- more -->

So, the idea is that now you can change the configuration of the USB emulator on the fly. For example, you can temporarily turn off the mouse or mass storage or USB network (if you have it configured) without restarting, and then turn it on again:

```console
[root@pikvm ~]# kvmd-otgconf
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
+ mass_storage.usb0  # Mass Storage Drive
[root@pikvm ~]# kvmd-otgconf --disable-function mass_storage.usb0
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
- mass_storage.usb0  # Mass Storage Drive
[root@pikvm ~]# kvmd-otgconf --enable-function mass_storage.usb0
+ hid.usb0  # Keyboard
+ hid.usb1  # Absolute Mouse
+ mass_storage.usb0  # Mass Storage Drive
```

Disabling the function means that the host will not see it in USB.

**Important**: Due to the imperfections of the kernel modules, in rare cases, a dynamic configuration change can lead to a kernel panic and reboot, so use this carefully. I will fix the kernel at some point.

To update:

```console
rw
pacman -Syu
reboot
```