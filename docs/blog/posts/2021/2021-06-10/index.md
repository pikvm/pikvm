---
title: "KVMD 3.0: The big H.264 release!"
date: 2021-06-10
slug: kvmd-3-0-big-h264-release
description: >
    Now, instead of using bold MJPEG for video, you can use fast WebRTC with H.264!
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.0
comments: true
---

I'm happy to introduce you to a feature I've been working on for the last six months. Now, instead of using bold MJPEG for video, you can use **fast WebRTC with H.264**.

<!-- more -->

This allows you to significantly reduce traffic consumption and improve the responsiveness of Pi-KVM on bad networks, and all in the regular Web UI! The MJPEG and H.264 modes are left to choose from and you can switch them at any time using the menu.

It was a huge job, as I had to understand the intricacies of WebRTC functioning, integrate it with uStreamer, develop a way to automatically configure the WebRTC gateway, and so on.

**To try the new super video mode**, upgrade your system (`rw; pacman -Syu; reboot`) and read the simple [user guide](https://github.com/pikvm/pikvm/blob/master/pages/webrtc.md).

**Please note that right now H.264 is only available for Raspberry Pi 4 with CSI bridge**.
