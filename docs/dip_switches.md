---
title: Configure DIP switches
description: How to configure DIP switches on PiKVM V4 Mini and Plus
---

# Configure DIP switches

PiKVM V4 Mini and Plus have a pair of dual in-line package (DIP) switches on the right side to control low-level settings of the Pi board.

![DIP switches on V4 Plus](v4_dip_switches.png "DIP switches on V4 Plus")

The left switch **[1]**:
: When pulled down (**ON** state), the advanced backpower protection is used. On the default state is **OFF** (up), "diode protection" is used. This is required for debugging at the request of technical support. Under normal conditions, it is not necessary to change the mode.

The right switch **[2]**:
: When pulled down (**ON** state), the Power Delivery chip is activated on the USB OTG port. The default state is **OFF** (up).

To change the position of switches:

1. Turn the PiKVM off.
2. Change the position of the switched.
3. Turn the PiKVM on.

!!! warning
	Do not do that change the state of the DIP switched while the device is turned on. **This may cause irreparable damage.**