---
title: "KVMD 2.31: Critical bug fix"
date: 2021-03-13
slug: kvmd-2-31-critical-bug-fix
description: >
    A critical bug has been fixed in the kernel that prevents the H264 encoder from being enabled by default
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.31
comments: true
---

In recent weeks, I have been mainly working on H264 and have achieved significant results ⁠h264_vnc_funding. A critical bug has been fixed in the kernel that prevents the H264 encoder from being enabled by default, so now everyone can try H264 for VNC for v2 and CSI bridge (only).

<!-- more -->

This is not yet the final official implementation, but everything should work well. The work on H264 support in the web interface is far from complete, but it will be implemented.

Among other things:

- Improved keyboard handling in the web interface on Mac OS.
- When you close the stream window, the interface now asks for user confirmation.
- Fixed a build bug for v0 related to disabling UART console.
- Work has been carried out to standardize the H264 RFB (VNC) protocol. The standard is waiting for confirmation.

To update: 

```console
rw
pacman -Syu
reboot
```