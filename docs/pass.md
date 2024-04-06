# HDMI Video Passthrough

This is a new exclusive feature available only on **PiKVM V4 Plus**.
It allows you to connect PiKVM to the gap between the target host and the display.
Thus, PiKVM does not interfere with the normal operation of the display and passes
the video signal through itself until you need remote access via PiKVM
In this case, PiKVM directs the video stream to the Web UI or VNC.

!!! info

    * The passthrough feature supports a screen resolution **up to 1920x1200** pixels.
    * Other PiKVM devices besides V4 Plus do not support the passthrough due to hardware limitations.

This is shown more clearly below:

<img src="pass.png" />

-----
## Setting up the passthrough

1. Connect the display to `OUT2` port on the back side of PiKVM V4 Plus.

2. Update OS and reboot:

    {!_update_os.md!}

4. Switch filesystem to RW-mode:

    ```console
    # rw
    ```

3. Add these lines to `/boot/config.txt`:

    ```ini
    dtoverlay=vc4-kms-v3d
    disable_overscan=1
    ```

4. Enable the passthrough service:

    ```console
    # systemctl enable kvmd-pass
    ```

5. Perform the soft reboot:

    ```console
    # reboot
    ```

After rebooting, you will see an image on the display.
If you open the stream in the Web UI or VNC, the image on display will be temporarily stopped
and redirected to the remote access session.


-----
## My monitor does not support the 1920x1200 mode

PiKVM V4 supports the advanced capture mode of 1920x1200.
If your physical monitor is limited to 1920x1080, then part of the image from the bottom will be cropped.

To avoid this, you can change the resolution of the host OS, or if the OS does not support this,
disable the 1920x1200 mode on PiKVM itself:

```console
# rw
# kvmd-edidconf --import-preset=v4plus.no-1920x1200  # Or v4mini.no-1920x1200
# reboot
```

-----
## Current limitations

Please note the feature is still new and will be improved.

* The video cannot be shown simultaneously on the display and in a remote access session.
    During a remote session, you will see the `STREAM IS ACTIVE` text on the display instead of the image.

* Display resolution must be greater than or equal to that used by PiKVM capture.
    If the maximum display resolution is 720p and the signal has a 1080p resolution, you will not see the image.
    PiKVM does not perform any downscaling.

* At the same time, PiKVM will try to show at least something than nothing.
    If the input signal has a resolution of 1920x1200, and the display supports only 1920x1080,
    the image will be shown but cropped from the bottom so that you at least have the opportunity
    to adjust the image parameters of the host.

* Audio is not supported at the moment.
