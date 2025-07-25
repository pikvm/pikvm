---
title: "KVMD 3.14: The Epic Apple fix, Vol.2"
date: 2021-08-12
slug: kvmd-3-14-epic-apple-fix-vol2
description: >
    Great news for Apple and v2/v3/OTG users: you no longer need to use the Arduino HID to get into the Boot Menu or Recovery Mode
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.14
comments: true
---

I continue to eliminate ancient bugs from USB. So great news for **Apple and v2/v3/OTG users**: you no longer need to use the Arduino HID to get into the Boot Menu or Recovery Mode.

<!-- more -->

It took a long and thoughtful study, but now this problem has been resolved. In addition, **compatibility with some strange HP and DELL motherboards** has improved, so if you didn't have a keyboard there before, now it has all the chances to work! Note: wakeup from suspend using keyboard has not yet worked, but it's a matter of time.

**Before updating**: If you used testing repository, cancel this and use the usual settings.

To update:

```console
rw
pacman -Syu
reboot 
```

You will also need my own stable kernel build (if you are using a very old image and have not installed it, in new images it is out of the box):

1. Check if it is installed: `pacman -Q | grep pikvm-os-raspberrypi`
2. If this command didn't show you anything, install my kernel