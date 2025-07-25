---
title: "uStreamer 5.42: Reduced stream latency!"
date: 2023-08-23
slug: ustreamer-5-42-reduced-stream-latency
description: >
    Now 1080p stream with H.264 can reach ~110ms on LAN
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v5.42
comments: true
---

While I was working on HDMI passthrough for V4 Plus (I didn't forget what we promised!), I found a way to reduce the stream latency.

<!-- more -->

Now 1080p stream with H.264 can reach ~110ms on LAN. That is, -50ms compared to the previous result.

BTW all PiKVMs, including V3 and DIY builds, will receive this update. 