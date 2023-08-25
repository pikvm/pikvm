# Tailscale VPN

The [Tailscale VPN](https://tailscale.com/) can be used to access PiKVM from the Internet
if configuring [port forwarding](port_forwarding.md) is not possible or more security is desired.
Tailscale is a convenient and free (for private use) tool for organizing a small VPN network.

The basic Tailscale configuration commands are shown below.
For detailed instructions, refer to [Tailscale support](https://tailscale.com/contact/support/).


-----
## Configuring the PiKVM

1. Install the client, run `tailscaled` service and register it in the network:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# pacman -Syu
    [root@pikvm ~]# pacman -S tailscale-pikvm
    [root@pikvm ~]# systemctl enable --now tailscaled
    [root@pikvm ~]# tailscale up
    ```

2. Follow the link to authorize this installation.
    You likely want to [disable key expiry](https://tailscale.com/kb/1028/key-expiry/)!

3. After authorization success, reboot to make sure that everything works correctly:

    ```console
    [root@pikvm ~]# reboot
    ```

4. Now, you can view the IP address of the Tailscale network interface:

    ```console
    [root@pikvm ~]# ip addr show tailscale0
    ```

If everything is successful, PiKVM will become a member of your VPN network.

!!! warning "Do not update Tailscale if you don't have access to PiKVM without VPN"
    Unfortunately, sometimes, updating the Tailscale client can cause problems due to breaking changes.
    Remember this when updating.


-----
## Configuring a client device

* [Download](https://tailscale.com/download) and install the Tailscale client
    to the system you are using (not to the system you want to control).
* Check the [Tailscale admin page](https://login.tailscale.com/admin/machines) to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see the PiKVM web interface.


-----
## Troubleshooting

If something does not work, the usual advice is to completely remove Tailscale from PiKVM and perform a clean installation:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# pacman -Rscnd tailscale
[root@pikvm ~]# rm -rf /var/lib/tailscale /var/cache/tailscale
[root@pikvm ~]# reboot
```

Now, follow the instructions from the beginning to re-install Tailscale.
