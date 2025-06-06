# Tailscale VPN

The [Tailscale VPN](https://tailscale.com/) can be used to access PiKVM from the Internet
if configuring [port forwarding](port_forwarding.md) is not possible or more security is desired.
Tailscale is a convenient and free (for private use) tool for organizing a small VPN network.

The basic Tailscale configuration commands are shown below.
For detailed instructions, refer to [Tailscale support](https://tailscale.com/contact/support/).

-----

## Configuring the PiKVM

1. Update OS:

    {!_update_os.md!}

3. Install the Tailscale client, run `tailscaled` service and register it in the network:

    ```console
    [root@pikvm ~]# rw
    # If you were afraid to pikvm-update above first run pacman -Syy
    [root@pikvm ~]# pacman -S tailscale-pikvm
    [root@pikvm ~]# systemctl enable --now tailscaled
    [root@pikvm ~]# tailscale up
    ```

4. Follow the link to authorize this installation.
    You likely want to [disable key expiry](https://tailscale.com/kb/1028/key-expiry/)!

5. After authorization success, reboot to make sure that everything works correctly:

    ```console
    [root@pikvm ~]# reboot
    ```

6. Now, you can view the IP address of the Tailscale network interface:

    ```console
    [root@pikvm ~]# ip addr show tailscale0
    ```

If everything is successful, PiKVM will become a member of your VPN network.

!!! warning "Do not update Tailscale if you don't have access to PiKVM without VPN"
    Unfortunately, sometimes, updating the Tailscale client can cause problems due to
    breaking changes. These are compatibility issues on the Tailscale side.
    Remember this when updating.

-----

## Configuring a client device

* [Download](https://tailscale.com/download) and install the Tailscale client
    to the system you are using (not to the system you want to control).
* Check the [Tailscale admin page](https://login.tailscale.com/admin/machines) to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see the PiKVM web interface.

-----

## Using Tailscale Certificates

PiKVM uses self-signed SSL certificates out of the box. You can also use
[Tailscale certificates](https://tailscale.com/kb/1153/enabling-https) in place of the default one.

!!! warning
    Tailscale certificates are provided by Let's Encrypt and has a default
    [expiry of 90 days](https://letsencrypt.org/2015/11/09/why-90-days/).
    There is currently no mechanism available to auto-renew Tailscale
    certificate. You may put the commands below in a script to simplify
    process.

1. Switch filesystem to RW if in ReadOnly mode and delete existing PiKVM certificates for nginx and vnc.

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# rm -v /etc/kvmd/{nginx,vnc}/ssl/*.{crt,key}
    ```

2. Provision new certificates using [`tailscale cert`](https://tailscale.com/kb/1080/cli#cert)
    command. Optionally you may create a directory to store the certificates.

    ```console
    [root@pikvm ~]# mkdir .cert
    [root@pikvm ~]# cd .cert
    [root@pikvm .cert]# tailscale cert <tailscale_hostname>
    ```

3. Copy the certificates to nginx's and vnc's ssl directories.

    ```console
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.key /etc/kvmd/nginx/ssl/server.key
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.crt /etc/kvmd/nginx/ssl/server.crt
    ```

    Repeat the same steps for vnc if you have configured it.

    ```console
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.key /etc/kvmd/vnc/ssl/server.key
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.crt /etc/kvmd/vnc/ssl/server.crt
    ```

4. Grant file ownership to nginx and vnc services. Switch filesystem to ReadOnly again

    ```console
    [root@pikvm ~]# chown :kvmd-nginx /etc/kvmd/nginx/ssl/*
    [root@pikvm ~]# chown :kvmd-vnc /etc/kvmd/vnc/ssl/*
    [root@pikvm ~]# ro
    ```

5. Restart nginx and vnc services

    ```console
    [root@pikvm ~]# systemctl restart kvmd-nginx
    [root@pikvm ~]# systemctl restart kvmd-vnc
    ```

-----

## Troubleshooting

* If something does not work, the usual advice is to completely remove Tailscale from PiKVM and perform a clean installation:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# pacman -Rscnd tailscale
    [root@pikvm ~]# rm -rf /var/lib/tailscale /var/cache/tailscale
    [root@pikvm ~]# reboot
    ```

Now, follow the instructions from the beginning to re-install Tailscale.

* In case of certificate issues you can try the following steps to debug and fix.

1. Check if the services are running. If not please start them. For example,
    web UI service can be checked using:

    ```console
    [root@pikvm ~]# systemctl status kvmd-nginx
    ```

    For VNC:

    ```console
    [root@pikvm ~]# systemctl status kvmd-vnc
    ```

2. If the services are running but not accessible or showing a warning, check
    the respective logs. For web UI:

    ```console
    [root@pikvm ~]# journalctl -xeu kvmd-nginx
    ```

3. If the logs shows TLS/certificate/permissions errors, the issue may be with
    file ownership. The services must have at least the group ownership of the
    certificates. The ownership should look similar to this:

    ```console
    [root@pikvm ~]# ls -l /etc/kvmd/{nginx,vnc}/ssl
    /etc/kvmd/nginx/ssl:
    total 8
    -r--r--r-- 1 root kvmd-nginx 2872 Jan  3 16:07 server.crt
    -r--r----- 1 root kvmd-nginx  227 Jan  3 16:07 server.key

    /etc/kvmd/vnc/ssl:
    total 8
    -r--r--r-- 1 root kvmd-vnc 2872 Jan  3 16:07 server.crt
    -r--r----- 1 root kvmd-vnc  227 Jan  3 16:07 server.key
    ```
