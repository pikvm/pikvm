---
title: "KVMD 1.78: VNC improvements"
date: 2020-07-23
slug: kvmd-1-78-vnc-improvements
description: >
    There are two important VNC improvements in the KVMD 1.78 release
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.78
comments: true
---

Two important VNC improvements: client connections that have hung up are now terminated correctly using `TCP_KEEPALIVE`; applying the `TCP_NODELA`Y parameter slightly improved responsiveness.

<!-- more -->

- Improved compatibility with FireFox.

- Minor fixes and codebase cleanup.

This release also updated the list of project sponsors, who donated via Patreon (https://patreon.com/pikvm) or PayPal (https://www.paypal.me/mdevaev). The names of these good people are forever immortalized on the project page and in the web interface in the About window.

Thanks to them, I was able to buy a couple of new devices, support for which will appear in one of the next releases of Pi-KVM, and also bought food for my cat!