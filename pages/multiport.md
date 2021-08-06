# Multiport KVM over IP

There are many ways to do this, but the best and most documented one right now is to use the [ezCoo KVM switch](ezcoo.md).

Also, Pi-KVM can be connected to a multi-port HDMI/USB switch and the switch's buttons can be connected via optocouplers to [the Pi's GPIO to switch channels](gpio.md).

If your KVM switches channels using keyboard shortcuts, there is a chance that it will not be able to work with OTG (v2 platform, see below), since it does not fully implement the USB stack. In this case, you will have to [use an Arduino board](arduino_hid.md) to emulate the keyboard & mouse (Pi-KVM supports this configuration).

❗WARNING:exclamation: - If you choose AiMOS, be aware that it has a back powering issue that you need to use work arounds for. Limitations are are listed below. Also please be aware that Arudino's will not work with the AIMOS KVM's.

# List of tested KVMs
Here the status is:
* ✔ - Everything is working as expected. There may be some subtleties.
* ☹ - The switch does not work with OTG (**v2**) and requires an [Arduino HID](arduino_hid.md) or soldering [GPIO](gpio.md) to switch channels or something like that.
* ✘ - The keyboard or mouse does not work at all, the switch loses the image, etc.

| Model | Status | Notes |
|:------|:-------|:------|
| [ezCoo EZ-SW41HA-KVMU3L 4x1 switch](https://www.easycoolav.com/products/hdmi20-switch-4x1-with-usb30-kvm-3-port-usbsupport-4k60hz-444-and-hdr-audio-breakout-36) ~~[ezCoo SW41HA HDMI 4x1 switch](https://www.easycoolav.com/products/hdmi20-switch-4x1-with-usb20-kvm-4-port-usbsupport-4k60hz-444-and-hdr-audio-breakout)~~ (legacy) | ✔ | [Using with Pi-KVM](ezcoo.md) - 4 Port is the ONLY supported KVM, 2 Port does not work the same and is not supported |
| [Ali's noname](https://a.aliexpress.com/_BSpS8t) | ✔ | Limitations are are listed below  |
| [Aimos 8-port HDMI USB-C KVM Switch](https://www.amazon.de/AIMOS-Umschalter-Tastatur-unterst%C3%BCtzen-verbunden/dp/B08FR5K111/) | ✔ | Similar to Ali's noname model, available in 4/8port editions, has same HDMI bridge boot problem/solution using a Marmitek 312 UHD HDMI splitter. Limitations are are listed below |
| [TESmart 8 PORT - HDMI KVM SWITCH](https://buytesmart.com/collections/8-ports) |  ✔ | Use OTG with USB 2.0 Hub only, no hotkey support. Switching available with serial or IP-to-serial interface using fixed IP (/31 peer-to-peer addressing supported). Can be managed [via WebUI](tesmart.md) or [CLI tool](https://github.com/bbeaudoin/bash/tree/master/tesmart) |

Limitations:

- HDMI backpower solutions:
	- See [here](https://github.com/pikvm/pikvm/issues/128)
	- See [here](https://github.com/pikvm/pikvm/issues/382) - Advanced soldering required
	- [Cheap 13$ HDMI splitter will work](https://www.amazon.com/dp/B07DQBY5TX) OR [this](https://www.amazon.com/gp/product/B08B346353)
	- v3 HAT v3.2 also takes care of the back power issue
- MSD work around (will not work OOB)
	- RPi4 OTG needs to be in the KB port for mouse and KB funtionality, ZeroW is required and needs to be connected to the HUB port for HK switching and MSD functionality - ✔**KNOWN WORKING**✔
	- See [here](https://github.com/pikvm/pikvm/issues/371) - Advanced soldering required - allows use of GPIO menu to change input
	
