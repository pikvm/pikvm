---
title: "KVMD 1.90: Closing the stream window in the web UI"
date: 2020-08-17
slug: kvmd-1-90-closing-the-stream-window-in-the-web-ui
description: >
    Now you can close the stream window in the web interface
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.90
comments: true
---

One small, but very important feature. Now you can close the stream window in the web interface.

<!-- more -->

Two things will happen: the browser will stop recieving the video stream, reducing traffic consumption, and the streamer on the Pi-KVM side will still work, so when you open the window again, the video stream will be restored.

This is useful if you want to upload an image to mass storage while all the traffic goes to the video. This is especially useful for the ZeroW because of the weakness of it. Note that changing the screen resolution will raise a closed window.

This is a feature that will be removed later along with the stream size slider.

We also introduced various minor fixes. Don't forget to clean the browser cache after upgrading:

```console
rw
pacman -Syu
reboot
```
