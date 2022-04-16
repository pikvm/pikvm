# FAQ & Troubleshooting

As a first step, we recommend carefully reading our documentation on [GitHub](https://github.com/pikvm/pikvm). Most steps to successfully set up your PiKVM are already described there. If you run into any issues you can check this page which will list common errors. If that still doesn't help you you're welcome to raise an [issue ticket](https://github.com/pikvm/pikvm/issues) or [join our Discord](https://discord.gg/bpmXfz5) for further help.

!!! tip
    If you can't find an answer to your question here, try the [Community FAQ](community_faq.md). It will be merged with this page in the future.


## Common questions

??? question "Can I connect multiple servers to a single PiKVM?"
    Yes, but it requires additional work to set up. See [this page](multiport.md).


??? question "How can I get the access to PiKVM in my local network over Internet?"
    You can use port forwarding for port 443 on your router if it has an external IP address. In all other cases, you can use the excellent free VPN service [Tailscale](tailscale.md), which can be configured on PiKVM with a [few simple commands](tailscale.md).


??? question "Can I assign a static IP to a PiKVM"
    Edit file `/etc/systemd/network/eth0.network` for Ethernet or `wlan0.network` for Wi-Fi and edit the `[Network]` section:

    ```ini
    [Network]
    Address=192.168.x.x/24
    Gateway=192.168.x.x
    DNS=192.168.x.x
    DNS=192.168.x.x
    ```

    If you're using Wi-Fi but you don't have `/etc/systemd/network/wlan0.network` file, then first you will need to [`migrate the Wi-Fi settings from `netctl` to `systemd-networkd`](wifi.md).


??? question "Can I use PiKVM for gaming?"
    No, because:

    * For HDMI-CSI bridge, bus bandwidth is not enough to transmit more than 1080p50.
    * For HDMI-USB dongle, high latency and low video quality.
    * General hardware video capture differs from software streaming and introduces additional latency.
    * PiKVM can't transmit audio at this time. It will be available on PiKVM v3 HAT at some point in the future (implemented in the hardware, but doesn't have software support).


??? question "Can PiKVM do 4K video?"
    * For HDMI-CSI bridge, no. There is not enough bandwidth in the CSI bus for that much data. 1080p50 will max out the bandwidth.
    * For the USB capture devices: technically yes, they will downsample to something smaller to meet the USB 2.0 bandwidth limitations, so the source may be 4k, but the stream will not.
    * The 4K real-time video will not fit through the network anyway.


??? question "Where does the video latency come from?"
    Here is the chain of transferring an image to your browser or VNC client.

    `Capture device -> Compression -> Network -> Decompression -> Rendering`

    100-200ms is very, very fast for this. But we are working to speed things up even more.


??? question "Does PiKVM support sound?"
    At this time sound is not supported on any platform. Once sound is implemented, it will only be available for PiKVM v3 HAT. Due to a hardware bug in HDMI-CSI bridges, sound may or may not work.


??? question "Can I power the Pi via PoE?"
    Yes! But you still need to ensure you isolate the 5v connection between the Raspberry Pi and host PC to prevent backpower issues that can cause instability or damage to either the host PC or the Pi. Power/Data cable + USB power blocker would work.


??? question "Do I need a power splitter? Why do I need one?"
    * Yes for RPi4 - Please see the main readme for splitter types listed under V2 Hardware
    * Yes for Zero W and Zero W 2, if using dedicated power you still need to split the power from the data towards the target. If using the target for power, this is not needed.
    * This is not needed if you have a v3 HAT, as the HAT splits power and signal on the board.


??? question "Can I use PiKVM with non-Raspberry Pi boards (Orange, Nano, etc)?"
    Yes, but you will have to prepare the operating system yourself. For the PiKVM software, you will need to replace some config files (such as UDEV rules). If you are a developer or an experienced system administrator, you will not have any problems with this. In addition, we are open to patches. If you need help with this, please contact us via [Discord](https://discord.gg/bpmXfz5).


??? question "Is PiKVM OS its own custom distro?"
    No. PiKVM OS is an [Arch Linux ARM](https://archlinuxarm.org) with our own repository for KVM-related packages. We distribute OS images (that is, our Arch Linux ARM build) to simplify installation, since PiKVM requires some tuning of the OS and special partitioning of the memory card.


??? question "Why is PiKVM OS based on Arch Linux ARM and not Raspbian / Raspberry Pi OS?"
    There are several reasons:

    * Several years ago, when PiKVM was just starting out, Raspbian didn't have a minimalistic image and the transition to systemd was in full swing, which is why the distribution was not too stable.
    * Raspbian did not have all the necessary packages in the repositories to satisfy most software dependencies.
    * PiKVM was born as a pet project, and the founder likes Arch the most.

    However, we plan to provide an alternative OS image based on Raspbian in the future - now it is quite stable.

??? question "Can I use an iPad on PiKVM?"
    * Yes, with the correct hardware you can control an iPad.
    * In the opposite sense - yes, use VNC and use JUMP app (fully-featured but more expensive), or bVNC (cheap). RealVNC does NOT work.


??? question "How do I add my own SSL cert?"
    If you have a certificate (making a cert falls outside the scope of PiKVM - please reference OpenSSL documentation), replace keys in `/etc/kvmd/nginx/ssl`, edit `/etc/kvmd/nginx/ssl.conf` if necessary and restart `kvmd-nginx` service.


??? question "How do I emulate various USB devices on the target machine?"
    By default this is what is set:

    ```yaml
    otg:
        manufacturer: PiKVM
        product: Composite KVM Device
        vendor_id: 0x1D6B
        product_id: 0x0104
        serial: CAFEBABE
    ```

    You can change how this is displayed with the following example for `/etc/kvmd/override.yaml` file:

    ```yaml
    otg:
        manufacturer: Corsair
        product: Corsair Gaming RGB
        vendor_id: 0x6940
        product_id: 0x6973
		serial:
    ```

    Use the following USB database to get the desired devices: https://the-sz.com/products/usbid or https://devicehunt.com.


??? question "Can I run a desktop on PiKVM?"
    Yes, but it's strongly not recommended OR supported as this OS should be used in read-only mode and it will need read-write enabled all of the time. Instructions [here](https://www.linuxfordevices.com/tutorials/linux/how-to-install-gui-on-arch-linux).


??? question "How do I blank the oled screen?"
    Please run the following:
    
    ```
    /usr/bin/kvmd-oled --height=32 --interval=5 --clear-on-exit --text="turn off in 5s"
    systemctl disable --now kvmd-oled kvmd-oled-reboot kvmd-oled-shutdown
    ```

??? question "I am getting a 500/503 error when I try and access the main KVM page!"
    This is due to your recent changes in your yaml file; you have to use spaces and NOT tabs.
    Undo what you just did, then, `systemctl restart kvmd`, does it work again?
    Review what you added and take care of [YAML syntax](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html).
    
    For future edits there are some steps you can do to prevent this from happening again.

    Make a .nanorc file and populate it with the following:

    ```
    set tabsize 4
    set tabstospaces
    ```

    Now re-edit your `/etc/kvmd/override.yaml` file and just use tab to get the right spacing, you might need to delete the current leading "spaces" to ensure proper formatting.


??? question "How can I use the serial console to access to access other devices"
    you need to stop the service which listens on the ttyAMA0:
    
    ```
    rw
    systemctl stop serial-getty@ttyAMA0.service
    ```
    
    If you want this change permanent (not starting again after reboot), you can disable this service, ('enable' to reverse this decision):
    
    ```
    systemctl disable serial-getty@ttyAMA0.service
    ```
    
    !!! note
        * Only USB OR the RJ-45 serial connector will work, you can't use them together! 
        * If you disable the service permanently, you can't recover your device via serial console if you need this.
        * There are some reports, that you need to remove "ttyAMA0" from /boot/cmdline.txt, but this is not needed on new installations.


## First steps

??? question "I can't find the PiKVM IP address in my network"
    Follow [this guide](first_steps.md#getting-access-to-pikvm).


??? question "What is the default password? How do I change it?"
    There are two types of accounts: OS and PiKVM (web interface) accounts. The system account `root` can be used for SSH/UART access and has the password `root`. The web interface account is called `admin` and has the password `admin`. The PiKVM account cannot be used for SSH access and vice versa.

    To change passwords, use the following commands (under root):

    ```bash
    su -  # If you're in the webterm
    rw  # Switch filesystem to read-write mode
    passwd root  # Change OS root password
    kvmd-htpasswd set admin  # Change web ui admin password
    ro  # Back to read-only
    ```


??? question "How do I get root access in the web terminal?"
    The web terminal works with the account `kvmd-webterm`. This is a regular user with no administrator privileges. In addition, `sudo` and login are disabled for this user for security reasons. To get `root` access, you need to use the `su -` command (minus is important) and **enter the root password**.


??? question "Where is the PiKVM configuration located?"
    Almost all KVMD (the main daemon controlling PiKVM) configuration files are located in `/etc/kvmd`. You can also find nginx configs and SSL certificates there. KVMD configs use [YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html) syntax. The specific platform parameters can be found in the file `/etc/kvmd/main.yaml` and **you should never edit it**. Use `/etc/kvmd/override.yaml` to redefine the system parameters.

    Files that are not recommended for editing have read-only permissions. If you edit any of these files, you will need to manually make changes to them when you upgrade your system. You can view the current configuration and all available KVMD parameters using the command `kvmd -m`.


??? question "I can't edit any file on PiKVM. Why is the system in read-only mode?"
    The PiKVM file system is always mounted in read-only mode. This measure prevents it from being damaged by a sudden power outage. To change the configuration you must first switch the filesystem to write mode using the command `rw` from root. After the changes, be sure to run the command `ro` to switch it back to read-only. If you get a message that the file system is busy, then the easiest way is to perform a `reboot`.


??? question "I want to get read-write filesystem all of the time"
    !!! danger "DON'T DO THIS"
    !!! danger "DON'T DO THIS"
    !!! danger "DON'T DO THIS"

    **Seriously, DON'T**. Read-only mode increases the life of the memory card and protects the filesystem from power loss failures. See the question above ^ ^ ^

    You can turn it off, but don't say you weren't warned.

    ??? danger "DON'T OPEN THIS SPOILER AND DON'T DO THIS"
        Okay, fine.

        * Edit `/boot/cmdline.txt` and change option `ro` to `rw`.
        * Do the same in `/etc/fstab` for the `/boot` partition.
        * Comment `tmpfs` lines in `/etc/fstab` for `/var/lib` and `/var/log`.
        !!! danger "But again: DON'T DO THIS"


??? question "How do I install or remove packages in PiKVM OS?"
    PiKVM OS is based on Arch Linux ARM and uses the [pacman](https://wiki.archlinux.org/title/Pacman) package manager.

    * Switch filesystem to RW-mode: `rw`.
    * Update the package cache: `pacman -Syy`.
    * Find some packages (`emacs` for example): `pacman -Ss emacs`.
    * Install it: `pacman -S emacs`.
    * Remove it: `pacman -R emacs`.
    * Switch filesystem to RO-mode: `ro`.


??? question "How do I update PiKVM with the latest software?"
    PiKVM OS is based on Arch Linux ARM and is fully updated from the repository by a regular package manager. Connect to your PiKVM via ssh and run:

    ```
    # rw
    # pacman -Syu
    # reboot
    ```

    Pacman saves all installed packages in a compressed format so that you can roll back to the old version if something goes wrong. After you've updated and made sure everything works, it makes sense to clear the package cache so that it doesn't take up space on the SD card: `rw; rm -rf /var/cache/pacman/pkg; ro`.


??? question "I don't need ATX functions. How do I disable this in the Web UI?"
    If you don't need ATX power control you can disable the relevant Web UI menu in `/etc/kvmd/override.yaml`:

    ```yaml
    kvmd:
        atx:
            type: disabled
    ```

    ... then restart `kvmd`:

    ```
    # systemctl restart kvmd
    ```


??? question "How do I disable the web terminal?"
    ```
    # systemctl disable --now kvmd-webterm
    ```


??? question "How do I completely disable authorization in PiKVM?"
    Edit the file `/etc/kvmd/override.yaml`:

    ```yaml
    kvmd:
        auth:
            enabled: false
    ```

    ... then restart `kvmd`:

    ```
    [root@pikvm ~]# systemctl restart kvmd
    ```


??? question "Can I have different hostnames for each of my PiKVMs?"
    Yes! And it's easy to do! Using a SSH session or the web terminal:
    1. Make sure you are root, run `rw` then run `hostnamectl set-hostname yournewhostname.domain`.
    2. Optional: edit `/etc/kvmd/meta.yaml` to alter the displayed hostname in the web UI.
    3. Run `ro` and `reboot`.

   
## Video problems

??? question "I can see the video but I can't see the WebRTC switch"
    WebRTC is an alternative mode for the default MJPEG and it's only supported on v2+ platforms with the CSI video capture device. See [this](webrtc.md) page to solve any problems with WebRTC.


??? question "PiKVM does not show the video from the computer at all"
    * Double-check that the video capture device is connected correctly. For the [CSI bridge](/README.md#for-the-hdmi-csi-bridge), this should be exactly the camera port; for the [USB dongle](/README.md#for-the-hdmi-usb-dongle), strictly the port indicated in the picture.
    * Some laptops do not output any signal until you switch the output (usually via the FN + and an F5 key on the keyboard).
    * Your computer may have turned on sleep mode for the monitor. Move the mouse to turn it off.


??? question "The video works in the booted OS, but not in the BIOS/UEFI"
    This problem appears on Intel NUC, GA-H77-DS3H, and some other devices when using a CSI bridge. All you need to do is [change the EDID data](edid.md). This is the information about supported resolutions that the CSI bridge reports to your computer.


??? question "Glitchy or wrong BIOS/UEFI resolution"
    On some motherboards, the BIOS may be displayed at a lower resolution, or with some rendering issues/glitches, specially on newer ASUS ones. Like this:

    <img src="bios_glitch.png" alt="ASUS BIOS glitch" width="400"/>

    This can be solved by enabling the **Compatibility Support Module (CSM)** in your BIOS, usually under the **Boot** options.

    If you can't or don't want to enable the CSM, you can try connecting a DisplayPort (DP) monitor, or a [dummy plug](http://amazon.com/s?k=displayport+dummy+plug). If you remove the DP cable/adapter the bug will reappear.

    If none of this works, try connecting the DP cable first, boot into the BIOS, disable the CSM and shutdown (do not restart) your PC. Then, boot into the BIOS and enable the CSM before shutting down your PC. Then connect the HDMI and turn your PC on again.


??? question "Why does the CSI bridge does not work with official Raspberry Pi PoE HAT?"
    Details [here](https://github.com/pikvm/pikvm/issues/6). The reason is that the [official HAT](https://www.raspberrypi.org/products/poe-hat) has a built-in fan controller that conflicts with the TC358743 chip of the bridge. The solution is to disable the fan control and connect the fan to the power line so that it works continuously. To turn off the controller you need to add the line `disable_poe_fan=1` to `/boot/config.txt`.


??? question "The video freezes a few seconds after the start, restarting the Web UI or VNC does not help"
    The story is [here](https://github.com/raspberrypi/firmware/issues/1562). Very very rarely, Raspberry Pi boards can have a hardware defect that causes some of the chip blocks to be unstable under normal power. The solution is to slightly increase the power supply, as you would when overclocking. Add `over_voltage=1` (or `over_voltage=2` if previous doesn't help) to `/boot/config.txt` and perform `reboot`.

    To make sure that you are facing this particular problem, first perform a diagnostic:

    * Boot the PiKVM without the specified options.
    * Open Web-UI and wait for freezing.
    * Click `System -> Reset Stream`.
    * Click `System -> Open log` and make sure that the log contains messages like `H264: Can't wait for the VCOS semaphore`.
    * Make sure that the last message from ustreamer was `H264: Configuring MMAL encoder` (not counting messages about connecting and disconnecting stream clients).


??? question "No image from computer with Linux + Awesome WM"
    Sometimes Awesome WM on Linux can't recognize a video output change on a cable. That is, if the cable was first inserted into the monitor, and then you reconnected it to PiKVM - it may happen that you will not see the image. It seems that the problem is Awesome WM, since for example with KDE, it is not reproducable. If you turn on your workstation with PiKVM already connected, everything will work fine.


??? question "Windows shows limited Available Resolutions"
    This is due to a driver issue. A possible resolution can be found [here](https://github.com/pikvm/pikvm/issues/577#issuecomment-998713201).
    

## USB problems (keyboard, mouse, mass storage, etc)

??? question "My computer does not recognize USB of PiKVM v2+ at all"
    * Make sure that you have used the correct USB cable with DATA lines to connect the OTG port for the Raspberry to the computer. You may have decided to use a USB hub instead of a Y-cable and **it won't work**. Use good cables and follow the instructions :)
    * In rare cases, some very buggy BIOSes do not like HID and Mass Storage in one USB device. You can either [disable Mass Storage](msd.md#disable-msd), or use an [Arduino HID](arduino_hid.md) to physically separate them.


??? question "BIOS/UEFI does not recognize USB of v2+, but computer does"
    If you are using a USB hub or USB PCI controller, this may not be handled by your BIOS. Try to use another USB port. Some ports may have a built-in hub on the motherboard and a buggy BIOS that can't handle it.


??? question "My keyboard works in BIOS/UEFI, but my mouse does not"
    The BIOS does not support absolute mouse mode, which is preferred by PiKVM. In this case, [you can enable relative or dual positioning mode](mouse.md).


??? question "I can't wake up suspended computer on v2+"
    This feature is experimental and requires manual activation. Perform a full system update, edit `/etc/kvmd/override.yaml`, and reboot. After that, you can use remote wakeup by pressing any keyboard key or mouse button.

    ```yaml
    otg:
        remote_wakeup: true
    ```


??? question "My mass storage drive works (I can boot an image from PiKVM v2+), but my keyboard/mouse does not"
    In rare cases, some very buggy BIOSes does not like HID and Mass Storage in one USB device. You can either [disable Mass Storage](msd.md#disable-msd), or use an [Arduino HID](arduino_hid.md) to physically separate them.


??? question "Buggy absolute mouse on Windows 98 as managed server"
    How to fix:

    * [v2+/OTG](mouse.md#fixing-the-absolute-mouse-on-windows-98).
    * [Arduino HID](arduino_hid.md#fixing-the-usb-absolute-mouse-on-windows-98).


??? question "There's big mouse latency on another Raspberry Pi as managed server"
    Unusual case: RPi4 is used as a PiKVM to control RPi3. In this case, the mouse delay may be several seconds. To fix it, append `usbhid.mousepoll=0` to the boot line in `/boot/cmdline.txt` on the managed server (i.e. RPI3 in our case) and reboot it. [Source.](https://www.reddit.com/r/pikvm/comments/m4xs79/slow_mouse_response/)


??? question "What speed is the USB OTG port?"
    Per the official RPI documentation, this is a limitation of the SoC.  The OTG port is only USB2.0, so is limited to 455 Mbit/s.


## Web UI problems

??? question "Chrome reports a Certificate Issue when I try to access the PiKVM web interface"
    The latest versions of Chrome do not allow access to the page with a self signed certificate, so if you see the following screen when loading the PiKVM website:

    <img src="chrome.png" alt="Chrome Blocking" width="400"/>

    You can proceed by typing `thisisunsafe` and Chrome will then load the page.


??? question "Pressing ESC in full screen mode causes the PiKVM page to close"
    Your browser does not support [keyboard lock](https://caniuse.com/mdn-api_keyboard_lock). Right now (January 2022), only Chromium implements this, so it works on Chrome, Edge, and Opera.


??? question "I can't use the PiKVM web interface on iOS: the Web UI network indicator flashes yellow"
    Safari on iOS contains an old bug that prevents a web application from connecting over a web socket if you use a self-signed certificate on the server (the default for PiKVM). There are two solutions:

    * Install a valid SSL certificate for PiKVM host to `/etc/kvmd/nginx/ssl`.
    * Disable HTTPS at all in `/etc/kvmd/nginx/nginx.conf`. To do this, comment some lines [like in this file](https://github.com/pikvm/kvmd/blob/master/configs/nginx/nginx.conf#L39) and restart web server: `systemctl restart kvmd-nginx`.

    !!! danger
        Don't do this for insecure networks or the Internet. Your passwords and what you type on the keyboard will be transmitted in unencrypted form.


??? question "The Web UI doesn't work properly in Firefox while it works fine in Chrome"
    This might be related to your specific hardware combination or browser hardware acceleration. Try [disabling hardware acceleration in Firefox](https://support.mozilla.org/en-US/kb/hardware-acceleration-and-windowblinds-crash) or updating your GPU and chipset drivers.


??? question "Unexpected interruption while loading the image for Mass storage drive"
    If problems occur when uploading even a small disk image it may be due to unstable network operation or antivirus software. It is well known that Kaspersky antivirus cuts off PiKVM connections during uploading, so you should add the PiKVM website to Kaspersky's list of exceptions or not filter web requests with the antivirus. Antivirus programs can also affect the performance of certain interface elements, for example the quality slider. For Kaspersky, the steps to add the network address of PiKVM's website to the exclusion list is: `Protection -> Private browsing -> Categories and exclusions -> Exclusions`.


## Hardware problems (Wi-Fi, ATX, etc)

??? question "I can't connect to Wi-Fi on a Raspberry Pi Zero W"
    * Some Zeros contain a defective Wi-Fi chip. You can either return the device to the store, or try the [software workaround](https://github.com/pikvm/pikvm/issues/137).


??? question "I can't connect to Wi-Fi at all!"
    * If your device is unable to connect to the Wi-Fi network that you have set up, check the 2.4 GHz Wi-Fi channel used by your Wi-Fi access point. 
      If channels 12 to 14 are used (some countries have banned these channels) try to use a channel between 1 and 11.


??? question "LEDs/Switches do not work in ATX control"
    Double check your wiring as per [the documentation](/README.md#setting-up-the-v2). Make sure you placed the relays (G3VM-61A1) in the correct orientation. The relays for switches (Power, Reset) have a different orientation than the ones for LEDs.


??? question "My PiKVM keeps disconnecting from the Wi-Fi network"
    Try to edit `/etc/conf.d/wireless-regdom` and look for your region and uncomment it. For example: `WIRELESS_REGDOM="US"`.


??? question "PiKVM complains about low power warnings"
    * Are you using a "proper" power supply? Not one you hacked together?
    * Some USB power bricks advertise 5V 2.1A or higher, but can't deliver consistent 5V.  Best to use Raspberry Pi Foundation recommended power supplies.
    

??? question "PiKVM complains about a RTC low voltage detected, date/time is not reliable"
    * This is mearly a warning that can be ignored however, the following resolves the issue: 
    * Leave plugged in for 24+ hours and or
    * Connect to the internet using the eth cable, the internal NTP service will set the time accordlingly
    * Force a time sync: `rw && hwclock --systohc"` or `"rw && hwclock -w"`
    * Set date and time manually can be found [here.](https://www.cyberciti.biz/faq/howto-set-date-time-from-linux-command-prompt/)
