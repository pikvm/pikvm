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

    [PiKVM V3](v3.md), [PiKVM V4](v4.md), and DIY builds based on Raspberry Pi 4
    include experimental support for connecting to WPA3 networks. To connect to
    a WPA3 network, you need to make sure your PiKVM is up-to-date, and edit the
    `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` file after creating it:

      1. uncomment the plain-text `psk=` line, and comment/remove the hashed `psk=` line;
      2. add options `key_mgmt=SAE` and `ieee80211w=2` before the closing `}` line;
      3. finally, add a global option `sae_pwe=2` before the `network={` line.

    For instance, if your `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` looks like this:
    ```
    network={
      ssid="MyNetwork"
      #psk="P@assw0rd"
      psk=4134d31e95e6387761d485796310894b1ac5e9bb86b3b96e0dd3473cea440014
    }
    ```

    You need to change it as follows:
    ```
    sae_pwe=2

    network={
      ssid="MyNetwork"
      psk="P@assw0rd"
      #psk=4134d31e95e6387761d485796310894b1ac5e9bb86b3b96e0dd3473cea440014
      key_mgmt=SAE
      ieee80211w=2
    }
    ```

    !!! note "Connecting to mixed WPA2/3 networks in WPA2 mode (older devices)"
        Add options `key_mgmt=WPA-PSK-SHA256 WPA-PSK` and `ieee80211w=1`
        to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` inside the `network={` block.

        This enables WPA2 PMF (protected management frame) support, which is
        often necessary to connect to WPA2/3 mixed mode networks.

    !!! note "Using Wi-Fi with hidden ESSID"
        Add global option `scan_ssid=1` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Using 5GHz Wi-Fi in the USA"
        Add global option `country=US` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Block 2 GHz or 5 GHz"
        Add option `bssid=xx:xx:xx:xx:xx:xx` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`
        inside the `network={` block.

        Here, `xx:xx:xx:xx:xx:xx` is the MAC address of the specific 2 GHz or 5 GHz
        AP that you want to _allow_. All other APs in this network will be blocked.


5. Enable the `wpa_supplicant@wlan0` service:

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

    If any of those networks enable or require WPA3, edit your `wpa_supplicant-wlan0.conf`
    as described above, making changes to relevant `network={...}` blocks.


3. Restart the service: `systemctl restart wpa_supplicant@wlan0.service`.

4. Make the filesystem read-only again using `ro` command



-----
## Antenna on PiKVM V4

PiKVM V4 has a robust metal case that protects your device from physical damage and electromagnetic interference.
This also means that an external antenna must be used for Wi-Fi. We recommend the official Antenna Kit for Raspberry Pi.

To install the antenna, fix it in the round hole in the back side of the PiKVM, and plug the wire to the connector
on the Compute Module 4.

Next, to activate the antenna, add line `dtparam=ant2` to the `/boot/config.txt` file on PiKVM, and perform `reboot`.

![type:video](https://www.youtube.com/embed/WyHBWEbtxB4)


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
