---
title: "DIY PiKVM V0 based on Arduino HID becomes legacy"
date: 2023-07-30
slug: diy-pikvm-v0-based-on-arduino-hid-becomes-legacy
description: >
    We are planning to replace V0 with a new V1, which will be based on Raspberry Pico
categories:
    - Products
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

I'm planning to replace **V0** with a new **V1** soon, which will be based on Raspberry Pico.

<!-- more -->

Here is what it boils down to:

- No more transistors and level shifters for USB emulation, now only wires are needed.
- Full-fledged PS/2 keyboard and mouse support for connoisseurs of antiquity.
- Pico is much cheaper than Arduino.

Old DIY devices will continue to be supported, but the instructions will be marked as legacy.
If you have any suggestions for the new Pico HID, please write to the `#⁠dev` channel on Discord.