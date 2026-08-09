---
search:
    exclude: true
---


!!! info "USB limitations"

    Each emulated USB device consumes a limited hardware resource called **endpoints**.
    On the default PiKVM, **you can add only one or two of additional USB devices**
    depending of its endpoint requirements.

    To get more information about the endpoints, add more devices,
    and flexibly manage the configuration on the fly, see **[here](usb.md)**.
    This also help you if you encounter a compatibility issue
    due to the device being turned on (for example, in UEFI).
