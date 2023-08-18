# Port forwarding

If the PiKVM located on a local network needs to be made accessible from the Internet,
the easiest way to achieve this is a port forwarding on the router.
In this case, an external (global) IP address must be assigned to the router.
This service is provided by the ISP.

!!! tip
    If using an external IP address is not possible, it is recommended to try
    the [Tailscale VPN](tailscale.md).

* To configure port forwarding, refer to the documentation of the router.
* The Web UI listening ports `80` (HTTP) and `443` (HTTPS).
* By default port `80` performs permanent forwarding to `443` for security reasons.
* Forwarding the port `443` is sufficient.
* The [VNC](vnc.md) server runs on port `5900` (disabled by default).

!!! warning

    * **[Change passwords](first_steps.md#getting-access-to-pikvm) before opening access to PiKVM from the outside Internet.**
    * It's also a good practice to use only HTTPS with a valid SSL certificate (like [Let's Encrypt](letsencrypt.md)).
        and using a custom port number instead of `443` from the Internet side, for example `14438` to avoid common port scanners.
    * If you still decide to use the `443` port number, you may have to forward port `80` to get a redirect for your convenience.
