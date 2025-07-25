---
title: "KVMD 3.159: Significant VNC improvement"
date: 2022-11-03
slug: kvmd-3-159-significant-vnc-improvement
description: >
    The VNC server has learned how to transmit video asynchronously
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.159
comments: true
---

The VNC server has learned how to transmit video asynchronously to make it fast and smooth. Now, FPS can grow about twice, it will be especially noticeable with poor internet quality.

<!-- more -->

Some of the other recent changes:

- Fixed H.264 stream corruption (it was a kernel bug).
- Fixed the bug where the web interface considered a laptop with a touchscreen to be a mobile device.
- Made it possible to use icon leds for [GPIO](https://docs.pikvm.org/gpio) menu title like this:

```yaml
title: ["#KVM", "#PC1", pc1led, "#PC2", pc2led]
```

Here is how it looks:

![LED for GPIO](gpio-led.webp)

To update:

```console
rw
pacman -Syu
reboot
```