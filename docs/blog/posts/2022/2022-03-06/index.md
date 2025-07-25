---
title: "New testing branch available"
date: 2022-03-06
slug: new-testing-branch-available
description: >
    I am asking all interested users of v0, v2 and v3 to test this update
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

A few months ago, due to the release of Bullseye, the usual video encoding method used in PiKVM stopped working in the new kernel. OpenMAX and MMAL were deprecated and uStreamer has ben rewrited to use new M2M encoder. Now the work is almost completed and everything seems to be working fine.

<!-- more -->

I am asking all interested users of v0, v2 and v3 to test this update before I make it available to everyone. Rememer: this is an experimental update, so don't install it unless you're ready to do a reflash. 

To install:

```console
rw
sed -i -e 's|repos/arch/|repos/arch-testing/|g' /etc/pacman.conf
pacman -Syu
reboot
```

Please report any problems to `#⁠dev` on Discord. Also let me know if everything is working fine. I am interested in testing on RPi3, RPi4 and Zero2W boards with HDMI-CSI bridge or v3 HAT.