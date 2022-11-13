# Port forwarding

If your ISP has provided you with an external IP address for the router, you can configure port forwarding to access PiKVM.

!!! warning
    It is not recommended to port forward 1 to 1 ports. EX: 80/443 external to 80/443 internal.
    PiKVM is not hardened and may pose a security breach if using these ports
    Please choose a random port between 1024-65550
    Example: (Internal IP) TCP/UDP Port 443, external IP Port 23509 

!!! warning
    [Change passwords](first_steps.md#getting-access-to-pikvm) before opening access to PiKVM from the outside Internet

* The Web UI runs on port `80` and `443`.
* [VNC](vnc.md) (if you use it) runs on port `5900`.

If you don't have an external IP address, then we recommend trying [Tailscale VPN](tailscale.md).
