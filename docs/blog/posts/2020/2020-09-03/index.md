---
title: "Pi-KVM is now available on Raspberry Pi 1"
date: 2020-09-03
slug: pikvm-now-available-on-rpi-1
description: >
     We have added the ability to use Raspberry Pi 1
categories:
    - Products
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz
comments: true
---

In the last release, I added the ability to use this board. This is still unofficial and not reflected in the documentation, but you can already build the system using the build environment if you use the `BOARD=rpi` and `PLATFORM=v0-hdmi` or `v0-hdmiusb` parameters.

<!-- more -->

At the moment, you can only use the A or B board. In B+, the network card does not working because of some glitches related to the new kernel (after all, this is very legacy hardware).

To emulate the keyboard and mouse, you will need an Arduino HID, like for rpi2 or rpi3. In addition, the USB port binding for the HDMI dongle is disabled for rpi1.
