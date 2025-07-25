---
title: "KVMD 2.3: Workaround for dhcpcd crashes"
date: 2020-10-31
slug: kvmd-2-3-workaround-for-dhcpd-crashes
description: >
    A problem was found in the distro due to which the new dhcpcd (client) crashes when trying to get a Wi-Fi address
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.3
comments: true
---

A problem was found in the distro due to which the new dhcpcd (client) crashes when trying to get a Wi-Fi address (it's not me!).

<!-- more -->

So that you don't get a broken KVM after random update, in this release I forced the use of dhclient instead of dhcpcd. You should not notice any changes or problems. If there is anything strange, please let me know.

Now about pleasant things.

* Added support for IPMI Serial-over-LAN. Now you can use ipmitool to access your server's console on the hardware COM port, [see here](https://docs.pikvm.org/ipmi/) for information.

* Added the ability to edit streamer options without having to copy the entire list to /etc/kvmd/override.yaml. Now you can write something like:

```yaml
kvmd:
    streamer:
        cmd_append: [--slowdown]
```

The other features I'm currently working on are in experimental mode. Due to the urgency of the release, I didn't have time to finish it. But I will soon :)