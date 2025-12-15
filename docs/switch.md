---
title: PiKVM Switch Multiport Extender Quickstart Guide
description: "How to get started with PiKVM Switch Multiport Extender"
---

# PiKVM Switch Multiport Extender

!!! info "Where to buy?"

    * [International store](https://shop.hipi.io/product/pikvm-switch-multiport-extender).
    * [Canadian store](https://www.pishop.ca/product/pikvm-switch-multiport-extender/).
    * EU is coming!

![PiKVM Switch](switch.png){ width="400" }

[PiKVM Switch Datasheet (PDF)](switch_datasheet.pdf){ .md-button }

The PiKVM Switch Multiport Extender enables one PiKVM device to view and control multiple target
computers connected to each port. Target computers are viewed using HDMI video capture and then
controlled via USB and ATX connections. Up to five Switch Multiport Extenders can be daisy-chained
for a total of 20 ports. This is the maximum number of target computers that can be controlled by
each supported PiKVM device.

Thanks to the modularity of PiKVM and the new Switch, you can build up your infrastructure gradually,
adding new Switches as needed, without replacing the KVM entirely.

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

* The PiKVM Switch box includes:
    * Switch device
    * Power supply unit
    * DC Barrel Jack Cable
    * HDMI 2.0 Cable
    * USB-A Male To USB-C Female Adapter
    * *2x* USB Cable, USB-C Male
    * *4x* ATX kit with brackets and wires

* Some cables are not included in the kit, but are required to connect each target host port:
    * HDMI 2.0 cable (no shorter than 30 centimeters).
    * USB-A to USB-C cable
    * <a target="_blank" href="../atx_board/straight.png">Straight Ethernet cable</a> for ATX connection.


-----
## Setup

1. Turn off the head PiKVM device.

2. Unpack the box. Turn Switch in your hands and study the purpose of the ports.
    Lovingly pat the top cover to show it that you want to be friends.

    * The **numbered ports** on the front can be used to connect to the target hosts.
    * **UPLINK** ports should be connected to PiKVM or to the superior chained Switch.
    * **DOWNLINK** ports should be connected to a lower-level Switch.

3. Connect Switch to PiKVM according to the following diagram.
    Example connections with [PiKVM V4 Plus](v4.md) are shown,
    but similar connections can be made for any supported model.

    <img src="conn_kvm_to_switch.png" height=500>

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

    If you want to connect multiple Switches in a chain, use the following diagram.
    Two connected units can be considered as a single device, and the left group of **UPLINK** ports areused
    in a similar way: either connect it to a PiKVM as in the previous step, or connect to another Switch to.

    <img src="conn_switch_to_switch.png">

    !!! info "Chaining limit"

        A maximum of 5 Switch units can be connected in a chain.

5. Connect the target hosts to the numbered ports on the front panel of Switch.

    * HDMI for a video (don't use a cable shorter than 50 centimeters).
    * USB-C for USB emulation.
    * Optional [ATX](atx_board.md) for power management of the host.

6. PiKVM Switch is a Plug-n-Play device, so you don't need to write any complex configs.
    All you need is a fresh PiKVM OS and drivers that can be obtained by updating.

    !!! note "Check the OS image"

        To store the settings, Switch uses the [Persistent Storage](pst.md) feature,
        which is presented in images older than **2022.06.20**. To check if your
        PiKVM OS supports this, use the following command:

        ```console
        [root@pikvm ~]# mount | grep '\<pst\>'
        /dev/mmcblk0p2 on /var/lib/kvmd/pst type ext4 (ro,nosuid,nodev,noexec,relatime,errors=remount-ro)
        ```

        If the output is similar to the above (`/var/lib/kvmd/pst`), then everything is fine.
        Otherwise on empty output, you need to [reflash the OS](flashing_os.md).

    Do the update anyway (even if you did reflashing):

    {!_update_os.md!}

7. It's done! PiKVM will automatically configure all your Switches.


-----
## Working with the Switch

All the functions of the Switch are available through the menu, which you will see in the PiKVM interface.
The attached example uses two Switches, and switching between their ports works transparently.

!!! info

    You can connect your keyboard and mouse directly to PiKVM V3 or V4 Plus, then PiKVM will transmit
    all input events to the selected port. You can also switch ports using hotkeys.

    [USB Keyboard/Mouse passthrough](usb_pass.md)

<img src="ui_menu.png" width=500 />

* The menu title shows the current active port (**1.4**) in **unit.port** format,
    and the status of the ATX power and HDD LEDs for its host.

* **(1)** The **Settings** button shows the common chain settings window (see below).

* **(2)** The ports are grouped by physical units, the sub-header of the table shows
    the unit 1 and the ports following it: 1.1, 1.2, 1.3 and 1.4.

* **(3)** Beacon activation buttons for the **UPLINK** and **DOWNLINK** ports on the back of the Switch unit 1.
    When activated, the corresponding multifunction LED on the back of the Switch will start flashing
    to make it easier to find its connectors. This is especially useful if you have several Switches in a chain.

* **(4)** The port switching button. The green color indicates the current active port.

* **(5)** A button for configuring individual port parameters such as name, EDID, and more.

* **(6)** The beacon activation button for the selected port activates the flashing LED
    on the numbered group of connectors on the front of the Switch unit.

    There are four indicators to the right: host video detected, USB detected,
    ATX power and HDD LEDs. Next, three ATX action buttons.

* **(7)** The title of the sub-table of the Switch unit 2. The units are numbered according to the closeness
    to PiKVM device: Switch number 1 is connected directly to PiKVM, unit 2 is connected to downlink of unit 1.

In the settings menu, you can access the EDIDs Collection and customize the color scheme of the Switch LEDs.


#### Chain settings

In the settings menu, you can access the EDIDs Collection and customize the color scheme of the Switch LEDs.

Each port can use its own EDID which must be preloaded into the Collection, otherwise it will use
the default EDID (taken from PiKVM). Binary and text [EDID in HEX format](edid.md) are supported.

| EDIDs Collection | Color scheme |
|------------------|--------------|
| <img src="ui_settings_edid.png" width=300 /> | <img src="ui_settings_colors.png" width=300 /> |


#### Port settings

<img src="ui_port.png" width=300 />

In the port settings, you can set the display name (can be used for the name of the connected host)
and the individual EDID from the Collection.

Other parameters relate to the ATX intervals for pressing the power and reset buttons of the target host.


-----
## Firmware updating

Sometimes we release firmware updates for the Switch, which are distributed along with PiKVM OS updates.
When the software detects that your switch has an old firmware, it will inform you about it via
the web interface. After that, you will be able update the Switch.

If you have several switches in the chain, then all devices will be updated: first, PiKVM uploads the update
to the first switch, then it updates the next one, and so on.
This is very convenient because you don't have to perform complex manual manipulations to maintain your equipment.
The Switches are intelligent and save you time.

!!! warning

    We recommend updating the firmware only if you have physical access to the hardware.

    Switches are extremely difficult to brick, but if there is a power failure during updating,
    you will need physical access to restore the device. So don't worry, it can't be bricked forever.

    It is also recommended to perform all the operations described below via SSH, and not via a web terminal.

### Performing update

Just run these commands via SSH under root:

```console
[root@pikvm ~]# cd /usr/share/kvmd/switch
[root@pikvm switch]# systemctl stop kvmd   # This will stop the KVM web service
[root@pikvm switch]# make install          # Flash the first switch
[root@pikvm switch]# systemctl start kvmd  # Start it again
```

The switches will show the progress of the update on the front LEDs and will gradually return to service.


-----
## Known issues

??? info "A DIY PiKVM device based on HDMI-CSI board does not receive a video through the Switch"

    Some HDMI-CSI boards does not follow the HDMI specification correctly.
    We have provided a special compatibility mode for them,
    which should be enabled using the following configuration:

    1. Switch filesystem to RW-mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Add some lines to `/etc/kvmd/override.yaml`:

        ```yaml
        kvmd:
            switch:
                ignore_hpd_on_top: true
        ```

    3. Restart KVMD:

        ```yaml
        [root@pikvm ~]# systemctl restart kvmd
        ```

    4. Switch filesystem back to RO-mode:

        ```console
        [root@pikvm ~]# ro
        ```
