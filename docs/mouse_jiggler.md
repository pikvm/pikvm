---
title: Mouse Jiggler
description: How to configure and use mouse jiggler to simulate the movement of a computer mouse
---

The mouse jiggler is a feature used to simulate the movement of a computer mouse.
It prevents sleep mode, standby mode or the screensaver from activating.
It is very useful when some lengthy process is going on on the target host
(for example, installing software), and the user needs to monitor it with his side vision,
without having to move the mouse manually to avoid the screensaver.


-----
## Using the Jiggler

With a latest PiKVM OS, the jiggler is available in the Web UI:

<img src="mouse_jiggler_menu.png" width="400"/>

If you don't see this switch, please update OS first:

{!_update_os.md!}


-----
## Jiggler settings

This is not required usually, but it is possible to change some of the parameters of the jiggler or disable it completely.

Here are some examples to place it to `/etc/kvmd/override.yaml`.

1. Make the jiggler unavailable in the menu:

    ```yaml
    kvmd:
        hid:
            jiggler:
                enabled: false
    ```

2. Activate it by default after PiKVM reboot:

    ```yaml
    kvmd:
        hid:
            jiggler:
                active: true
    ```


-----
## Description of the algorithm

When the Jiggler is active, PiKVM counts down the time that has elapsed since the last user input:
that is, any action with the keyboard or mouse. If there have been no actions for more than 15 seconds,
the Jiggler performs a mouse movement and waits another 15 seconds until the next iteration.

The Jiggler supports both [mouse modes](mouse.md): absolute and relative.

Movement patterns looks like these:

* **Absolute:** `(+100, +100), wait, (-100, -100), wait...`<br>*The coordinates are converted depending on the screen resolution.*
* **Relative:** `(+10, +10), wait, (-10, -10), wait...`

The Jiggler works on the PiKVM device side, even if the Web UI was closed.

An important feature of the Jiggler is that it does not interfere with normal user work.
If the user is actively interacting with the keyboard and mouse, Jiggler will not introduce its interference
until it notices that the period of inactivity has exceeded the threshold of 15 seconds.
