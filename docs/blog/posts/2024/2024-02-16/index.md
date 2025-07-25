---
title: "KVMD 3.305: New option to hide the blue dot"
date: 2024-02-16
slug: kvmd-3-305-new-option-to-hide-the-blue-dot
description: >
    Now you can disable the blue mouse dot, although we do not recommend it
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.305
comments: true
---

Now you can disable the blue mouse dot.

<!-- more -->

![New display orientation options](hide-blue-dot.webp)

But I still don't recommend doing this, because using the blue dot you can not wait for the real cursor. Click events are instantly transmitted to where the blue dot points, not the lagging real cursor.
