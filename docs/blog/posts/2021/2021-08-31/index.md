---
title: "KVMD 3.23 + kernel fix: keyboard/mouse wakeup"
date: 2021-08-31
slug: kvmd-3-23-keyboard-mouse-wakeup
description: >
    We solved the v2+/OTG on Pi4 and ZeroW issue where you could not wake up the host if it was in suspend
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.23
comments: true
---

Previously, when using v2+/OTG on Pi4 and ZeroW, you could not wake up the host if it was in suspend. Now this problem is solved. 

<!-- more -->

At the moment, this feature is experimental and disabled by default, since it was implemented blindly without documentation for the USB controller (no one gave it to me lol). It would be great if as many people as possible test it and tell if everything works fine.

Although the feature is experimental, the update must be safe.

To update you will need our own stable kernel build (if you are using a very old image and have not installed it, in new images it is out of the box):

1. Check if it is installed: `pacman -Q | grep pikvm-os-raspberrypi`
2. If this command didn't show you anything, install our kernel (⁠news⁠)
3. After reboot, make this: `rw; pacman -Syu; reboot`
4. To enable wakeup feature edit `/etc/kvmd/override.yaml` and add this:

```yaml
otg:
    remote_wakeup: true
```
... and reboot 
