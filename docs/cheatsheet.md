---
title: PiKVM Cheat Sheet
description: "Getting started with PiKVM"
---

# PiKVM Cheat Sheet

Here are **first steps guides** for each PiKVM device:

{!_device_guides.md!}


-----
## Basics

{!_passwd.md!}

{!_config.md!}

{!_update_os.md!}

??? note "Connect to PiKVM via SSH"

    SSH is the most common remote access method in the Linux world. PiKVM is accessible via SSH. This method is used to manage the device:

    * **Linux, MacOS:** Open any terminal application and run: `ssh root@192.168.0.100` or `ssh root@pikvm`.
    * **Windows:** Use [PuTTY](https://www.putty.org/) for this.

    **The default `root` password is `root`.**

??? note "Connect to PiKVM via serial console"

    A serial console is a convenient and fast way to connect to PiKVM when there is no network, or get boot logs and a console if something goes wrong.

    1. Connect to the physical UART console:

        * On PiKVM V3 or V4, you have a built-in USB-UART adapter in your device. Just disconnect the OTG cable and place the USB-C end into `IOIOI` port on V4 (or `CON` port on V3). Place the USB-A end into the port you want serial to be accessed, typically done on the host. If you have a Windows host, you may need to install this [driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers), other OS's may not need one.

        * On DIY PiKVM V1 or V2, you'll need to get the right TTY to USB cable, we recommend the [RPi Debug Probe](https://www.pishop.us/product/raspberry-pi-debug-probe/) and follow existing RPi TTY serial setups.

    2. Install GNU Screen on Linux or macOS host, or [Putty](https://www.putty.org/) on Windows.

    3. Select the COM port in Putty (you can verify this looking in Device Manager), then select **115200** baud, or use `screen /dev/ttyUSB0 115200` for other OS's

    4. You should now be able to see and interact with the Serial Port.


-----
## Getting User Support

If something doesn't work, check out our [FAQ](faq.md). Otherwise, head straight to our [Discord chat](https://discord.gg/bpmXfz5).
