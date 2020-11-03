# Mouse modes

There are two modes of mouse operation: absolute and relative.

In absolute mode, the input device transmits the exact coordinates (X,Y) where the cursor should be moved.

In relative mode, only the relative offset (dX,dY) to the current position is transmitted, which is unknown to the input device itself.

By default, Pi-KVM uses absolute positioning mode as the most convenient for the user and software.
However, this is not always supported by the BIOS/UEFI.
For such cases, support is provided for the relative mode of operation, which can be enabled in the config.

When using relative mode, the browser will exclusively capture your mouse when you click on the stream window in Pi-KVM once.
When you press `Esc`, the browser releases the mouse.

:exclamation: Currently, relative mouse mode is not supported by [Pi-KVM VNC server](vnc.md).
The reason is that none of the recommended clients support the [QEMU Pointer Motion Change](https://github.com/rfbproto/rfbproto/blob/master/rfbproto.rst#qemu-pointer-motion-change-pseudo-encoding) extension. 
We expect to implement this in [TigerVNC](https://github.com/TigerVNC/tigervnc/issues/619).

# Enabling relative mouse on v2 platform (OTG HID)
* Switch filesystem to RW-mode using command `rw`.
* Edit `/etc/kvmd/override.yaml` and add these lines:
  ```yaml
  kvmd:
      hid:
          mouse:
              absolute: false
  ```
* Perform `reboot`.
* If the mouse is still not detected by the BIOS/UEFI, try disabling horizontal scrolling to ensure maximum compatibility:
  ```yaml
  kvmd:
      hid:
          mouse:
              absolute: false
              horizontal_wheel: false
  ```
* Don't forget to perform `reboot`.

# Enabling relative mouse on v0 platform (serial HID)
This is not currently supported but will be added in a future release. The reason is that we are working on improving the HID protocol.
