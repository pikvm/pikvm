---
title: "KVMD 3.301: Generated Nginx configs"
date: 2024-02-03
slug: kvmd-3-301-generated-nginx-configs
description: >
    Starting from this version, the /etc/kvmd/nginx.conf config will be replaced
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.301
comments: true
---

Starting from this version, the `/etc/kvmd/nginx.conf` config will be replaced with the `/etc/kvmd/nginx.conf.mako` template, which will be rendered to `/run/kvmd/nginx.conf` taking into account the `/etc/kvmd/override.yaml` parameters and network configurations.

<!-- more -->

This will make it very easy to turn off IPv6, HTTPS on and off and change ports using the standard override mechanism, like this:

```yaml
nginx:
    https:
        enabled: false
```

If you had any changes in nginx.conf (for example, you previously disabled HTTPS manually), your Nginx configuration will roll back to the default, and HTTPS will be enabled again. To disable it, use the snippet above.

This will not affect the settings of certificates and Letsencrypt, nothing will break here. If you have not changed Nginx configs, you have nothing to worry about at all and the migration will be seamless.

To update:

```console
$ curl https://files.pikvm.org/update-os.sh | bash
```
