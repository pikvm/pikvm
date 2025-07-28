---
title: Video modes
description: Key differences between available video modes on PiKVM and tips for using them
---

# Video modes

PiKVM [V3](v3.md), [V4 Plus/Mini](v4.md) and all DIY devices based on
HDMI-CSI bridge provides three video streaming modes. This page explains
the key differences between them and helps you to achieve optimal video
performance.

The video mode can be switched in the **System** menu in the Web UI. If
you don't see the switch, probably your browser does not support H.264
video.


<img src="menu.png" width="350" />

!!! tip "Quick tips"

    * Good network: use `WebRTC` or `Direct` mode, set `H.264 gop = 0`.

    * Bad network and `WebRTC` mode: Set `H.264 gop = 30`.

    * Bad network and `Direct` mode: Set `H.264 gop = 0`.

    * If the `WebRTC` mode is not working, try the `Direct`.

    * The `Direct` mode doesn't support audio yet. If you need audio, but `WebRTC` is not working, follow [this guide](webrtc_config.md).


-----
## Settings

* **H.264 kbps** *(Bitrate)* - with a large value, the video quality will be better, but the network traffic will increase.

* **H.264 gop** *(Group of Pictures)* - the number of frames between which a reference frame must be forcibly added.
    The recommended values are described above.


-----
## WebRTC H.264 mode

This is the default mode. It'is using the efficient H.264 encoding to
save traffic. The video is streamed over WebRTC protocol which you may
have encountered when you used video calls in Discord or Google Chat.
Since WebRTC does not use HTTP for video, establishing a connection is
quite tricky (but PiKVM automates 99% of cases). If you have problems
with the WebRTC mode, please [check this guide](webrtc_config.md).

!!! info "Advantages / Disadvantages"

    * ✅ Supported by all modern browsers.

    * ✅ Provides [two-way audio](audio.md) on PikVM [V3](v3.md) and [V4 Plus/Mini](v4.md).

    * ❌ The video may be lost due to a poor connection (like mobile internet, bad Wi-Fi, etc.),
        or because of the router settings, when WebRTC is given low priority.

    * ❌ It may be blocked at all in some networks.

    * ❌ Sometimes the latency may increase slightly due to the peculiarities of WebRTC processing in all browsers.


-----
## Direct H.264 mode

The new experimental mode for real-time streaming, introduced by PiKVM.
It also uses H.264 encoding, but streams the video over regular HTTP (WebSocket).

!!! info "Advantages / Disadvantages"

    * ✅ Very stable on poor networks, better than WebRTC (based on our tests and user reviews).

    * ✅ It is not blocked by firewalls because it appears to be regular HTTPS traffic.

    * ✅ The latency is low and stable too.

    * ❌ No audio support right now (but it will).

    * ❌ Some [older browsers](https://caniuse.com/webcodecs) doesn't have the WebCodes support needed for this mode.


-----
## Legacy MJPEG mode

Good old Motion JPEG. This is the way IP cameras have been streaming videos to browsers since ancient times.
The stream is just infinite queue of JPEGs that replace each other in `<img>` HTML tag.
There is no point in using it now if one of the previous modes is working.

!!! info "Advantages / Disadvantages"

    * ✅ Sometimes the H.264 is disabled in a browser by OS license limitations (for example, in Red Had Linux or Debian).
        But MJPEG is working always.

    * ✅ It is not blocked by firewalls because it appears to be regular HTTPS traffic.

    * ✅ Low latency if you have a good network.

    * ❌ No audio support.

    * ❌❌❌ Consumes a HUGE amount of traffic. No Wi-Fi, no mobile, nothing but cable connection will work.


-----
## What if H.264 is not supported by browser at all

There are some Linux distro's that require more work to be able to use H.264,
this may include any RedHat or Debian variant. Here some examples:

  * In case of Chromium on Fedora, you can connect the [RPM Fusion](https://rpmfusion.org) repo
    and then install the `chromium-freeworld` package instead of `chromium`.

  * On Debian GNU/Linux and Firefox, make sure the OpenH264 Plugin both exists and is enabled.
    Press `Ctrl+Shift+A` to open the `Add-on Manager`, then press `Plugins`. There you should see
    *OpenH264 Video Codec provided by Cisco Systems, Inc.*
    Make sure it is enabled by pressing the "more options" button (tree dots), then pressing `Always Activate`.


-----
## Video recording

At the moment, it is not possible to record videos in a convenient way from the Web UI,
but a small trick in the console can be used to record videos without sound.
It's only available on same PiKVM models which support H.264 video.

??? example "Recording video from terminal"

    1. Update OS:

        {!_update_os.md!}

    2. Install `ffmpeg` package and reboot:

        ```console
        [root@pikvm ~]# rw
        [root@pikvm ~]# pacman -S ffmpeg
        [root@pikvm ~]# reboot
        ```

    3. After reboot, switch filesystem to RW-mode again using the `rw` command

    4. To record a video, open the Web UI (i.e. stream should be running) or connect via VNC.
        Next, run the recording process in the current directory:

        ```console
        [root@pikvm ~]# ustreamer-dump --sink kvmd::ustreamer::h264 --output - | ffmpeg -use_wallclock_as_timestamps 1 -i pipe: -c:v copy my_video.mp4
        ```

    5. Press `Ctrl+C` to stop the recording, and don't forget to switch filesystem to read-only mode using the `ro` command.

??? example "Take a screenshot from terminal"

    To take a screenshot, switch filesystem to RW-mode like in previous example and run the stream.

    Next, take a screenshot:

    ```console
    [root@pikvm ~]# curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o /tmp/screen.jpg
    ```
