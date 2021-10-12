# Setting up Wi-Fi

The following describes how to setup a Wi-Fi connection on the default pikvm builds based on Arch Linux. The process might vary for other Linux distros. We recommend to do this while having a display and keyboard connected directly to the Raspberry Pi as you will loose network connectivity once you connect to a Wi-Fi. Alternatively you can connect to the PiKVM via SSH. The built-in Web Terminal (available through the browser) should also work.

!!! warning
    There is nothing more reliable than wired Ethernet, so it's better to use it. But who are we to stop you... :)


## Step by step

1. Make filesystem writable using `rw` command.

2. *Optional:* If you want your Raspberry Pi to automatically connect to any configured and available Wi-Fi networks you have to set the following option. On Raspberry Pis `wlan0` is the default name of the wlan device.

    ```
    # systemctl enable netctl-auto@wlan0.service
    ```

3. Create Wi-Fi profiles

    * **Using the interactive dialog**

        You can create Wi-Fi profiles either manually or by using `wifi-menu`. This requires the Wi-Fi you want to connect to in signal range.

        ```
        # wifi-menu -o
        ```

        The `-o` makes sure that the Wi-Fi passphrase is stored encrypted. Otherwise it will be stored in cleartext in the profile file. `wifi-menu` will scan for all available Wi-Fi networks and provide you a list:

        <img src="wifi-1.png" />

        Select the Wi-Fi you want to connect to and give the profile file a name. The default name is `wlan0-wifiname`:

        <img src="wifi-2.png" />

        Enter the WPA-Passphrase:

        <img src="wifi-3.png" />

        Afterwards `wifi-menu` will try to connect to the Wi-Fi. If you're connected via ssh or the Web Terminal you'll loose connection to the Raspberry Pi. Most DHCP servers will give the Raspberry Pi a new (and usually different) IP address for each interface (LAN / WLAN).

        If everything worked out you should be connected to your Wi-Fi now. `wifi-menu` created a new profile file for you in */etc/netctl*. 

    * **Manually**

        If you want to store the Wi-Fi passphrase encrypted you have to generate it via `wpa_passphrase`:

        ```
        # wpa_passphrase wifiname this_is_my_great_and_secure_key_1234567890
        ```

        <img src="wifi-4.png" />

        Copy the second hexadecimal string without `psk=`. In this example `814c45d0f88f60636532b034c463639a506670f8ba3c7965e62cdbc1989f6d66`.

        Create a new file with the editor of your choice (nano, vim, etc.):

        ```
        # nano /etc/netctl/wlan0-wifiname
        ```

        Copy the following template into the file and modify it with your parameters. 

        Note the `\"` after `Key=` is required for encrypted passphrases. If you want to put your Wi-Fi passphrase in cleartext the \\" is not required. See [this](https://github.com/joukewitteveen/netctl/blob/master/docs/netctl.profile.5.txt) for the quoting rules and more Wi-Fi profile configuration options.

        ```bash
        Description='My great Wi-Fi'
        Interface=wlan0
        Connection=wireless
        Security=wpa
        ESSID=wifiname
        IP=dhcp
        Key=\"814c45d0f88f60636532b034c463639a506670f8ba3c7965e62cdbc1989f6d66
        ```

        Save the file and you're good to go. You can manually connect to the profile you've just created with:

        ```
        # netctl-auto switch-to wlan0-wifiname
        ```

4. To add the hidden ESSID you need to edit `/etc/netctl/wlan0-<SSID>` file and add the hidden option:

    ```bash
    Description='Hidden SSID template'
    Interface=wlan0
    Connection=wireless
    Security=wpa
    ESSID=WIFI-Name
    IP=dhcp
    Key=supersecretpassword
    Hidden=yes
    ```

5. *Optional:* If you want to connect to a 5GHz Wi-Fi in the US and it's not listed, create `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` with a single line `country=US`, and enable it with:

    ```
    # systemctl enable wpa_supplicant@wlan0
    ```

6. Make filesystem read-only again using `ro` command


## Useful console commands

* `iwconfig` - Manipulate the basic wireless parameters.
* `iwlist` - Allow's you to initiate scanning and list frequencies, bit-rates, encryption keys, etc.
* `iwspy` - Displays per node link quality.
* `iwpriv` - Allow's you to manipulate the Wireless Extensions specific to a driver (private).

!!! example "Some examples"
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

* [Arch Linux Wiki for netctl](https://wiki.archlinux.org/index.php/Netctl)
