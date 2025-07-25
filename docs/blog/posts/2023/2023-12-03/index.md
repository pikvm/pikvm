---
title: "Introducing the new DIY PiKVM V1 build"
date: 2023-12-03
slug: introducing-the-new-diy-pikvm-v1-build
description: >
    We've been working for a while to unify DIY builds and simplify instructions. The result was a new DIY platform V1, which replaced V0
categories:
    - Products
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

We've been working for a while to unify DIY builds and simplify instructions. The result was a **new DIY platform V1, which replaced V0**.

<!-- more -->

- The old Arduino HID was replaced by a new one based on the Raspberry Pi Pico.
- **The Pico HID uses an SPI connection and leaves the UART on the Raspberry free** so that you can connect a USB-TTL adapter and use a serial console. Hurray!
- Also, **the new HID has full PS/2 mouse support**, not just the keyboard, as before.
- It is much easier and faster to make than the old V0 build with Arduino.
- Among other things, **now we're providing ready-made OS images for all DIYs. You will no longer have to build them yourself**.

From this day on, V0 on Arduino is declared obsolete and consigned to oblivion. Instructions for its assembly are no longer available, except for the [Arduino HID](https://docs.pikvm.org/arduino_hid/) page. If you need an Arduino HID for anything, use the new [Pico HID](https://docs.pikvm.org/pico_hid/). The Pico HID is also capable of working as an in-place replacement for the Arduino HID, in case you need to replace it on your old V0.

**OS images and updates for V0 will still be coming out. That is, V0 support will be continued. We only deprecate the instructions.**

**The assembly instructions for the PiKVM V2 have also been updated—this is greatly simplified and systematized.**

- https://docs.pikvm.org/v1
- https://docs.pikvm.org/v2