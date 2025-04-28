---
title: First steps with PiKVM
description: "Getting started with PiKVM: power on and access the remote host"
---

# First steps

This guide is written primarily with V3 and V4 Mini/Plus in mind and covers the basic steps: what ports to connect and how to access a remote host that your PiKVM is connected to.

-----

## Wiring

Let's connect all the wires before you power up the device.

1. Connect **Ethernet** to the network (**not applicable** to DIY PiKVM built with Pi Zero 2).

2. Connect the **HDMI input** and the **OTG** port (USB emulation) to the remote computer.

3. Optionally, connect the **[ATX port](atx_board.md)** to control the power of the remote host.

## Power up

1. Optional: [setting up Wi-Fi or static IP](on_boot_config.md) before booting.<br>
    *Remember that there is nothing more reliable than wired Ethernet.*

2. **Power up the device.**

3. **Do not turn off the device until it's fully booted for the first time.**<br>
    *After turning on the power, PiKVM OS will generate unique SSH keys and certificates
    and perform all necessary operations on the memory card. It takes a few minutes.*

## Connect and set up

### Configure the display

The operating system on your remote computer will treat PiKVM as an additional display and use it in the Extend mode by default. That's why you will see an empty desktop when you first connect.

To avoid that, go to the display settings in your remote computer's operating system and enable the mirror mode for the external screen that you operating system identifies as PiKVM. Refer to your operating system's documentation on that.

### Access PiKVM

By default, PiKVM receives a dynamic IP address via DHCP. PiKVM V3 and V4 will show it in the top row of the OLED display:

```console
192.168.0.100
(|) iface: eth0
cpu: 1% mem: 13%
```

