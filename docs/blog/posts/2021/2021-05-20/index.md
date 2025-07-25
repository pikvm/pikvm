---
title: "KVMD 2.71: Massive internal changes"
date: 2021-05-20
slug: kvmd-2-71-massive-internal-changes
description: >
    In addition to new features and fixes, a large number of internal changes have been made for the upcoming H264/WebRTC support
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.71
comments: true
---

This is a very important release. In addition to new features and fixes, a large number of internal changes have been made for the upcoming H264/WebRTC support.

<!-- more -->

As usual, I tested everything very carefully, but anyway. If you notice anything strange (for example, with the stream), let me know.

- **Added module for new managed KVM switch Tesmart** (as an Ezcoo alternative): https://github.com/pikvm/pikvm/blob/master/pages/tesmart.md. It can be used in a same way from Web UI.

- Fixed the **Bluetooth HID** emulation module.

- **Improved text insertion via the Web UI**: typographic quotes are now replaced with ASCII quotes. Many sites where scripts can be copied from like to break quotes, so I decided to make life a little easier for sysadmins.

- Due to a bug in systemd/udev, **port binding for USB HDMI is disabled**. This is temporary for now, but I'm considering getting rid of it altogether, because no one seems to be using multiple video devices on the Pi-KVM.

- **Redesigned the System menu in the Web UI** to make it more compact, as due to H264 and v3 there will be a lot of new settings.

To update: 

```console
rw
pacman -Syu
reboot
```