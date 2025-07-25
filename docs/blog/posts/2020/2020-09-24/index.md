---
title: "uStreamer 2.0: Memory protection"
date: 2020-09-24
slug: ustreamer-2-0-memory-protection
description: >
    Given the previous changes, I believe that there are already enough changes for version 2.0
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v2.0
comments: true
---

Given the previous changes, I believe that there are already enough changes for version 2.0 :)

<!-- more -->

* wiringPi replaced to libgpiod (reasons: ⁠news⁠)

* Added protection from memory corruption on usage of buggy webcam drivers ([details](https://github.com/pikvm/ustreamer/issues/43))

* Disabled cross-domain requests by default for security reasons ([details](https://github.com/pikvm/ustreamer/issues/48))

To update:

```console
rw
pacman -Syu
reboot
```