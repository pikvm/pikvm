---
title: Setting up 3G/4G/LTE modem
description: How to configure a 3G/4G/LTE modem to connect to Internet without a permanent wired network access
---

With PiKVM, you can create a portable device to work in a distant
environment without a permanent wired internet connection. A cellular
modem in combination with any VPN like [Tailscale](tailscale.md) is also
an excellent backup for emergency access to the host.

-----
## Choosing a modem

PiKVM supports a huge number of USB modems. If the modem works with a desktop Linux, it will work with PiKVM as well.

### Mini-PCI on PiKVM V4 Plus

[PiKVM V4 Plus](v4.md) has an internal Mini-PCI and built-in SIM card slot for installing a modem.
Please note that only modems with USB data lines are supported.

Here is a list of good modems that you can start with:

* [**SIMCom SIM7600G-H**](https://techship.com/product/simcom-sim7600g-h-r2-mpcie/?variant=006)
* [Sierra Wireless MC7700](https://source.sierrawireless.com/devices/mc-series/mc7700/)
* [Huawei EM820W](https://techship.com/product/huawei-em820w/?variant=001)
* [Quectel EG25-G](https://www.quectel.com/product/lte-eg25-g-mpcie/)

An antenna and an SMA pigtail are also required to use the modem.

When choosing an antenna, check the supported frequency list of your cellular ISP and the antenna itself.


-----
## Setting up the connection

Change default passwords if you haven't done so earlier. It's very important for the security.

Cellular networks can open your device to the big world. PiKVM is safe if you use a strong password, so...

{!_passwd.md!}

1. Update the OS and reboot.

    {!_update_os.md!}

2. Make filesystem writable using `rw` command.

3. Install NetworkManager and ModemManager:

    ```console
    [root@pikvm ~]# pacman -S modemmanager networkmanager
    ```

4. Create file `/etc/NetworkManager/conf.d/pikvm-unmanaged.conf` with following content:

    ```ini
    [keyfile]
    unmanaged-devices=*,except:type:gsm
    ```

5. Run the services:

    ```console
    [root@pikvm ~]# systemctl enable --now NetworkManager ModemManager
    ```

6. Make sure that ModemManager detects your modem. You will see something similar after `mmcli`, modem `0` is detected here:

    ```console
    [root@pikvm ~]# mmcli --list-modems
        /org/freedesktop/ModemManager1/Modem/0 [QUALCOMM INCORPORATED] SIMCOM_SIM7600G-H
    ```

7. View the modem `0` information:

    ```console
    [root@pikvm ~]# mmcli -m 0
      -----------------------------------
      General  |                    path: /org/freedesktop/ModemManager1/Modem/0
               |               device id: ...
      -----------------------------------
      Hardware |            manufacturer: QUALCOMM INCORPORATED
               |                   model: SIMCOM_SIM7600G-H
               |       firmware revision: LE20B04SIM7600G22
               |          carrier config: ROW_Gen_VoLTE
               | carrier config revision: ...
               |            h/w revision: 10000
               |               supported: gsm-umts, lte
               |                 current: gsm-umts, lte
               |            equipment id: ...
      ...
      -----------------------------------
      Status   |                    lock: sim-pin
               |          unlock retries: sim-pin (3), sim-puk (10), sim-pin2 (3), sim-puk2 (10)
               |                   state: locked
               |             power state: on
      ...
    ```

8. Set up the connection. You will need the APN value (from the mobile ISP) and PIN-code for the SIM:

    ```console
    [root@pikvm ~]# nmcli c add type gsm ifname '*' con-name pikvm-lte gsm.apn cytamobile gsm.pin 1234
    ```

    * `pikvm-lte` is just a meaning name of the connection, use any you like.
    * `gsm.apn cytamobile` sets APN value to `cytamobile` (will be different for other ISP).
    * `gsm.pin 1234` sets PIN for unlocking the SIM card. If the SIM is not locked, omit these words.

    Depending on the ISP, you may need to specify a password and/or
    [some other parameters](https://networkmanager.pages.freedesktop.org/NetworkManager/NetworkManager/nm-settings-nmcli.html).

9. Make the connection automatically connected:

    ```console
    [root@pikvm ~]# nmcli connection modify pikvm-lte autoconnect yes
    ```

10. The connection will already be working:

    ```console
    [root@pikvm ~]# nmcli
    cdc-wdm0: connected to pikvm-lte
            "cdc-wdm0"
            gsm (option, qmi_wwan), hw, iface wwan0, mtu 1500
            ip4 default
            inet4 XXX.XXX.XXX.XXX/XX
            route4 XXX.XXX.XXX.XXX/XX metric 700
            route4 default via XXX.XXX.XXX.XXX/XX metric 700
    ...
    ```

11. Perform `reboot`.

To set up a Tailscale VPN, refer to [this page](tailscale.md).
