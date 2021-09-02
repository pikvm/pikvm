# Mouse modes

There are two modes of pointer device: absolute and relative.

In absolute mode, the input device transmits the exact coordinates (X,Y) where the cursor should be moved. This is how touchscreens or drawing tablets work.

In relative mode, only the relative offset (dX,dY) to the current position is transmitted, which is unknown to the input device itself. This is a regular mouse.

By default, Pi-KVM uses absolute positioning mode as the most convenient for the user and software.
However, this is not always supported by the BIOS/UEFI.
For such cases, support is provided for the relative mode of operation, which can be enabled in the config.

When using relative mode, the browser will exclusively capture your mouse when you click on the stream window in Pi-KVM once.
When you press `Esc`, the browser releases the mouse.

# Important notes
The relative mouse generates a huge number of events that can be poorly transmitted over the network or very slowly perceived by the BIOS/UEFI driver. To solve this problem, mouse events are optimized using a vector sum. This mode is enabled by default and is available in the web menu `System -> Squash mouse moves`. You can try disabling this if you have problems with mouse acceleration. This is the best and most reasonable compromise right now.

Also currently the relative mouse mode is not supported by [Pi-KVM VNC server](vnc.md) yet. The reason is that none of the recommended clients support the [QEMU Pointer Motion Change](https://github.com/rfbproto/rfbproto/blob/master/rfbproto.rst#qemu-pointer-motion-change-pseudo-encoding) extension. 
We expect to implement this in [TigerVNC](https://github.com/TigerVNC/tigervnc/issues/619). The relative mode is also not supported by mobile browsers.

# Enabling the relative mouse on the v2 platform (OTG HID)
### Dual mode
Using dual mouse mode you can switch between the absolute and relative mouse in the `System` menu without reloading.
This is more convenient, but for compatibility reasons it is disabled by default. To enable it, do the following:
* Switch filesystem to RW-mode using command `rw.
* Edit `/etc/kvmd/override.yaml` and add these lines:
  ```yaml
  kvmd:
      hid:
          mouse_alt:
              device: /dev/kvmd-hid-mouse-alt
  ```
* Perform `reboot`. After that reboot your PC.

### Single relative mode
* Switch filesystem to RW-mode using command `rw`.
* Edit `/etc/kvmd/override.yaml` and add these lines:
  ```yaml
  kvmd:
      hid:
          mouse:
              absolute: false
  ```
* Perform `reboot`. After that reboot your PC.
* If the mouse is still not detected by the BIOS/UEFI, try disabling horizontal scrolling to achieve the maximum compatibility:
  ```yaml
  kvmd:
      hid:
          mouse:
              absolute: false
              horizontal_wheel: false
  ```
* Don't forget to perform `reboot`.

# Enabling the relative mouse on the v0 platform (Arduino HID)
Mode switching for [Arduino HID](https://github.com/pikvm/pikvm/blob/master/pages/arduino_hid.md) can be performed on-the-fly starting with KVMD 2.6 and the corresponding firmware. No additional actions are required.

# Fixing the absolute mouse on Windows 98
Due to an ancient buggy driver, the absolute mouse on Windows 98 moves only within the upper-left quarter of the screen. To fix this, you need to activate some magic workaround in `/etc/kvmd/override.yaml`:
```yaml
kvmd:
    hid:
        mouse:
            absolute_win98_fix: true
```
And run `systemctl restart kvmd`.
