---
title: "KVMD 4.127: Improved fullscreen and mobile UI"
date: 2025-11-26
slug: kvmd-4-127-improved-fullscreen-and-mobile-ui
description: >
    The fullscreen and mobile UI of the PiKVM web dashboard has become much more convenient to use
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.127
comments: true
---

The fullscreen and mobile UI of the PiKVM web dashboard has become much more convenient to use. 

<!-- more -->

You now have access to the pop-up menu with all the interface elements and no longer need to leave the fullscreen mode to get to shortcuts or settings. The same applies to the full-tab mode.

The mobile interface on tablets can now be expanded to the full screen or to the entire tab, and a pop-up menu is also available there.

We also implemented a floating box with mouse buttons in the mobile interface:

![Updated fullscreen mode](fullscreen-update.webp)

To update, log into your PiKVM as `root` and run this command:

```shell
pikvm-update
```