# WebRTC
This is a new alternative video transfer mode available for Raspberry Pi 4 users with an HDMI-CSI bridge.
It uses H.264 encoding instead of MJPEG and provides significantly less traffic consumption.

# How to use
If you use an OS image built after 2021.06.10, this mode will be available to you by default.
If you are upgrading to an older version of the OS, you will need to manually enable the WebRTC gateway:
```
# systemctl enable --now kvmd-janus
```
Then restart the Web UI and then in the **System** menu you will see the video mode switch.

:exclamation: **If you do not see the switch, it means that either your browser does not support WebRTC, or the `kvmd-janus` service was not started.**

# Subtleties
The MJPEG video stream uses the same HTTP connection that you use to get the web interface.
This means that for remote access, you just need to forward ports 80 and 443 on your router.

In contrast, WebRTC is a completely different way of transmitting video.
It uses a P2P connection and UDP. This reduces network load, but makes it difficult to configure -
the server needs to know your network configuration in order to use it correctly.

To implement this, the Pi-KVM checks which of the network interfaces is used for the default gateway,
and also tries to find out your external address using the Google [STUN](https://en.wikipedia.org/wiki/STUN) server.
This is necessary when using [Tailscale](tailscale.md) or so that you can connect to your Pi-KVM from the external Internet,
since simply forwarding ports 80 and 443 for WebRTC is not enough - it requires a direct connection.

If you don't like using Google (it was chosen as the default for reliability reasons) for this purpose,
you can choose [any other STUN server](https://www.voip-info.org/stun/) at your discretion, or start your own.
Use `/etc/kvmd/override.yaml` to this:
```yaml
janus:
    stun:
        host: stun.stunprotocol.org
        port: 3478
```
And restart `systemctl restart kvmd-janus`.

# Custom Janus config
❗**Custom config is not working right now**

[Janus](https://janus.conf.meetecho.com) is a WebRTC gateway that is used to transmit the [uStreamer](https://github.com/pikvm/ustreamer) video.
KVMD-Janus is a wrapper around it, configuring and monitoring changes in the network configuration. This is suitable for most users.
However, if your Pi-KVM is not connected to the Internet and/or you want to use a custom Janus configuration,
then you should use the `kvmd-janus-static` service instead. You should first change the Janus configuration yourself.
You can find it in `/etc/kvmd/janus/janus.jcfg`.

```
# systemctl disable --now kvmd-janus
...
# systemctl enable --now kvmd-janus-static
```

# Troubleshooting
In rare cases, WebRTC may not work. The most common reasons are:
* Tricky IPv6 configuration on the network. IPv6 support for WebRTC in Pi-KVM is still in its infancy, so if your network has IPv4, it will be easiest to completely disable IPv6 for Pi-KVM. To do this, switch the file system to write mode using `rw` command, add option `ipv6.disable=1` to `/boot/cmdline.txt` and perform `reboot`. Also see [here](https://wiki.archlinux.org/title/IPv6#Disable_IPv6).
* A paranoid firewall when you try to connect to the Pi-KVM by forwarding port 443 to the Internet from the internal network. WebRTC is not enough of this, it uses UDP on ports 10000-20000 for a P2P connection. Make sure that the Firewall does not block them.
* If nothing helps, open the browser's JS console and look at the log, and contact our community via [Discord](https://discord.gg/bpmXfz5). Developers and/or experienced users will definitely help you.
