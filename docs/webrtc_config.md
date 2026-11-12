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
## Faster stream start

When you open the Web UI, a few things happen before the first video frame appears:
the page loads, the video streamer gets ready, Janus negotiates the WebRTC connection,
and the browser waits for a full frame (a keyframe) to decode.
The settings below shorten the parts of that wait that depend on the PiKVM configuration.


### Keep the streamer running

By default, the video streamer ([uStreamer](https://github.com/pikvm/ustreamer)) runs **on demand**:
KVMD starts it when the first viewer opens the Web UI (or connects over VNC),
and stops it 10 seconds after the last viewer has left (`kvmd/streamer/shutdown_delay`).
So if nobody was watching for a while, every new viewer waits for uStreamer to start,
open the capture device and detect the video signal before any video can be sent.

The `forever` option keeps uStreamer running all the time, so the video is ready the moment
somebody connects. It is already enabled by default on PiKVM V4 Plus.

To enable it, edit `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    streamer:
        forever: true
```

!!! note
    If your `override.yaml` already has a `kvmd:` section, add `streamer:` inside it
    instead of creating a second `kvmd:` key.

Then apply and check it:

```
[root@pikvm ~]# rw
[root@pikvm ~]# nano /etc/kvmd/override.yaml
[root@pikvm ~]# ro
[root@pikvm ~]# kvmd -m | grep forever
        forever: true ### Default: false
[root@pikvm ~]# systemctl restart kvmd
```

After the restart, uStreamer stays running even when nobody is connected
(it shows up as `kvmd/streamer: /usr/bin/ustreamer ...` in `ps aux`).

What it gives and what it costs, measured on PiKVM V4 Mini (1080p HDMI source):

| | `forever: false` *(default)* | `forever: true` |
|---|---|---|
| New viewer → uStreamer ready | 0.22–0.25 s | 0.01 s |
| New viewer → video signal detected | 0.37–0.90 s | 0.01 s |
| New viewer → first JPEG frame | 0.48–1.0 s | 0.06–0.16 s |
| CPU when nobody is watching | 0 | ~1.7% of one core |
| RAM when nobody is watching | 0 | ~6 MB |

The idle cost is small: when nobody is watching, uStreamer keeps capturing but doesn't encode.
On PiKVM V3, V4 and other HDMI-CSI based devices, the CPU governor also stays at `schedutil` while idle
(uStreamer switches it to `performance` only while someone is watching).

!!! tip
    If you don't want uStreamer to run all the time, you can just keep it a bit longer
    after the last viewer has left, so quick reconnects and page reloads don't pay the start cost:

    ```yaml
    kvmd:
        streamer:
            shutdown_delay: 300
    ```


### Skip the STUN lookup on LAN/VPN-only setups

To find your external IP address, Janus asks a public [STUN](https://en.wikipedia.org/wiki/STUN) server
for its own WebRTC candidates on every new connection. If you only reach the PiKVM
over the local network or a VPN (for example Tailscale, WireGuard or ZeroTier),
these candidates are useless, but Janus still waits for the lookup
to finish, which delays the start of the video. On a high-latency link this can add a noticeable delay to every connection.

In that case you can tell KVMD to start Janus without a STUN server:

```yaml
janus:
    cmd_remove:
        - "{o_stun_server}"
```

Apply it with `systemctl restart kvmd-janus`. The browser still gets its own STUN server,
so this only affects the candidates gathered by Janus on the PiKVM side.

!!! warning
    Don't do this if you access the PiKVM from the Internet through port forwarding
    without a VPN. Without the STUN server, Janus can't find its external address,
    and WebRTC may fail to connect from outside your network.
    In that case use the [Direct H.264](video.md) mode or keep the default.


### Answer the multimedia question right away

If **Multimedia** was turned on in the previous session,
the Web UI asks *"Do you want to continue with the same settings?"* when it opens.
The browser requires this confirmation before it can play sound.
Clicking **OK** restarts the WebRTC connection with audio, so answer it as soon as it appears:
the sooner you click, the less time is spent on the first, discarded connection.
If you don't need audio at all, click **Cancel** (or turn off **Multimedia** in the **System** menu), and the question won't be asked again.


-----
## Troubleshooting

In some cases, WebRTC may not work. Here some common tips:

* Clear the browser cache.

* Try any other browser, incognito or private window without any extensions.

* Tricky IPv6 configuration on the network can be a problem. IPv6 support for WebRTC in PiKVM is still in its infancy, so if your network has IPv4, it will be easiest to disable IPv6 on PiKVM. To do this, switch the file system to write mode using `rw` command, add option `ipv6.disable_ipv6=1` to `/boot/cmdline.txt` and perform `reboot`. Also see [here](https://wiki.archlinux.org/title/IPv6#Disable_IPv6).

* A paranoid firewall can interfere too when you try to connect to the PiKVM by forwarding port 443 to the Internet from the internal network. WebRTC is not enough of this, it uses UDP on ports 20000-40000 for a P2P connection. Make sure that the Firewall does not block them.

* If nothing helps, open the browser's JavaScript console, look at the log and contact our [Support](https://pikvm.org/support/). Developers and/or experienced users will definitely help you.
