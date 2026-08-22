---
title: PiKVM V4 and V3 two-way audio
description: How to setup two-way audio on PiKVM V4 Mini/Plus and PiKVM V3
---

Official [PiKVM V4 Mini/Plus](v4.md) and [PiKVM V3](v3.md) devices have an exclusive audio transmission feature,
including **two-way** communication with microphone directly in the browser.

The incoming stream is captured from the target host via HDMI, the outgoing stream is transmitted to an emulated USB microphone.
This brings the user experience of working with voice applications on the remote host even closer to the local one.

!!! note

    * Audio does not work with DIY devices, either CSI or USB video dongles.

    * [VNC](vnc.md) does not support audio, it only works in the Web UI in [WebRTC](video.md) mode.


-----
## Speakers (incoming audio)

* On [PiKVM V4 Mini and Plus](v4.md), this feature is enabled by default, unless you didn't disable it [with custom EDID](edid.md).

* On [PiKVM V3](v3.md), this is disabled for historical reasons so as not to break old user's configurations
    that was created before audio support was introduced.

    ??? example "Enabling audio on PiKVM V3"

        1. Make sure that you have not removed the [audio jumpers (4)](v3.md#io-ports-and-jumpers)
            on the V3 HAT board and have not deleted or commented the `dtoverlay=tc358743-audio`
            line in `/boot/config.txt`. Return everything as it was, if you changed it.

        2. Update OS and reboot:

            {!_update_os.md!}

        3. Enable the Basic Audio support in the [EDID](edid.md) in the `/etc/kvmd/tc358743-edid.hex` and reboot the device again:

            ```console
            [root@pikvm ~]# rw
            [root@pikvm ~]# kvmd-edidconf --set-audio=yes
            [root@pikvm ~]# reboot
            ```

The target host determines whether it is possible to output audio via HDMI. Each OS does this in its own way.
In general, make sure that the audio output is HDMI in the mixer.
PiKVM supports stereo mode with any standard bits and frequencies like 32/44.1/48 kHz with 16/24 bit.

* **Mac OS** usually understands the priority of HDMI for audio output on its own,
    but you can specify this explicitly in the settings.

* **Windows** requires explicit specifying of the audio output device.

* In **Linux**, everything depends on the distribution you use. In ancient times, the audio required performing
    a ritual dance under the full Moon. For now, a working Pipewire or Pulseaudio most likely be enough.
    Just specify HDMI as the audio sink in the mixer.

To receive audio in the PiKVM Web UI, go to the **System** menu and switch the video mode to `WebRTC`.
If everything is in order, the multimedia section will appear. Set the **Multimedia** switch on,
and and just the volume for non-zero value.
The video stream will restart and you should start hearing sounds from the target host.

<img src="menu_speakers.png" width="350" />

If the volume slider is set to zero, PiKVM does not accept the audio stream to save traffic,
while the target host will still assume that the audio output to HDMI is available.


-----
## Microphone (outgoing audio)

PiKVM [V3](v3.md) and [V4](v4.md) is able to emulate a USB microphone on the target host to transmit
your speech from the browser to the host.

If you also want enable a webcam for video calls and other applications,
after this instruction, please follow [here](camera.md).

{!_usb_limits.md!}

??? example "Enabling USB Microphone"

    1. Microphone requires speakers support so check the previous paragraph. Also perform OS updating and reboot if you didn't:

        {!_update_os.md!}

    2. Switch filesystem to RW-mode:

        ```console
        [root@pikvm ~]# rw
        ```

    3. Add a config to `/etc/kvmd/override.yaml`:

        ```yaml
        otg:
            devices:
                audio:
                    enabled: true
        ```

    4. Perform reboot:

        ```console
        [root@pikvm ~]# reboot
        ```

To receive audio in the PiKVM Web UI, go to the **System** menu and switch the video mode to `WebRTC`.
Before using the microphone, you need to allow the PiKVM Web UI to access it.
Enable **Multimedia** switch and enable the **Microphone** switch too. You can also choose a specific device.
The settings are saved in the browser's local storage.

<img src="menu_mic.png" width="350"/>


-----
## Troubleshooting

* If the browser does not play sound or does not show audio slider, try a different browser
    and/or incognito mode without extensions. Firefox and Google Chrome works best.

* Check the log: `journalctl -u kvmd-janus`.

* If nothing helped, please report about the problem [to our support](https://pikvm.org/support/)
