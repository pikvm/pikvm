---
title: "HDMI passthrough on PiKVM V4 Plus"
date: 2024-02-23
slug: hdmi-passthrough-on pikvm-v4-plus
description: >
     We promised it at the start and finally it's almost done. The V4 Plus will get an HDMI passthrough on one of its outputs
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

We promised it at the start and finally it's almost done. The V4 Plus will get an HDMI passthrough on one of its outputs. Right now It's working on my desk, and it's pretty good: 1080p 60 fps with vertical sync, perfect 24 bit color and zero-latency.

<!-- more -->

The first versions will pass the video if the online stream in the Web UI or VNC is not active. This is necessary to reduce all possible delays. I will finalize this in the future. I plan to release a public beta in the next week or two. In fact, it might happen sooner if I catch a wave.