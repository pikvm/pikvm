# FAQ & Troubleshooting
As a first step, we recommend carefully reading our documentation on [GitHub](https://github.com/pikvm/pikvm). Most steps to successfully set up your PiKVM are already described there. If you run into any issues you can check this page which will list common errors. If that still doesn't help you you're welcome to raise an [issue ticket](https://github.com/pikvm/pikvm/issues) or [join our Discord](https://discord.gg/bpmXfz5) for further help.

Note: if you can't find an answer to your question here, try the [Community FAQ](community_faq.md). It will be merged with this page in the future

-----
# Navigation
* [Common questions](#common-questions)
* [First steps](#first-steps)
* [Video problems](#video-problems)
* [USB problems (keyboard, mouse, mass storage)](#usb-problems-keyboard-mouse-mass-storage-etc)
* [Web UI problems](#web-ui-problems)
* [Hardware problems (Wi-Fi, ATX, etc)](#hardware-problems-wi-fi-atx-etc)

-----
# Common questions

### Can I connect multiple servers to a single PiKVM?
<details>
  <summary>Click to view</summary>

* Yes, but it will require additional work to set up. See [this page](multiport.md).
</details>

### How can I get the access to PiKVM in my local network over Internet?
<details>
  <summary>Click to view</summary>

* You can use port forwarding for port 443 on your router if it has an external IP address. In all other cases, you can use the excellent free VPN service [Tailscale](tailscale.md), which is configured on PiKVM with a [few simple commands](tailscale.md).
</details>

### Can I use PiKVM with non-Raspberry boards (Orange, Nano, etc)?
<details>
  <summary>Click to view</summary>

* Yes, but you will have to prepare the operating system yourself. As for the PiKVM software, you will need to replace some config files (such as UDEV rules). If you are a developer or an experienced system administrator, you will not have any problems with this. In addition, we are open to patches. If you need help with this, please contact us via [Discord](https://discord.gg/bpmXfz5).
</details>

-----
# First steps

### What is the default password? How do I change it?
<details>
  <summary>Click to view</summary>

* There are two types of accounts: OS and PiKVM (web interface) accounts. The system account `root` can be used for SSH/UART access and has the password `root`. The web interface account is called `admin` and has the password `admin`. The PiKVM account cannot be used for SSH access and vice versa.

  To change passwords, use the following commands (under root):
  ```bash
  su -  # If you're in the webterm
  rw  # Switch filesystem to read-write mode
  passwd root  # Change OS root password
  kvmd-htpasswd set admin  # Change web ui admin password
  ro  # Back to read-only
  ```
</details>

### How do I get root access in the web terminal?
<details>
  <summary>Click to view</summary>

* The web terminal works with the account `kvmd-webterm`. This is a regular user with no administrator privileges and. In addition, `sudo` and login are disabled for this user for security reasons. To get `root` access, you need to use the `su -` command (minus is important) and **enter the root password**.
</details>

### Where is the PiKVM configuration located?
<details>
  <summary>Click to view</summary>

* Almost all KVMD (the main daemon controlling PiKVM) configuration files located in `/etc/kvmd`. You can also find nginx configs and SSL certificates there. KVMD configs use [YAML](config.md) syntax. The specific platform parameters can be found in the file `/etc/kvmd/main.yaml` and **you should never edit it**. Use `/etc/kvmd/override.yaml` to redefine the system parameters.
  
  Another files that are also not recommended for editing have read-only permissions. If you edit any of these files, you will need to manually make changes to them when you upgrade your system. You can view the current configuration and all available KVMD parameters using the command `kvmd -m`.
</details>

### I can't edit any file on PiKVM. Why is the system in read-only mode?
<details>
  <summary>Click to view</summary>

* The PiKVM file system is always mounted in read-only mode. This measure prevents it from being damaged by a sudden power outage. To change the configuration you must first switch the filesystem to write mode using the command `rw` from root. After the changes, be sure to run the command `ro` to switch it back to read-only. If you get a message that the file system is busy, then the easiest way is to perform a `reboot`.
</details>

### How do I update PiKVM with the latest software?
<details>
  <summary>Click to view</summary>

* PiKVM OS is based on Arch Linux ARM and is fully updated from the repository by a regular package manager. Connect to your PiKVM via ssh and run:
  ```
  rw
  pacman -Syu
  reboot
  ```
  
  :exclamation: Pacman saves all installed packages in a compressed format so that you can roll back to the old version if something goes wrong. After you've updated and made sure everything works, it makes sense to clear the package cache so that it doesn't take up space on the SD card: `rw; rm -rf /var/cache/pacman/pkg; ro`.
</details>

-----
# Video problems

### I can see the video but I can't see the WebRTC switch
<details>
  <summary>Click to view</summary>

* WebRTC is an alternative mode for the default MJPEG and it's only supported on v2+ platforms with the CSI video capture device. See [this](webrtc.md) page to solve any problems with WebRTC.
</details>

### PiKVM does not show the video from the computer at all
<details>
  <summary>Click to view</summary>
  
* Double-check that the video capture device is connected correctly. For the [CSI bridge](/README.md#for-the-hdmi-csi-bridge), this should be exactly the camera port, for the [USB dongle](/README.md#for-the-hdmi-usb-dongle), strictly the port indicated in the picture.
* Some laptops do not output any signal until you switched the output (usually via the FN + and an F5 key on the keyboard).
* Your computer may have turned on sleep mode for the monitor. Move the mouse and turn it off.
</details>

### The video works in the booted OS, but not in the BIOS/UEFI
<details>
  <summary>Click to view</summary>

* The problem appears on Intel NUC, GA-H77-DS3H, and some other devices with using CSI bridge. All you need to do is [change the EDID data](edid.md). This is the information about supported resolutions that the CSI bridge reports to your computer.
</details>

### Glitchy or wrong BIOS/UEFI resolution
<details>
  <summary>Click to view</summary>

* On some motherboards, the BIOS may be displayed at a lower resolution, or with some rendering issues/glitches, specially on newer ASUS ones. Like this:

  <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/bios_glitch.png" alt="ASUS BIOS glitch" width="400"/>

  This can be solved by enabling the **Compatibility Support Module (CSM)** in your BIOS, usually under the **Boot** options.

  If you can't or don't want to enable the CSM, you can try connecting a DisplayPort monitor, or a [dummy plug](http://amazon.com/s?k=displayport+dummy+plug). If you remove the DP cable/adapter the bug will reappear.

  If none of this works, try connecting the DP cable first, boot into the BIOS, disable the CSM and shutdown (do not restart) your PC. Then, boot into the BIOS and enable the CSM before shutting down your PC. Then connect the HDMI and turn your PC on again.
</details>

### CSI bridge does not work with official Raspberry Pi PoE HAT
<details>
  <summary>Click to view</summary>

* Details [here](https://github.com/pikvm/pikvm/issues/6). The reason is that the [official HAT](https://www.raspberrypi.org/products/poe-hat) has a built-in fan controller that conflicts with the TC358743 chip of the bridge. The solution is to disable the fan control and connect it to the power line so that it works continuously. To turn off the controller you need to add the line `disable_poe_fan=1` to `/boot/config.txt`.
</details>

### The video freezes a few seconds after the start, restarting the Web UI or VNC does not help
<details>
  <summary>Click to view</summary>

* The story is [here](https://github.com/raspberrypi/firmware/issues/1562). Very-very rarely, Raspberry boards can have a hardware defect that causes some of the chip blocks to be unstable under normal power. The solution is to slightly increase the power supply, as in overclocking. Add `over_voltage=1` (or `over_voltage=2` if previous doesn't help) to `/boot/config.txt` and perform `reboot`.

  To make sure that you are facing this particular problem, first perform a diagnostic:
  - Boot the PiKVM without the specified options.
  - Open Web-UI and wait for freezing.
  - Click **System -> Reset Stream**.
  - Click **System -> Open log** and make sure that the log contains messages like `H264: Can't wait for the VCOS semaphore`.
  - Make sure that the last message from ustreamer was `H264: Configuring MMAL encoder` (not counting messages about connecting and disconnecting stream clients).
</details>

### No image from computer with Linux + Awesome WM
<details>
  <summary>Click to view</summary>

* Sometimes Awesome WM on Linux can't recognize a video output change on a cable. That is, if the cable was first inserted into the monitor, and then you reconnected it to PiKVM - it may happen that you will not see the image. It seems that the problem is Awesome WM, since for example with KDE, it is not reproducable. If you turn on your workstation with PiKVM already connected, everything will work fine.
</details>

-----
# USB problems (keyboard, mouse, mass storage, etc)

### My computer does not recognize USB of PiKVM v2+ at all
<details>
  <summary>Click to view</summary>

* Make sure that you have used the correct USB cable with DATA lines to connect the OTG port for the Raspberry to the computer. You may have decided to use a USB hub instead of a Y-cable and **it won't work**. Use good cables and follow the instructions :)
* In rare cases, some very buggy BIOSes does not like HID and Mass Storage in one USB device. You can either [disable Mass Storage](https://github.com/pikvm/pikvm/blob/master/pages/msd.md#disable-msd), or use [Arduino HID](https://github.com/pikvm/pikvm/blob/master/pages/arduino_hid.md) to physically separate them.
</details>

### BIOS/UEFI does not recognize USB of v2+, but computer does
<details>
  <summary>Click to view</summary>

* If you are using a USB hub or USB PCI controller, this may not be handled by your BIOS. Try to use another USB port. Some ports may have a built-in hub on the motherboard and a buggy BIOS that can't handle it.
</details>

### The keyboard works in BIOS/UEFI, but the mouse does not
<details>
  <summary>Click to view</summary>

* The BIOS does not support absolute mouse mode, which is preferred by PiKVM. In this case, [you can enable relative or dual positioning mode](mouse.md).
</details>

### I can't wake up suspended computer on v2+
<details>
  <summary>Click to view</summary>

* This feature is experimental and requires manual activation. Perform a full system update, edit `/etc/kvmd/override.yaml`, and reboot. After that, you can use remote wakeup by pressing any keyboard key or mouse button.
  ```yaml
  otg:
      remote_wakeup: true
  ```
</details>

### Mass storage drive working (I can boot an image from PiKVM v2+), but keyboard/mouse does not
<details>
  <summary>Click to view</summary>

* In rare cases, some very buggy BIOSes does not like HID and Mass Storage in one USB device. You can either [disable Mass Storage](https://github.com/pikvm/pikvm/blob/master/pages/msd.md#disable-msd), or use [Arduino HID](https://github.com/pikvm/pikvm/blob/master/pages/arduino_hid.md) to physically separate them.
</details>

### Buggy absolute mouse on Windows 98 as managed server
<details>
  <summary>Click to view</summary>

* How to fix:
  - [v2+/OTG](https://github.com/pikvm/pikvm/blob/master/pages/mouse.md#fixing-the-absolute-mouse-on-windows-98).
  - [Arduino HID](https://github.com/pikvm/pikvm/blob/master/pages/arduino_hid.md#fixing-the-usb-absolute-mouse-on-windows-98).
</details>

### Big mouse latency on another Raspberry as managed server
<details>
  <summary>Click to view</summary>

* Unusual case: RPi4 is used as a PiKVM to control RPi3. In this case, the mouse delay may be several seconds. To fix it, just add line `usbhid.mousepoll=0` to `/boot/config.txt` to the server (i.e. RPI3 in our case) and reboot it.
</details>

-----
# Web UI problems

### Chrome Certificate Issue
<details>
  <summary>Click to view</summary>

* The latest versions of Chrome do not allow access to the page with a self signed certificate, so if you see the following screen when loading the PiKVM website:

  <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/chrome.png" alt="Chrome Blocking" width="400"/>

* You can proceed by typing ```thisisunsafe``` and Chrome will then load the page.
</details>

### Pressing ESC in full screen mode causes this to close
<details>
  <summary>Click to view</summary>

* Your browser does not support [keyboard lock](https://caniuse.com/mdn-api_keyboard_lock). Right now, only Chrome implements this.
</details>

### I can't use this on iOS: the Web UI network indicator flashes yellow
<details>
  <summary>Click to view</summary>

* Safari on iOS contains an old bug that prevents a web application from connecting over a web socket if you use a self-signed certificate on the server (the default for PiKVM). There are two solutions:
  - Install a valid SSL certificate for PiKVM host to `/etc/kvmd/nginx/ssl`.
  - Disable HTTPS at all in `/etc/kvmd/nginx/nginx.conf`. To do this, comment some lines [like in this file](https://github.com/pikvm/kvmd/blob/master/configs/nginx/nginx.conf#L39) and restart web server: `systemctl restart kvmd-nginx`.

    :exclamation: Don't do this for insecure networks or the Internet. Your passwords and what you type on the keyboard will be transmitted in unencrypted form.
</details>

### The Web UI doesn't work properly in Firefox while it works fine in Chrome
<details>
  <summary>Click to view</summary>

* This might be related to your specific hardware combination or browser hardware acceleration. Try [disabling hardware acceleration in Firefox](https://support.mozilla.org/en-US/kb/hardware-acceleration-and-windowblinds-crash) or updating your GPU and chipset drivers.
</details>

### Unexpected interruption while loading the image for Mass storage drive
<details>
  <summary>Click to view</summary>

* If problems occur when uploading even a small disk image it may be due to unstable network operation or antivirus software. It is well known that Kaspersky antivirus cuts off PiKVM connections during uploading, so you should add the PiKVM website to Kaspersky's list of exceptions or not filter web requests with the antivirus. Antivirus programs can also affect the performance of certain interface elements, for example the quality slider. For Kaspersky, the steps to add the network address of PiKVM's website to the exclusion list is: **Protection -> Private browsing -> Categories and exclusions -> Exclusions**.
</details>

### I can't copy clipboard contents from the server (the machine controlled via PiKVM) to the client
<details>
  <summary>Click to view</summary>

* The clipboard only works from the client to the server not vice versa. There is currently no way to do it.
</details>

-----
# Hardware problems (Wi-Fi, ATX, etc)

### No Wi-Fi on Raspberry Pi Zero W
<details>
  <summary>Click to view</summary>

* If your device is unable to connect to the WiFi network that you have setup check the 2.4 GHz WiFi channel used by your WiFi access point. 
  If channels 12 to 14 are used (some countries have banned these channels) try to use a channel between 1 and 11.
  
* Some Zeros contain a defective Wi-Fi chip. You can either return the device to the store, or try the [software workaround](https://github.com/pikvm/pikvm/issues/137).
</details>

### LEDs/Switches does not work in ATX control
<details>
  <summary>Click to view</summary>

* Double check your wiring as per [the documentation](/README.md#setting-up-the-v2). Make sure you placed the relays (G3VM-61A1) in the correct orientation. The relays for switches (Power, Reset) have a different orientation than the ones for LEDs.
</details>
