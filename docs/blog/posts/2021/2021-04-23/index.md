---
title: "KVMD 2.55: Arduino HID imrpovements"
date: 2021-04-23
slug: kvmd-2-55-arduino-hid-improvements
description: >
    This release delivers a significant improvement of the Arduino HID when you control a computer with a MacOS
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.55
comments: true
---

This release delivers a significant improvement of the **Arduino HID** when you control a **computer with a MacOS**.

<!-- more -->

Now you don't need to spam the **Command+R** or **Option** keys on boot to hope to get to the UEFI menu or Recovery mode—just hold down the shortcut on boot, as on a real keyboard, and everything will work.

We also improved the behavior of the stream window: now it **will not try to establish a connection several times** due to a race on a slow channel, but works more stably. This is part of the work on future H.264 support—cleaning the ancient Augean stables.

To update: 

```console
rw
pacman -Syu
reboot
```