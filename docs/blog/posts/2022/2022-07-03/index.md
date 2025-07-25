---
title: "A small request for V3 and DIY builds with CSI bridge owners"
date: 2022-07-03
slug: small-request-for-v3-and-diy-builds-with-csi-bridge-owners
description: >
    We want to change some default values in the EDID
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

We want to change some default values in the EDID (information about the virtual display) so that it looks not like `Toshiba-H2C`, but like `PiKVM`, and also change the vendor code.

<!-- more -->

If you have a minute, please change the EDID settings and test the PiKVM virtual display in your BIOS and OS.

Preparations:

```console
rw
pacman -Syu
kvmd-edidconf --set-mfc-id=LNX --set-monitor-name=PiKVM
reboot
```

After this, check OS and BIOS. The current paranoid hypothesis is that perhaps some ugly BIOSes may rely on the manufacturer's code for monitor Plug-n-Playing.

**Expected behavior**: PiKVM video capture work as before without any problems. If something goes wrong, you can undo all the changes.

Please, if you have completed the testing and everything is fine, click the UP! under the message. If something doesn't work, please report to ⁠the `#dev` channel on Discord. 