---
title: "KVMD 4.74: Local USB keyboard & mouse passthrough"
date: 2025-05-23
slug: kvmd-4-74-local-usb-mouse-passthrough
description: >
    With this new mode, all USB keyboards and mice connected to PiKVM directly will be forwarded the host
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.74
comments: true
---

With this new mode, all USB keyboards and mice connected to PiKVM directly will be forwarded the host. If you're using PiKVM Switch, they will be forwarded via the Switch to the active selected host.

<!-- more -->

There are several hotkeys available that are always active:

- `LeftAlt, LeftAlt, K` - (mnemonic **K**VM, quick hit) disable keyboard/mouse grabbing and allow them to use with PiKVM locally, for example, for the console operating.
- `LeftAlt, LeftAlt, H` - (**H**ost) - switch back to the passthrough mode and pass keyboard-mouse events to the host.
- Switching the PiKVM Switch channels. If you have one or two switches, you can use `LeftAlt, LeftAlt, 1 (1-8)` to switch between 8 channels. For three or more Switches, you need to use double numbers, like `LeftAlt, LeftAlt, 3, 2` (unit 3, channel 2).

Now you can set up your workplace so that all your input devices are connected via PiKVM, this is especially convenient with the V4 Plus, which can also passthrough a monitor. And if you use a switch, then you will no longer need to have a separate keyboard and mouse for local work. Your workplace behaves exactly the same locally as it does remotely.

To enable this feature, update OS with `pikvm-update` and run `rw; systemctl enable --now kvmd-localhid; ro`. 
