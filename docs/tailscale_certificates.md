# Tailscale certificates

PiKVM uses self-signed SSL certificates out of the box. If you have set up
Tailscale VPN to access PiKVM, you can use [Tailscale certificates](https://tailscale.com/kb/1153/enabling-https).

!!! warning
    Tailscale certificates are provided by Let's Encrypt and has a default
    [expiry of 90 days](https://letsencrypt.org/2015/11/09/why-90-days/).
    There is currently no mechanism available to auto-renew Tailscale
    certificate. You may put the commands below in a script to simplify
    process.

-----

## Basic setup

1. Update the OS and configure [Tailscale](tailscale.md) VPN before proceeding further.

    {!_update_od.md!}

2. Switch filesystem to RW and delete existing PiKVM certificates for nginx and vnc.

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# rm -v /etc/kvmd/{nginx,vnc}/ssl/*.{crt,key}
    ```

3. Provision new certificates using [`tailscale cert`](https://tailscale.com/kb/1080/cli#cert)
    command. Optionally you may create a directory to store the certificates.

    ```console
    [root@pikvm ~]# mkdir .cert
    [root@pikvm ~]# cd .cert
    [root@pikvm .cert]# tailscale cert <tailscale_hostname>
    ```

4. Copy the certificates to nginx's and vnc's ssl directories.

    ```
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.key /etc/kvmd/nginx/ssl/server.key
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.crt /etc/kvmd/nginx/ssl/server.crt
    ```

    Repeat the same steps for vnc if you have configured it.

    ```console
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.key /etc/kvmd/vnc/ssl/server.key
    [root@pikvm ~]# cp /root/.cert/<tailscale_hostname>.crt /etc/kvmd/vnc/ssl/server.crt
    ```

5. Grant file ownership to nginx and vnc services.

    ```console
    [root@pikvm ~]# chown :kvmd-nginx /etc/kvmd/nginx/ssl/*
    [root@pikvm ~]# chown :kvmd-vnc /etc/kvmd/vnc/ssl/*
    ```

6. Restart nginx and vnc services

    ```console
    [root@pikvm ~]# systemctl restart kvmd-nginx
    [root@pikvm ~]# systemctl restart kvmd-vnc
    ```

## Troubleshooting

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
