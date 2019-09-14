# DIY IP KVM System with WEB-interface using Raspberry Pi
Stand-alone IP KVM device with web interface with various video capture options and bunch of features like keyboard/mouse control, ATX control (power/reset/ HDD load), Mass-Storage Device. 

![Screenshot](image1.png)

## Minimal hardware implementation
- Raspberry Pi 2, 3 or 4(work in progress)
- MicroSD card
- Raspberry Pi power supply

**Video capture side for lowcost S-Video**
- Easycap UTV007 device (https://www.amazon.com/dp/B0126O0RDC)
- HDMI to S-Video (not all options work, but these two have been tested) (https://www.amazon.com/dp/B012MDMWLM or https://www.amazon.com/gp/product/B01E56CV42)
  
**Video capture side for HDMI**
- B101 HDMI to CSI-2 Bridge (https://auvidea.eu/b101-hdmi-to-csi-2-bridge-15-pin-fpc/)

**HID Subsystem and ATX control**
- Arduino Pro Micro with hardware USB for HID sub-system
- GPIO cables
- 2-Channel Relay Module
- Optocouplers



## Setting up the hardware
Here is a diagram of how you connect all of the pieces:

![Screenshot](image2.png)

## Building OS
Pi-KVM OS is based on Arch Linux ARM and contains all required packages and config for work. To build OS you will need any Linux machine with fresh Docker (we recommand >= 1:19).

1. Checkout build toolchain:
    ```shell
    $ git clone https://github.com/pikvm/os
    $ cd os
    ```

2. Select the target hardware configuration (platform). If you are using an analog VGA video capture device, choose `v0-vga`. If you want to use HDMI with Auvidea B101, choose `v0-hdmi`. Other options are for specialized Pi-KVM boards (WIP).

3. Create config file `config.mk` for the target system. You must specify the path to SD card on your local computer (this will be used to format and install the system) and version of your Raspberry Pi and platform. You can change other parameters as you wish:
    ```Makefile
    $ cat config.mk
    BOARD = rpi3       # rpi3 for any Raspberry Pi 3, rpi2 for version 2.
    PLATFORM = v0-vga  # Hardware configuration.
    HOSTNAME = pikvm   # Target hostname
    LOCALE = en_US     # ru_RU, etc. UTF-8 only
    TIMEZONE = Europe/Moscow  # See /usr/share/zoneinfo
    ROOT_PASSWD ?= root         # For SSH root user
    WEBUI_ADMIN_PASSWD ?= admin # Web UI credentials: user=admin, password=<this>
    IPMI_ADMIN_PASSWD ?= admin  # IPMI credentials: user=admin, password=<this>
    CARD ?= /dev/mmcblk0  # SD card device
    ```

4. Build OS. It may take about an hour depends on your Internet connection:
    ```shell
    $ make os
    ```
    
5. Put SD card into card reader and install OS:
    ```shell
    $ make install
    ```
    
6. After installation remove the SD card and insert it into Raspberry Pi. Turn on the power. Raspberry Pi will try to get the address using DHCP in your LAN. Congratulations! Your Pi-KVM will be available via SSH (`ssh root@<addr>`) and HTTPS (try to open using browser `https://<addr`). For HTTPS used a self-signed certificate by default.

7. If you cannot find the device address, try using the following command:
    ```shell
    $ make scan
    ```

Everything will be done on the Pi3 and Pi0 automatically with the video input defaulting to s-video.

If you would like to manage multiple servers with one IPMI system, please see the [Managing multiple servers](#managing-multiple-servers) section below.

Be sure to check the bottom of this README for [Tips](#tips) and [Troubleshooting](#troubleshooting)!

## The long way
If you would like to do things step by step to understand how things work, the following instructions can be used.

#### Setting up the Pi 3
First, let's get all the software we need:
```
sudo apt-get update

```

#### Access the IPMI
You should now be able to access the IPMI console at `http://<RaspberryPi3IP>/`. From here you can set up SSL and port forwarding to the device as your situation requires.

## Managing multiple servers

## Tips

## Troubleshooting

