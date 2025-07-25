---
title: "KVMD 1.93 & uStreamer 1.22"
date: 2020-08-21
slug: kvmd-1-98-ustreamer-1-22
description: >
    This is a double release of KVMD and uStreamer with improvements and fixes
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.93
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v1.22
comments: true
---

This is a double release of KVMD and uStreamer with improvements and fixes.

<!-- more -->

KVMD:

* Improved error message in login window.

* Added [HTTP API for HID](https://github.com/pikvm/kvmd/blob/master/kvmd/apps/kvmd/api/hid.py#L161). For example, press and release the Shift key: 

```console
curl -k -XPOST -HX-KVMD-User:admin -HX-KVMD-Passwd:admin 'https://kvm/api/hid/events/send_key?key=ShiftLeft'`
```

uStreamer:

* Added timeout to vcos semaphore to prevent unexpected hanging of the OMX encoder (this should not happen about ever, but it is better to be safe).

* Fixed fallback to the CPU encoder when the OMX fails.

* Improved compatibility with some USB 3.0 video capture devices that may produce incorrect frames. The minimum frame size for encoding is set to 128 bytes.

* Added options to flip image and accept some color effects provided by webcams.

To update:

```console
rw
pacman -Syu
reboot
```