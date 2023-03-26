# Setting up Wi-Fi

The following describes how to setup a Wi-Fi connection on the default pikvm builds based on Arch Linux.
The process might vary for other Linux distros. We recommend to do this while having a display and keyboard
connected directly to the Raspberry Pi as you will loose network connectivity once you connect to a Wi-Fi.
Alternatively you can connect to the PiKVM via SSH. The built-in Web Terminal (available through the browser) should also work.

!!! warning
    Please review [First Steps](first_steps.md) if you are setting up wifi for the zero2w. This guide also applies to Wi-Fi setup for v2+ devices if switching from Ethernet to Wi-Fi..

!!! warning
    There is nothing more reliable than wired Ethernet, so it's better to use it. Wi-Fi with the steel case (on V3) results in poor performance. But who are we to stop you... :)

!!! note "[ADVANCED USERS ONLY] Moving Wi-Fi settings for OS older than 2021.10.19"
    Starting from 2021.10.19, the old way to configure Wi-Fi using `netctl` is deprecated.
    Instead, it is proposed to use a more native path with `systemd-networkd`, which is already used to configure Ethernet.
    Follow the guide and then delete the old netctl profile:

    ```
    # rw
    # systemctl disable netctl-auto@wlan0.service
    # rm /etc/netctl/wlan0-*
    # ro
    ```


## Step by step - Advances users ONLY section

1. Make filesystem writable using `rw` command.

2. Create Wi-Fi settings file `/etc/systemd/network/wlan0.network` with following content:

    ```ini
    [Match]
    Name=wlan0

    [Network]
    DHCP=yes
    DNSSEC=no

    # Use same IP by forcing to use MAC address for clientID
    [DHCP]
    ClientIdentifier=mac
    ```

3. Set network ESSID and password:

    ```
    # wpa_passphrase 'MyNetwork' 'P@assw0rd' > /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
    ```
    
    !!! note "Using Wi-Fi with hidden ESSID"
        Add option `scan_ssid=1` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`

    !!! note "Using 5GHz Wi-Fi in the USA"
        Add option `country=US` to `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf`


4. Enable WPA-supplicant service:
   ```
   systemctl enable wpa_supplicant@wlan0.service
   ```

5. Make filesystem read-only again using `ro` command


## Useful console commands

* `iwconfig` - Manipulate the basic wireless parameters.
* `iwlist` - Allow's you to initiate scanning and list frequencies, bit-rates, encryption keys, etc.
* `iwspy` - Displays per node link quality.
* `iwpriv` - Allow's you to manipulate the Wireless Extensions specific to a driver (private).

??? example "Some examples"
    ```
    # iw dev wlan0 scan | egrep "signal:|SSID:" | sed -e "s/\tsignal: //" -e "s/\tSSID: //" | awk '{ORS = (NR % 2 == 0)? "\n" : " "; print}' | sort
    ```
    ```
    # iwlist wlan0 scan | egrep "Cell|ESSID|Signal|Rates"
    ```
    ```
    # iwlist wlan0 scan
    ```
    ```
    # iw wlan0 info
    ```


## Additional resources

* [Arch Linux Wiki for systemd-networkd](https://wiki.archlinux.org/title/systemd-networkd)
