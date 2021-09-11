# Setting up WiFi / WLAN
The following describes how to setup a WiFi connection on the default pikvm builds based on Arch Linux. The process might vary for other Linux distros.
I'd recommend to do this while having a display and keyboard connected directly to the Raspberry Pi as you will loose network connectivity once you connect to a WiFi.
Alternatively you can connect to the pikvm via ssh. The built-in Terminal (available through the browser) should also work.

**Note:** I'm omitting any sudo prefix for commands as the default installation runs as root anyway. If your installation does not run as root you'll have to add `sudo` in front of each command.

## Make filesystem writeable
By default the pikvm filesystem is read-only. In order to make changes you'll need to switch to read-write mode. Do this by typing `rw` in the console.
```
rw
```

## Enable WiFi auto roaming mode
If you want your Raspberry Pi to automatically connect to any configured and available WiFi networks you have to set the following option. On Raspberry Pis wlan0 is the default name of the wlan device.
```
systemctl enable netctl-auto@wlan0.service
```

## Create WiFi profiles
### via GUI
You can create WiFi profiles either manually or by using `wifi-menu` - GUI. This requires the WiFi you want to connect to in signal range.
```
wifi-menu -o
```
The `-o` makes sure that the WiFi passphrase is stored encrypted. Otherwise it will be stored in cleartext in the profile file. `wifi-menu` will scan for all available WiFi networks and provide you a list:

![Wifi Menu 1](/img/wifi-1.png)

Select the WiFi you want to connect to and give the profile file a name. The default name is wlan0-wifiname:

![Wifi Menu 2](/img/wifi-2.png)

Enter the WPA-Passphrase:

![Wifi Menu 3](/img/wifi-3.png)

Afterwards `wifi-menu` will try to connect to the WiFi. If you're connected via ssh or the Web Terminal you'll loose connection to the Raspberry Pi. Most DHCP servers will give the Raspberry Pi a new (and usually different) IP address for each interface (LAN / WLAN).

If everything worked out you should be connected to your WiFi now. `wifi-menu` created a new profile file for you in */etc/netctl*. 

### Manually
If you want to store the WiFi passphrase encrypted you have to generate it via `wpa_passphrase`:
```
wpa_passphrase wifiname this_is_my_great_and_secure_key_1234567890
```

![WPA passphrase generation](/img/wifi-4.png)

Copy the second hexadecimal string without *psk=*. In this example _814c45d0f88f60636532b034c463639a506670f8ba3c7965e62cdbc1989f6d66_.
Create a new file with the editor of your choice:
```
nano /etc/netctl/wlan0-wifiname
```
or
```
vi /etc/netctl/wlan0-wifiname
```
Copy the following template into the file and modify it with your parameters. 
**Attention:** Please note the \\" after Key= is required for encrypted passphrases. If you want to put your WiFi passphrase in cleartext the \\" is not required. See [this](https://github.com/joukewitteveen/netctl/blob/master/docs/netctl.profile.5.txt) for the quoting rules and more WiFi profile configuration options.
```
Description='My great WiFi'
Interface=wlan0
Connection=wireless
Security=wpa
ESSID=wifiname
IP=dhcp
Key=\"814c45d0f88f60636532b034c463639a506670f8ba3c7965e62cdbc1989f6d66
```
Save the file and you're good to go. You can manually connect to the profile you've just created with:
```
netctl-auto switch-to wlan0-wifiname
```

Adding a Hidden SSID:
You need to edit /etc/netctl/wlan0-<SSID> file and add the hidden option
```
Description='Hidden SSID template'
Interface=wlan0
Connection=wireless
Security=wpa
ESSID=WIFI-Name
IP=dhcp
Key=supersecretpassword
Hidden=yes
```
  
### 5GHz WiFi in the US
If you want to connect to a 5GHz WiFi in the US and it's not listed, create `/etc/wpa_supplicant/wpa_supplicant-wlan0.conf` with a single line `country=US`, and enable it with:
```
systemctl enable wpa_supplicant@wlan0
```

## Make filesystem read-only again
Do this by typing `ro` in the console
```
ro
```
## Additional resources

- [Arch Linux Wiki for netctl](https://wiki.archlinux.org/index.php/Netctl)
