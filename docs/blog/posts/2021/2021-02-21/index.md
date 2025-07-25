---
title: "KVMD 2.27: Critical bug fix"
date: 2021-02-21
slug: kvmd-2-27-critical-bug-fix
description: >
    A lot of changes have accumulated since the last announced release. Mostly finally fixed wifi support on Zero and RPi4
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.27
comments: true
---

A lot of changes have accumulated since the last announced release. Mostly finally fixed wifi support on Zero and RPi4.

<!-- more -->

* Added new udev rules for USB HDMI for latest RPi4 board revisions

* Improved handling of VNC frames. It should get a little faster.

* Added support for VNC X.509 encryption. Now you can use some mobile clients (such as bVNC) to access the Pi-KVM.

* Now the Arduino HID is rebooted when the KVMD is restarted, this prevents the Arduino from possibly hanging due to the slow build-up of the supply voltage.

* Changed the default JPEG compression quality on Zero. Now it is 50 (FPS has become higher, the quality remains acceptable).

* The web interface now allows to upload MSD images with spaces. Some more minor improvements to the web interface. Also it's now available over IPv6.

* For USB Ethernet (v2 only), we added the ability to configure Pi-KVM as a router for the server, [see here](https://github.com/pikvm/pikvm/blob/master/pages/usb_ethernet.md).

* A lot of work has been done to use H.264 with VNC. At the moment, we have registered our new protocol in IANA and are waiting for the applying of patches in TigerVNC and the fixing of some bugs in the kernel related to HDMI and H.264.

To update: 

```console
rw
pacman -Syy
pacman -S linux-firmware=20210221.b79d239-1
pacman -Su
reboot
```