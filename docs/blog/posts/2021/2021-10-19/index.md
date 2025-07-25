---
title: "KVMD 3.33: New Wi-Fi configuration method"
date: 2021-10-19
slug: kvmd-3-33-new-wifi-configuration-method
description: >
    Starting from today, the old way to configure Wi-Fi using netctl is deprecated
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.33
comments: true
---

Starting from today, the old way to configure Wi-Fi using `netctl` is deprecated. Instead, it is proposed to use a more native way with `systemd-networkd`, which is already used to configure Ethernet.

<!-- more -->

To update:

```console
rw
pacman -Syu
reboot
```

All new OS images will use this feature. In addition, I have prepared documentation for you on how to set up wifi in a new way: https://docs.pikvm.org/wifi

Additionally, **even if you don't use Wi-Fi**, do this:

```console
rw
systemctl disable pikvm-bootconfig
rm /etc/systemd/system/pikvm-bootconfig.service /usr/local/bin/_pikvm-bootconfig.sh
systemctl enable kvmd-bootconfig
reboot
```