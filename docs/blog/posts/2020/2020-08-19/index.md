---
title: "KVMD 1.92: Support for mouse buttons 4/5"
date: 2020-08-19
slug: kvmd-1-92-support-for-mouse-buttons-4-and-5
description: >
    This release brings support for mouse buttons 4 and 5 in the web interface for all Pi-KVM platforms
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.92
comments: true
---

This release brings support for mouse buttons 4 and 5 (back/forward) in the web interface for all Pi-KVM platforms.

<!-- more -->

If you are using an Arduino HID, then you need to update the firmware to use the additional buttons. However, if you do not update the firmware, nothing terrible will happen: the Protocol is backward compatible, and Arduino will simply ignore the new buttons.

* Note that these buttons will not work in VNC, since the RFB protocol does not support them by design.

* Fixed race condition on HID reset.

To update:

```console
rw
pacman -Syu
reboot
```
