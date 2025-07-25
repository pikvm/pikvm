---
title: "KVMD 2.53: Web terminal in a web UI window"
date: 2021-04-17
slug: kvmd-2-53-web-terminal-in-web-ui-window
description: >
    You can now have a terminal window in the web UI on top of the video stream if you like
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.53
comments: true
---

You can now have the web terminal in a window above the video stream if you like. The focus works a little strange, but it is quite functional and even supports changing the size.

<!-- more -->

![Web terminal in a window](web-terminal-window.webp)

Another recent change is that you can now select the keyboard layout of the target machine in the paste-as-keys menu, so this solves the problem of German, British, and other layouts.

![Select the keyboard layout of the target machine in the paste-as-keys menu](paste-as-keys-keyboard-layout.webp)

And a few more changes:

* You can disable confirmation in the paste-as-keys menu
* Full-screen mode now works in Safari on Mac.
* Some minor UI fixes and improvements.

To update: 

```console
rw
pacman -Syu
reboot
```