---
title: Setting up Wi-Fi
description: Learn how to configure a Wi-Fi connection on your PiKVM to one or multiple networks
---

!!! tip
    * There is nothing more reliable than wired Ethernet, so it's better to use it. Wi-Fi with the steel case (on PiKVM V3 and V4) results in poor performance. But who are we to stop you... :)
    * Devices based on Raspberry Pi Zero 2 W does not support 5GHz Wi-Fi.

The following describes how to setup a Wi-Fi connection. We recommend to
do this while having a display and keyboard or a serial console
connected directly to the Raspberry Pi as you will loose network
connectivity once you connect to a Wi-Fi. Alternatively you can connect
to the PiKVM via SSH. The built-in Web Terminal (available through the
browser) should also work.

!!! warning "Take a look at the easiest way"
    This guide describes how to manually set up a Wi-Fi. An easier way is to use [On-boot config](on_boot_config.md).
    It is also mandatory for Zero 2 W board.


-----
## Setting up Wi-Fi manually

1. Make filesystem writable using the `rw` command.

2. Create the Wi-Fi settings file `/etc/systemd/network/wlan0.network` with the following content:

    ```ini
    [Match]
    Name=wlan0

    [Network]
    DHCP=yes
    DNSSEC=no

    [DHCP]
    ClientIdentifier=mac
    RouteMetric=50
    ```

3. Set network ESSID and password:

    ```console
    [root@pikvm ~]# wpa_passphrase 'MyNetwork' 'P@assw0rd' > /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    [root@pikvm ~]# chmod 640 /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    ```

    !!! note "WPA2 and WPA3 support"
        Add options `key_mgmt=WPA-PSK-SHA256 WPA-PSK` and `ieee80211w=1` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Using Wi-Fi with hidden ESSID"
        Add option `scan_ssid=1` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Using 5GHz Wi-Fi in the USA"
        Add option `country=US` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Block 2ghz or 5ghz"
        Add option `bssid=xx:xx:xx:xx:xx:xx` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` within the `network={` block


5. Enable WPA-supplicant service:

   ```console
   [root@pikvm ~]# systemctl enable wpa_supplicant@wlan0.service
   ```

6. Make filesystem read-only again using `ro` command


-----
## Multiple Wi-Fi networks

You can configure PiKVM to connect to one of several known Wi-Fi networks.
To do this, just simply add the configuration of these networks.
Pay attention to the symbol `>>`, it is used to append at the end of configuration,
while a single `>` will overwrite the entire configuration.

1. Make the filesystem writeble with `rw` command.

2. Add some new networks:

    ```console
    [root@pikvm ~]# wpa_passphrase 'Wifi1' 'P@assw0rd' >> /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    [root@pikvm ~]# wpa_passphrase 'Wifi2' 'P@assw0rd' >> /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    [root@pikvm ~]# wpa_passphrase 'Wifi3' 'P@assw0rd' >> /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    ```

3. Restart the service: `systemctl restart wpa_supplicant@wlan0.service`.

4. Make the filesystem read-only again using `ro` command


-----
## Useful console commands

* `iwconfig` - Manipulate the basic wireless parameters.
* `iwlist` - Allow's you to initiate scanning and list frequencies, bit-rates, encryption keys, etc.
* `iwspy` - Displays per node link quality.
* `iwpriv` - Allow's you to manipulate the Wireless Extensions specific to a driver (private).

??? example "Some examples"
    ```console
    [root@pikvm ~]# iw dev wlan0 scan | egrep "signal:|SSID:" | sed -e "s/\tsignal: //" -e "s/\tSSID: //" | awk '{ORS = (NR % 2 == 0)? "\n" : " "; print}' | sort
    ```
    ```console
    [root@pikvm ~]# iwlist wlan0 scan | egrep "Cell|ESSID|Signal|Rates"
    ```
    ```console
    [root@pikvm ~]# iwlist wlan0 scan
    ```
    ```console
    [root@pikvm ~]# iw wlan0 info
    ```


-----
## Additional resources

* [Arch Linux Wiki for systemd-networkd](https://wiki.archlinux.org/title/systemd-networkd)
