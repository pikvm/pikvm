---
title: "KVMD 3.27: Mouse polling rate"
date: 2021-10-03
slug: kvmd-3-27-mouse-polling-rate
description: >
    KVMD now supports setting the mouse polling rate
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.27
comments: true
---

The new version ships with a new feature: configurable mouse polling rate.

<!-- more -->

Previously it was a fixed 100ms, now it can be reduced to 10ms, so on good communication channels it makes the mouse more responsive.

Other changes:

- Added tests to check whether the browser supports WebRTC/H.264.
- Added a GPIO driver for a new KVM switch XK-HK4401.

To update:

```console
rw
pacman -Syu
reboot
```

We also fixed the use of new Tailscale versions. Install the `tailscale-pikvm` package.