---
title: "KVMD 2.4: The Relative mouse & Bluetooth"
date: 2020-11-11
slug: kvmd-2-4-relative-mouse-bluetooth
description: >
    This release added a great new feature that will please those who did not work the mouse in the BIOS/UEFI
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.4
comments: true
---

This release added a great new feature that will please those who did not work the mouse in the BIOS/UEFI.

<!-- more -->
 
Previously, Pi-KVM only emulated absolute mouse mode, and some UEFIs didn't understand this. Now you can enable relative mouse mode. In this mode, the browser will completely capture your cursor (until you press `Esc`) and transmit all events to the server.

Testing has shown that on all UEFI in which the PI-KVM mouse did not work before, when the relative mode is enabled, the cursor works. This is a significant breakthrough in improving compatibility with various hardware. [See here](https://github.com/pikvm/pikvm/blob/master/pages/mouse.md) for details.

A very interesting feature has appeared: now Pi-KVM can emulate Bluetooth keyboard & mouse. The usecases of this may be specific, but I'm sure there will be a use for it. For example, you can control the cursor and keyboard of an iPad or other pieces. Bluetooth mouse works in relative mode, [see here](https://github.com/pikvm/pikvm/blob/master/pages/bluetooth_hid.md).

To update:

```console
rw
pacman -Syu
reboot
```