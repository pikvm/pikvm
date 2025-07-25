---
title: "KVMD 1.83: Security fix for the V2 platform"
date: 2020-07-31
slug: kvmd-1-83-security-fix-for-the-v2-platform
description: >
    KVMD 1.83 released with minor security fix for v2 platform
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.83
comments: true
---

After a little discussion, I decided to disable OTG Serial Console for security reasons.

<!-- more -->

The option `otg.acm.enabled` now is `false` by default. Additionally, the new [OS build environment](https://github.com/pikvm/os) does not perform the steps for setting up the console.

It is important to note that if you set a **strong password** on your Pi-KVM, this problem is not so significant. Attackers will not be able to exploit it from the outside. However, I want to provide the most secure default settings. I'm sorry about this mess. This feature was very useful for development and users of ZeroW devices that don't have Ethernet, but it's not good enough for general installations.

* To disable this feature permanently on older Pi-KVMs, follow the instructions above (the `override.yaml` will not need to be edited after KVMD is updated).

* If you have an old Pi-KVM installation and you want to continue using this feature, use `override.yaml` and set option `otg.acm.enabled` to `true`.

* To enable this feature for the v2 platform again in the build environment, add to the `config.mk` this line: `STAGES ?= __init__ os pikvm-repo watchdog ro no-audit pikvm pikvm-otg-console ssh-keygen __cleanup__`

-----

As a new feature, you can disable VNC TLS if you need compatibility with strange VNC clients. Use `/etc/kvmd/override.yaml` for this (remove {} before):

```yaml
vnc:
    server:
        tls:
            ciphers: ""
```

To update:

```console
rw
pacman -Syu
reboot
```
