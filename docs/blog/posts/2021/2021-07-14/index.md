---
title: "KVMD 3.9: Paste-as-Keys update"
date: 2021-07-14
slug: kvmd-3-9-paste-as-keys-update
description: >
    For the Paste-as-Keys function, the state of the confirmation switch and the selected keymap are saved
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.9
comments: true
---

For the Paste-as-Keys function, the state of the confirmation switch and the selected keymap are saved. You asked for it—I did it.

<!-- more -->

Also, after solving the problems with HID on Apple, I sent patches to the upstream HID library. I know of at least one other project for which these problems were a thorn. Let's hope that we will make life easier for people 🙂

To update:

```console
rw
pacman -Syu
reboot 
```