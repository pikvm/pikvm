# HDMI Video Passthrough

This is a new exclusive feature available only on **PiKVM V4 Plus**.
It allows you to connect PiKVM to the gap between the target host and physical display.
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

Connect the display to `OUT2` port on the back side of PiKVM V4 Plus.
This feature should be enabled by default on new images.

If not, follow two simple steps:

1. Update OS and reboot:

    {!_update_os.md!}

2. After rebooting, you will see an image on the physical display.


-----
## My monitor does not support the 1920x1200 mode

PiKVM V4 supports the advanced capture mode of 1920x1200.
If your physical monitor is limited to 1920x1080, then part of the image from the bottom will be cropped.

To avoid this, you can change the resolution of the host OS, or if the OS does not support this,
disable the 1920x1200 mode on PiKVM itself:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-preset=v4plus.no-1920x1200
[root@pikvm ~]# reboot
```


-----
## Current limitations

Please note the feature is pretty new and will be improved.

* Display resolution must be greater than or equal to that used by PiKVM capture.
    If the maximum display resolution is 720p and the signal has a 1080p resolution, you will not see the image.
    PiKVM does not perform any downscaling.

* At the same time, PiKVM will try to show at least something than nothing.
    If the input signal has a resolution of 1920x1200, and the display supports only 1920x1080,
    the image will be shown but cropped from the bottom so that you at least have the opportunity
    to adjust the image parameters of the host.

* Audio is not supported at the moment.


-----
## Disabling the passthrough

1. Add few lines to `/etc/kvmd/override.yaml`:

    ```yaml
    kvmd:
        streamer:
            forever: false
            cmd_remove:
                - "--v4p"
    ```

2. Perform `reboot`.
