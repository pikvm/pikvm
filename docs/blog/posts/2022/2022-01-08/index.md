---
title: "KVMD 3.53: OLED and fan updates for V3"
date: 2022-01-08
slug: kvmd-3-53-oled-and-fan-updates-for-v3
description: >
    The OLED screen now displays the temperature, CPU and memory usage
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.53
comments: true
---

The new KVMD update ships with a few major OLED changes.

<!-- more -->

First off, the OLED screen now displays the temperature, CPU and memory usage. You can control that with a new `kvmd-oled` tool. American users can now turn on the temperature display in Fahrenheit, see Step 5 in the [quickstart guide](https://docs.pikvm.org/v3) for details.

The next new feature is `kvmd-fan`. This new utility implements automatic fan speed control depending on temperature.

To update:

```console
rw
pacman -Syu
reboot
```