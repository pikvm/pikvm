---
title: "KVMD 1.100: GPIO and USB relays"
date: 2020-09-11
slug: kvmd-1-100-gpio-and-usb-relays
description: >
    This release introduces the ability to use GPIO and USB relays
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.100
comments: true
---

This release introduces a feature that I have been working on for a long time and that will significantly expand the functionality of Pi-KVM: the ability to use GPIO and USB relays.

<!-- more -->

Now you can connect any number of relays and configure GPIO to control anything using the convenient customizable menu in the Pi-KVM interface. If you wanted to make a smart server power switch, or control a multiport HDMI switch via the menu - now you have all the tools to do it: https://docs.pikvm.org/gpio/.

Some other features:

* The API for integration with the Prometheus monitoring system has been finally stabilized and documented. By the way, you can get data about the status of GPIO ports in it: https://docs.pikvm.org/prometheus/.

* KVMD is now compatible with Python 3.7, allowing enthusiasts to create custom builds for other operating systems.

* Looped playback is now available for user action macros in the web interface.

* Fixed a minor Nginx issue that could cause the Could not build optimal types_hash message in the logs. You will probably have to look at the diff between the `/etc/kvmd/nginx/nginx.conf` and `/etc/kvmd/nginx/nginc.conf.pacnew` files and make the appropriate changes to the first one, then manually delete the second one. But if you don't do any of this, it's not a big deal, it won't affect the functionality of the system.

* New images are available in the archive: https://pikvm.org/download/.

Thank you to everyone who helped with the documentation and testing of new features. In addition, this release includes an updated list of thanks to those who donated to the project.

To update:

```console
rw
pacman -Syu
reboot
```