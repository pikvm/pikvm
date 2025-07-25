---
title: "KVMD 3.26: Philips Hue GPIO plugin"
date: 2021-09-26
slug: kvmd-3-26-philips-hue-gpio-plugin
description: >
    We added a Philips Hue GPIO plugin for smartplugs and lamps
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.26
comments: true
---

This releases comes with several new features and improvements.

<!-- more -->

- Started rebranding Pi-KVM -> PiKVM. Everyone is constantly confused about how to write it correctly, so we will write the name in one word. And it's easier to google, too.

- Added Philips Hue GPIO [plugin](https://github.com/pikvm/pikvm/blob/master/pages/gpio.md#philips-hue) for smartplugs and lamps. We also changed the GPIO HTTP API accordingly: pin numbers are strings now, which is a requirement for named pins.

- ATX and GPIO actions are now also recorded in macros.

- The IPMI GPIO plugin no longer calls ipmitool twice when a button is clicked in the interface.

To update:

```console
rw
pacman -Syu
reboot
```