---
title: "KVMD 3.36: Custom command button in the menu"
date: 2021-10-24
slug: kvmd-3-36-custom-command-button
description: >
    We have just implemented the long-awaited feature—adding a custom command button to the menu
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.36
comments: true
---

We have just implemented the long-awaited feature—adding a custom command button to the menu.

<!-- more -->

I don't know why this is necessary, but it's been asked so often, so why not do it. To use it, you will need a pseudo-GPIO CMD driver. See [this help page](https://docs.pikvm.org/gpio/#cmd) for details.

We also improved the behavior of stream quality sliders on Firefox.

To update:

```console
rw
pacman -Syu
reboot
```