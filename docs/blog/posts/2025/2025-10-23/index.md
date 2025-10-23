---
title: "KVMD 4.107: Configuration changes"
date: 2025-10-23
slug: kvmd-4-107-configuration-changes
description: >
    The number of users is shown and the brightness is reduced if there is at least one to prolong the life of the screen
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.107
comments: true
---

We have revamped the configuration system. If PiKVM customization concerns you, read on.

<!-- more -->

Here are the main changes:

- We have moved `/etc/kvmd/main.yaml` to `/usr/lib/kvmd/`, because it's a platform config that should never be changed.

- We have deprecated and removed `/etc/kvmd/logging.yaml`. It contained some Python-specific logging settings that no one had ever changed. Getting rid of this artifact will simplify the configuration structure for some future improvements.

- We have deprecated `/etc/kvmd/auth.yaml`. This is a legacy auth configuration that existed before `/etc/kvmd/override.yaml` was introduced, and has never been suggested for use even in the documentation. If you have ever customized your PiKVM with `auth.yaml` (likely not), your changes will be carefully moved to `/etc/kvmd/override.d/...`, and the source file is `auth.yaml` should be deleted manually. Please [see here](https://docs.pikvm.org/config/#legacy-notes) for details.

- The `!include` directive in `/etc/kvmd/override*` and `/etc/kvmd/meta.yaml` configs is now deprecated and removed. Instead, you can place your partial config files into the `/etc/kvmd/override.d` directory, which is described in the documentation. Automatic migration is not possible here, and if you used `!include` for some reason, `pikvm-update` will tell you to remove this from the configuration before updating.

Please note that if you stored all the configs only in `override.d` and `override.yaml` and did not use `!include`, the migration will be transparent for you.