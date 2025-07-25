---
title: "KVMD 1.98: Technical preview for GPIO"
date: 2020-08-31
slug: kvmd-1-98-technical-preview-for-gpio
description: >
    This is the technical preview for the ability to use custom GPIO pins for any purpose, such as connecting sensors or relays
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.98
comments: true
---

I've been working on a new big important feature: the ability to use custom GPIO pins for any purpose, such as connecting sensors or relays.

<!-- more -->

This release is technical preview (but stable ofc) so that you can try out the features that will then be introduced into production.

* In this release the GPIO API was added. Now you can configure any number of switches, leds and buttons connected to Pi-KVM and act with it using API: ⁠`#chat⁠`. In one of the next releases, these switches will be available in the web interface and I will write the documentation.

* Added HTTP export handle for the [Prometheus](https://prometheus.io/) system to monitor the pi's and server's state: `/api/export/prometheus/metrics` with basic auth.

* Added support for HTTP header `Authorization: Basic ...` to support basic auth for Prometheus (and other monitoring systems).

To update:

```console
rw
pacman -Syu
reboot
```