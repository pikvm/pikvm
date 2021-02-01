# Multiport KVM over IP

There are many ways to do this, but the best and most documented one right now is to use the [ezCoo KVM switch](ezcoo.md).

Also, Pi-KVM can be connected to a multi-port HDMI/USB switch and the switch's buttons can be connected via optocouplers to [the Pi's GPIO to switch channels](gpio.md).

If your KVM switches channels using keyboard shortcuts, there is a chance that it will not be able to work with OTG (v2 platform, see below), since it does not fully implement the USB stack. In this case, you will have to [use an Arduino board](arduino_hid.md) to emulate the keyboard & mouse (Pi-KVM supports this configuration).

# List of tested KVMs
Here the status is:
* ![#00aa00](https://placehold.it/15/00aa00/000000?text=+) - Everything is working as expected. There may be some subtleties.
* ![#ffaa00](https://placehold.it/15/ffaa00/000000?text=+) - The switch does not work with OTG (**v2**) and requires an [Arduino HID](arduino_hid.md) or soldering [GPIO](gpio.md) to switch channels or something like that.
* ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) - The keyboard or mouse does not work at all, the switch loses the image, etc.

| Model | Status | Notes |
|:------|:-------|:------|
| [ezCoo SW41HA HDMI 4x1 switch](https://www.easycoolav.com/products/hdmi20-switch-4x1-with-usb20-kvm-4-port-usbsupport-4k60hz-444-and-hdr-audio-breakout) | ![#00aa00](https://placehold.it/15/00aa00/000000?text=+) | [Using with Pi-KVM](ezcoo.md) |
| [Ali's noname](https://a.aliexpress.com/_BSpS8t) | ![#00aa00](https://placehold.it/15/00aa00/000000?text=+) | [Here the details](https://github.com/pikvm/pikvm/issues/128) |
| [TESmart 8 PORT - HDMI KVM SWITCH](https://buytesmart.com/collections/8-ports) |  ![#00aa00](https://placehold.it/15/00aa00/000000?text=+) | Use OTG with USB 2.0 Hub only, no hotkey support. Switching available with serial or IP-to-serial interface using fixed IP (/31 peer-to-peer addressing supported). [Sample script on GitHub.](https://github.com/bbeaudoin/bash/blob/master/kvmctl) |
