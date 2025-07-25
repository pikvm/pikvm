---
title: "Zero W 1 and RPi 1 end-of-life"
date: 2022-02-11
slug: zero-w-1-and-rpi-1-end-of-life
description: >
     We are discontinuing support for PiKVM based on Zero W and RPi 1
categories:
    - Products
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz
comments: true
---

Since Arch Linux ARM has [discontinued](https://archlinuxarm.org/forum/viewtopic.php?f=3&t=15721) support for the ARMv6 architecture , we are discontinuing support for PiKVM based on Zero W and RPi 1, because we don't have the ability to maintain our own fork of the whole distro for this architecture.

<!-- more -->

It is proposed to use Zero W 2 and RPi 2 for supported replacement. I know this will upset a lot of users, but there's nothing we can do about it right now. The current plan is as follows:

1. We will build the last image with the current packages for Zero W 1. It will not receive updates, but will continue to work as before.

2. In the long term, we plan to create a package repository for Raspbian. When this happens, support for Zero W 1 and RPi 1 will be returned, but not for the Arch Linux ARM, but for the Raspbian / Raspberry Pi OS.

**RPi 2 and the rest of the devices continue to be supported as before.**