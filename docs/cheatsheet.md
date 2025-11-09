---
title: PiKVM Cheat Sheet
description: "Getting started with PiKVM"
---

# PiKVM Cheat Sheet

Here are **first steps guides** for each PiKVM device:

{!_device_guides.md!}


-----
## Basics

??? note "Performing commands with root privileges"

    There are two ways to perform any command with root privileges.

    1. Gain root privileges, then perform any command.

        `[kvmd-webterm@pikvm ~]$ su -`

        After providing root account password, you will be able to run any commands as a root user as long as the session is running. Use it wisely. For example, if you need to reboot PiKVM, all you need to do is this:
    
        `[root@pikvm ~]# reboot`

        The use of `su -` applies to both SSH and web terminal sessions.

    2. Use `su -c` followed by the command wrapped in apostrophes. This will perform the command with root privileges a single time, you will not gain permanent root access. This will For example, to reboot PiKVM, do this:

        `[kvmd-webterm@pikvm ~]$ su -c 'reboot'`

        The use of `su -c` applies to both SSH and web terminal sessions.

{!_passwd.md!}

{!_config.md!}

{!_update_os.md!}

??? note "Connecting to PiKVM via SSH"

    SSH is the most common remote access method in the Linux world. Normally, it should be possible to simply run `ssh root@pikvm` in a terminal window to connect to your PiKVM. However, this can fail for various reasons. In that case, you will have to connect using PiKVM's IP address.

    To connect to PiKVM via SSH, do this:

    1. Discover PiKVM's IP address in the local network. There are several ways to do that:

        * Open the web interface of your router and find the list of issued IP addresses there.
        * Linux-only: install and run [arp-scan](https://github.com/royhills/arp-scan): `sudo arp-scan --localnet`.
        * Linux, MacOS, Windows: Download and run [Angry IP Scanner](https://angryip.org/).
        * Windows PowerShell: Use the `arp -a` command.

        In each case, look for the entry that says "Raspberry Pi Trading Ltd" and copy its IP address to the clipboard. Let's assume that the IP address is `192.168.0.100`.

    2. Run the SSH client to connect to PiKVM:

        * **Linux, MacOS:** Open any terminal application and run: `ssh root@192.168.0.100`.
        * **Windows:** Use [PuTTY](https://www.putty.org/) for this.

    3. Submit your `root` user credentials. The default password is `root`. If you haven't changed it, you absolutely should do it.

    4. You should now be able to see and interact with the serial port. All the system tools in PiKVM will be available in the terminal window. Once you are done, type `exit` and press **Enter**, or simply press **Ctrl+d** to terminate the session.


??? note "Connecting to PiKVM via serial console"

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

??? note "Shutting down PiKVM"

    PiKVM defaults to using the system in read-only mode, so there is **no need to explicitly shut it down**. You can simply unplug the device from power.
    
    If you absolutely need to use the shutdown command, **please ensure the following requirements are met**:

    - **This is not one of the DIY (V1 or V2) devices**. If you shut down a DIY PiKVM, it will not power on until you physically reconnect the power cord.
    - **You are not currently running a system update**. If you are, you will likely corrupt the system.
    - **You are not currently uploading a mass storage drive image**. If you are, you will likely corrupt the system.
    
    If all these requirements are met, do this:

    ```
    [kvmd-webterm@pikvm ~]$ su -
    [root@pikvm ~]# shutdown -h now
    ```
    
    PiKVM V3 and V4 will automatically reboot after several minutes of being halted. DIY PiKVM will need a power cord reconnection to become available again. 

??? note "Sending keyboard shortcuts to target host systems"
    {!shortcuts.md!}

-----
## Getting User Support

If something doesn't work, check out our [FAQ](faq.md). Otherwise, head straight to our [Support](https://pikvm.org/support/).
