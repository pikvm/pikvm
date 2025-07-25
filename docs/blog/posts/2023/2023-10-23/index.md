---
title: "KVMD 3.265: Mouse Jiggler!"
date: 2023-10-23
slug: kvmd-3-265-mouse-jiggler
description: >
    Mouse jiggler will allow you to prevent the monitor from falling asleep if it was turned on
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.265
comments: true
---

This is a feature that many users have been asking for for a long time. So, mouse jiggler will allow you to prevent the monitor from falling asleep if it was turned on.

<!-- more -->

**It performs short mouse movements every minute until you use PiKVM. Works with both mouse modes: absolute and relative**. In addition, being enabled, it does not interfere with normal work with PiKVM: it will only interfere when you are not interacting with a virtual keyboard or mouse. The time of inactivity is counted from your last actions.

To update (see previous post):

```console
curl https://files.pikvm.org/update-os.sh | bash
```

Or ``rw; pacman -Syu; reboot``, if you have already updated the OS using the script earlier.

Howto enable it: https://docs.pikvm.org/mouse_jiggler/