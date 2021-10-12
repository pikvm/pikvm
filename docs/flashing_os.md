# Flashing the OS image

!!! warning "Micro-SD Card Requirements"
    * Minimum **16 Gb**
    * **Class 10** is strongly recommended

## Download the image

Download the appropriate SD card image. Select it based on the board, platform, and the video capture device you are using:

* [**PiKVM v3 HAT (Raspberry Pi 4)**](https://pikvm.org/images/v3-hdmi-rpi4.img.bz2) <sub>- [*sha1*](https://pikvm.org/images/v3-hdmi-rpi4.img.bz2.sha1)</sub>
* **DIY - Raspberry Pi 4, v2 platform:**
    * [For HDMI-CSI bridge](https://pikvm.org/images/v2-hdmi-rpi4.img.bz2) <sub>- [*sha1*](https://pikvm.org/images/v2-hdmi-rpi4.img.bz2.sha1)</sub>
    * [For HDMI-USB dongle](https://pikvm.org/images/v2-hdmiusb-rpi4.img.bz2) <sub>- [*sha1*](https://pikvm.org/images/v2-hdmiusb-rpi4.img.bz2.sha1)</sub>
* **DIY - Raspberry Pi ZeroW, v2 platform:**
    * [For HDMI-CSI bridge](https://pikvm.org/images/v2-hdmi-zerow.img.bz2) <sub>- [*sha1*](https://pikvm.org/images/v2-hdmi-zerow.img.bz2.sha1)</sub>

Pre-compiled images are only available for the Raspberry Pi 4 and ZeroW. For all other cases, you will need to build the operating system yourself. But don't worry, it's [very simple](building_os.md).


## Flash the image

!!! tip
    Choose the most suitable method for you


### Using Linux CLI

Decompress and flash the image. Be careful when choosing your device path:
```
# bzip2 -d v2-hdmi-rpi4.img.bz2
# dd if=v2-hdmi-rpi4.img of=/dev/mmcblkX
```


### Using balenaEtcher (Linux, MacOS and Windows)

1. Download and install [balenaEtcher](https://www.balena.io/etcher).

2. Decompress the image file using your favorite archive software. If you don't have one that supports `.bz2` files (on Windows for example) - [7-Zip](https://www.7-zip.org) is a great and free tool. *Do not try to flash a compressed image: either it will not work, or it will take a very long time.*

3. Run balenaEtcher:

    <img src="balena-1.png" alt="drawing" height="250" />

4. Press **Flash from file** and select a **decompressed** image (a file with `.img` suffix):

    <img src="balena-2.png" alt="drawing" height="250" />

5. Insert the memory card into the card reader. Press **Select target** and choose your memory card:

    <img src="balena-3.png" alt="drawing" height="250" />

6. Press **Flash!** button.

    <img src="balena-4.png" alt="drawing" height="250" />

7. Wait for the process to finish. Get yourself a coffee or do some stretching :) If an error occurs during flashing, repeat the process:

    <img src="balena-5.png" alt="drawing" height="250" />

!!! tip
    If balenaEtcher does not work for you and you continue to get failed bootup's, download the [Raspberry Pi Imager](https://www.raspberrypi.com/software) and use that instead. The general algorithm of actions is exactly the same: use a decompressed image, run Imager, select a device and flash the image there.
