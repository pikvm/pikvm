---
title: "KVMD 4.119: Keyboard Shortcuts and Magic Keys"
date: 2025-11-09
slug: kvmd-4-119-shortcuts-revamp
description: >
    New configurable shortcuts system helps sending keyboard shortcuts to target host systems in a consistent manner
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.119
comments: true
---

We have revamped the keyboard shortcuts system to make sending shortcuts consistent across multiple target host systems.

<!-- more -->

The new system is built around the concept of a magic key. Pressing the magic key in the web UI turns on the keyboard shortcut composition mode. The web UI will keep accumulating modifier keys, such as `Ctrl`/`Command`, `Shift`, and `Alt`/`Option`, and display them in an overlay.

As soon as you push a non-modifier key (typically, alphanumeric keys), the web UI will stop accumulating modifiers and send all the keys you pressed.

For details, please see the [documentation](https://docs.pikvm.org/shortcuts/).