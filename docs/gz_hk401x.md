# GZVich 4-port HDMI USB KVM Switch

<img src="kvm_switch.avif" alt="" width="300"/>

This KVM seems only selling in China (On [Taobao](https://item.taobao.com/item.htm?id=608572288478) and [JD](https://item.jd.com/61870996709.html)). It can control by the buttons on panel, by remote control (IR or RF), and a RS232 port in a 3.5mm headphone Jack

!!! warning
    Audio was not tested, it is assumed to be non-functional


## Connections

1. Make a custom RS232 cable with a 3.5mm headphone jack. See the pin definition at below table

    | Pin | Definition (From host prospective) |
    | ---| ---|
    | Top | RX |
    | Middle | TX |
    | Bottom | GND |


2. Connect the HDMI out from the KVM switch to the Raspberry Pi CSI-2 to HDMI input.

3. Connect host USB and HDMI cables from the KVM switch to the machines to be managed per the switch instructions.

4. Connect the RS232 port to Raspberry Pi via USB to serial bridge or TTL to RS232 Converter


## Serial port control protocol

 !!! info
    This KVM switch does not have serial command to query active port. Also, it does not send notify message to serial when switching port by using panel button or IR remote. So the LED in Web UI will not sync if the port was switched in these 2 ways.

|Action|Command|
|---|---|
|Switch to port 1|0xfe 0x00 0x33 0x31 0xaa|
|Switch to port 2|0xfe 0x00 0x33 0x32 0xaa|
|Switch to port 3|0xfe 0x00 0x33 0x33 0xaa|
|Switch to port 4|0xfe 0x00 0x33 0x34 0xaa|



## Adding UI elements to control the KVM switch

The UI can be updated to add buttons to switch between KVM inputs and indicators for which input is currently selected.  The instructions below will make these available in the PiKVM UI after clicking the "GPIO" menu button in the KVM view.

1. SSH into PiKVM

2. Enable read-write mode on the sd card via `rw`

3. Edit the `/etc/kvmd/override.yaml` file and include the following. 

   | Method   | Device         |
   |----------|----------------|
   | USB to RS232 Bridge   | `/dev/ttyUSB0` |
   | TTL to RS232 Converter | `/dev/ttyAMA0` |

   ```yaml
   kvmd:
       gpio:
           drivers:
               hk:
                   type: gz_hk401x
                   device: /dev/ttyUSB0
           scheme:
               ch0_led:
                   driver: hk
                   pin: 0
                   mode: input
               ch1_led:
                   driver: hk
                   pin: 1
                   mode: input
               ch2_led:
                   driver: hk
                   pin: 2
                   mode: input
               ch3_led:
                   driver: hk
                   pin: 3
                   mode: input
               ch0_button:
                   driver: hk
                   pin: 0
                   mode: output
                   switch: false
               ch1_button:
                   driver: hk
                   pin: 1
                   mode: output
                   switch: false
               ch2_button:
                   driver: hk
                   pin: 2
                   mode: output
                   switch: false
               ch3_button:
                   driver: hk
                   pin: 3
                   mode: output
                   switch: false
           view:
               table:
                   - ["#Input 1", ch0_led, ch0_button]
                   - ["#Input 2", ch1_led, ch1_button]
                   - ["#Input 3", ch2_led, ch2_button]
                   - ["#Input 4", ch3_led, ch3_button]
   ```

4. Return to read-only mode for the sd card via `ro`

5. Restart the kvmd service: `systemctl restart kvmd`


## Switching between hosts in the UI

To switch between hosts, enter the KVM UI and click the "GPIO" menu. You should see 4 inputs, one of which will have a green circle indicating it is currently selected. Click the other inputs to change the selected host.


## Regarding HDMI Backpower

This KVM switch have the HDMI backpower issue. You can use either the solutions in [Multiport KVM over IP](https://docs.pikvm.org/multiport/). Or use the below solution (Need a hot air rework station).

1. Remove the diode marked below.
<img src="remove_diode.png" alt="" width="600"/>

2. Use USB to DC Cable to power the KVM switch by using the USB port on the Pi


