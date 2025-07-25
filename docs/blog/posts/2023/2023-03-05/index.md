---
title: "KVMD 3.203: Changes in MSD"
date: 2023-03-05
slug: kvmd-3-203-changes-in-msd
description: >
    The internal structure of the MSD image storage has changed
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/kvmd/releases/tag/v3.203
comments: true
---

This is an infrastructure release. The internal structure of the MSD image storage has changed.

<!-- more -->

Metadata and image directories have been merged into one:

Old:

```
/var/lib/kvmd/msd/images/foobar.iso
/var/lib/kvmd/msd/meta/foobar.iso.complete
```

New:

```
/var/lib/kvmd/msd/foobar.iso
/var/lib/kvmd/msd/.__foobar.iso.complete
```

If you use a standard configuration (or even MSD on a separate flash drive), the migration will be seamless for you. All you need is just to update and reboot, the files will be moved automatically. The change was needed for future MSD-over-network support.

To update:

```console
rw
pacman -Syu
reboot
```
