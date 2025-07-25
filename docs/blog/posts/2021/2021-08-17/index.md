---
title: "KVMD 3.18: Sensitivity adjustment for relative mouse"
date: 2021-08-17
slug: kvmd-3-18-sensitivity-adjustment-for-relative-mouse
description: >
    The relative mouse now has a sensitivity adjustment, the setting is remembered in the browser.
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.18
comments: true
---

There are several improvements in this release.

<!-- more -->

- **The relative mouse now has a sensitivity adjustment**. The setting is remembered in the browser.

- **We added a PWM and Servo module for GPIO**. Now you can control servos using the GPIO menu.

- The most important change! We added the absolute mouse compatibility mode for Windows 98 for both OTG and Arduino HID.

To update:

```console
rw
pacman -Syu
reboot 
```