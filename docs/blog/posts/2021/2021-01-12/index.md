---
title: "uStreamer 3.0: H264 video recording"
date: 2021-01-12
slug: ustreamer-3-0-h264-video-recording
description: >
    In the near future, it is planned to support H264, and then switch to it as the main one
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v3.0
comments: true
---

Currently, Pi-KVM uses MJPEG for video transmission. This is a simple and widely supported, but not very effective video format. In the near future, it is planned to support H264, and then switch to it as the main one.

<!-- more -->

The H264 implementation is still under development, but right now you can use it to record video from your server. To do this, uStreamer supports simultaneous MJPEG and H264 encoding.

[See here](https://docs.pikvm.org/video/) for more information.

We also have some news about Tailscale support.

Previously, Tailscale was in its own pikvm repository and contained fixed versions of the startup scripts. Now it was accepted in upstream and the default startup scripts were broken. 

If you upgrade the system and want to keep Tailscale working, you need to install the tailscale-pikvm package:

```console
rw
pacman -Syu
pacman -S tailscale-pikvm
reboot
```