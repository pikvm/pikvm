# Troubleshooting Pi-KVM / FAQ
As a first step we recommend carefully reading our documentation on [GitHub](https://github.com/pikvm/pikvm). Most steps to successfully set up your Pi-KVM are already described there. If you run into any issues you can check this Troubleshooting guide which will list common errors. If that still doesn't help you you're welcome to raise an [issue ticket](https://github.com/pikvm/pikvm/issues) or [join our Discord](https://discord.gg/bpmXfz5) for further help

-----

# Hardware
### No Wi-Fi on Pi Zero
- Some Zeros contain a defective Wi-Fi chip. You can either return the device to the store, or try the [software workaround](https://github.com/pikvm/pikvm/issues/137).

### LEDs / Switches do not work in ATX control
- Double check your wiring as per [the documentation](/README.md#setting-up-the-v2). Make sure you placed the relays (G3VM-61A1) in the correct orientation. The relays for switches (Power, Reset) have a different orientation than the ones for LEDs.

### Pi-KVM does not show any image from the connected computer
- Double check if you connected the HDMI-CSI-2 bridge cable correctly. [Check the documentation for details](/README.md#for-the-hdmi-csi-bridge) A red LED will light up on the bridge if it is connected properly. 
- Some laptops do not output any signal until you switched the output (usually via the FN + and an F5 key on the keyboard). 

### BIOS/UEFI does not recognize Pi-KVM USB
- If you are using a USB hub or USB PCI controller, this may not be handled by your BIOS. Try using motherboard's USB ports.

### No mouse in UEFI/BIOS
- The BIOS does not support absolute mouse mode, which is preferred by Pi-KVM. In this case, [you can enable relative positioning mode](mouse.md).

### No image in UEFI/BIOS with CSI bridge
- The problem appears on Intel NUC, GA-H77-DS3H, and some other devices. All you need to do is [change the EDID data](edid.md). This is the information about supported resolutions that the CSI bridge reports to your computer.

### Glitchy/wrong UEFI/BIOS resolution
- On some motherboards, the BIOS may be displayed at a lower resolution, or with some rendering issues/glitches, specially on newer ASUS ones. Like this:

  <img src="../img/bios_glitch.png" alt="ASUS BIOS glitch" width="400"/>

  This can be solved by enabling the **Compatibility Support Module (CSM)** in your BIOS, usually under the **Boot** options.

  If you can't or don't want to enable the CSM, you can try connecting a DisplayPort monitor, or a [dummy plug](http://amazon.com/s?k=displayport+dummy+plug). If you remove the DP cable/adapter the bug will reappear.

  If none of this works, try connecting the DP cable first, boot into the BIOS, disable the CSM and shutdown (do not restart) your PC. Then, boot into the BIOS and enable the CSM before shutting down your PC. Then connect the HDMI and turn your PC on again.

### HDMI-CSI bridge not working with official RPi PoE HAT
Details [here](https://github.com/pikvm/pikvm/issues/6). The reason is that the [HAT](https://www.raspberrypi.org/products/poe-hat) has a built-in fan controller that conflicts with the TC358743 chip. The solution is to disable the fan control and connect it to the power line so that it works continuously. To turn off the controller you need to add the line `disable_poe_fan=1` to `/boot/config.txt`.

### Big mouse latency on RPi as managed server
- Unusual case: RPi4 is used as a Pi-KVM to control RPi3. In this case, the mouse delay may be several seconds. To fix it, just add line `usbhid.mousepoll=0` to `/boot/config.txt` to the server (i.e. RPI3 in our case) and reboot it.

-----

# Software
### How do I update Pi-KVM with the latest software?
- Connect to your Pi-KVM via ssh and run:
  ```
  rw
  pacman -Syu
  reboot
  ```
  :exclamation: Pacman saves all installed packages in a compressed format so that you can roll back to the old version if something goes wrong. After you've updated and made sure everything works, it makes sense to clear the package cache so that it doesn't take up space on the SD card: `rw; pacman -Sc; ro`.

### Awesome WM video output
- Sometimes Awesome WM on Linux can't recognize a video output change on a cable. That is, if the cable was first inserted into the monitor, and then you reconnected it to Pi-KVM - it may happen that you will not see the image. It seems that the problem is Awesome WM, since for example with KDE it does not reproducing. If you turn on your workstation with Pi-KVM already connected, everything will work fine.

### Unexpected interruption while loading the image for Mass Storage Drive
- If problems occur when uploading even a small disk image it may be due to unstable network operation or antivirus software. It is well known that Kaspersky antivirus cuts off Pi-KVM connections during uploading, so you should add the Pi-KVM website to Kaspersky's list of exceptions or not filter web requests with the antivirus. Antivirus programs can also affect the performance of certain interface elements, for example the quality slider. For Kaspersky, the steps to add the network address of Pi-KVM's website to the exclusion list is: **Protection -> Private browsing -> Categories and exclusions -> Exclusions**

### The Pi-KVM web interface does not work correctly in Mozilla Firefox while it works fine in Google Chrome
- This might be related to your specific hardware combination or browser hardware acceleration. Try [disabling hardware acceleration in Firefox](https://support.mozilla.org/en-US/kb/hardware-acceleration-and-windowblinds-crash) or updating your GPU and chipset drivers.

### I can't copy clipboard contents from the server (the machine controlled via Pi-KVM) to the client
- The clipboard only works from the client to the server not vice versa. There is currently no way to do it.

### Chrome Certificate Issue
- The latest versions of Chrome do not allow access to the page with a self signed certificate, so if you see the following screen when loading the pi-kvm website:

  <img src="../img/chrome.png" alt="Chrome Blocking" width="400"/>
- You can proceed by typing ```thisisunsafe``` and Chrome will then load the page.

