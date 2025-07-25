---
title: "KVMD 3.152: Android and iOS tablets support"
date: 2022-10-07
slug: kvmd-3-152-android-and-ios-tablets-support
description: >
    The two latest releases of KVMD come with improve support for web UI running on tablets
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.152
comments: true
---

Several latest releases of KVMD come with improved support for web UI running on tablets.

<!-- more -->

- We now have working mouse buttons and mobile keyboard for Apple tablets running iOS.
- We also fixed Shift key in iOS JUMP and bVNC clients and fixed key confusion in Apple Magic International Keyboard.
- The mobile interface is now available for Android tablets. Maybe not perfect, but it works.

Some of the other changes are:

- Workaround for paste-as-keys for en/em dashes.
- Improved OCR.
- Kernel updated to 5.15.68.

To update:

```console
rw
pacman -Syu
reboot
```