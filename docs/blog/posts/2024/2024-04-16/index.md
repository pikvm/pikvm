---
title: "KVMD 3.333: HDMI passthrough now available on V4 Plus"
date: 2024-04-16
slug: kvmd-3-333-hdmi-passthrough-now-available-on-v4-plus
description: >
    Thanks to the work of the Raspberry kernel team, a bug related to incorrect colors in H.264 was finally fixed while working with passthrough
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.333
comments: true
---

After a long and thorny path of research, we are pleased to present the promised HDMI passthrough feature for PiKVM V4 Plus.

<!-- more -->

![type:video](./hdmi-passthrough.webm)

The new feature allows you to connect PiKVM between the host and local display. PiKVM will not interfere with the normal operation of the display and passes the video signal through itself until you need remote access. In this case, PiKVM will copy the video stream to the Web UI or VNC.

But the most important thing is that the video will still be available on the local display at the same time as the stream! And of course it's zero-latency for the local display, with VSync support.

How-to: https://docs.pikvm.org/pass

Also, I'm glad that this release got a beautiful number, and I was finally able to make the Evangelion reference, which I forgot to do for 3.33 :)
