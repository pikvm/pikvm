# Let's Encrypt certificates

PiKVM uses self-signed SSL certificates out of the box. If you have a domain name, you can use Let's Encrypt certificates.

Usually Let's Encrypt certificates are issued and updated automatically using Certbot, however, since PiKVM uses a read-only
file system, special tools around Certbot are required to work with certificates. KVMD 3.117 provides them.

!!! note
    This feature is available on images newer than 2022.06.20 since it requires [PST storage partition on SD card](pst.md).


## Basic setup

1. Update the OS and make sure that you are using a new image with [PST storage](pst.md).
   ```
   # rw
   # pacman -Syu
   # reboot
   ...
   # kvmd-pstrun -- true
   ```
   If the storage is not available, you need to [reflash the OS image](flashing_os.md) to the latest one from our official website.

2. Switch filesystem to RW and obtain the certificate (for example, `pikvm.example.com`. The method depends on the network configuration. In the simplest case, if PiKVM is open for access from the Internet, it is recommended to use the webroot. Another examples will be described below.
   ```
   # rw
   # kvmd-certbot certonly_webroot --agree-tos -n --email user@example.com -d pikvm.example.com
   ```

3. Install the certificate for KVMD-Nginx and (optionally) [KVMD-VNC](vnc.md). Running services will be restarted/reloaded automatically. Switch filesystem to RO.
   ```
   # kvmd-certbot install_nginx pikvm.example.com
   # kvmd-certbot install_vnc pikvm.example.com
   # ro
   ```

4. Check the renewal immediately, just for testing:
   ```
   # kvmd-certbot renew --force-renewal
   ```

5. Enable automatic certificate renewal:
   ```
   # systemctl enable --now kvmd-certbot.timer
   ```

## Cloudflare DNS

This example shows that PiKVM may not be accessible from the internet, but you can still get a certificate if you use Cloudflare DNS.

1. Switch filesystem to RW and install the Cloudflare DNS plugin:
   ```
   # rw
   # pacman -S certbot-dns-cloudflare
   ```

2. Prepare the environment for the DNS plugin (place the auth data):
   ```
   # kvmd-pstrun -- mkdir /var/lib/kvmd/pst/data/certbot/runroot
   # kvmd-pstrun -- nano /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth
   # kvmd-pstrun -- chmod 600 /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth
   ```

3. Obtain the certificate:
   ```
   # kvmd-certbot certonly \
       --dns-cloudflare \
       --dns-cloudflare-propagation-seconds 60 \
       --dns-cloudflare-credentials /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth \
       --agree-tos \
       -n \
       --email user@example.com \
       -d pikvm.example.com
   ```

4. Next follow the basic guide.
