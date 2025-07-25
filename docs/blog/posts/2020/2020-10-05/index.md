---
title: "Another test request for v2 users of RPi4 and ZeroW"
date: 2020-10-05
slug: another-test-request-for-v2-users-of-rpi4-and-zerow
description: >
    I found a way to improve USB HID/Mass Storage compatibility with some motherboards
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

I found a way to improve USB HID/Mass Storage compatibility with some motherboards. I would like to ask you to check if there are any problems because of this. If successful, if you didn't have MSD working, it may work after this change.

<!-- more -->

Please check this on your configurations: whether HID/MSD worked before, whether it works after the patch. I will be happy to hear about any changes (both positive and negative).

Run on Pi-KVM:

```console
rw
sed -i -e 's|^dtoverlay=dwc2$|dtoverlay=dwc2,dr_mode=peripheral|g' /boot/config.txt
reboot
```

This can be easily undone if problems occur.