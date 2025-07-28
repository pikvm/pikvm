---
title: Flashing PiKVM OS image
description: How to flash a PiKVM OS image to an SD card
---

!!! warning "Micro-SD Card Requirements"

    Minimum **32 Gb, Class 10** recommended.


-----
## Download the image

Download the appropriate SD card image. Select it based on the board, platform, and the video capture device you are using.

!!! abstract "Official PiKVM Devices"

    These images are not suitable for DIY and are intended only for our branded devices.

    * **PiKVM V4** <sub>*64-bit*</sub>
        * [PiKVM V4 Mini](https://files.pikvm.org/images/v4mini-hdmi-rpi4/aarch64/v4mini-hdmi-rpi4-aarch64-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v4mini-hdmi-rpi4/aarch64/v4mini-hdmi-rpi4-aarch64-latest.img.xz.sha1)
        * [PiKVM V4 Plus](https://files.pikvm.org/images/v4plus-hdmi-rpi4/aarch64/v4plus-hdmi-rpi4-aarch64-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v4plus-hdmi-rpi4/aarch64/v4plus-hdmi-rpi4-aarch64-latest.img.xz.sha1)

    * **PiKVM V3** <sub>*64-bit*</sub>
        * [PiKVM V3 HAT BOX Image, OLED/FAN preactivated](https://files.pikvm.org/images/v3-hdmi-rpi4/aarch64/v3-hdmi-rpi4-aarch64-box-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v3-hdmi-rpi4/aarch64/v3-hdmi-rpi4-aarch64-box-latest.img.xz.sha1)
        * [PiKVM V3 HAT DIY Assembly](https://files.pikvm.org/images/v3-hdmi-rpi4/aarch64/v3-hdmi-rpi4-aarch64-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v3-hdmi-rpi4/aarch64/v3-hdmi-rpi4-aarch64-latest.img.xz.sha1)</sub>

!!! abstract "DIY PiKVM V2 Platform"

    * **Raspberry Pi 4** <sub>*64-bit*</sub>
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-rpi4/aarch64/v2-hdmi-rpi4-aarch64-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-rpi4/aarch64/v2-hdmi-rpi4-aarch64-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v2-hdmiusb-rpi4/aarch64/v2-hdmiusb-rpi4-aarch64-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmiusb-rpi4/aarch64/v2-hdmiusb-rpi4-aarch64-latest.img.xz.sha1)</sub>

    * **Raspberry Pi Zero 2 W** <sub>*32-bit*</sub>
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v2-hdmi-zero2w/arm/v2-hdmi-zero2w-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v2-hdmi-zero2w/arm/v2-hdmi-zero2w-arm-latest.img.xz.sha1)</sub>

!!! abstract "DIY PiKVM V1 Platform"

    * **Raspberry Pi 3** <sub>*32-bit*</sub>
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-rpi3/arm/v1-hdmi-rpi3-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-rpi3/arm/v1-hdmi-rpi3-arm-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-rpi3/arm/v1-hdmiusb-rpi3-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-rpi3/arm/v1-hdmiusb-rpi3-arm-latest.img.xz.sha1)</sub>

    * **Raspberry Pi 2** <sub>*32-bit*</sub>
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-rpi2/arm/v1-hdmi-rpi2-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-rpi2/arm/v1-hdmi-rpi2-arm-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-rpi2/arm/v1-hdmiusb-rpi2-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-rpi2/arm/v1-hdmiusb-rpi2-arm-latest.img.xz.sha1)</sub>

    * **Raspberry Pi Zero 2 W** <sub>*32-bit*</sub>
        * [For HDMI-CSI bridge](https://files.pikvm.org/images/v1-hdmi-zero2w/arm/v1-hdmi-zero2w-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmi-zero2w/arm/v1-hdmi-zero2w-arm-latest.img.xz.sha1)</sub>
        * [For HDMI-USB dongle](https://files.pikvm.org/images/v1-hdmiusb-zero2w/arm/v1-hdmiusb-zero2w-arm-latest.img.xz)
            <sub>- [*sha1*](https://files.pikvm.org/images/v1-hdmiusb-zero2w/arm/v1-hdmiusb-zero2w-arm-latest.img.xz.sha1)</sub>

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

7. Refuse customization options.

    !!! warning

        The customization is designed for Raspberry OS and will not work in PiKVM OS.
        If you apply any custom settings, this will cause the image to malfunction.

        PiKVM OS has its [own settings mechanism](on_boot_config.md), please use it after the flashing
        if you need to configure Wi-Fi or something similar.
        
    <img src="RPi-imager6.jpg" width="400" />

8. Wait for the process to finish. Get yourself a coffee or do some stretching :)
    The process may hang at 99% for a long time, this is okay, just wait for it to complete.

    <img src="RPi-imager7.jpg" width="400" />

9. Remove the memory card after successful completion. If an error occurs during flashing or booting PiKVM, repeat the process.
    If the error persists, use a different memory card.
