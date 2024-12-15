# PiKVM Switch Multiport Extender

<img src="switch.png" width="400" />

* [PiKVM Switch Multiport Extender](switch_datasheet.pdf)

The PiKVM Switch Multiport Extender enables one PiKVM device to view and control multiple target
computers connected to each port. Target computers are viewed using HDMI video capture and then
controlled via USB and ATX connections. Up to five Switch Multiport Extenders can be daisy-chained
for a total of 20 ports. This is the maximum number of target computers that can be controlled by
each supported PiKVM device.

Thanks to the modularity of PiKVM and the new Switch, you can build up your infrastructure gradually,
adding new switches as needed, without replacing KVM entirely.

One target system at a time can be selected for HDMI video capture and USB control. ATX statuses
and controls are available for all connected targets simultaneously. Video inputs include dedicated
EDID (HDMI information and display parameters) and full control of the video connection state of
each port.

The PiKVM Switch is fully plug-and-play.

It is compatible with [PiKVM V4 Plus](v4.md), [PiKVM V3](v3.md), [DIY V2](v2.md) and [DIY V1](v1.md) devices.

Please note that it's not compatible with PiKVM V4 Mini and DIY devices based on Raspberry Pi Zero boards
because of the lack of available USB host ports.


-----
## Installation requirements

* Head device: [PiKVM V4 Plus](v4.md) (recommended) or any other PiKVM except V4 Mini and Zero-based DIY.

* The PiKVM Switch box include:
    * Switch device
    * Power supply unit
    * DC Barrel Jack Cable
    * HDMI 2.0 Cable
    * USB-A Male To USB-C Female Adapter
    * *x2* USB Cable, USB-C Male
    * *x4* ATX kit with brackets and wires

* Some cables are not included in the kit, required to connect each target host port:
    * HDMI 2.0 cable (no shorter than 30 centimeters).
    * USB-A to USB-C cable
    * <a target="_blank" href="../atx_board/straight.png">Straight Ethernet cable</a> for ATX connection.


-----
## Setup

1. Turn off the head PiKVM device.

2. Unpack the box. Turn Switch in your hands and study the purpose of the ports. Gently stroke it on the top cover.

    * The **numbered ports** on the front can be used to connect to the target hosts.
    * **UPLINK** ports should be connected to PiKVM or to the superior chained Switch.
    * **DOWNLINK** ports should be connected to a lower-level Switch.

3. Connect Switch to PiKVM according the following diagram.
    The example of a connection with [PiKVM V4 Plus](v4.md), similar should be made for any supported model.

    <img src="conn_kvm_to_switch.png">

    * **(1)** OTG connection for USB emulation (using Type-C cable).
    * **(2)** Video (using HDMI cable).
    * **(3)** USB control connection (using Type-C cable and included C-to-A adapter).
    * **(4)** Optional power chaining. If you're using [PiKVM V4 Plus](v4.md),
        both PiKVM and Switch can be powered from a single 12V power supply.
        Use the supplied two-way power cable to connect the PiKVM and Switch.
    * **(5)** Connect the supplied 12V power supply here.

    !!! warning "Double power supply is not allowed"

        * When power chaining (4), never use your own 5V power port on the PiKVM V4.

        * The two 12V connectors on the Switch are designed for chaining only. Never connect two power supplies to your Switch.

    If you want to connect multiple switches in chain, use the following diagram.
    Two connected switches can be considered as a single device, and the left group of **UPLINK** ports can be used
    in a similar way: either connect it to PiKVM as in the previous step, or connect another Switch to.

    <img src="conn_switch_to_switch.png">

    !!! info "Chaining limit"

        It is allowed to connect no more than 5 switches in a chain.

5. Connect the target hosts to the numbered ports on the front panel of Switch.

    * HDMI for a video (don't use a cable shorter than 50 centimeters).
    * USB-C for USB emulation.
    * Optional [ATX](atx_board.md) for power management of the host.

6. PiKVM Switch is a true Plug-n-Play device, so you don't need to write any complex configs.
    Turn on PiKVM device and update the OS to get Switch drivers. Wait for reboot:

    {!_update_os.md!}


-----
## Known issues and limitations

* No issues found yet.