??? example "PiKVM without OLED: finding device in the network"

    To determine the IP address of your PiKVM, use one of the following methods:

    * **Common way:** Open the web interface of your router and find the list of issued IP addresses there.
    * **Linux-only:** Use command `arp-scan --localnet`.
    * **Linux, MacOS, Windows:** Download and run [Angry IP Scanner](https://angryip.org).
    * **Windows PowerShell:** Use command `arp -a`.
    
    In order to find PiKVM using the ARP commands, you need to look for the following MACs: `B8:27:EB`, `DC:A6:32` or `E4:5F:01`.

Let's assume that PiKVM has received the address `192.168.0.100` and has also been assigned a hostname `pikvm`.

Type the URL in the browser's address bar and press **Enter**: https://192.168.0.26/ or https://pikvm/.

![Login screen](../v4/login-prompt.png)

Submit the default credentials and click **Login**:

- Username: `admin`
- Password: `admin`
- 2FA Code: disabled by default, skip this field

You will see the initial dashboard screen of the PiKVM where you can access the remote desktop, connect to the PiKVM over SSH, or log out:

![Initial UI](../v4/initial-ui.png)

### Change the default passwords

For security's sake, it's best to change the default passwords immediately after running PiKVM for the first time. To do that:

1. On the initial dashboard screen, click the **Terminal** button to open the web terminal. You will see this command line interface:

    ![MISSING SCREENSHOT](../v4/pikvm-web-terminal-start.png)

2. Gain superuser privileges:

    ```console
    $ su -
    ```

    When prompted for password, use `root`.

3. Run `rw` to change the access to the SD card to the write mode:

    ```console
    [root@pikvm ~]# rw
    ```

4. Change the password for the superuser:

    ```console
    [root@pikvm ~]# passwd root
    ```

    Submit the new password, retype it the second time to confirm, press **Enter**, and you should see this:

    ```console
    passwd: password updated successfully
    ```

5. Change the password for web access:

    ```console
    [root@pikvm ~]# kvmd-htpasswd set admin
    ```

    Submit the new password, retype it the second time to confirm, and press **Enter**.

6. Run `ro` to change the access to the SD card back to the read-only mode:

    ```console
    [root@pikvm ~]# ro
    ```

7. Press **Ctrl+D** or type "exit" and press **Enter** to drop the root privileges.

8. Go back one page in the browser. You should be back to the initial dashboard screen.

### Access the remote system

1. On the initial dashboard screen, click the **KVM** button to access the remote desktop.

2. You should now see the host system's display and interact with it remotely using a keyboard and a mouse.

    ![Work remotely](../v4/remote-screen.png)

There are two alternative ways to connect to the PiKVM:

??? example "Connect to PiKVM via SSH"

    SSH is the most common remote access method in the Linux world. PiKVM is accessible via SSH. This method is used to manage the device:

    * **Linux, MacOS:** Open any terminal application and run: `ssh root@192.168.0.100` or `ssh root@pikvm`.
    * **Windows:** Use [PuTTY](https://www.putty.org/) for this.

    **The default `root` password is `root`.**

??? example "Connect to PiKVM via serial console"

    A serial console is a convenient and fast way to connect to PiKVM when there is no network, or get boot logs and a console if something goes wrong.

    1. Connect to the physical UART console:

        * On PiKVM V3 or V4, you have a built-in USB-UART adapter in your device. Just disconnect the OTG cable and place the USB-C end into `IOIOI` port on V4 (or `CON` port on V3). Place the USB-A end into the port you want serial to be accessed, typically done on the host. If you have a Windows host, you may need to install this [driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers), other OS's may not need one.

        * On DIY PiKVM V1 or V2, you'll need to get the right TTY to USB cable, we recommend the [RPi Debug Probe](https://www.pishop.us/product/raspberry-pi-debug-probe/) and follow existing RPi TTY serial setups.

    2. Install GNU Screen on Linux or macOS host, or [Putty](https://www.putty.org/) on Windows.

    3. Select the COM port in Putty (you can verify this looking in Device Manager), then select 115200, or use `screen /dev/ttyUSB0 115200` for other OS's

    4. You should now be able to see and interact with the Serial Port.

## Further steps

1. **Get to know PiKVM OS**: read [this help section](webui.md) to better understand all the possibilities of the web user interface.

2. **Update and customize the system**:

    - [Update](_update_os.md) the PiKVM operating system.
    - [Harden the remote access](auth.md) by enabling 2FA and setting session expiration time.
    - Configure access to PiKVM from the Internet using [port forwarding](port_forwarding.md) or [Tailscale VPN](tailscale.md).
    - Enable a microphone for [two-way audio](audio.md) (**only for PiKVM V3 and V4 Mini/Plus**).
    - Enable [HDMI pass-through](pass.md) (**only for PiKVM V4 Plus**)..

3. **Configure hardware**:

    - Set up [ATX connection](atx_board.md).
    - Configure [DIP switches](dip_switches.md)
    - Install and set up [Wi-Fi antenna](wifi.md).
    - Install and set up [LTE/5G modem](modem.md) (**only for PiKVM V4 Plus**).
    - Set up [USB 3.0](usb3v4.md) (**only for PiKVM V4 Plus**).
    - Choose Fahrenheit over Celsius to display on the OLED:

??? note "How to set up Fahrenheit"

        Create a directory for a configuration file:

        ```console
        [root@pikvm ~]# mkdir -p /etc/systemd/system/kvmd-oled.service.d
        ```

        Create file `/etc/systemd/system/kvmd-oled.service.d/override.conf`:

        ```ini
        [Service]
        ExecStart=
        ExecStart=/usr/bin/kvmd-oled --clear-on-exit --fahrenheit
        ```

        Then run `systemctl restart kvmd-oled`. In some cases, if you still do not see Fahrenheit being displayed, reboot the device.

## Basic troubleshooting

{!_basic_troubleshooting.md!}


## Getting user support

If something doesn't work, check out our [FAQ](faq.md). Otherwise, head straight to our [Discord chat](https://discord.gg/bpmXfz5).