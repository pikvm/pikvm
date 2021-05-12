# Community FAQ

### Can this be used for gaming? Why not?
- ❗No:exclamation:, the max bus lanes the Pi provides, is not enough to support anything faster than 30 FPS. Your better off looking at other solutions for this.
- ❗No:exclamation:, PiKVM does not capture and transmit audio at this time. The developers have indicated that this may be available for the v3 hat at some point in the future, but it is not a priority for development at this time.

### Can this do 4K?
- For the CSI Bridge, ❗No:exclamation:. there is not enough bandwidth in the CSI bus for that much data. 1080p50 will max out the bandwidth
- For the USB capture devices: Technically yes, but they will downsample to something smaller to meet the usb2.0 bandwidth limitations, so the source may be 4k, but the stream will not.

### Is Pi-KVM an OS or its own Distro?
- Yes and No, Other than the some repacking and patches, its heavly based off an existing [Arch Linux ARM](https://archlinuxarm.org/).

### Why are you using Arch Linux?
- The developer was more familiar with Arch Linux so this was chosen as the base operating system. As a Linux distribution, it has more in common than not with other distributions.
<br/><br/>
As an appliance, users are not expected to interact with the host operating system often, if at all. There are some distribution-specific differences, by default networking is done using either systemd-networkd or netctl but NetworkManager can be used as a replacement if one prefers.

### Can I power the Pi via POE?
- Yes! But you will still need to ensure you isolate the 5v connection between the Raspberry Pi and host PC to prevent backpower issues that can cause instability or damage to either the host PC or the Pi.

### Do I need a power splitter? Why do I need one?
- Yes for RPi4, No for ZeroW
- Yes, otherwise you could back power the pi and or the target
- You can get a Y cable from amazon and mod one of the leads - Please see getting started guide
- You can get a power splitter board from Tindi or PiShop (Links provided below)
- If you have the v3 HAT - This is built in

### I can't get the KVM KB to work on my ZeroW!
Make sure that you did NOT modify your config.txt file, this is the default: 
```
# See /boot/overlays/README for all available options
initramfs initramfs-linux.img followkernel
hdmi_force_hotplug=1
gpu_mem=64
enable_uart=1
dtoverlay=tc358743,i2c_pins_28_29=1
dtoverlay=disable-bt
dtoverlay=dwc2,dr_mode=peripheral
```
Ensure that you have the cable(Needs to support both power/data) plugged into the right port, the one closest to the mini HDMI is the correct port

### Can I use a KB on my ZeroW?
- Yes but kb/mouse passthrough will not work. Its one or the other
  - Host mode - Comment out dtoverlay=dwc2
  - Passthrough mode - Uncomment out dtoverlay=dwc2

### Can you have the pi-kvm(RPi4) connected along with a monitor?
- **A community member has had success with the following: https://www.amazon.com/gp/product/B08DQWLXF1**
- Some Alternitives
  - If you have two outputs, you may be able to use screen mirroring from the OS but not BIOS
  - If you have one output or need access from both a local monitor or Pi-KVM at boot time, one of the following options may work:
  - Passthrough HDMI capture devices (sometimes referred to as a loop capture device). The Elgato devices DO NOT WORK! Look for Linux OS support when choosing a device, the expected price range is about $35-$70 US.
  - Depending on your capture device, an HDMI splitter may work but will need what is called an EDID (Extended Device ID) generator, the monitor and capture device both generate EDID so the splitter must produce its own separate EDID for the host.
  - Look for HDMI splitters - although there have been reports that these are not stable
    - Please use the search function in Discord, some users have had sucess in getting this to work but your mileage may vary
  - The better solution is to capture the stream in a dir and then use VLC to stream to that capture on another computer. This will result in fps loss.
  

### Wouldn't it be good to have different hostnames for your multitude of pi-kvms?
Yes! And it's easy to do! Using a SSH session or the web terminal:
- Make sure you're `root`, if you're not root use the `su` command to become root
- Enter read write mode of the PiKVM by executing the `rw` command
- Execute: `hostnamectl set-hostname yournewhostname.domain`
- Optional: Edit `/etc/kvmd/meta.yaml` to alter the displayed hostname in the web UI
- Reboot the pikvm

### I can't make edits?!?!?
- Did you issue a `rw` before updating/editing?

### In the Web Terminal, how do I get root?
- Type `su -`
- Put `root` for the password

### I want to do something not related to Pi-KVM
- It's recommended that you review Arch documents related to what you want to do, while there are several folks in discord who can help, there is no obligation...they do it for the feels. So if you don't get an answer within the time frame you are looking for, it's advised you start google searching for what you want.

### Can this be used in any other distro’s like Rasbian? Run this in a Docker?
- Not at this time, maybe in the future

### My Pi keeps disconnecting from my wireless! What do I do?
- You can try the following: Edit "/etc/conf.d/wireless-regdom" and look for your region and uncomment it. Example: WIRELESS_REGDOM="US"

### I want a static IP!!
- You can configure systemd-networkd for a static address for ethernet NIC. Config file is /etc/systemd/network/eth0.network
- For wireless adapter, config file is /etc/netctl/wlan0-<wifiname>
- See pikvm/wifi_config.md at master · pikvm/pikvm · GitHub for details on how to get basic wireless config with DHCP going.  Afterwards, you’ll need to edit the /etc/netctl/wlan0-<wifiname> file changing the IP=dhcp line with the following lines updated to reflect your network:
```
IP=static
Address=('192.168.X.XXX/24')
Gateway=('192.168.X.X')
DNS=("192.168.X.X 1.0.0.1 1.1.1.1")
```
- You can also reserve the IP in your dhcp server (Quicker)

### Why do I keep getting a different IP?
- Add to, /etc/systemd/network/eth0.network
```
[DHCP]
ClientIdentifier=mac
```
- Reserve the DHCP ip in your server/router
- You can replace systemd-networkd with NetworkManager, this has proven to fix the IP issue with DHCP for some routers

### HELP!! I can't find the IP on the ZeroW/RPi4
- Open a browser and type: pikvm, still doesnt work?
- Use the FING mobile app to scan your network, its free
- Install Angry IP scanner, tools/preferences/Display results in the results list/Select Alive hosts, modify IP range, hit start
- Using FF, navigate to https://pikvm (Depends on your network if this actually works, in most case's will work))
  - Open web terminal and go to root, rw then nano /etc/issue
  - add ‘IP: \4’
  - Once you reboot, you will now see the IP in the upper left
  - The below commands will verify that your Pi on on your network
```
arp -a | grep below is a list of MAC's for Raspberry Pi
	B8:27:EB:xx:xx:xx	B8-27-EB-xx-xx-xx	B827.EBxx.xxxx
	DC:A6:32:xx:xx:xx	DC-A6-32-xx-xx-xx	DCA6.32xx.xxxx
	E4:5F:01:xx:xx:xx	E4-5F-01-xx-xx-xx	E45F.01xx.xxxx
Power shell: arp -a | findstr 'b8-27-eb' (Replace with the above, all lower case)
```

### Help! I ran out of room! What now?
- You’ve cached package updates you no longer need.
- Enter read/write mode by executing rw as root
- Execute the following as root to clear the package cache
```
rm -rf /var/cache/pacman/pkg/*
```
- Exit read/write mode by executing ro as root
- You can also use gparted to resize partitions without losing data, although this may delete all of your data

### Can you connect a camera to this and still make pikvm functional?
- Yes, any cheapo webcam can be used in place of the usb dongle, please use the usb image

### I have a question that is not answered here!! Now what?
- Please look at all pins on Discord
- Please look in #news on Discord

### I want the v3 hat!! Where do I get it??
- At this time it is not available, due to the current pandemic the factories are running at a much slower rate

### HELP!! Something isn't working!!
- What was the last thing or most recent thing you did? Did you undo it?
- Did you hook this to anything else? If not why not?
- Did you try different cables?
### Can you use an iPad on PiKVM?
- Yes, with the correct hardware you can control an iPad
- Yes, activate VNC and use JUMP app(Full featured but more expensive), or bVNC(Not recommended, lack luster features but cheap). RealVNC does NOT work
### Can I use RealVNC to connect to PiKVM?
- No, RealVNC is not a real vnc so will not work

### How do I add my own SSL cert?
- If you have a certificate(:exclamation:**Making a cert falls outside the scope of PIKVM - Please reference Linux documentation**:exclamation:), replace the public key in /etc/kvmd/nginx/ssl/server.crt and private key in /etc/kvmd/nginx/ssl/server.key and restart the kvmd-nginx service.
- It should look like the following:

```
cd /etc/kvmd/nginx
cat ssl.conf (Expection of what's inside the file)
ssl_protocols TLSv1.3 TLSv1.2 TLSv1.1 TLSv1;
ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
ssl_certificate /etc/kvmd/nginx/ssl/server.crt;
ssl_certificate_key /etc/kvmd/nginx/ssl/server.key;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### How do I emulate various USB devices on the target machine?

By default this is what is set:
```
otg:
    manufacturer: Pi-KVM
    max_power: 250
    product: Composite KVM Device
    product_id: 260
    serial: CAFEBABE
    udc: ''
    user: kvmd
    vendor_id: 7531
```

You can change how this is displayed with the following example:
```nano /etc/kvmd/override.yaml```

```
otg:
    manufacturer: Corsair
    product: Corsair Gaming RGB
    serial:
    vendor_id: 6940
    product_id: 6973
```
USB Data Base: ```https://the-sz.com/products/usbid/```


### Things to do after initial install:
- Fix date: 'timedatectl list-timezones' then 'timedatectl set-timezone America/Los_Angeles' (Change to your location)
- Update Pi-KVM, follow #news on Discord for instructions
- Enable Avahi-Daemon (A Zeroconf daemon) to allow finding the pikvm via mDNS queries as `pikvm.local`
  - `pacman -S avahi nss-mdns` 
  - `gtk3 python-dbus python-gobject` (You may or may not need this to make it work)
  - Enable the Avahi daemon in order to make it persistent after reboot:
```
systemctl enable avahi-daemon.service
```
  - Start the DBus (if not already running) & Avahi daemons:
```
systemctl start dbus.service
systemctl start avahi-daemon.service
```
- Setup a NFS share to give read/write storage on the read only pikvm
  - Note: this does assume you already have an NFS server on your network and accessible to pikvm
  - Source https://linuxhint.com/install_configure_nfs/
```
pacman -S nfs-utils
showmount -e 192.168.1.XXX
mount -t nfs 192.168.1.XXX:/volume1/Data /mnt/Data
nano /etc/fstab
```
  Add To the bottom of the file
```
192.168.1.XXX:/volume1/Data /mnt/Data nfs      auto,rw,soft    0 0
```
### Can I have a RW FS all of the time?
- YES! BUT its not recommended, however this is what you can do:```nano /boot/cmdline.txt``` & ```nano /etc/fstab``` Change ro to rw and change the /boot line from ro to rw

### Troubleshooting
- :exclamation:**It is expected that you are aware of basic networking while working on this project and that you have read up on the project prior to going to Discord**:exclamation:
  - Do you know the IP?
  - Can you ping the IP?
  - Did you swap cables?
  - Did you swap the eth port to a known working eth port?
  - Do you have access to another router or switch?
  - Did you change ports on the router/switch?
  - RPi4 - Did you hook up a monitor? Once logged in, can you ping to your gateway? Other IP's on the same network?
  - Did you connect a monitor to the target? Does it work?
  - Did you connect the PIKVM to the target directly? Does it work?

- Reboot target
- Try default image, do not update and test

-copy/paste into a file, call it pi-info.sh, chmod +x pi-info.sh, ./pi-info.sh **Same script is located [here](https://pastebin.com/u/srepac)**
```
#!/bin/bash
uptime
TMPFILE="/tmp/pacmanquery"; /bin/rm -f $TMPFILE
pacman -Q | awk '{print $2, $1}' > $TMPFILE
chmod go+w $TMPFILE

pistat && echo

printf "%-18s\t%s\n" "Version" "Package-Name" "----------------------" "-----------------------------"

PACKAGES="firmware bootloader kvmd ustreamer nginx wpa wireless"
for PKG in $( echo $PACKAGES ); do
        printf "%-18s\t%s\n" $(grep $PKG $TMPFILE | sed 's/-[1-9]//g')
done
```
```dmesg | grep tc35``` - CSI
<br/><br/>
```dmesg | egrep '1-1.[245]|uvc'``` - USB

```systemctl status kvmd```

```systemctl status kvmd-otg```

- **hint:**  look at kvmd-platform line of the output... make sure it matches the image they expect for the capture device and platform

- Keyboard/Mouse icons orange? Try a different cable (ALLOT are power only), try a different usb port

- Should see the following if everything is in place
```ls -l /dev/kvmd*
lrwxrwxrwx 1 root root 5 Apr  5 21:33 /dev/kvmd-hid-keyboard -> hidg0
lrwxrwxrwx 1 root root 5 Apr  5 21:33 /dev/kvmd-hid-mouse -> hidg1
lrwxrwxrwx 1 root root 6 Mar 15 09:07 /dev/kvmd-video -> video0
```

### Common Commands for troubleshooting Pi-KVM

- `journalctl -u kvmd`
- `journalctl -u kvmd-vnc`
- `journalctl -u kvmd-ipmi`


### Common ARCH commands
- search - `pacman -Ss 'the thing'`
- install - `pacman -S 'the thing'`
- remove - `pacman -Rscnd 'the thing'`

### Common wifi commands
- `iwconfig` manipulate the basic wireless parameters
- `iwlist`   allow's you to initiate scanning and list frequencies, bit-rates, encryption keys…
- `iwspy`    displays per node link quality
- `iwpriv`   allow's you to manipulate the Wireless Extensions specific to a driver (private)

- Some examples
```
iw dev wlan0 scan | egrep "signal:|SSID:" | sed -e "s/\tsignal: //" -e "s/\tSSID: //" | awk '{ORS = (NR % 2 == 0)? "\n" : " "; print}' | sort
```
```
iwlist wlan0 scan | egrep "Cell|ESSID|Signal|Rates"
```
```
iwlist wlan0 scan
```
```
iw wlan0 info
```

### Bootup/power issues
- PiKVM won’t boot past “rainbow” screen
  - Are you plugged into the right HDMI port? Needs to be the one next to the power
  - Have you reflashed your SD card?

### PiKVM Complains about low power warnings
- Are you using a `proper` power supply? Not one you hacked together
- Some USB power bricks advertise 5V @ 2.1A or higher, but can’t deliver consistent 5V.  Best to use rpi foundation recommended power supplies

### USB Video Capture Issues
- Make sure this is a capture card and not an adapter (HDMI->USB)

### HDMI-CSI Capture issues
- Have you reset the Target PC?
- Are you sure it's a bridge and not an extender? There is a difference
- Did you make sure it's plugged into the right port? It needs to say Camera NOT Display
- Did you try another ribbon cable?
- Did you reseat the ribbon cable?
- Is the ribbon cable facing the right way? Needs to be towards the PCB (Green or Black)

### Capturing video from non HDMI sources
- TBD

### Keyboard/Mouse Issues
- TBD

### OTG Keyboard/Mouse Connection
- TBD

### Arduino Keyboard Mouse Connection (UART wiring)
- TBD

### Arduino Keyboard/Mouse Connection (SPI Wiring)
- TBD

### ATX Control Issues
- TBD

### HDMI KVM Interface Issues
- TBD

### Connection issues
- TBD

### Misc stuff
- Fully working example of a Pi4 USB-HDMI KVM attached to AIMOS 4-port HDMI KVM switch (8 port is on AliExpress), with keyboard hotkey switching between inputs, and mass storage media emulation on a Pi Zero W https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4
- Useful scripts that enhance the Pi-KVM's functionality ```https://pastebin.com/u/srepac```

	
### Useful links
- https://www.tomshardware.com/how-to/kvm-over-ip-raspberry-pi - Very good article on PI-KVM setup
- Pi-KVM Power/Data OTG splitter boards
  - https://www.pishop.us/product/usb-pwr-splitter/ (Look on Tindi for the same thing in the UK)
  - https://www.pishop.us/product/usb-c-pwr-splitter/ (Look on Tindi for the same thing in the UK)
- Current 3D cases that support the various Pi-KVM hardware configurations https://www.thingiverse.com/search?q=pi-kvm&type=things&sort=relevant, https://www.thingiverse.com/thing:4799094

As of March 2021, Out of Stock or hard to get, all have exceptionally LONG shipping dates - Could try AliExpress or get a usb2hdmi dongle from Amazon, please ask or search in Discord for the best known working one

```
Ezcoo KVM - Goes out of stock frequently
CSI2-HDMI bridge w/ TC358743XBG chip - Goes out of stock freqently 
Alternative names for the same devices:
Tiamu	  	Sling	    	Yazan	    	Ningwang	Essenc	  	Geekworm
Fauge	  	Haudang	  	AKAT	    	Docoop	    	Katigan	  	Lyusa (recommended by mdevaev)
LNIMI	  	cherrypop	Lopbinte	Uang	      	Tuneway	  	Mustwell
Facibom		Binchil	  	Cobeky	  	Ctzrzyt	    	Davitu	
```

- Community recommended USB capture [card](https://www.amazon.com/gp/product/B08FG54QPH)
- Community recommended Loop device that allows [Monitor+PiKVM](https://www.amazon.com/gp/product/B08DQWLXF1)
