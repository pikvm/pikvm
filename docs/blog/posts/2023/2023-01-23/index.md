---
title: "KVMD 3.196: 2FA support"
date: 2023-01-23
slug: kvmd-3-196-2fa-support
description: >
    Many have asked for this, so now you have the opportunity to increase the security of your PiKVM
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.196
comments: true
---

Many have asked for this, so now you have the opportunity to increase the security of your PiKVM.

<!-- more -->

By the way, this is a great chance to see how the QR code is rendered in the terminal using ASCII 😄

Have fun: https://docs.pikvm.org/auth/#two-factor-authentication

![2FA support in the web UI](2fa.webp)

To update:

```console
rw
pacman -Syu
reboot
```
