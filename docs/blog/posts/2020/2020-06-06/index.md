---
title: "KVMD 1.67: NumPad support"
date: 2020-06-08
slug: kvmd-1-67-numpad-support
description: >
    Added NumPad support, including for configurations with Arduino HID
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.67
comments: true
---

We added NumPad support, including for configurations with Arduino HID.

<!-- more -->

The Arduino firmware is backward compatible so nothing will break if you don't update it, but it's still worth rewiring your device. You can find out how to do this in the user's guide: https://github.com/pikvm/pikvm. 

KVM on the basis of the ZeroW parameter and RPi4 will receive support NumPad once after upgrading and rebooting.NumPad also works in VNC, but the keys are not represented in the web interface, because there is no space for them now. I'm saving this issue for the future when I'm improving the UI.

For Arduino HID, communication logging over the serial port has been reworked, so that the log shows fewer unimportant connection errors. The logic there is quite complex, and although I have checked everything ten times, please let me know if there are any problems with the Arduino.

IPMI and VNC logs are made slightly more readable. The IPMI log shows the IP address of the client from which the request was sent.

This release also includes improvements to the About window of the web interface, which now shows more information about the system.

To update:

```console
rw
pacman -Syu
reboot
```

If you have problems installing packages, see the previous news.

PS: The situation with the new kernel has become a little clearer. [Another bug](https://github.com/raspberrypi/linux/issues/3647) that I found  has been fixed, so there is a chance for a quick system update. In the meantime, we'll continue enjoying the stability of the 4.x branch 