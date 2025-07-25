---
title: "Implementing H264 support for VNC"
date: 2021-01-19
slug: implementing-h264-support-for-vnc
description: >
    I want to implement H264 support for VNC, but the problem is that no VNC client supports H264
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

For those who use VNC and want to reduce the traffic using H264.

<!-- more -->

I want to implement H264 support for VNC, but the problem is that no VNC client supports H264. I'm ready to write a server and I already have a stable H264 encoder, but I need help with the client.

I'm going to negotiate with the developers of TigerVNC to work together on this: we will agree on a new protocol, I will implement the server, and they will implement the client. Since this is clearly a low-priority task for them, I suggest that anyone who needs this functionality should chip in for a beer for these guys.

If you are willing to participate and want to have H264 in VNC, please report yourself in ⁠h264_vnc_funding with an indication of how much you are willing to donate. Any contribution is important! If we collect an acceptable amount (I think $500 is reasonable), I will notify everyone and you can throw this money on [BountySource](http://bountysource.com/) (a site with rewards for developers).

Once again: I'm not asking for myself, but to pay for the work of other people. This is a very large-scale task, and if it is done by several people, everyone will benefit.