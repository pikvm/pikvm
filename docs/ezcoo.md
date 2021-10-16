# ezCoo managed multiport KVM switch

The ezCoo managed switch can be controlled by PiKVM to allow it to connect to multiple hosts. A typical scenario is a single PiKVM device which can control and switch between multiple hosts or servers using the ezCoo switch. UI elements can be added to the [GPIO dropdown](gpio.md) to allow switching between hosts from the PiKVM webpage. The instructions here were tested with the ~~[ezCoo SW41HA HDMI 4x1 switch](https://www.easycoolav.com/products/hdmi20-switch-4x1-with-usb20-kvm-4-port-usbsupport-4k60hz-444-and-hdr-audio-breakout)~~ [ezCoo EZ-SW41HA-KVMU3L 4x1 switch](https://www.easycoolav.com/products/hdmi20-switch-4x1-with-usb30-kvm-3-port-usbsupport-4k60hz-444-and-hdr-audio-breakout-36). Both older USB2.0 and newer USB3.0 variants are supported. The following was testing on a Raspberry Pi 4 but should also work on the Pi 2 and 3. This document was createdy using the contributions from multiple users in our [Discord](https://discord.gg/bpmXfz5) and the author appreciates their efforts.

!!! info
    While most images of the switch do not show the sides, there is a Micro USB port on the side of the ezCoo switch. This is the management port, which is controlled via COM port on the ezCoo KVM. When plugged into the Raspberry Pi, it appears as `/dev/ttyUSB0`.

!!! info
    Audio was not tested, it is assumed to be non-functional.


## Connections

From a high level, the ezCoo switch uses standard connections to the host machines (USB-A to USB-B and HDMI). The Raspberry Pi OTG connector (the one coming from the USB-C port on a Pi 4 via the custom splitter cable or device) should be connected to the USB 3 port on the ezCoo switch. There is an additional USB cable connected to the managed port on the switch.

1. Connect the USB-A cable from the Raspberry Pi OTG port to ezCoo switch USB 3 port on the front of the switch. **Note**: If this cable is connected to the keyboard port of the ezCoo switch the mouse will not be present.

2. Connect the HDMI out from the ezCoo switch to the Raspberry Pi CSI-2 to HMDI input. Other users have reported HMDI encoder USB dongles as working.

3. Connect a USB-A to Micro USB cable from the Raspberry Pi to the management port on the side of the ezCoo switch.

4. Connect host USB and HDMI cables from the ezCoo switch to the machines to be managed per the switch instructions.

5. At this point the KVM switch should be present as a device on the PiKVM. SSH into PiKVM and ensure a device like `/dev/ttyUSB0` is present. The following instructions assume this is the KVM switch.

!!! info
    There is a limitation in the underlying PiKVM software related to plugging video cables from a host which is already powered and connected to a monitor to a Raspberry Pi CSI2-HDMI encoder. These limitations apply equally when using the ezCoo KVM switch. If video is not present in PiKVM, try keeping all host machines off and connecting them directly to the ezCoo switch before powering the hosts on.


## Adding UI elements to control the KVM switch

The UI can be updated to add buttons to switch between KVM inputs and indicators for which input is currently selected.  The instructions below will make these available in the PiKVM UI after clicking the "GPIO" menu button in the KVM view.

1. Enable read-write mode on the SD card via `rw`

2. Edit the file: `nano /etc/kvmd/override.yaml` and include the following. Note the assumption that the KVM switch is present on `/dev/ttyUSB0`:

    ```yaml
    kvmd:
        gpio:
            drivers:
                ez:
                    type: ezcoo
                    device: /dev/ttyUSB0
            scheme:
                ch0_led:
                    driver: ez
                    pin: 0
                    mode: input
                ch1_led:
                    driver: ez
                    pin: 1
                    mode: input
                ch2_led:
                    driver: ez
                    pin: 2
                    mode: input
                ch3_led:
                    driver: ez
                    pin: 3
                    mode: input
                ch0_button:
                    driver: ez
                    pin: 0
                    mode: output
                    switch: false
                ch1_button:
                    driver: ez
                    pin: 1
                    mode: output
                    switch: false
                ch2_button:
                    driver: ez
                    pin: 2
                    mode: output
                    switch: false
                ch3_button:
                    driver: ez
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

    Make sure to notate the spacing for each line, needs to be a total of 4 spaces:

    ```
    For example:
        parent: 0 spaces (kvmd:)
        child: 4 spaces (gpio:)
        sub-child: 8 spaces (drivers:)
        sub-sub-child: 16 spaces (ez:)
    ```

3. Return to read-only mode for the sd card via `ro`.

4. Restart the kvmd service: `systemctl restart kvmd`.

5. If you are still not getting KB output, issue a `ls -la /dev/tty* | grep USB` , if no output change cables (Alot of cables are power only)


## Switching between hosts in the UI

To switch between hosts, enter the KVM UI and click the "GPIO" menu.  You should see 4 inputs, one of which will have a green circle indicating it is currently selected.  Click the other inputs to change the selected host.


## Additional step for the USB 3.0 version

Please add `protocol: 2` to the override.yaml under the `type: ezcoo` at the same level:

```yaml
kvmd:
    gpio:
        drivers:
            ez:
                type: ezcoo
                protocol: 2
                device: /dev/ttyUSB0
```


## Developer info
* [The official protocol version 1 reference](ezcoo1.docx)
* ??? example "Differences between protocols 1 and 2"
    ```
    ===============================================================================================================================
    =********************************************************Systems HELP*********************************************************=
    =-----------------------------------------------------------------------------------------------------------------------------=
    =                        System Address = 00           F/W Version : 1.20                                                     =
    =   Azz                           :  All Commands start by Prefix System Address zz, if [01-99]                               =
    =-----------------------------------------------------------------------------------------------------------------------------=
    =   EZH                           : Help                                                                                      =
    =   EZSTA                         : Show Global System Status                                                                 =
    =   EZS RST                       : Reset to Factory Defaults                                                                 =
    =   EZS ADDR xx                   : Set System Address to xx {xx=[00~99](00=Single)}                                          =
    =   EZS CAS EN/DIS                : Set Cascade Mode Enable/Disable                                                           =
    =   EZS OUTx VS INy               : Set Output x To Input y{x=[0~2](0=ALL), y=[1~4]}                                          =
    =   EZS IR SYS xx.yy              : Set IR Custom Code{xx=[00-FFH],yy=[00-FFH]}                                               =
    =   EZS IR OUTx INy CODE zz       : Set IR Data Code{x=[1~2],y=[1~4],zz=[00-FFH]}                                             =
    =   EZG ADDR                      : Get System Address                                                                        =
    =   EZG STA                       : Get System System Status                                                                  =
    =   EZG CAS                       : Get Cascade Mode Status                                                                   =
    =   EZG OUTx VS                   : Get Output x Video Route{x=[0~2](0=ALL)}                                                  =
    =   EZG IR SYS                    : Get IR Custom Code                                                                        =
    =   EZG IR OUTx INy CODE          : Get IR Data Code{x=[1~2],y=[1~4]}                                                         =
    =   EZS OUTx VIDEOy               : Set Output VIDEO Mode                                                                     =
    =                                   {x=[1~2], y=[1~2](1=BYPASS,2=4K->2K)}                                                     =
    =-----------------------------------------------------------------------------------------------------------------------------=
    =Input Setup Commands:(Note:input number(x)=HDMI(x),x=1)                                                                      =
    =   EZS INx EDID y                : Set Input x EDID{x=[0~4](0=ALL), y=[0~15]}                                                =
    =                                   0:EDID_BYPASS         1:1080P_2CH_HDR          2:1080P_6CH_HDR        3:1080P_8CH_HDR     =
    =                                   4:1080P_3D_2CH_HDR    5:1080P_3D_6CH_HDR   6:1080P_3D_8CH_HDR                             =
    =                                   7:4K30HZ_3D_2CH_HDR  8:4K30HZ_3D_6CH_HDR  9:4K30HZ_3D_8CH_HDR                             =
    =                                   10:4K60HzY420_3D_2CH_HDR  11:4K60HzY420_3D_6CH_HDR  12:4K60HzY420_3D_8CH_HDR              =
    =                                   13:4K60HZ_3D_2CH_HDR  14:4K60HZ_3D_6CH_HDR  15:4K60HZ_3D_8CH_HDR                          =
    =                                   16:H4K_DOLBY_VISION_ATMOS                                                                 =
    =   EZG INx EDID                  : Get Input x EDID  Index{x=[0~4](0=ALL)}                                                   =
    =-----------------------------------------------------------------------------------------------------------------------------=
    =*****************************************************************************************************************************=
    ===============================================================================================================================
    ```
