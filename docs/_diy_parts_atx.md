---
search:
    exclude: true
---


With this part, you will be able to remotely turn on, turn off and restart your computer!

* *x4* MOSFET relays [OMRON G3VM-61A1](https://www.digikey.com/products/en?keywords=G3VM-61A1)
  or [OMRON G3VM-61AY1](https://www.digikey.com/products/en?keywords=G3VM-61AY1).<br>
  *Don't use random relay modules or random optocouplers! Some of these may not be sensitive enough
  for the Raspberry Pi, some others may be low-level controlled. Either use relays that are activated by a high logic level,
  or follow the design provided and buy an OMRON. See details [here](https://github.com/pikvm/pikvm/issues/13).*
* *x4* 390 Ohm resistors (see [here](https://github.com/pikvm/pikvm/issues/46) for alternatives).
* *2x* 4.7 kOhm resistors.
* *x10+* dupont wires male-male.
* *x1* a breadboard.
* *various* wires for the breadboard.

This can be partially replaced by using [Wake-on-LAN](wol.md) in the software, but it will not allow
to reboot a hung system, and it is not as reliable as an ATX controller. Sometimes the Wake-on-LAN
on the host just stops working, for its own or network reasons.
