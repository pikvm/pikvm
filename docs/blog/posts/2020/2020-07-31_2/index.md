---
title: "Security note for v2"
date: 2020-07-31
slug: security-note-for-v2
description: >
    After installation, Pi-KVM will be available via USB OTG from the managed server via the virtual serial console port
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

After installation, Pi-KVM will be available via USB OTG from the managed server via the virtual serial console port.

<!-- more -->

This is very helpful if SSH is unavailable (and you don't have a UART cable), so you can login to the device using something like mingetty or PuTTY and find out what's wrong. The login is protected by the same password that is used for the root login. In some cases (if different networks are used for servers and KVM for security reasons), you may want to disable this feature. To do this:

* Run rw.
* Edit file /etc/securetty and remove line ttyGS0.
* Edit file /etc/kvmd/override.yaml and add these lines (remove {} before):

```yaml
otg:
    acm:
        enabled: false
```

* Run:

```console
[root@pikvm ~]# systemctl enable getty@ttyGS0.service
[root@pikvm ~]# rm -rf /etc/systemd/system/getty@ttyGS0.service.d
[root@pikvm ~]# reboot
```

This setting is enabled by default so that you are not left alone with an unmanaged device if it does not receive an address on the network for some reason—for example, if you choose a Wi-Fi connection.

If you have a reasonable argument for disabling default, I will be happy to hear it. 