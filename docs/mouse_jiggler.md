# Mouse Jiggler

The mouse jiggler is a feature used to simulate the movement of a computer mouse.
It prevents sleep mode, standby mode or the screensaver from activating.
It is very useful when some lengthy process is going on on the target host
(for example, installing software), and the user needs to monitor it with his side vision,
without having to move the mouse manually to avoid the screensaver.

To enable the Jiggler, it is enough to activate the switch in the Web UI:

<img src="mouse_jiggler_menu.png" width="400"/>


-----
## Description of the algorithm

If the Jiggler is enabled, then PiKVM counts down the time that has elapsed since the last user input:
that is, any action with the keyboard or mouse. If there have been no actions for more than **60 seconds**,
the Jiggler performs a mouse movement and waits another 60 seconds until the next iteration.

The Jiggler supports both [mouse modes](mouse.md): absolute and relative.

**Movement patterns are deterministic:**

* **Absolute:** `(-100, -100), wait, (100, 100), wait...`<br>*The coordinates are converted depending on the screen resolution.*
* **Relative:** `(-10, -10), wait, (10, 10), wait...`.

The Jiggler works on the PiKVM side, even if the web interface was closed.

An important feature of the Jigger is that it does not interfere with normal user work.
If the user is actively interacting with the keyboard and mouse, Jiggler will not introduce its interference
until it notices that the period of inactivity has exceeded the threshold of 60 seconds.


-----
## Disabling the Jiggler

If PiKVM is used in a corporate network, an administrator who considers it undesirable to use the Jiggler by users,
the PiKVM admin can disable this feature completely. This can be done by adding the following lines to `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    hid:
        jiggler:
            enabled: false
```

Restart KVMD is required:

```console
[root@pikvm ~]# systemctl restart kvmd
```
