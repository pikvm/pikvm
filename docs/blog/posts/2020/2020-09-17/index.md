---
title: "KVMD 1.101: Improvement for the HDMI USB dongle"
date: 2020-09-17
slug: kvmd-1-101-improvement-for-the-hdmi-usb-dongle
description: >
    The main change in this release concerns the internals of Pi-KVM
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.101
comments: true
---

The main change in this release concerns the internals of Pi-KVM.

<!-- more -->

About a year ago, the Linux kernel interface, which is used by most applications on the Raspberry Pi that work with GPIO, was deprecated (sysfs/gpiomem). This was replaced by the character device `/dev/gpiochipX`.

It is stated that the old interface will be removed in 2020, that is, very soon. Existing GPIO libraries for Python and C will also stop working: RPi.GPIO, pigpio, wiringpi and other. 

It seems that the coming year will be fun for many projects that use the old library. For this reason, I got rid of RPi.GPIO and now KVMD uses libgpiod, a library for working with GPIO recommended and supported by kernel developers.

GPIO changes will not affect those who simply use this to control the ATX or control the KVM switch. However, those who use [custom GPIO](https://docs.pikvm.org/gpio/) in Pi-KVM should know that it is no longer possible to save the pin state for GPIO (this is the kernel limitation) using option `initial=null`. In other words, when KVMD is restarted, the state of the relay connected to the GPIO will be reset to logic 0.

With the exception of this, the new library allowed KVMD to get rid of active GPIO state polling cycles, as well as crutches around kvmd-cleanup (does anyone even know what this is lol?). I have thoroughly tested this release and everything should be OK. However, if you notice any oddities, please let me know.

To update:

```console
rw
pacman -Syu
reboot
```