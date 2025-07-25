---
title: "KVMD + uStreamer performance update"
date: 2024-03-06
slug: kvmd-ustreamer-performance-update
description: >
     After few weeks of research, I managed to increase the video performance slightly reduce the latency for all CSI devices
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.310
    - uStreamer release: https://github.com/pikvm/ustreamer/releases/tag/v6.0
comments: true
---

Today I have prepared a great update for you. After few weeks of research, I managed to increase the video performance slightly reduce the latency for all CSI devices (PiKVM V4, V3 and CSI-based V2).

<!-- more -->

In H.264 mode (WebUI and VNC), you will get stable 30fps on 1080p and 60fps on 720p
In MJPEG mode it just works a little faster.

To update:

```
# pikvm-update`
```

If this command is not available, please use:

```console
# curl https://files.pikvm.org/update-os.sh | bash`
```