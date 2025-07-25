---
title: "uStreamer 2.2: Better video performance"
date: 2020-11-27
slug: ustreamer-2-2-better-video-performance
description: >
    This is a very big release with a lot of changes, which took me a whole month.
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v2.2
comments: true
---

This is a bugfix release, albeit an important one.

<!-- more -->

We fixed an issue where video performance could degrade due to NTP system clock tweaking. A small but useful fix.

PS: If you missed the KVMD updates, I'm currently working on improvements to the Arduino HID, which will allow you to switch mouse modes in real time, as well as support for the SPI Protocol instead of UART. This is a very big change, but the work is almost done.

```console
rw
pacman -Syu
reboot
```