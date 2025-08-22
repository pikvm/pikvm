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

* A paranoid firewall can interfere too when you try to connect to the PiKVM by forwarding port 443 to the Internet from the internal network. WebRTC is not enough of this, it uses UDP on ports 20000-40000 for a P2P connection. Make sure that the Firewall does not block them.

* If nothing helps, open the browser's JavaScript console, look at the log and contact our [Support](https://pikvm.org/support/). Developers and/or experienced users will definitely help you.
