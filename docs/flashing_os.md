# Flashing the OS image

!!! warning "Micro-SD Card Requirements"
    * Minimum **16 Gb**
    * **Class 10** is strongly recommended

## Download the image

Download the appropriate SD card image. Select it based on the board, platform, and the video capture device you are using:

* [**PiKVM v3 HAT (Raspberry Pi 4)**](https://files.pikvm.org/images/v3-hdmi-rpi4-latest.img.xz) <sub>- [*sha1*](https://files.pikvm.org/images/v3-hdmi-rpi4-latest.img.xz.sha1)</sub>
* **DIY - Raspberry Pi 4, v2 platform:**
    * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-rpi4-latest.img.xz) <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-rpi4-latest.img.xz.sha1)</sub>
    * [For HDMI-USB dongle](https://files.pikvm.org/images/v2-hdmiusb-rpi4-latest.img.xz) <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmiusb-rpi4-latest.img.xz.sha1)</sub>
* **DIY - Raspberry Pi ZeroW, v2 platform:**
    * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-zerow-latest.img.xz) <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-zerow-latest.img.xz.sha1)</sub>

Pre-compiled images are only available for the Raspberry Pi 4 and ZeroW. For all other cases, you will need to build the operating system yourself. But don't worry, it's [very simple](building_os.md).


## Flash the image

!!! tip
    Choose the most suitable method for you


### Using Linux CLI

Decompress and flash the image. Be careful when choosing your device path:

```
# xz --decompress v2-hdmi-rpi4-latest.img.xz
# dd if=v2-hdmi-rpi4-latest.img of=/dev/mmcblkX
```

You can also use `dd_rescue` or `ddrescue`.


### Using RPi Imager (Linux, MacOS and Windows)

1. Download and install **the latest version** of [RPi Imager](https://github.com/raspberrypi/rpi-imager/releases).

2. Run RPi Imager:

    <img src="imager-1.jpg" width="400" />

3. Press **CHOOSE OS** and select **Use custom** image at bottom of the list:

    <img src="imager-2.jpg" width="400" />

4. After clicking on this item, select the image file (`.img.xz`), then click **CHOOSE STORAGE**:

    <img src="imager-3.jpg" width="400" />

5. Insert the memory card into the card reader. Choose the card reader from this list. **Be careful** and choose the right device:

    <img src="imager-4.jpg" width="400" />

6. After choosing the memory card, press the **WRITE** button. Confirm the operation when you are asked about it:

    <img src="imager-5.jpg" width="400" />

7. Wait for the process to finish. Get yourself a coffee or do some stretching :)

    !!! tip
        The process may hang at 99% for a long time, this is okay, just wait for it to complete

    <img src="imager-6.jpg" width="400" />

8. Remove the memory card after successful completion:

    <img src="imager-7.jpg" width="400" />

    !!! tip
        If an error occurs during flashing or booting PiKVM, repeat the process.
