---
title: On-boot configuration & production deployment
description: How to configure parameters that are applied the first time a PiKVM is booted
---

At the first boot, PiKVM generates encryption keys and performs other
actions necessary to configure the device.

Some parameters, such as connecting to Wi-Fi, or configuring a static
interface for wired Ethernet, can be easily changed by the user if there
is physical access to the memory card. This is convenient for quick
customization of your device before the first use.

All settings are made using a file `pikvm.txt` on the first section of
the memory card. After applying the settings, the file is automatically
deleted.

-----
## Setting up Wi-Fi

!!! note
    Devices based on Raspberry Pi Zero 2 W does not support 5GHz Wi-Fi.

1. Remove the PiKVM memory card. The device must be turned off.

2. Insert the memory card into the computer and mount the first FAT32 partition.

3. Among the system files you will see the file `pikvm.txt`.

    * If you haven't powered up PiKVM yet, this file will contain a single line `FIRST_BOOT=1`. Do not remove it, just add following lines from the next step.

    * If the file does not exist, create an empty file (don't add `FIRST_BOOT` option).

4. To connect to Wi-Fi with DHCP, you will need an ESSID (network name) and a password. Add this to `pikvm.txt`.
    If the file doesn't exists, just create it. Like following:

    ```bash
    WIFI_ESSID='mynet'
    WIFI_PASSWD='p@s$$w0rd'
    ```

    Note that backslash in the password should be escaped: `\` should be written as `\\`.

    If there was a string `FIRST_BOOT=1` in the file, do not remove it.
    This is the trigger needed to initialize the OS at the first boot.
    On the contrary, if the file pikvm.txt does not exist, you should not add this line.
   
5. Unmount partition and return the memory card to PiKVM.

6. A few things to keep in mind:
    * Note that after applying the settings, the pikvm.txt file will be deleted.
    * WPA3 is not supported. Enable WPA2 on your router, while AES is supported, some aspects of it is not and you may need to disable AES for it to connect.
    * There is a possibility that, in countries that support channel 13, the device will not connect.
        You will need to configure your router to disable channels 12-14 or disable Auto scan mode.


-----
## Other available options

A number of other parameters can be applied in the same way as with Wi-Fi.

!!! note
    The parameters must be specified strictly each on a separate line.

* `FIRST_BOOT=1`<br>
    Triggers initialization of the first OS startup. The following actions are performed:

    * Generates unique `/etc/machine-id` for internal systemd machinery.
    * Generates unique SSH host keys.
    * Generates unique SSL certificates for HTTPS and VNC.
    * Generates Avahi ZeroConf service `/etc/avahi/services/pikvm.service` with Pi's serial number. But keeps Avahi disabled by default.
    * Mass Storage image partition is reformatted to fill the available space at the end of SD card (only for V2+).
    * Different minor things are performed like fc-cache update.

    Note that this option does not reset the OS to factory defaults.
    There is no way to do this other than [reflashing](flashing_os.md).

* `ENABLE_AVAHI=1`<br>
    Triggers Avahi service generation (if needed) and enables `avahi-daemon`. It's disabled by default.

* `ENABLE_OTG_SERIAL=1`<br>
    Only for V2+. Enables a virtual serial port on a USB emulator, that can be used to log in
    to PiKVM from the target host side. Disabled for security reasons.

* `SSH_PORT=1234`<br>
    Changes SSH server port to 1234 instead of 22.

* `ETH_DHCP=1`<br>
    Configures Ethernet port for DHCP. This is a default for PiKVM OS.

* `ETH_ADDR=192.168.0.100/24`<br>`ETH_DNS=8.8.8.8`<br>`ETH_GW=192.168.0.1`<br>
    Configures a static IP on the Ethernet port. Only IPv4 is available here. For IPv6 you'll need to change
    [systemd configuration files](https://wiki.archlinux.org/title/systemd-networkd) on the live OS.
    All three options must be set simultaneously to avoid incorrect configuration.

* `WIFI_ESSID=foo`<br>`WIFI_PASSWD=bar`<br>
    Configures Wi-Fi with DHCP, described in more detail in previous paragrpah.
    Both options must be set simultaneously to avoid incorrect configuration.
    Can be followed by several options:

    * `WIFI_WPA23=1`<br>
        Allows to connect to mixed WPA2/WPA3 network. Available only on new images >= 2025.03.03.

    * `WIFI_HIDDEN=1`<br>
        Allows to connect to hidden Wi-Fi network. Available only on new images >= 2024.03.12.

    * `WIFI_ADDR=192.168.0.100/24`<br>`WIFI_DNS=8.8.8.8`<br>`WIFI_GW=192.168.0.1`<br>
        Configures a static IP on the Wifi. Only IPv4 is available here. For IPv6 you'll need to change
        [systemd configuration files](https://wiki.archlinux.org/title/systemd-networkd) on the live OS.
        All three options must be set simultaneously with `WIFI_ESSID` and `WIFI_PASSWD` to avoid incorrect configuration.

* `WIFI_REGDOM=US`<br>
    Changes Wi-Fi regulatory domain to the US. Other domains available by
    [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes.



-----
## Advanced production deployment

For a production environment, it may be important to integrate PiKVM into an existing infrastructure automatically.
Usually, such actions are performed by special scripts written by the administrator.

To run such scripts, PiKVM OS suggests placing them in `pikvm-scripts.d` directory (`/boot/pikvm-scripts.d` on the system itself)
on the same partition next to `pikvm.txt` file.

If `pikvm.txt` exists, all the parameters described there will be applied, and the contents inside `pikvm-scripts.d`
will be checked if this directory exists. Scripts in this directory are run in alphabetical order,
the failure will be ignored, it is assumed that the script author should handle this situation.

If the script needs to reboot the OS, it should create an empty file `/boot/pikvm-reboot.txt`.
The reboot is performed once after all scripts.

In order not to copy scripts manually on each memory card on each PiKVM, it may make sense to build
a custom OS image containing everything you need.
