---
title: "KVMD 1.86: PS/2 keyboards support"
date: 2020-08-07
slug: kvmd-1-86-ps2-keyboards-support
description: >
    Great news for fans of retro computers and tech priests: now Pi-KVM supports PS/2 keyboard
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.86
comments: true
---

Great news for fans of retro computers and tech priests. Now Pi-KVM supports PS/2 keyboard. 

<!-- more -->

This is useful for older hardware KVM switches and industrial computers. It is very simple to use, I wrote a small guide: https://github.com/pikvm/pikvm/blob/master/pages/arduino_hid.md

Over the past few days, many people have supported my work on Pi-KVM, and I am very grateful to them. The names of all sponsors are included in the documentation and in the "About" dialog window in the Pi-KVM interface.

PS: Mouse jiggler was not included in this release due to the fact that there is still some logic improvement required, and I decided that it is better to release the PS/2 functionality separately than to stall for time. This will be included in the next release.

To update:

```console
rw
pacman -Syu
reboot
```
