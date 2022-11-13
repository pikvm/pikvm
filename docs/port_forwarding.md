# Port forwarding

If your ISP has provided you with an external IP address for the router, you can configure port forwarding to access PiKVM.

!!! warning

    * **[Change passwords](first_steps.md#getting-access-to-pikvm) before opening access to PiKVM from the outside Internet.**
    * It's also a good practice to use only HTTPS (port 443) with a valid certificate (like [Let's Encrypt](letsencrypt.md)).
	* Additionally, you can use a custom external port number instead of 443, for example 14438 to avoid common port scanners.

* The Web UI runs on port `80` and `443`.
* [VNC](vnc.md) (if you use it) runs on port `5900`.

If you don't have an external IP address, then we recommend trying [Tailscale VPN](tailscale.md).
