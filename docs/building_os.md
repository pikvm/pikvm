# Building the OS

!!! warning "ZeroW reached End-Of-Life and is no longer supported, the last image it can be found [here](https://files.pikvm.org/images/v2-hdmi-zerow-latest.img.xz)"

The PiKVM OS is based on Arch Linux ARM and contains all the required packages and configs for it to work. To build the OS you will need x86_64 Linux machine with:

* kernel >= 5.8
* glibc >= 2.33
* docker >= 19.03.13

Docker must be enabled in privileged mode.

1. When starting with a clean OS you need to install and configure docker (after adding your user to the docker group you must log out and log back in), as well as git and make. An example for Ubuntu:

    ```shell
    [user@localhost ~]$ sudo apt-get install git make curl binutils -y
    [user@localhost ~]$ sudo apt-get install docker.io
    [user@localhost ~]$ sudo usermod -aG docker $USER
    ```

    Re-login to apply the changes.

2. Git checkout the build toolchain:

    ```shell
    [user@localhost ~]$ git clone --depth=1 https://github.com/pikvm/os
    [user@localhost ~]$ cd os
    ```

3. Determine the target hardware configuration (platform):

    * Choose the board: `BOARD=rpi4` for Raspberry Pi 4 or `BOARD=zerow`, `BOARD=rpi2`, `BOARD=rpi3` for other options.
    * Choose the platform:
        * `PLATFORM=v4mini-hdmi` for PiKVM V4 Mini.
        * `PLATFORM=v4plus-hdmi` for PiKVM V4 Plus.
        * `PLATFORM=v3-hdmi` for RPi4 and PiKVM V3 HAT.
        * `PLATFORM=v2-hdmi` for RPi3a+/RPi4 or Zero2W with HDMI-CSI bridge.
        * `PLATFORM=v2-hdmiusb` for RPi4 with HDMI-USB dongle.
        * `PLATFORM=v0-hdmi` for RPi2 or 3b+ with HDMI-CSI bridge and Arduino HID.
        * `PLATFORM=v0-hdmiusb` for RPi2 or 3b+ with HDMI-USB dongle and Arduino HID.
        * Other options are for legacy or specialized PiKVM boards (WIP).

4. Create the config file `config.mk` for the target system. You must specify the path to the SD card on your local computer (this will be used to format and install the system) and the version of your Raspberry Pi and platform. You can change other parameters as you wish. Please note: if your password contains the # character, you must escape it using a backslash like `ROOT_PASSWD = pass\#word`.

!!! warning "In any case, do **not** use the default passwords. In order to generate a random password just use following command:" ```printf '%s\n' $(head /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | head -c16)```

    ```Makefile
    [user@localhost os]$ cat config.mk
    # rpi4 for Raspberry Pi 4; rpi3 for Raspberry Pi 3; rpi2 for the version 2, zero2w for Zero2W
    BOARD = rpi4
    
    # Hardware configuration
    PLATFORM = v2-hdmi
    
    # Target hostname
    HOSTNAME = pikvm
    
    # ru_RU, etc. UTF-8 only
    LOCALE = en_US
    
    # See /usr/share/zoneinfo
    TIMEZONE = Europe/Moscow
    
    # For SSH root user
    ROOT_PASSWD = root
    
    # Web UI credentials: user=admin, password=<this>
    WEBUI_ADMIN_PASSWD = admin
    
    # IPMI credentials: user=admin, password=<this>
    IPMI_ADMIN_PASSWD = admin
    
    # SD card device
    # (Used for burning the image with `make install`. Irrelevant if you only use `make image`.)
    CARD = /dev/mmcblk0
    ```

4. Build the OS. It may take about one hour depending on your Internet connection:

    ```shell
    [user@localhost os]$ make os
    ```
!!! warning "If you get an error about failing to retrieving a file, please edit the Makefile and remove "de3." from the repo path"
    
5. One of two actions:
    * Put SD card into card reader and install OS (**you should disable automounting beforehand**: `systemctl stop udisk2` or something like that):

        ```shell
        [user@localhost os]$ make install
        ```

    * Or make the image only. You can then later burn it on an SD card (e.g. using the Raspberry Pi Imager, see article [Flashing the OS image](https://docs.pikvm.org/flashing_os/#flash-the-image)):

        ```shell
        [user@localhost os]$ make image
        ```

        Image is then available as [xz](https://linux.die.net/man/1/xz) compressed file in `images/`.
        
!!! note "On a system where `sudo` is unavailable, you can use `make SUDO= image`."
