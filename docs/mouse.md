---
title: Mouse
description: How to use the absolute, relative, and dual modes for your mouse on a PiKVM
---

There are two modes of pointer device: absolute and relative.

In absolute mode, the input device transmits the exact coordinates `(X,Y)` where the cursor should be moved. This is how touchscreens or drawing tablets work.

In relative mode, only the relative offset `(dX,dY)` to the current position is transmitted, which is unknown to the input device itself. This is a regular mouse.

By default, PiKVM uses absolute positioning mode as the most convenient for the user and software.
However, this is not always supported by the BIOS/UEFI.
For such cases, support is provided for the relative mode of operation, which can be enabled in the config.

When using relative mode, the browser will exclusively capture your mouse when you click on the stream window in PiKVM once.
When you press `Esc`, the browser releases the mouse.


-----
## Important notes

The relative mouse generates a huge number of events that can be poorly transmitted over the network or very slowly perceived by the BIOS/UEFI driver. To solve this problem, mouse events are optimized using a vector sum. This mode is enabled by activating the below first and is available in the web menu `System -> Squash mouse moves`. You can try disabling this if you have problems with mouse acceleration. This is the best and most reasonable compromise right now.

Also currently the relative mouse mode is not supported by [PiKVM VNC server](vnc.md) yet. The reason is that none of the recommended clients support the [QEMU Pointer Motion Change](https://github.com/rfbproto/rfbproto/blob/master/rfbproto.rst#qemu-pointer-motion-change-pseudo-encoding) extension. 
We expect to implement this in [TigerVNC](https://github.com/TigerVNC/tigervnc/issues/619). The relative mode is also not supported by mobile browsers.


-----
## Relative mouse on V2+ platform (OTG HID)

!!! info
	On PiKVM V4 dual mode is enabled by default. To disable it and enable single mode, set `kvmd/hid/mouse_alt/device` (see below) to empty string:

    ```yaml
    kvmd:
        hid:
            mouse_alt:
				device: ""
    ```


### Dual mode

Using dual mouse mode you can switch between the absolute and relative mouse in the `System` menu without reloading.
This is more convenient, but for compatibility reasons it is disabled by default. To enable it, do the following:

1. Switch filesystem to RW-mode using command `rw`.

2. Edit `/etc/kvmd/override.yaml` and add these lines:

    ```yaml
    kvmd:
        hid:
            mouse_alt:
                device: /dev/kvmd-hid-mouse-alt
    ```

3. Perform `reboot`. After that reboot your PC.


### Single relative mode

1. Switch filesystem to RW-mode using command `rw`.

2. Edit `/etc/kvmd/override.yaml` and add these lines:

    ```yaml
    kvmd:
        hid:
            mouse:
                absolute: false
    ```

3. Perform `reboot`. After that reboot your PC.

4. If the mouse is still not detected by the BIOS/UEFI, try disabling horizontal scrolling to achieve the maximum compatibility:

    ```yaml
    kvmd:
        hid:
            mouse:
                absolute: false
                horizontal_wheel: false
    ```

5. Don't forget to perform `reboot`.


### Fixing the absolute mouse on Windows 98

Due to an ancient buggy driver, the absolute mouse on Windows 98 moves only within the upper-left quarter of the screen. To fix this, you need to activate some magic workaround. Due to the specifics of the implementation, you will have to turn on the relative mouse too. Write it in `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    hid:
        mouse:
            absolute_win98_fix: true
        mouse_alt:
            device: /dev/kvmd-hid-mouse-alt
```

... and run `systemctl restart kvmd`. After that, you will get 3 new buttons with mouse modes in the **System** menu in Web UI. Switch it to **Abs-Win98**.


-----
## Relative mouse on V0-V1 platform (Pico/Arduino HID)

Mode switching for the [Pico HID](pico_hid.md) or [legacy Arduino HID](arduino_hid.md) can be performed on-the-fly starting with KVMD 2.6 and the corresponding firmware. No additional actions are required.
