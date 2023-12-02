# Flashing PiKVM OS image

!!! warning "Micro-SD Card Requirements"
    Minimum **16 Gb, Class 10** recommended

-----
## Download the image

Download the appropriate SD card image. Select it based on the board, platform, and the video capture device you are using.

!!! abstract "Official PiKVM Devices"

    These images are not suitable for DIY and are intended only for our branded devices.

    * **PiKVM V4**
        * [PiKVM V4 Mini](https://files.pikvm.org/images/v4mini-hdmi-rpi4-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v4mini-hdmi-rpi4-latest.img.xz.sha1)
        * [PiKVM V4 Plus](https://files.pikvm.org/images/v4plus-hdmi-rpi4-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v4plus-hdmi-rpi4-latest.img.xz.sha1)

    * **PiKVM V3**
        * [PiKVM V3 HAT BOX Image, OLED/FAN preactivated](https://files.pikvm.org/images/v3-hdmi-rpi4-box-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v3-hdmi-rpi4-box-latest.img.xz.sha1)
        * [PiKVM V3 HAT DIY Assembly](https://files.pikvm.org/images/v3-hdmi-rpi4-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v3-hdmi-rpi4-latest.img.xz.sha1)</sub>

!!! abstract "DIY PiKVM V2 Platform"

    * **Raspberry Pi 4**
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-rpi4-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-rpi4-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v2-hdmiusb-rpi4-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmiusb-rpi4-latest.img.xz.sha1)</sub>

    * **Raspberry Pi Zero 2 W**
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-zero2w-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-zero2w-latest.img.xz.sha1)</sub>

    * **Raspberry Pi Zero W (obsolete)**
        * Support has been discontinued due to reaching the End-of-Life of the base board.<br>
            Please join [Discord](https://discord.gg/bpmXfz5) and ask about this in #unofficial_ports channel if you still want to use it.

!!! abstract "DIY PiKVM V1 Platform"

    * **Raspberry Pi 3**
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-rpi3-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-rpi3-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-rpi3-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-rpi3-latest.img.xz.sha1)</sub>

    * **Raspberry Pi 2**
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-rpi2-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-rpi2-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-rpi2-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-rpi2-latest.img.xz.sha1)</sub>

    * **Raspberry Pi Zero 2 W**
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-zero2w-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-zero2w-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-zero2w-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-zero2w-latest.img.xz.sha1)</sub>

!!! abstract "Any other combinations for advanced users"
    Please check the [file archives](https://files.pikvm.org/images/) for ready-made image or [build the image yourself](building_os.md).


-----
## Flashing the image

!!! tip
    After inserting the memory card into your computer, ignore request to format. This is not nessessary.


### Using Linux CLI (ADVANCED USERS)

Decompress (if nessessary) and flash the image. **Be careful when choosing the device path, it may be different on your machine**:

```console
[user@localhost]$ xz --decompress v2-hdmi-rpi4-latest.img.xz
[user@localhost]$ sudo dd if=v2-hdmi-rpi4-latest.img of=/dev/mmcblkX
```

You can also use `dd_rescue` or `ddrescue`.


### Using RPi Imager (Linux, MacOS and Windows)

1. Download and install **the latest version** of [RPi Imager](https://github.com/raspberrypi/rpi-imager/releases).

2. Run RPi Imager:

    <img src="RPi-imager1.jpg" width="400" />

3. Press **NO FILTERING** then **CHOOSE OS** and select **Use custom** image at bottom of the list:

    <img src="RPi-imager2.jpg" width="400" />

4. After clicking on this item, select the image file (`*.img` or `*.img.xz`), then click **CHOOSE STORAGE**:

    !!! warning
        This should already be set to blank though the flashing process from step 7 but its best to double check the advanced settings (`CTRL+SHIFT+X`), make sure they are blank or the flash will fail.

    <img src="RPi-imager3.jpg" width="400" />

5. Insert the memory card into the card reader. Choose the card reader from this list. **Be careful** and choose the right device:

    <img src="RPi-imager4.jpg" width="400" />

6. After choosing the memory card, press the **WRITE** button. Confirm the operation when you are asked about it:

    <img src="RPi-imager5.jpg" width="400" />

7. Wait for the process to finish. Get yourself a coffee or do some stretching :)
    The process may hang at 99% for a long time, this is okay, just wait for it to complete.

    <img src="RPi-imager6.jpg" width="400" />

8. Remove the memory card after successful completion. If an error occurs during flashing or booting PiKVM, repeat the process.
    If the error persists, use a different memory card.

    <img src="RPi-imager7.jpg" width="400" />
