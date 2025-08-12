---
title: USB Passthrough
description: "How to set up USB Passthrough on PiKVM"
---

# USB Passthrough

For USB keyboards and mice connected to PiKVM directly, USB passthrough allows forwarding their input to the host system. This feature is available for all versions of PiKVM **except** the v4 Mini (no available USB ports) or a DIY version based on Pi Zero/Pi Zero 2 (using a USB hub prevents utilizing the OTG which the passthru expects to be available). It works best with [HDMI passthrough](pass.md) available on PiKVM V4 Plus.

Let's consider this setup:

- [PiKVM V4 Plus](v4.md) connected to [PiKVM switch](switch.md);
- A keyboard and a mouse connected to USB A ports on the PiKVM;
- An external display connected to the PiKVM directly using HDMI out.

![Example setup](usb-passthrough.png){ width="400" }

With both HDMI passthrough and USB passthrough enabled, you would be able to do this:

- Switch between Computer 1 and Computer 2 connected to PiKVM Switch;
- Control them directly from this single keyboard/mouse pair (in addition to remote control);
- See the video output from the selected host on the local display.


-----
## Enabling USB passthrough

Follow these steps to enable USB passthrough on your PiKVM:

1. [Log into your PiKVM](cheatsheet.md) as `root`, either via SSH, web console, or USB serial connection.

2. You need KVMD 4.74+ to be able to use this feature. Update the PiKVM OS as `root`:

    ```
    [root@pikvm ~]# pikvm-update
    ```

3. PiKVM will reboot, log in as `root` again.

4. Run the following command to change acces to read-write, enable USB passthrough, and change acces to read-only again:

    ```
    [root@pikvm ~]# rw; systemctl enable --now kvmd-localhid; ro
    ```

Once you've done that, you should be able to use your USB keyboard and mouse connected directly to your PiKVM to control the host.


-----
## Toggling USB passthrough

Every once in a while you may want using keyboard/mouse to control your PiKVM instead of controlling a host. Once USB passthrough is enabled in the system, you can switch it on and off with shortcuts:

- `LeftAlt, LeftAlt, K` (mnemonic **K**VM) disables keyboard/mouse grabbing and allows using the input devices with PiKVM locally, for example, for the console operating.

- `LeftAlt, LeftAlt, H` (mnemonic **H**ost) switches back to the passthrough mode and passes keyboard-mouse events to the host.

Press these keys **immediately** one after another: `LeftAlt`, then `LeftAlt` again, then the mnemonic key. 


-----
## Switching the PiKVM Switch channels

If you have one or two PiKVM Switches, you can use `LeftAlt, LeftAlt, 1` (1-8) to switch between up to 8 channels.

For three or more PiKVM Switches, you need to use double numbers, e.g., `LeftAlt, LeftAlt, 3, 2` (unit 3, channel 2).
