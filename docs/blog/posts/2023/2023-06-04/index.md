---
title: "KVMD 3.225: Performance update"
date: 2023-06-04
slug: kvmd-3-225-performance-update
description: >
    This is a performance update that affects the mouse events protocol
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/kvmd/releases/tag/v3.225
comments: true
---

This is a performance update that improves multiple aspects of PiKVM OS.

<!-- more -->

- Added a new very effective mouse events protocol.
- Tuned some OS settings, so you will get a faster mass-storage image uploading.
- Actually, there are many more things that I have fixed and improved, but it's too boring to describe them.

To update:

```console
rw
pacman -Syu
reboot
```

We would appreciate wider testing. There are two important parameters in Web UI that affect the latency. Try them out:

- H.264 gop in the same location.
- Mouse polling interval in the System menu;

Try to reduce it to tis minimum values (0 and 10 ms respectively). This should reduce latency and increase responsiveness. If you don't have a very reliable network (you're using VPN, or your host is a thousand kilometers away from you)—check whether the mouse will work well and whether the video will not be interrupted often.

It is important for me to know this, because if everything is fine, I will change the default values. Let me know if you encounter any problems with the described parameters.