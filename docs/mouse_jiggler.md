# Mouse Jiggler

The mouse jiggler is a feature used to simulate the movement of a computer mouse.
It prevents sleep mode, standby mode or the screensaver from activating.
It is very useful when some lengthy process is going on on the target host
(for example, installing software), and the user needs to monitor it with his side vision,
without having to move the mouse manually to avoid the screensaver.


-----
## Enabling the Jiggler
To enable the Jiggler, it is required to allow some config lines to `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    hid:
        jiggler:
            enabled: true
```

... and restart KVMD:

```console
[root@pikvm ~]# systemctl restart kvmd
```

After that, it will be available in the Web UI for activation:

<img src="mouse_jiggler_menu.png" width="400"/>


-----
## Description of the algorithm

When the Jiggler is active, PiKVM counts down the time that has elapsed since the last user input:
that is, any action with the keyboard or mouse. If there have been no actions for more than **60 seconds**,
the Jiggler performs a mouse movement and waits another 60 seconds until the next iteration.

The Jiggler supports both [mouse modes](mouse.md): absolute and relative.

**Movement patterns are deterministic:**

* **Absolute:** `(-100, -100), wait, (100, 100), wait...`<br>*The coordinates are converted depending on the screen resolution.*
* **Relative:** `(-10, -10), wait, (10, 10), wait...`

The Jiggler works on the PiKVM device side, even if the Web UI was closed.

An important feature of the Jiggler is that it does not interfere with normal user work.
If the user is actively interacting with the keyboard and mouse, Jiggler will not introduce its interference
until it notices that the period of inactivity has exceeded the threshold of 60 seconds.
