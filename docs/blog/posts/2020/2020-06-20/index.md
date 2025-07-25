---
title: "KVMD 1.71: Improved IPMI server"
date: 2020-06-20
slug: kvmd-1-71-vnc-improvements
description: >
    The new version comes with support for ipmi health
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.71
comments: true
---

The new version comes with two improvements.

<!-- more -->

First off, we improved the IPMI server. The `ipmiutil health` command is now supported.

Secondly, in the web interface, you can now record a macro of your keyboard and mouse actions on the server, save it, and play it back.

This is convenient if you need to perform a sequence of similar actions. The downloaded macro has a convenient json format, so you can independently write scripts with macros in any convenient language to play them remotely.

For example, [this](https://gist.github.com/mdevaev/4266ec6c8911482d45b40a228ad94083) is a Python script that plays a macro on the specified PiKVM.