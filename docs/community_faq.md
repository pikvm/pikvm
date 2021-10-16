### Can I power the Pi via POE?
- Yes! But you will still need to ensure you isolate the 5v connection between the Raspberry Pi and host PC to prevent backpower issues that can cause instability or damage to either the host PC or the Pi. Power/Data cable + usb power blocker would work. Please see Variant #1 in the main getting started page for details.


### Do I need a power splitter? Why do I need one?
- Yes for RPi4, Yes and No for ZeroW - Yes if you want dedicated power, otherwise No
- Yes, otherwise you could back power the pi and or the target
- You can get a Y cable from amazon and mod one of the leads - Please see getting started guide - or see [non modding of Y cable](https://github.com/pikvm/pikvm#hardware-for-v2)
- You can also get a power splitter board from Tindi or PiShop [(Links provided under variants #3 & #4)](https://github.com/pikvm/pikvm#hardware-for-v2)
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
- Yes but kb/mouse passthrough will not work. Its one or the other - This is especially true if you use an addon that requires the below to change.
- edit ```/boot/config.txt```
  - Host mode - Comment out dtoverlay=dwc2
  - Passthrough mode - Uncomment out dtoverlay=dwc2



### Can you have the pikvm(RPi4) connected along with a monitor?
- **A community member has had success with the following: https://www.amazon.com/gp/product/B08DQWLXF1**
- Some Alternitives
  - If you have two outputs, you may be able to use screen mirroring from the OS but not BIOS
  - If you have one output or need access from both a local monitor or PiKVM at boot time, one of the following options may work:
  - Passthrough HDMI capture devices (sometimes referred to as a loop capture device). The Elgato devices DO NOT WORK! Look for Linux OS support when choosing a device, the expected price range is about $35-$70 US.
  - Depending on your capture device, an HDMI splitter may work but will need what is called an EDID (Extended Device ID) generator, the monitor and capture device both generate EDID so the splitter must produce its own separate EDID for the host.
  - Look for HDMI splitters - although there have been reports that these are not stable
    - Please use the search function in Discord, some users have had sucess in getting this to work but your mileage may vary
  - The better solution is to capture the stream in a dir and then use VLC to stream to that capture on another computer. This will result in fps loss.


### Wouldn't it be good to have different hostnames for your multitude of pikvms?
Yes! And it's easy to do! Using a SSH session or the web terminal:
- Make sure you're `root`, if you're not root use the `su` command to become root
- Enter read write mode of the PiKVM by executing the `rw` command
- Execute: `hostnamectl set-hostname yournewhostname.domain`
- Optional: Edit `/etc/kvmd/meta.yaml` to alter the displayed hostname in the web UI
- Reboot the pikvm


### I want to do something not related to PiKVM
- It's recommended that you review Arch documents related to what you want to do, while there are several folks in discord who can help, there is no obligation...they do it for the feels. So if you don't get an answer within the time frame you are looking for, it's advised you start google searching for what you want.


### Can this be used in any other distro’s like Rasbian? Run this in a Docker?
- Officially, no. Unofficially yes and totally #unsupported. Please DM @srepac on discord for the directions.
- Docker image is available, search the docker hub but this is #unsupported and #unofficial and not updated.


### Can you switch from USB to CSI or from CSI to USB?
- Officially, no. You would be advised to make 2 seperate SD cards and swap them when needed. Unofficially yes and totally NOT supported. Please DM @srepac on discord for the script and directions.


### My Pi keeps disconnecting from my wireless! What do I do?
- You can try the following: Edit "/etc/conf.d/wireless-regdom" and look for your region and uncomment it. Example: WIRELESS_REGDOM="US"


### I want a static IP!!
- You can configure systemd-networkd for a static address for ethernet NIC. Config file is /etc/systemd/network/eth0.network
- For wireless adapter, config file is /etc/netctl/wlan0-<wifiname>
- See [this page](wifi.md) for details on how to get basic wireless config with DHCP going.  Afterwards, you’ll need to edit the /etc/netctl/wlan0-<wifiname> file changing the IP=dhcp line with the following lines updated to reflect your network:
```
For /etc/systemd/network/eth0.network
[Match]
Name=eth0

[Network]
Address=192.168.X.XXX/24
Gateway=192.168.X.X
DNS=192.168.X.X
DNS=192.168.X.X

For /etc/netctl/wlan0-<wifiname>
IP=static
Address=('192.168.X.XXX/24')
Gateway=('192.168.X.X')
DNS=("192.168.X.X 1.0.0.1 1.1.1.1")
```
- You can also reserve the IP in your dhcp server (Quicker)


### Help! I ran out of space aka room! What now?

(This ONLY applies to the older flashed images and is no longer nessessary as the newer images had the main partition increased, as a result, the MSD partition was shrunk)
- You’ve cached package updates you no longer need.
- Enter read/write mode by executing rw as root
- Execute the following as root to clear the package cache
```
rm -rf /var/cache/pacman/pkg/*
```
- Exit read/write mode by executing ro as root
- You can also use gparted to resize partitions without "losing data", although there is a chance this may delete all of your data


### Can you connect a camera to this and still make pikvm functional?
- Yes, any cheapo webcam can be used in place of the usb dongle, please use the usb image
- A PiCam will NOT work


### HELP!! Something isn't working!!
- What was the last thing or most recent thing you did? Did you undo it?
- Did you change a file? Did you back it up before changing it?
- Did you hook this to anything else? If not why not?
- Did you try different cables?

	
### HELP! I am getting a 500/503 error when I try and access the main KVM page!
- This is due to a bad line in your yaml file, here are some steps you can make to help in the future. 
- Run ```kvmd -m```, this will display ALL kvmd settings, you can compare to your own. Make sure you are not doubling up on child/sub-child entries.
- Remember you need 4 space per child and 4 additional for each sub-child
- Make a .nanorc file and populate it with the following:
*set linenumbers* is optional
```
set linenumbers
set tabsize 4
set tabstospaces
```
- Now re-edit your override.yaml file and just use tab to get the right spacing, you might need to delete the current leading "spaces" to ensure proper formatting

	
### Can you use an iPad on PiKVM?
- Yes, with the correct hardware you can control an iPad
- Yes, activate VNC and use JUMP app(Full featured but more expensive), or bVNC(Not recommended, lack luster features but cheap). RealVNC does NOT work


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
    manufacturer: PiKVM
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
Use the following USB Data Base to get the desired devices: ```https://the-sz.com/products/usbid/``` or ```https://devicehunt.com```
	
❗NOTE❗ You may need to include ```0x0``` in the id string's for it to work properly.
- Example:
	- ```vendor_id: 0x06940```


### Things to do after initial install:
- Fix date: 'timedatectl list-timezones' then 'timedatectl set-timezone America/Los_Angeles' (Change to your location)
- Update PiKVM, follow #news on Discord for instructions
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


### Can you run a desktop on pikvm?
- Yes BUT, its not recommended OR supported as this OS should be used in RO and it will need RW enabled all of the time. Instructions [here](https://www.linuxfordevices.com/tutorials/linux/how-to-install-gui-on-arch-linux)


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
`ls -l /dev/kvmd`
```
lrwxrwxrwx 1 root root 5 Apr  5 21:33 /dev/kvmd-hid-keyboard -> hidg0
lrwxrwxrwx 1 root root 5 Apr  5 21:33 /dev/kvmd-hid-mouse -> hidg1
lrwxrwxrwx 1 root root 6 Mar 15 09:07 /dev/kvmd-video -> video0
```


### Common Commands for troubleshooting PiKVM

- `journalctl -u kvmd`
- `journalctl -u kvmd-vnc`
- `journalctl -u kvmd-ipmi`


### Bootup/power issues
- PiKVM won’t boot past “rainbow” screen
  - Are you plugged into the right HDMI port? Needs to be the one next to the power for RPI4
  - Have you reflashed your SD card?


### PiKVM Complains about low power warnings
- Are you using a `proper` power supply? Not one you hacked together?
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
- If you are getting snow looking screen, you need to make sure you select 50hz OR select anything below 1080p, like 720p60
- If you are getting an Indian looking screen, please clear the browser cache or use private/incog window


### Misc stuff
- Fully working [example](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4) of a Pi4 USB-HDMI KVM attached to AIMOS 4-port HDMI KVM switch (8 port is on AliExpress), with keyboard hotkey switching between inputs, and mass storage media emulation on a Pi Zero W
- PiKVM that mitigates HDMI backpower and requires no splitter board [here](https://docs.google.com/document/d/1M9xUgNE_-P8GydKr_3qIgXUR9YzqApHNPhetRv3pcsE/edit)
- VERY useful scripts that enhance the PiKVM's functionality - Please DM @srepac on discord to gain access

	
### Useful links
- https://www.tomshardware.com/how-to/kvm-over-ip-raspberry-pi - Very good article on PIKVM setup

As of March 2021, Below are frequently out of Stock or hard to get items, all have exceptionally LONG shipping dates 

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

