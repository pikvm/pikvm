---
title: "Automatic snapshots"
description: How to make automatic timer-based snapshots in your PiKVM
---

You can configure PiKVM to automatically take screenshots of the server screen and save them into the memory, so that you retrieve it with the HTTP API.

## Enabling snapshots

Automatic snapshots are disabled by default, you need to enable and configure this feature. Switch to the read-write mode (`rw`), then open `/etc/kvmd/override.yaml` and add the following lines:

```yaml
kvmd:
    snapshot:
        idle_interval: 3600
        live_interval: 60
        wakeup_key: ShiftLeft
        wakeup_move: 1000
```

Here is what these parameters do:

- `idle_interval=3600` means that every hour the PiKVM must turn on the streamer, take a screenshot, and save it, if there are no users on the PiKVM.
- `live_interval=60` means that KVM must take a screenshot every minute as long as there are users working on the PiKVM.
- `wakeup_key=ShiftLeft` means that if there are no users on KVM, before taking a screenshot, KVM must wake up the server so that it turns on the "screen" from power-saving mode. To do this, it clicks and releases the left shift, simulating the user's actions.
- `wakeup_move=1000` is another simulator of user actions. It moves the mouse to the position 0x0, and then to 1000x1000 (units, not pixels, but it doesn't matter, just write a large number), and then returns it back.

Although the last two options work, PiKVM may not know if you are using the server to bypass it with a monitor and keyboard, and PiKVM input may be mix with your own. So if the PiKVM is not the only way to work with the server, we recommend not using the wakeup options. INstead, disable the power saving mode for HDMI.

## Retrieving snapshots

As soon as you have snapshots, you can retrieve them from the PiKVM using Streamer API as follows:

```console
$ curl -k \
    -u admin:admin \
    'https://<pikvm-ip>/api/streamer/snapshot?load=1' \
    --output=file.jpg
```

You can also ask PiKVM to give you a small preview of the screenshot:

```console
$ curl -k \
    -u admin:admin \
    'https://<pikvm-ip>/api/streamer/snapshot?load=1&preview=1' \
    --output=preview.jpg
```

Additional parameters can be used to configure the preview: `preview_max_width=100`, `preview_max_height=100`, `preview_quality=75`. 