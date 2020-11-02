# Multiport KVM over IP

There are many ways to do this, but the best and most documented one right now is to use the [ezCoo KVM switch](ezcoo.md).

ALso Pi-KVM can be connected to a multi-port HDMI/USB switch and the switch's buttons can be connected via optocouplers to [the Pi's GPIO to switch channels](gpio.md).

If your KVM switches channels using keyboard shortcuts, there is a chance that it will not be able to work with OTG (v2 platform, see bellow), since it does not fully implement the USB stack. In this case, you will have to [use an Arduino board](arduino_hid.md) to emulate the keyboard & mouse (Pi-KVM supports this configuration)
