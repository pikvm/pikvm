---
search:
    exclude: true
---


!!! info "USB limitations"

    Each emulated USB device consumes a limited hardware resource called **endpoints**.
    On the default PiKVM, **you can add only one or two of additional USB devices**
    depending of its endpoint requirements.

    [See here](usb.md) to get more information about the endpoints, add devices
    and flexibly manage the configuration on the fly.

    Also note that all USB devices uses [the same USB identifiers](id.md)
    as the keyboard, mouse and other stuff.
    You can change everything together, but not separately.

