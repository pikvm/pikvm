# Tailscale VPN

The [Tailscale](https://tailscale.com/) can be used to access PiKVM from the Internet
when using [port forwarding](port_forwarding.md) is not possible or does not seem secure enough.
Tailscale is a convenient and free (for private use) tool for organizing a small VPN network.


-----
## Installation

Basic support like whats shown below is provided as an example,
any other setting or functionality needs to be redirected to the [Tailscale support](https://tailscale.com/contact/support/).


### On the PiKVM side

1. Execute these commands:

    ```
    # rw
    # pacman -Syu
    # pacman -S tailscale-pikvm
    # systemctl enable --now tailscaled
    # tailscale up
    ```

2. Follow the link to authorize this installation.

3. After success, perform soft reboot using the `reboot` command to make sure that everything is working correctly.

4. Perform the command `ip addr show tailscale0` to view the Tailscale IP address.

If everything is successful, PiKVM will become a member of your VPN network.

!!! warning
    **Do not update Tailscale if you don't have access to PiKVM without VPN,
    because on breaking change in Tailscale, you may lose access.**

    Unfortunately sometimes updating the Tailscale client on PiKVM can cause problems.
    This is happening since Tailscale has weak support of read-only systems.


### For each device you wish to access PiKVM

* [Download](https://tailscale.com/download) and install the Tailscale client for your OS
    to the system you are using (not to the system you want to control).
* Check the [admin page](https://login.tailscale.com/admin/machines) to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see PiKVM web interface.


----
## Troubleshooting

If something not work, the usual advice is to completely remove the Tailscale from PiKVM and perform a clean installation.

To remove follow this:

```
# rw
# pacman -Rscnd tailscale
# rm -rf /var/lib/tailscale /var/cache/tailscale
# reboot
```

Next, follow this document from the beginning to install the Tailscale again.
