---
title: "Big testing request"
date: 2021-08-08
slug: big-testing-request
description: >
    We are preparing for a big update that will improve compatibility with BIOS and UEFI on many devices
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

I have a very important request. We are preparing for a big update that will improve compatibility with BIOS and UEFI on many devices, and I need as many people as possible to check out the new build of the kernel and core packages.

<!-- more -->

How to test:

1. Switch filesystem to RW-mode using the `rw` command.
2. Open the `/etc/pacman.conf` file for editing and go to its end.
3. Change the repository URL like this (add testing component path): `Server = https://pikvm.org/repos/testing/rpi4-arm`. Don't change the last component (`rpi4-arm`, `zerow-arm`, etc).
4. Run `pacman -Syu && reboot`

Please make sure that everything works as usual, I mean video and USB. I am particularly interested in the CSI bridge.




