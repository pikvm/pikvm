---
title: "KVMD 2.65: Ezcoo fix for USB 3.0"
date: 2021-05-09
slug: kvmd-2-65-ezcoo-fix-for-usb3
description: >
    If you bought an Ezcoo switch for USB 3.0, you need to upgrade to the new version and add one option to the config
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.65
comments: true
---

If you bought an Ezcoo switch for USB 3.0, then in order for it to work with Pi-KVM, you need to upgrade to the new version and add one option to the config.

<!-- more -->

The fact is that the Ezcoo guys for some reason changed the management protocol. The update adds support for [this](https://github.com/pikvm/pikvm/blob/master/pages/ezcoo.md#additional-step-for-the-usb30-version).

Ah, and if you're wondering where the rest of the versions disappeared between release 2.59 and 2.65, then these were some things for the upcoming H.264 support 🙂

To update: 

```console
rw
pacman -Syu
reboot
```