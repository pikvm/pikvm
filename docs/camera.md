---
title: Web Camera on PiKVM V4 and V3
description: How to setup web camera on PiKVM V4 Mini/Plus and PiKVM V3
---

Official [PiKVM V4 Mini/Plus](v4.md) and [PiKVM V3](v3.md) devices have an exclusive webcam feature.
With it, you can transfer an image from your local web camera to the remote host to use it for streaming,
video calls, debugging, and so on.

The host sees the virtual camera as a completely ordinary USB device which doesn't require any special drivers.
The maximum supported resolution at present is 1280x720.

If you also want enable a microphone for video calls and other applications,
after this instruction, please follow [here](audio.md#microphone-outgoing-audio).

!!! warning "Limitations"

    By installing the `ucamera` (follows), you agree that it will be used only on official [PiKVM V3](v3.md) and [PiKVM V4](v4.md) devices.

    We put a lot of effort into making this feature possible, so we want to keep it exclusive to PiKVM for a certain period.
    After that, we will publish the full source code of `ucamera` under GPLv3.

    Please note that this feature is in early access. Using the camera may cause PiKVM to fail.
    This is not fatal for PiKVM V3 and V4 since they have a robust hardware watchdog
    which reboot your device after a fail, but just remember that not everything can work perfectly.

    If you encounter a problem, we will be glad to receive your bug report to fix it:
    use our [support chat](https://pikvm.org/support) or [GitHub Issues](https://github.com/pikvm/pikvm/issues).


-----
## Enabling the camera

{!_usb_limits.md!}

??? info "A recommended hardware modification for PiKVM V3"

    [PiKVM V3](v3.md) is a good old workhorse that was not designed for the kind of computing loads that the camera provides.
    It was released many years ago and was made for completely different requirements.
    However, we want V3 users to be able to enjoy our latest features as long as possible.

    A cooling system fan is installed inside V3, but there is no radiator on the CPU since it was simply not needed.

    Using the camera uses a lot of hardware blocks that we haven't used before,
    so in order to avoid potential overheating (if the fan is turned off or fails),
    we recommend [buying and attaching additional heatsinks](https://www.pishop.us/product/aluminum-heatsink-for-raspberry-pi-4b-3-pack/).

    Both PiKVM V4 contains a good heatsink inside, so no modifications are required.

1. Perform OS update:

    {!_update_os.md!}

2. Switch filesystem to RW-mode:

    ```console
    [root@pikvm ~]# rw
    ```

3. Install `ucamera` package:

    ```console
    [root@pikvm ~]# pacman -S ucamera
    ```

3. Add a config to `/etc/kvmd/override.yaml`:

    ```yaml
    otg:
        devices:
            camera:
                enabled: true
    ```

5. Add parameter `gpu_freq=700` to `/boot/config.txt` **on a separate line**.

6. Add parameter `isolcpus=3` to `/boot/cmdline.txt` **to the end of existing one-line**, separate with a space.

4. Perform reboot:

    ```console
    [root@pikvm ~]# reboot
    ```

-----
## Using the camera

To use the camera, you will need Firefox, Chrome, or Safari of the latest version,
operability on old/other browsers is not guaranteed. If you use macOS, you will have to
update macOS entirely to update Safari.

A camera is a device that is completely controlled by the host.
The host tells it when to turn on the stream and what resolution should be used.

To receive audio in the PiKVM Web UI, go to the **System** menu and switch the video mode to `WebRTC`.
Before using the camera, you need to allow the PiKVM Web UI to access it.
Enable **Multimedia** switch and enable the **Camera** switch too. You can also choose a specific device.
The settings are saved in the browser's local storage.

<img src="menu_camera.png" width="350"/>

When the host asks the PiKVM device to provide it with an image, the stream will start.


-----
## Troubleshooting

* If the browser does not play sound or does not show multimedia submenu, try a different browser
    and/or incognito mode without extensions. Firefox and Google Chrome works best.

* Check the log: `journalctl -u kvmd-janus` -u `ucamera`.

* If nothing helped, please report about the problem [to our support](https://pikvm.org/support/)
