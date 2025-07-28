---
title: Building PiKVM OS
description: How to build PiKVM OS from source code with Docker
---

The assembly of PiKVM OS is carried out using a special build environment.
Here the minimum required for its use, imposed on the build machine:

* kernel >= 5.8
* glibc >= 2.33
* docker >= 19.03.13
* git

Docker must work in privileged mode.

1. When starting with a clean OS you need to install and configure Docker. An example for Ubuntu:

    ```console
    [user@localhost ~]$ sudo apt-get install git make curl binutils -y
    [user@localhost ~]$ sudo apt-get install docker.io
    [user@localhost ~]$ sudo usermod -aG docker $USER
    ```

    Re-login to apply the changes.

2. Checkout the build environment:

    ```console
    [user@localhost ~]$ git clone --depth=1 https://github.com/pikvm/os
    [user@localhost ~]$ cd os
    ```

3. Determine the target board and platform:

    * Choose the board:
        * `BOARD=rpi4` for Raspberry Pi 4.
        * `BOARD=zero2w`
        * `BOARD=rpi3`
        * `BOARD=rpi2`

    * Choose the platform:
        * `PLATFORM=v4mini-hdmi` for PiKVM V4 Mini.
        * `PLATFORM=v4plus-hdmi` for PiKVM V4 Plus.
        * `PLATFORM=v3-hdmi` for RPi4 and PiKVM V3 HAT.
        * `PLATFORM=v2-hdmi` for RPi3a+/RPi4 or Zero2W with HDMI-CSI bridge.
        * `PLATFORM=v2-hdmiusb` for RPi4 with HDMI-USB dongle.
        * `PLATFORM=v1-hdmi` for RPi2 or 3b+ with HDMI-CSI bridge and the Pico HID.
        * `PLATFORM=v1-hdmiusb` for RPi2 or 3b+ with HDMI-USB dongle and the Pico HID.

4. Create the build config file `config.mk` for the target system and and the `BOARD` and `PLATFORM` variables.
    You can also set some other parameters as you wish (see below).
    Please note: if your password contains the # character, you must escape it using a backslash like `ROOT_PASSWD = pass\#word`.

    ```bash
    # Base board
    BOARD = rpi4

    # Hardware configuration
    PLATFORM = v2-hdmi

    # Target hostname
    HOSTNAME = pikvm

    # ru_RU, etc. UTF-8 only
    LOCALE = en_US

    # See /usr/share/zoneinfo
    TIMEZONE = Europe/Nicosia

    # For SSH root user
    ROOT_PASSWD = rootpass

    # Web UI credentials: user=admin, password=adminpass
    WEBUI_ADMIN_PASSWD = adminpass

    # IPMI credentials: user=admin, password=adminpass
    IPMI_ADMIN_PASSWD = adminpass
    ```

4. Build the OS. It may take about one hour depending on the Internet connection:

    ```console
    [user@localhost os]$ make os
    ```

    !!! tip
        If you get an error about failing to retrieving a file, please edit the Makefile and remove `de3.` from the repo URL.

5. Create an image. It will be stored in the `images` directory as a file with `*.img` extension:

    ```console
    [user@localhost os]$ make image
    ```

6. [Flash the result image to SD card](flashing_os.md#flashing-the-image).
