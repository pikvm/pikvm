# Community FAQ

### Index
- [Can this be used for gaming? Why not?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-this-be-used-for-gaming-why-not)
- [Can this do 4K?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-this-do-4k)
- [Does PIKVM support sound](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#does-pikvm-support-sound)
- [Why so much latency between the screen and target?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#why-so-much-latency-between-the-screen-and-target)
- [Is Pi-KVM an OS or its own Distro?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#is-pi-kvm-an-os-or-its-own-distro)
- [Why are you using Arch Linux?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#why-are-you-using-arch-linux)
- [Can I power the Pi via POE?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-i-power-the-pi-via-poe)
- [Do I need a power splitter? Why do I need one?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#do-i-need-a-power-splitter-why-do-i-need-one)
- [I can't get the KVM KB to work on my ZeroW!](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#i-cant-get-the-kvm-kb-to-work-on-my-zerow)
- [Can I use a KB on my ZeroW?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-i-use-a-kb-on-my-zerow)
- [Can you have the pi-kvm(RPi4) connected along with a monitor?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-you-have-the-pi-kvmrpi4-connected-along-with-a-monitor)
- [Wouldn't it be good to have different hostnames for your multitude of pi-kvms?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#wouldnt-it-be-good-to-have-different-hostnames-for-your-multitude-of-pi-kvms)
- [I want to do something not related to Pi-KVM](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#i-want-to-do-something-not-related-to-pi-kvm)
- [Can this be used in any other distro’s like Rasbian? Run this in a Docker?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-this-be-used-in-any-other-distros-like-rasbian-run-this-in-a-docker)
- [Can you switch from USB to CSI or from CSI to USB?](#can-you-switch-from-usb-to-csi-or-from-csi-to-usb)
- [My Pi keeps disconnecting from my wireless! What do I do?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#my-pi-keeps-disconnecting-from-my-wireless-what-do-i-do)
- [I want a static IP!!](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#i-want-a-static-ip)
- [Why do I keep getting a different IP?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#why-do-i-keep-getting-a-different-ip)
- [HELP! I can't find the IP on the ZeroW/RPi4](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#help-i-cant-find-the-ip-on-the-zerowrpi4)
- [Help! I ran out of room!](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#help-i-ran-out-of-room-what-now)
- [Can you connect a camera to this and still make pikvm functional?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-you-connect-a-camera-to-this-and-still-make-pikvm-functional)
- [I have a question that is not answered here!! Now what?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#i-have-a-question-that-is-not-answered-here-now-what)
- [HELP! Something isn't working!!](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#help-something-isnt-working)
- [HELP! I am getting a 500/503 error when I try and access the main KVM page!](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#help-i-am-getting-a-500503-error-when-I-try-and-access-the-main-kvm-page)
- [Can you use an iPad on PiKVM?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-you-use-an-ipad-on-pikvm)
- [Can I use RealVNC/Guacamole to connect to PiKVM?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-i-use-realvncguacamole-to-connect-to-pikvm)
- [How do I add my own SSL cert?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#how-do-i-add-my-own-ssl-cert)
- [How do I emulate various USB devices on the target machine?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#how-do-i-emulate-various-usb-devices-on-the-target-machine)
- [Things to do after initial install](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#things-to-do-after-initial-install)
- [Can I have a RW FS all of the time?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-i-have-a-rw-fs-all-of-the-time)
- [Can you run a desktop on pi-kvm?](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#can-you-run-a-desktop-on-pikvm)
- [Troubleshooting](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#troubleshooting)
- [Common Commands for troubleshooting Pi-KVM](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#common-commands-for-troubleshooting-pi-kvm)
- [Common ARCH commands](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#common-arch-commands)
- [Common wifi commands](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#common-wifi-commands)
- [Bootup/power issues](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#bootuppower-issues)
- [PiKVM Complains about low power warnings](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#pikvm-complains-about-low-power-warnings)
- [USB Video Capture Issues](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#usb-video-capture-issues)
- [HDMI-CSI Capture issues](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#hdmi-csi-capture-issues)
- [Misc stuff](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#misc-stuff)
- [Useful links](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#useful-links)

### Can this be used for gaming? Why not?
- ❗No:exclamation:, the max bus lanes the Pi provides, is not enough to support anything faster than 30 FPS. Your better off looking at other solutions for this.
- ❗No:exclamation:, PiKVM does not capture and transmit audio at this time. The developers have indicated that this may be available for the v3 hat at some point in the future, but it is not a priority for development at this time.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can this do 4K?
- For the CSI Bridge, ❗No:exclamation:. there is not enough bandwidth in the CSI bus for that much data. 1080p50 will max out the bandwidth
- For the USB capture devices: Technically yes, but they will downsample to something smaller to meet the usb2.0 bandwidth limitations, so the source may be 4k, but the stream will not.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Does PIKVM support sound?
- At this time sound is not supported on any platform however, once sound is implimented, it will only be available for v3. Due to a hardware bug in v0/v2 capture devices, sound may or may not work.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Why so much latency between the screen and target?
- capture device+compression+network+decompression+external network(if applicable)

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Is Pi-KVM an OS or its own Distro?
- Yes and No, Other than the some repacking and patches, its heavly based off an existing [Arch Linux ARM](https://archlinuxarm.org/).

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Why are you using Arch Linux?
- The developer was more familiar with Arch Linux so this was chosen as the base operating system. As a Linux distribution, it has more in common than not with other distributions.
<br/><br/>
As an appliance, users are not expected to interact with the host operating system often, if at all. There are some distribution-specific differences, by default networking is done using either systemd-networkd or netctl but NetworkManager can be used as a replacement if one prefers.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can I power the Pi via POE?
- Yes! But you will still need to ensure you isolate the 5v connection between the Raspberry Pi and host PC to prevent backpower issues that can cause instability or damage to either the host PC or the Pi. Power/Data cable + usb power blocker would work. Please see Variant #1 in the main getting started page for details.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Do I need a power splitter? Why do I need one?
- Yes for RPi4, Yes and No for ZeroW - Yes if you want dedicated power, otherwise No
- Yes, otherwise you could back power the pi and or the target
- You can get a Y cable from amazon and mod one of the leads - Please see getting started guide - or see [non modding of Y cable](https://github.com/pikvm/pikvm#hardware-for-v2)
- You can also get a power splitter board from Tindi or PiShop [(Links provided under variants #3 & #4)](https://github.com/pikvm/pikvm#hardware-for-v2)
- If you have the v3 HAT - This is built in

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can I use a KB on my ZeroW?
- Yes but kb/mouse passthrough will not work. Its one or the other - This is especially true if you use an addon that requires the below to change.
- edit ```/boot/config.txt```
  - Host mode - Comment out dtoverlay=dwc2
  - Passthrough mode - Uncomment out dtoverlay=dwc2


[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index) 

### Wouldn't it be good to have different hostnames for your multitude of pi-kvms?
Yes! And it's easy to do! Using a SSH session or the web terminal:
- Make sure you're `root`, if you're not root use the `su` command to become root
- Enter read write mode of the PiKVM by executing the `rw` command
- Execute: `hostnamectl set-hostname yournewhostname.domain`
- Optional: Edit `/etc/kvmd/meta.yaml` to alter the displayed hostname in the web UI
- Reboot the pikvm

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### I want to do something not related to Pi-KVM
- It's recommended that you review Arch documents related to what you want to do, while there are several folks in discord who can help, there is no obligation...they do it for the feels. So if you don't get an answer within the time frame you are looking for, it's advised you start google searching for what you want.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can this be used in any other distro’s like Rasbian? Run this in a Docker?
- Not at this time, maybe in the future

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can you switch from USB to CSI or from CSI to USB?
- Officially, no. Unofficially yes. Please visit this [site](https://pastebin.com/u/srepac) and grab the platform-switcher.sh script

Directions:
1) Place script in the root dir
2) Copy the following settings into `/etc/kvmd/override.yaml` - NEEDS to adhere to proper spacing, please see kvmd -m for proper formatting
```
kvmd:
    streamer:
        forever: true
        cmd_append: [--slowdown]                    # for usb-hdmi only so that target PC display works w/o rebooting
        ### this section is for use with webrtc/h.264 -- up to resolution: line
        h264_bitrate:
            default: 5000
        cmd_append:
            - "--h264-sink=kvmd::ustreamer::h264"   # requires gpu_mem=256 in /boot/config.txt for usb dongle
            - "--h264-sink-mode=0660"
            - "--h264-bitrate={h264_bitrate}"
            - "--h264-gop={h264_gop}"
        ### Optional
        #resolution:
        #    default: 1280x720                       # default resolution I use in webui - usb-hdmi only
```

3) Make a `config.txt.usb` file
```# See /boot/overlays/README for all available options
initramfs initramfs-linux.img followkernel

hdmi_force_hotplug=1
gpu_mem=256
enable_uart=1
dtoverlay=disable-bt
dtoverlay=dwc2,dr_mode=peripheral
#dtparam=act_led_gpio=13

# SPI (AUM)
#dtoverlay=spi0-1cs

# I2C (display)
dtparam=i2c_arm=on

# Clock
#dtoverlay=i2c-rtc,pcf8563
```

4) Make a `config.txt.csi` file
```# See /boot/overlays/README for all available options
initramfs initramfs-linux.img followkernel

hdmi_force_hotplug=1
gpu_mem=128
enable_uart=1
dtoverlay=tc358743
dtoverlay=disable-bt
dtoverlay=dwc2,dr_mode=peripheral
dtparam=act_led_gpio=13

# HDMI audio capture
dtoverlay=tc358743-audio

# SPI (AUM)
dtoverlay=spi0-1cs

# I2C (display)
dtparam=i2c_arm=on

# Clock
dtoverlay=i2c-rtc,pcf8563 
```

5) Place all files in the same dir as the platform-switcher script
6) Run `chmod +x platform-switcher.sh`
7) Run `./platform-switcher.sh`
8) Follow the directions that are printed out, Eg: ./platform-switcher.sh -f
9) Now you can switch back and forth between usb and csi, please note there is an almost 2 min delay before the portal becomes active.

**NOTE**: WEBRTC/H.264 with USB is not as realiable as MJPEG mode.

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### My Pi keeps disconnecting from my wireless! What do I do?
- You can try the following: Edit "/etc/conf.d/wireless-regdom" and look for your region and uncomment it. Example: WIRELESS_REGDOM="US"

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### I want a static IP!!
- You can configure systemd-networkd for a static address for ethernet NIC. Config file is /etc/systemd/network/eth0.network
- For wireless adapter, config file is /etc/netctl/wlan0-<wifiname>
- See pikvm/wifi_config.md at master · pikvm/pikvm · GitHub for details on how to get basic wireless config with DHCP going.  Afterwards, you’ll need to edit the /etc/netctl/wlan0-<wifiname> file changing the IP=dhcp line with the following lines updated to reflect your network:
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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Why do I keep getting a different IP?
- You can do 2 of the following actions:
- Add to, /etc/systemd/network/eth0.network
```
[DHCP]
ClientIdentifier=mac
```
- OR reserve the DHCP ip in your server/router

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### HELP!! I can't find the IP on the ZeroW/RPi4
- Open a browser and type: pikvm, still doesnt work?
- Use the FING mobile app to scan your network, its free
- Install Angry IP scanner, tools/preferences/Display results in the results list/Select Alive hosts, modify IP range, hit start
- Using FF, navigate to https://pikvm (Depends on your network if this actually works, in most case's it "should" work))
  - The below commands will verify that your Pi on on your network
```
Linux: arp -a | grep below is a list of MAC's for Raspberry Pi
	B8:27:EB:xx:xx:xx	B8-27-EB-xx-xx-xx	B827.EBxx.xxxx
	DC:A6:32:xx:xx:xx	DC-A6-32-xx-xx-xx	DCA6.32xx.xxxx
	E4:5F:01:xx:xx:xx	E4-5F-01-xx-xx-xx	E45F.01xx.xxxx
Windows Power shell: arp -a | findstr 'b8-27-eb' (Replace with the above, all lower case)
```
- For older flashed images you can do the following on the RPI4, ZeroW edit it when you edit WiFi info
  - Open web terminal and go to root, ```rw``` then ```nano /etc/issue```
  - add ```IP: \4```
  - Once you reboot, you will now see the IP in the upper left

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)
	
### Help! I ran out of space aka room! What now?
- You’ve cached package updates you no longer need.
- Enter read/write mode by executing rw as root
- Execute the following as root to clear the package cache
```
rm -rf /var/cache/pacman/pkg/*
```
- Exit read/write mode by executing ro as root
- You can also use gparted to resize partitions without "losing data", although there is a chance this may delete all of your data

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can you connect a camera to this and still make pikvm functional?
- Yes, any cheapo webcam can be used in place of the usb dongle, please use the usb image
- A PiCam will NOT work

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### I have a question that is not answered here!! Now what?
- Please look at all pins on Discord and/or ask in #chat
- Please look in #news on Discord

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### HELP!! Something isn't working!!
- What was the last thing or most recent thing you did? Did you undo it?
- Did you change a file? Did you back it up before changing it?
- Did you hook this to anything else? If not why not?
- Did you try different cables?

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)
	
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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)
	
### Can you use an iPad on PiKVM?
- Yes, with the correct hardware you can control an iPad
- Yes, activate VNC and use JUMP app(Full featured but more expensive), or bVNC(Not recommended, lack luster features but cheap). RealVNC does NOT work

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can I use RealVNC/Guacamole to connect to PiKVM?
- No, RealVNC is not a real vnc so will not work
- No, Guacamole supports a minimum of VNC capabilities and is fundamentally incompatible with Pi-KVM (for example, it does not support JPEG for video compression).

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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
Use the following USB Data Base to get the desired devices: ```https://the-sz.com/products/usbid/``` or ```https://devicehunt.com```
	
❗NOTE❗ You may need to include ```0x0``` in the id string's for it to work properly.
- Example:
	- ```vendor_id: 0x06940```

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Things to do after initial install:
- Fix date: 'timedatectl list-timezones' then 'timedatectl set-timezone America/Los_Angeles' (Change to your location)
- Update Pi-KVM, follow #news on Discord for instructions
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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can you run a desktop on pi-kvm?
- Yes BUT, its not recommended OR supported as this OS should be used in RO and it will need RW enabled all of the time. Instructions [here](https://www.linuxfordevices.com/tutorials/linux/how-to-install-gui-on-arch-linux)

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Can I have a RW FS all of the time?
- YES! BUT its not recommended, however this is what you can do:```nano /boot/cmdline.txt``` & ```nano /etc/fstab``` Change ro to rw and change the /boot line from ro to rw

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Common Commands for troubleshooting Pi-KVM

- `journalctl -u kvmd`
- `journalctl -u kvmd-vnc`
- `journalctl -u kvmd-ipmi`

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Common ARCH commands
- search - `pacman -Ss 'the thing'`
- install - `pacman -S 'the thing'`
- remove - `pacman -Rscnd 'the thing'`

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Bootup/power issues
- PiKVM won’t boot past “rainbow” screen
  - Are you plugged into the right HDMI port? Needs to be the one next to the power for RPI4
  - Have you reflashed your SD card?

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### PiKVM Complains about low power warnings
- Are you using a `proper` power supply? Not one you hacked together?
- Some USB power bricks advertise 5V @ 2.1A or higher, but can’t deliver consistent 5V.  Best to use rpi foundation recommended power supplies

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### USB Video Capture Issues
- Make sure this is a capture card and not an adapter (HDMI->USB)

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### HDMI-CSI Capture issues
- Have you reset the Target PC?
- Are you sure it's a bridge and not an extender? There is a difference
- Did you make sure it's plugged into the right port? It needs to say Camera NOT Display
- Did you try another ribbon cable?
- Did you reseat the ribbon cable?
- Is the ribbon cable facing the right way? Needs to be towards the PCB (Green or Black)
- If you are getting snow looking screen, you need to make sure you select 50hz OR select anything below 1080p, like 720p60
- If you are getting an Indian looking screen, please clear the browser cache or use private/incog window

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Capturing video from non HDMI sources
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Keyboard/Mouse Issues
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### OTG Keyboard/Mouse Connection
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Arduino Keyboard Mouse Connection (UART wiring)
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Arduino Keyboard/Mouse Connection (SPI Wiring)
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### ATX Control Issues
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### HDMI KVM Interface Issues
- TBD

>[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Connection issues
- TBD

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)

### Misc stuff
- Fully working [example](https://docs.google.com/document/d/1wgBZHxwpbJWkJBD3I8ZkZxSDxt0DdNDDYRNtVoL_vK4) of a Pi4 USB-HDMI KVM attached to AIMOS 4-port HDMI KVM switch (8 port is on AliExpress), with keyboard hotkey switching between inputs, and mass storage media emulation on a Pi Zero W
- Pi-KVM that mitigates HDMI backpower and requires no splitter board [here](https://docs.google.com/document/d/1M9xUgNE_-P8GydKr_3qIgXUR9YzqApHNPhetRv3pcsE/edit)
- Useful scripts that enhance the Pi-KVM's functionality ```https://pastebin.com/u/srepac```

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)
	
### Useful links
- https://www.tomshardware.com/how-to/kvm-over-ip-raspberry-pi - Very good article on PI-KVM setup
- Current 3D cases that support the various Pi-KVM hardware configurations:
```
https://www.thingiverse.com/search?q=pi-kvm&type=things&sort=relevant
https://www.thingiverse.com/thing:4799094
```

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

[Back to the Top](https://github.com/pikvm/pikvm/blob/master/pages/Community_FAQ.md#Index)
