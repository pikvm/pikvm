---
title: "KVMD 3.116: Let's Encrypt certificates"
date: 2022-06-24
slug: kvmd-3-116-lets-encrypt-certificates
description: >
    Now you can easily install Let's Encrypt certificates on your PiKVM
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.116
comments: true
---

Usually Let's Encrypt certificates are issued and updated automatically using Certbot, however, since PiKVM uses a read-only file system, special tools around Certbot are required to work with certificates.

<!-- more -->

Now you can use it out of box. PiKVM will ensure that they are automatically renewed without affecting the root file system. Check out the documentation: https://docs.pikvm.org/letsencrypt/.

Here is what we recently changed to allow for this.

As you know, the file system uses read-only mode by default. However, sometimes user scripts (updating some certificates, keys, or something else) need to save some data to the memory card.

New versions of PiKVM after 20 June 2022 provide a small 256 Mb storage partition for this and a convenient tools of automatically managing it. The storage will always be in read-only mode, and will be writable only if requested. This is super handy if you want to make a cron job or a systemd timer. For details, please see here: https://docs.pikvm.org/pst/.