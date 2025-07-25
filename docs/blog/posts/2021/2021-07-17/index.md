---
title: "KVMD 3.11 For Workgroups"
date: 2021-07-17
slug: kvmd-3-11-for-workgroups
description: >
    Wake-on-LAN can now be configured for a whole list of hosts, and the interval between hotkeys was increased to 100 ms
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.11
comments: true
---

More new features in this new release.

<!-- more -->

Now **Wake-on-LAN** can be configured not for one, but **for a whole list of hosts**.  Now you can use this as another method of managing multiple hosts connected to an HDMI switch: https://github.com/pikvm/pikvm/blob/master/pages/wol.md

This change required a complete rewrite of the WoL subsystem, which has now become a pseudo-GPIO driver. Your old settings in `override.yaml` will work and the button for one host is still in the System menu, since I took care of backward compatibility, but the `/api/wol` handle has been removed, you need to use the GPIO API instead it (if anyone has used it at all).

We also made some improvements in the interface. The **interval between hotkeys was increased to 100 milliseconds** (since 50 was sometimes not enough for reliable operation), **the shortcuts menu was separated from the paste menu** in preparation for the implementation of custom keyboard shortcuts.

To update:

```console
rw
pacman -Syu
reboot 
```