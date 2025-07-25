---
title: "KVMD 1.88: Tailscale support"
date: 2020-08-13
slug: kvmd-1-88-tailscale-support
description: >
    We added Tailscale to the OS repository for easy access to KVM from an external network via VPN
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.88
comments: true
---

We added [Tailscale](https://tailscale.com/) to the OS repository for easy access to KVM from an external network via VPN. Updated documentation is [here](https://docs.pikvm.org/tailscale/).

<!-- more -->

For very old computers a new mixed Arduino HID mode has been added: PS/2 keyboard + USB mouse. This is a great alternative to the PS/2 keyboard only mode that was [added earlier](https://docs.pikvm.org/arduino_hid/).

All new project supporters are added to the thank you list in the About dialog in Pi-KVM and to the github. Thanks again! 

To update:

```console
rw
pacman -Syu
reboot
```
