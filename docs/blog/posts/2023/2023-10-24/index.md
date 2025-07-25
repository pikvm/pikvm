---
title: "PiKVM just got full PS/2 support"
date: 2023-10-24
slug: pikvm-just-got-full-ps2-support
description: >
     With the transition to Raspberry Pi Pico, we finally have full support for both PS/2 keyboard and mouse
categories:
    - Products
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

Previously, to support PS/2 keyboards (only), it was necessary to assemble a complex circuit on Arduino. With the transition to Raspberry Pi Pico, we finally have full support for both keyboard and mouse. The design has been greatly simplified, and is now compatible with V4 Plus.

<!-- more -->

![PS/2 support](pico_hid_bridge_ps2.webp)

HOWTO: https://docs.pikvm.org/pico_hid_bridge/

Let me know if you need a native support of the Sun SPARCstation Keyboard & Mouse!