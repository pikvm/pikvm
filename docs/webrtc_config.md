---
title: WebRTC H.264
description: how to configure and troubleshoot the WebRTC H.264 streaming mode
---

# WebRTC H.264

This is the default mode. It'is using the efficient H.264 encoding to save traffic.
The video is streamed over WebRTC protocol which you may have encountered when you used video calls in Discord or Google Chat.

It is available on PiKVM [V3](v3.md), [V4 Plus/Mini](v4.md) and all DIYdevices based on HDMI-CSI bridge.

The video mode can be switched in the **System** menu in the Web UI.
If you don't see the switch, probably your browser does not support H.264 video.


-----
## How it's working

The [Direct H.264 or MJPEG video](video.md) is streaming video using the
similar HTTP connection like to get the Web UI. This means that for
remote access, you just need to [forward](port_forwarding.md) only ports
`80` and `443` on your router it has public external IP address.

In contrast, WebRTC is a completely different way of transmitting video.
It uses a P2P connection and UDP. This reduces network load, but makes
it difficult to connect—the PiKVM needs to know your network
configuration in order to use it correctly: public IP, NAT type and so
on.

To achieve this, the PiKVM checks which of the network interfaces is
used for the default gateway, and tries to find out your external IP
address using the Google [STUN](https://en.wikipedia.org/wiki/STUN)
server.

!!! tip
    Google STUN servers was choosen for reliability reasons.

    If you don't want to use it, you can choose [any other public STUN server](https://www.voip-info.org/stun) you like, or set up your own.

    To change the STUN server, edit `/etc/kvmd/override.yaml` (an example):

    ```yaml
    janus:
        stun:
            host: stun.stunprotocol.org
            port: 3478
    ```

    ... and restart `kvmd-janus` service using `systemctl restart kvmd-janus`.


-----
## WebRTC behind NAT

If you access PiKVM from the Internet via [port forwarding](port_forwarding.md),
forwarding ports `80` and `443` is enough for the Web UI and the
[Direct H.264 or MJPEG video](video.md), but not for WebRTC. WebRTC
transmits the video over a P2P UDP connection, so the router must also
forward a range of UDP ports to the PiKVM.

By default, Janus picks a random UDP port from a wide range for each
connection. To make port forwarding practical, limit this range to a
small one and forward it on the router:

1. Forward UDP ports `20000-20020` on your router to the PiKVM.

2. Switch the file system to write mode and add the port range to `/etc/kvmd/override.yaml`:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# nano /etc/kvmd/override.yaml
    ```

    ```yaml
    janus:
        cmd_append:
        - --rtp-port-range=20000-20020
    ```

3. Switch the file system back to read-only mode and restart the `kvmd-janus` service:

    ```console
    [root@pikvm ~]# ro
    [root@pikvm ~]# systemctl restart kvmd-janus
    ```

!!! note
    The range `20000-20020` is just an example. You can choose any other UDP range,
    but the forwarded ports on the router and the `--rtp-port-range` option must match.


-----
## Custom Janus config

[Janus](https://janus.conf.meetecho.com) is a WebRTC gateway that is
used to transmit the video from [PiKVM
uStreamer](https://github.com/pikvm/ustreamer). PiKVM has a special
service named `kvmd-janus` which is a wrapper for Janus that monitors
the network configuration and applies changes.

However, if your PiKVM is not connected to the Internet and/or you want
to use a custom Janus configuration, you should run the
`kvmd-janus-static` service instead.

The configuration is located in `/etc/kvmd/janus/janus.jcfg`. You can
change all you need according to the [Janus
Documentation](https://janus.conf.meetecho.com/docs/index.html), stop
the `kvmd-janus` and start the `kvmd-janus-static` service:

```
[root@pikvm ~]# systemctl disable --now kvmd-janus
[root@pikvm ~]# systemctl enable --now kvmd-janus-static
```

-----
## Troubleshooting

In some cases, WebRTC may not work. Here some common tips:

* Clear the browser cache.

* Try any other browser, incognito or private window without any extensions.

* Tricky IPv6 configuration on the network can be a problem. IPv6 support for WebRTC in PiKVM is still in its infancy, so if your network has IPv4, it will be easiest to disable IPv6 on PiKVM. To do this, switch the file system to write mode using `rw` command, add option `ipv6.disable_ipv6=1` to `/boot/cmdline.txt` and perform `reboot`. Also see [here](https://wiki.archlinux.org/title/IPv6#Disable_IPv6).

* If you access PiKVM from the Internet, forwarding port `443` alone is not enough. WebRTC needs a wide range of UDP ports for the P2P connection, and a strict firewall or NAT will block it. You can significantly limit the port range in the config, forward it on the router and allow it in the firewall, see [WebRTC behind NAT](#webrtc-behind-nat).

* If nothing helps, open the browser's JavaScript console, look at the log and contact our [Support](https://pikvm.org/support/). Developers and/or experienced users will definitely help you.
