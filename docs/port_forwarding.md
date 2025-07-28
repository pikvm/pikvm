---
title: Port forwarding
description: How to setup port forwarding to make your PiKVM accessible from Internet
---

If you need to make PiKVM accessible from Internet, the easiest way to
achieve this is by forwarding a port on the router. In this case, an
external (global) IP address must be assigned to the router. This
service is provided by the ISP.

!!! tip
    If using an external IP address is not possible, it is recommended to try
    the [Tailscale VPN](tailscale.md).

* To configure port forwarding, refer to the documentation of the router.
* The Web UI listening ports are `80` (HTTP) and `443` (HTTPS).
* By default, port `80` performs permanent forwarding to `443` for security reasons.
* Forwarding the port `443` is sufficient in most cases.
* If enabled, the [VNC](vnc.md) server runs on port `5900` (disabled by default).

!!! warning

    * **[Set strong passwords and enable two-factor authorization](auth.md)
        before opening access to PiKVM from the Internet!**
    * It is strongly recommended to obtain a valid HTTPS certificate, for example via [Let's Encrypt](letsencrypt.md).
    * A good practice is using a custom port number instead of `443` from the Internet side, for example `14438`, to avoid common port scanners.
    * If you still decide to use the `443` port number, you may want to forward port `80` to get a convenient redirect.

Port forwarding is a powerful and convenient tool, but remember that security depends entirely on your configuration.
In most cases, a VPN is a more secure, but less convenient option (since it requires a VPN client on all devices that access PiKVM).
