# H.264 / WebRTC

!!! note
    * Officially supported browsers: Chrome, Firefox and Safari.
    * Only for V3+ and other devices based on CSI bridge

This is a main video streaming mode available for all V3+ users and DIY devices with CSI bridge.
With the efficient H.264 encoding, a significant reduction in traffic is achieved compared to old MJPEG.

If you use an OS image built after 2021.06.10, this mode will be available by default.
If you are upgrading to an older version of the OS, you will need to manually enable the WebRTC gateway:

```
# systemctl enable --now kvmd-janus
```

Then reload the Web UI and then in the **System** menu you will see the video mode switch.

!!! note
    If you don't see the switch, it means that either your browser does not support WebRTC, or the `kvmd-janus` service was not started.


## H.264 parameters

The main parameters available for configuration in the Web UI are **bitrate** and **gop**.

* **Bitrate (H.264 kbps)** - with a large value, the quality will be better, but the network consumption will increase.
* **Group of pictures (H.264 gop)** - the number of frames between which a reference frame must be forcibly added.
  The recommended value is 0 for low-loss networks, this will also reduce latency. Use a value of 30 or so for unreliable networks if the image flickers frequently.


## Details

The MJPEG video stream uses the same HTTP connection that you use to get the web interface.
This means that for remote access, you just need to forward ports 80 and 443 on your router. 
Please review the [Port Foward doc](port_forwarding.md) for proper usage.

In contrast, WebRTC is a completely different way of transmitting video.
It uses a P2P connection and UDP. This reduces network load, but makes it difficult to configure -
the server needs to know your network configuration in order to use it correctly.

To implement this, the PiKVM checks which of the network interfaces is used for the default gateway,
and also tries to find out your external address using the Google [STUN](https://en.wikipedia.org/wiki/STUN) server.
This is necessary when using [Tailscale](tailscale.md) or so that you can connect to your PiKVM from the external Internet.

If you don't like using Google (it was chosen as the default for reliability reasons) for this purpose,
you can choose [any other STUN server](https://www.voip-info.org/stun/) at your discretion, or set up your own.

Edit `/etc/kvmd/override.yaml`:

```yaml
janus:
    stun:
        host: stun.stunprotocol.org
        port: 3478
```

... and restart `kvmd-janus` service using `systemctl restart kvmd-janus`.


## Custom Janus config

[Janus](https://janus.conf.meetecho.com) is a WebRTC gateway that is used to transmit the [uStreamer](https://github.com/pikvm/ustreamer) video.
KVMD-Janus is a wrapper around it, configuring and monitoring changes in the network configuration. This is suitable for most users.
However, if your PiKVM is not connected to the Internet and/or you want to use a custom Janus configuration,
then you should use the `kvmd-janus-static` service instead. You should first change the Janus configuration yourself.
You can find it in `/etc/kvmd/janus/janus.jcfg`.

```
# systemctl disable --now kvmd-janus
...
# systemctl enable --now kvmd-janus-static
```


## Troubleshooting

In rare cases, WebRTC may not work. Here some common tips:

* Clear the browser cache.

* Try other browsers, incognito or private window without any extensions.

* Tricky IPv6 configuration on the network can be a problem. IPv6 support for WebRTC in PiKVM is still in its infancy, so if your network has IPv4, it will be easiest to disable IPv6 on PiKVM. To do this, switch the file system to write mode using `rw` command, add option `ipv6.disable_ipv6=1` to `/boot/cmdline.txt` and perform `reboot`. Also see [here](https://wiki.archlinux.org/title/IPv6#Disable_IPv6).

* A paranoid firewall when you try to connect to the PiKVM by forwarding port 443 to the Internet from the internal network. WebRTC is not enough of this, it uses UDP on ports 10000-20000 for a P2P connection. Make sure that the Firewall does not block them.

* If nothing helps, open the browser's JS console and look at the log, and contact our community via [Discord](https://discord.gg/bpmXfz5). Developers and/or experienced users will definitely help you.

* Another option to try is if you have both wifi and eth connected, disable wifi `rfkill list wifi` then `rfkill block X` where is a number that shows in the output. Reason: Arch Linux will choose to route all outgoing packets out wifi by default.

* There are some linux distro's that require more work to be able to use H.264 (WEBRTC MODE), this may include any RedHat variant.

    * For instance: On Fedora you can install the rpmfusion repos, then use the `chromium-freeworld` package instead of `chromium`
