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

    1. Connect to the physical universal asynchronous receiver / transmitter (UART) console from your host computer:

        * On PiKVM V3 or V4, you have a built-in USB-UART adapter in your device. Just disconnect the OTG cable and place the USB-C end into the `IOIOI` port on V4 (or the `CON` port on V3). Place the USB-A end into the port you want serial to be accessed, typically done on the host. If you have a Windows host, you may need to install this [driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers), other operating systems may not need one.

        * On DIY PiKVM V1 or V2, you'll need to get the right TTY to USB cable, we recommend the [RPi Debug Probe](https://www.pishop.us/product/raspberry-pi-debug-probe/) and follow existing RPi TTY serial setups.

    2. Install `picocom` on a Linux or a macOS host (available in [Homebrew](https://formulae.brew.sh/formula/picocom) and [MacPorts](https://ports.macports.org/port/picocom/)), or [Putty](https://www.putty.org/) on Windows.

    3. Identify the port that your operating system exposes for connecting to the PiKVM.

        * Windows: look this up in the Device Manager

        * Linux: open a terminal program, run `sudo dmesg | grep tty`and look for a message like this:

        ```
        [14362.388405] usb 1-2: cp210x converter now attached to ttyUSB0
        ```

        This means you will need to use `/dev/ttyUSB0`.

        * macOS: open the terminal and list all USB serial devices with `ls /dev/cu.usbserial-*`. Look for a device that contains `cu.usbserial`, e.g. `/dev/cu.usbserial-FT0RVWSW`.

    4. Connect via the serial port:

        * Windows: select the COM port in Putty and use the **115200** baud rate, then connect.

        * Linux/macOS: open your terminal program and run `sudo picocom -b 115200 $USB_SERIAL_DEVICE` where `$USB_SERIAL_DEVICE` is the device you looked up, e.g. `/dev/ttyUSB0` on Linux or `/dev/cu.usbserial-FT0RVWSW` on macOS.

        After running the command, press **Enter** to get to a login prompt.

    5. Submit your root user credentials.

    6.  You should now be able to see and interact with the serial port. All the system tools in PiKVM will be available in the terminal window. Once you are done, press **Ctrl+a** and then immediately **Ctrl+x** to terminate the session.


-----
## Getting User Support

If something doesn't work, check out our [FAQ](faq.md). Otherwise, head straight to our [Discord chat](https://discord.gg/bpmXfz5).
