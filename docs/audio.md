# PiKVM V3+ Audio

Official PiKVM V3, V4 Mini and V4 Plus devices have an exclusive audio transmission feature.
Audio is transmitted over an HDMI cable from the target host to PiKVM as if it were a regular monitor
with speakers, and then from PiKVM to a web browser in [WebRTC video mode](webrtc.md).
This brings the user experience of working with a remote host even closer to the local one.

!!! note

    * This feature does not work with DIY devices, either CSI or USB video dongles.

    * Reverse audio transmission, that is, from the browser towards PiKVM
        (for example, to emulate a microphone) is not yet supported.

    * [VNC](vnc.md) does not support audio, it only works in the Web UI.


-----
## Preparing

For PiKVM V4, this feature is enabled by default and no special preparations are required.

For PiKVM V3, this feature is disabled by default for historical reasons so as not to break
old user configurations that were created before audio support was added.

??? example "Enabling audio on PiKVM V3"

    1. Make sure that you have not removed the [audio jumpers (4)](v3.md#io-ports-and-jumpers)
        on the V3 HAT board and have not deleted or commented the `dtoverlay=tc358743-audio`
        line in `/boot/config.txt`. Return everything as it was, if you changed it.

    2. Update OS and reboot:

        {!_update_os.md!}

    3. Add the following lines to `/etc/kvmd/janus/janus.plugin.ustreamer.jcfg` if they missing:

        ```
        audio: {
            device = "hw:0,0"
            tc358743 = "/dev/kvmd-video"
        }
        ```

    4. Enable the Basic Audio support in the [EDID](edid.md) in the `/etc/kvmd/tc358743-edid.hex`:

        ```console
        [root@pikvm ~]# kvmd-edidconf --set-audio=yes
        ```

    5. Reboot the device:

        ```console
        [root@pikvm ~]# reboot
        ```


-----
## Usage

The target host determines whether it is possible to output audio via HDMI. Each OS does this in its own way.

* Mac OS usually understands the priority of HDMI for audio output on its own,
    but you can specify this explicitly in the settings.

* Windows requires explicit specifying of the audio output device.

* In Linux, everything depends on the distribution you use. In ancient times, audio required performing
    a ritual dance on a full moon. For now, a working Pipewire or Pulseaudio most likely be enough.
    Just specify HDMI as the audio sink in the mixer.

In general, make sure that the audio output is output via HDMI.
PiKVM supports stereo mode with any standard bits and frequencies like 32/44.1/48 kHz with 16/24 bit.

To receive audio in the PiKVM Web UI, go to the **System** menu and switch the video mode to `H.264 / WebRTC`.
If everything is in order, the volume slider will appear. Set the volume to a non-zero value.
The video stream will restart and you should start hearing sounds from the target host.

<img src="menu.png" width="350"/>

!!! note

    If the volume slider is set to zero, then PiKVM does not accept the audio stream to save traffic,
    while the target host will still assume that the audio output to HDMI is available.

    Besides, when the page is reloaded, the volume slider will be reset to zero.
    Saving this setting is not possible due to browser limitation that do not allow web pages to play audio
    immediately after opening without user activity to protect against annoying ads.


-----
## Troubleshooting

* If the browser does not play sound or does not show audio slider, try a different browser
    and/or incognito mode without extensions. Google Chrome works best.

* Check the log: `journalctl -u kvmd-janus`.

* If nothing helped, please report about the problem [to our support](https://discord.gg/bpmXfz5)
