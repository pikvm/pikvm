---
title: "KVMD 2.42: Fullscreen mode in the web UI"
date: 2021-04-13
slug: kvmd-2-42-fullscreen-mode-web-ui
description: >
    Fullscreen mode is now available and works in all browsers
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.42
comments: true
---

Introducing a big update to the web interface!

<!-- more -->

Full-screen mode! It works in all browsers, but most of all-in Chrome/Chromium, where it allows you to capture system keys like Ctrl+W and so on.

![type:video](./fullscreen-mode.mp4)

Other changes:

- Changing the size of the stream window using the window corner. No more ugly "Stream size" slider!
- The ability to expand the window to the entire workspace with a single button.
- Added the ability to manage remote hosts via IPMI from the Web UI menu: view the power status, turn on/off, and so on. [See here](https://github.com/pikvm/pikvm/blob/master/pages/gpio.md#ipmi) for details.
- Work continues on implementing H264. Many components of the system needed to be improved. Not everything is ready yet, but we are one step closer to replacing MJPEG with H264 in the browser.

To update: 

```console
rw
pacman -Syu
reboot
```