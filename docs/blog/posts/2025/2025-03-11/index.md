---
title: "KVMD 4.65: Adopt display identifiers on V4 Plus"
date: 2025-03-11
slug: kvmd-4-65-adopt-display-identifiers-on-v4-plus
description: >
    PiKVM V4 Plus just got a new tool to read and adopt display identifiers like model and serial number from the physical monitor
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.65
comments: true
---

PiKVM V4 Plus just got a new tool to read and adopt display identifiers like model and serial number from the physical monitor.

<!-- more -->

Install the updated OS using pikvm-update, connect the desired display to OUT2 port and use follows:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-display-ids --apply
[root@pikvm ~]# ro
```

V4 will read display identifiers and apply them to own EDID. The target host connected to PiKVM will recognize it as your display.