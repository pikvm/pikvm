---
title: "KVMD 2.1: Bug fixes"
date: 2020-10-08
slug: kvmd-2-1-bug-fixes
description: >
    We fixed various bugs including incorrect keys mapping in VNC
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.1
comments: true
---

This is mainly a bugfix release.

<!-- more -->

- Fixed incorrect keys mapping in VNC. Also implemented QEMU Extended Key Events protocol which provides messages with hardware keycodes for VNC. This input method is preferred, and clients which can use it (yea-yea, I'm advertising TigerVNC again) will not have any problems with the layouts. Configuring keymap in override.yaml also becomes unnecessary in this case.

- For v2 builds (RPi and ZeroW) the peripheral device mode for the USB-gadget controller is forced by default. This improves compatibility with some strange motherboards. Testing has not revealed any negative effects, but if something goes wrong, let me know.

- Fixed GPIO switches in Web UI menu for the case when pulsing is disabled.

To update:

```console
rw
pacman -Syu
reboot
```