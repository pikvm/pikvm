---
title: "KVMD 3.249: easier uploading over SSH"
date: 2023-08-19
slug: kvmd-3-249-easier-uploading-over-ssh
description: >
    Now 1080p stream with H.264 can reach ~110ms on LAN
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/kvmd/releases/tag/v3.249
comments: true
---

In addition to many minor improvements from the previous announcement, an important change has occurred in the new release for those who use advanced Mass Storage emulation features.

<!-- more -->

Now, **when uploading an image via SSH, you no longer need to create a `.complete` file**, since a manually placed image will be considered complete by default. This should simplify the operation of NFS shares for images and simplify console use.

**Before updating, delete all your broken images. In theory, you should not have them, since PiKVM deletes it on uploading error, but anyway.**

To update:

```console
rw
pacman -Syu
reboot
```

PS: A little bit about the state of things: **PiKVM is an open source product and full-time work for several people, thanks to which we can maintain the proper level of quality and security**. As you can see, even after the release of V3 and V4, we do not abandon the development of DIY devices and port all possible features there.