# Building the OS
The PiKVM OS is based on Arch Linux ARM and contains all the required packages and configs for it to work. 

To build the OS you will need x86_64 Linux machine with:
* kernel >= 5.8
* glibc >= 2.33
* docker >= 19.03.13

Docker must be enabled in privileged mode.

Latest Arch Linux is working.

0. When starting with a clean OS you need to install and configure docker (after adding your user to the docker group you must log out and log back in), as well as git and make.
    ```shell
    [user@localhost ~]$ sudo apt-get install git make curl binutils -y
    [user@localhost ~]$ curl -fsSL https://get.docker.com -o get-docker.sh
    [user@localhost ~]$ sudo sh get-docker.sh
    [user@localhost ~]$ sudo usermod -aG docker $USER
    ```
    Re-login to apply the changes.

1. Git checkout the build toolchain:
    ```shell
    [user@localhost ~]$ git clone https://github.com/pikvm/os
    [user@localhost ~]$ cd os
    ```

2. Determine the target hardware configuration (platform):
  * Choose the board: `BOARD=rpi4` for Raspberry Pi 4 or `BOARD=zerow`, `BOARD=rpi2`, `BOARD=rpi3` for other options.
  * Choose the platform:
    - `PLATFORM=v2-hdmi` for RPi4 or ZeroW with HDMI-CSI bridge.
    - `PLATFORM=v0-hdmi` for RPi 2 or 3 with HDMI-CSI bridge and Arduino HID.
    - `PLATFORM=v2-hdmiusb` for RPi4 with HDMI-USB dongle.
    - `PLATFORM=v0-hdmiusb` for RPi 2 or 3 with HDMI-USB dongle and Arduino HID.
    - Other options are for legacy or specialized PiKVM boards (WIP).

3. Create the config file `config.mk` for the target system. You must specify the path to the SD card on your local computer (this will be used to format and install the system) and the version of your Raspberry Pi and platform. You can change other parameters as you wish. Please note: if your password contains the # character, you must escape it using a backslash like `ROOT_PASSWD = pass\#word`.
    ```Makefile
    [user@localhost os]$ cat config.mk
    # rpi3 for Raspberry Pi 3; rpi2 for the version 2, zerow for ZeroW
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
    CARD = /dev/mmcblk0
    ```
    
    If you want to configure wifi (for ZeroW board for example) you must add these lines to `config.mk`:
    ```Makefile
    WIFI_ESSID = "my-network"
    WIFI_PASSWD = "P@$$word"
    ```

4. Build the OS. It may take about one hour depending on your Internet connection:
    ```shell
    [user@localhost os]$ make os
    ```
    
5a. Put SD card into card reader and install OS (**you should disable automounting beforehand**: `systemctl stop udisk2` or something like that):
    ```shell
    [user@localhost os]$ make install
    ```

5b. Make the image to copy elsewhere and burn on to SD
    ```shell
    [user@localhost os]$ make image
    ```
    Image is then available as a bziped file in images/

6. After installation remove the SD card and insert it into your RPi. Turn on the power. The RPi will try to get an IP address using DHCP on your LAN. It will then be available via SSH.

7. If you can't find the device's address, try using the following command:
    ```shell
    [user@localhost os]$ make scan
    ```

8. **Only for v0**: [Flash the Arduino HID](flashing_hid.md).

9. Congratulations! Your PiKVM will be available via SSH (`ssh root@<addr>` with password `root` by default) and HTTPS (try to open in a browser the URL `https://<addr>`, the login `admin` and password `admin` by default). For HTTPS a self-signed certificate is used by default.

    *The latest versions of Chrome do not allow access to the page with a self signed certificate. You can proceed by typing ```thisisunsafe``` and Chrome will then load the page*

10. To change the root password use command `passwd` via SSH or webterm. To change PiKVM web password use `kvmd-htpasswd set admin`. As indicated on the login screen use `rw` to make the root filesystem writable, before issuing these commands. After making changes, make sure to run the command `ro`.

11. Important **note for HDMI-USB dongle** users only. Because of this, many video capture devices tell the server's video card that the HDMI cable is supposedly disconnected. This may lead to the fact that if you boot the server without an active stream, the server will not detect your capture card. This is easy to fix:
    * Switch filesystem to RW-mode:
      ```
      # rw
      ```
    * Edit file `/etc/kvmd/override.yaml` and add these lines:
      ```yaml
      kvmd:
          streamer:
              forever: true
              cmd_append: [--slowdown]
      ```
    * Finish:
      ```
      # ro
      # systemctl restart kvmd
      ```

12. **27.08.2020 note about systemd**: the latest version of Arch Linux has a slightly broken systemd. The problem is that SSH to the PiKVM host may not work the first time, but the second or third. The PiKVM build environment contains a workaround for this problem: in the file `/etc/pam.d/system-login` line `-session   optional   pam_systemd.so` is commented. This does not have any negative impact on the PiKVM functionality, but if you want to, after fixing the systemd (in a couple of months with the next update), you can uncomment this line.

## Further Help
If you have any problems or questions, contact us using Discord: https://discord.gg/bpmXfz5

Subscribe to our Subreddit to follow news and releases: https://www.reddit.com/r/pikvm
