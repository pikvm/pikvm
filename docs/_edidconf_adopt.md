---
search:
    exclude: true
---

[PiKVM V4 Plus](v4.md) has a simple way to read and adopt display identifiers like model and serial number
from a physical monitor connected to `OUT2` port (it's also used for [HDMI passthrough](pass.md)).
This way, the target host will recognize PiKVM as your display.

To adopt display identifiers, connect the display to `OUT2` port and run these commands:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-display-ids --apply
[root@pikvm ~]# ro
```

Now the display can be unplugged. PiKVM will remember the new settings (in `/etc/kvmd/tc358743-edid.hex`)
and apply them immediately (`--apply option`).
