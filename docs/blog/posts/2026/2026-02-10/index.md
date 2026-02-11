---
title: "KVMD 4.147: Huge latency improvement"
date: 2026-02-10
slug: kvmd-4-147-huge-latency-improvement
description: >
    The fullscreen and mobile UI of the PiKVM web dashboard has become much more convenient to use
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.147
comments: true
---

We rolled out a new algorithm for configuring the WebRTC H.264 video stream. This should give an incredible boost to performance and reduce latency. You can try this on any PiKVM that supports H.264.

<!-- more -->

All you need to do is update OS, set `H.264 gop` to `0`, and the magic will happen.

![GOP setting in the web UI](gop.webp)

It works great on local networks and over the Internet. Try it yourself, it should also work through Tailscale and other VPNs.

Please let us know if this doesn't work well on your network, VPN, or anywhere else, because I'm considering making `gop=0` the default setting.