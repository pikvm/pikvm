---
title: "Introducing a new tool — `kvmd-edidconf`"
date: 2022-06-11
slug: introducing-new-tool-kvmd-edidconf
description: >
    A new tool will help you configure EDID and provide import/export for EDID modification
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

For the happy owners of V2 and V3, we now offer a new utility, `kvmd-edidconf`. It will help you configure EDID (the display metadata) and provide import/export for EDID modification using advanced editors such as AW EDID Editor.

<!-- more -->

For example, with its help, you can easily change the manufacturer and model of the virtual display without external editor apps, if you want PiKVM to mimic real hardware:

```console
$ kvmd-edidconf --set-mfc-id=LNX --set-monitor-name=PiKVM
```

See the full documentation here: https://docs.pikvm.org/edid.