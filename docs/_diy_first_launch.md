---
search:
    exclude: true
---


1. Double-check the correct assembly of the device, and make sure that you have connected
    all the necessary cables to the host: USB, HDMI and ATX.

2. [Flash the memory card with PiKVM OS](https://docs.pikvm.org/flashing_os){target=_blank}
    and insert it to Raspberry Pi.

3. **Carefully read and follow [the First Steps Guide](first_steps.md){target=_blank}.**<br>
    It describes how to perform the first power-on, how to find PiKVM on the network, login, change passwords, and so on.<br>
    **Follow the steps described there and come back to this page.**

4. **Just reminding again:**

    {!_passwd.md!}

5. Try to manage the computer using PiKVM with the Web Interface.<br>
    Make sure that you get an image and both keyboard and mouse are working.
    If something doesn't work, check out our [FAQ](faq.md) (it's really useful).
    If nothing helped, you can get support in our [Discord chat](https://discord.gg/bpmXfz5).

6. ??? note "Note for the HDMI-USB dongle"

        Many USB video capture devices tell the server's video card that the HDMI cable is supposedly disconnected.
        This may lead to the fact that if you boot the server without an active stream, the server will not detect
        your capture card. This is easy to fix:

        * Switch filesystem to RW-mode:
            ```console
            [root@pikvm ~]# rw
            ```

        * Edit file `/etc/kvmd/override.yaml` and add these lines:
            ```yaml
            kvmd:
                streamer:
                    forever: true
                    cmd_append: [--slowdown]
            ```

        * Finish:
            ```console
            [root@pikvm ~]# ro
            [root@pikvm ~]# systemctl restart kvmd
            ```

        * Check that everything is working.

7. Configure access to PiKVM from the Internet using [port forwarding](https://docs.pikvm.org/port_forwarding)
    or [Tailscale VPN](https://docs.pikvm.org/tailscale), if you need it.

8. Explore the features of PiKVM using the site's table of contents and have fun!
