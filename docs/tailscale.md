---
title: Tailscale VPN
description: How to configure the access to your PiKVM using Tailscale VPN
---

The [Tailscale VPN](https://tailscale.com/) can be used to access PiKVM
from the Internet if configuring [port forwarding](port_forwarding.md)
is not possible or more security is desired. Tailscale is a convenient
and free (for private use) tool for organizing a small VPN network.

The basic Tailscale configuration commands are shown below. For detailed
instructions, refer to [Tailscale
support](https://tailscale.com/contact/support/).

-----

## Configuring the PiKVM

1. Update OS:

    {!_update_os.md!}

2. Install the Tailscale client, run `tailscaled` service and register it in the network:

    ```console
    [root@pikvm ~]# rw
    # If you were afraid to pikvm-update above first run pacman -Syy
    [root@pikvm ~]# pacman -S tailscale-pikvm
    [root@pikvm ~]# systemctl enable --now tailscaled
    [root@pikvm ~]# tailscale up
    ```

3. Follow the link to authorize this installation.
    You likely want to [disable key expiry](https://tailscale.com/kb/1028/key-expiry/)!

4. After authorization success, reboot to make sure that everything works correctly:

    ```console
    [root@pikvm ~]# reboot
    ```

5. Now, you can view the IP address of the Tailscale network interface:

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
    Tailscale certificates are provided by Let's Encrypt and have a default
    [expiry of 90 days](https://letsencrypt.org/2015/11/09/why-90-days/).
    Certificates created with `tailscale cert` are not installed or renewed
    automatically. Follow the steps below for a manual installation, or use
    the [automatic renewal](#automatic-certificate-renewal-for-nginx) setup.

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

## Automatic Certificate Renewal for Nginx

The following systemd service checks the certificate daily and renews it only
when it does not match the configured Tailscale hostname or has less than 30
days remaining. It stages and validates the new certificate and key before
installing them and reloads nginx without interrupting existing connections.
The certificate and key are kept in [persistent storage](pst.md), which
`kvmd-pstrun` makes writable only while the renewal script is running. The root
filesystem remains read-only during scheduled checks and renewals.

This setup manages the nginx certificate only. If you use [KVMD-VNC](vnc.md),
extend the script to install copies of the certificate and key with the
`kvmd-vnc` group and restart `kvmd-vnc` after renewal.

1. Switch the filesystem to RW mode and create
    `/etc/conf.d/kvmd-tailscale-cert-renew`:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# nano /etc/conf.d/kvmd-tailscale-cert-renew
    ```

    Set the full MagicDNS hostname shown by the Tailscale admin console:

    ```bash
    TAILSCALE_DOMAIN="pikvm.example.ts.net"
    ```

2. Create `/usr/local/sbin/kvmd-tailscale-cert-renew`:

    ```bash
    #!/usr/bin/bash
    set -Eeuo pipefail

    : "${TAILSCALE_DOMAIN:?Set TAILSCALE_DOMAIN in /etc/conf.d/kvmd-tailscale-cert-renew}"
    : "${KVMD_PST_DATA:?Run this script with kvmd-pstrun}"

    readonly domain="${TAILSCALE_DOMAIN%.}"
    readonly cert_dir="${KVMD_PST_DATA}/tailscale-cert"
    readonly cert_file="${cert_dir}/server.crt"
    readonly key_file="${cert_dir}/server.key"
    readonly renew_before_seconds=2592000

    exec 9>/run/lock/kvmd-tailscale-cert-renew.lock
    if ! flock -n 9; then
        printf '%s\n' "Certificate renewal is already running"
        exit 0
    fi

    install -d -o root -g kvmd-nginx -m 0750 "${cert_dir}"

    certificate_is_fresh() {
        [[ -r "${cert_file}" ]] &&
            openssl x509 -in "${cert_file}" -noout -checkhost "${domain}" >/dev/null 2>&1 &&
            openssl x509 -in "${cert_file}" -noout -checkend "${renew_before_seconds}" >/dev/null 2>&1
    }

    if certificate_is_fresh; then
        printf '%s\n' "Certificate for ${domain} is valid for more than 30 days; nothing to do"
        exit 0
    fi

    printf '%s\n' "Certificate for ${domain} is missing, mismatched, or due within 30 days"
    tailscale wait --timeout=60s

    umask 077
    tmp_dir="$(mktemp -d /run/kvmd-tailscale-cert.XXXXXX)"
    staged_cert="${tmp_dir}/server.crt"
    staged_key="${tmp_dir}/server.key"
    old_cert="${tmp_dir}/old-server.crt"
    old_key="${tmp_dir}/old-server.key"
    new_cert="${cert_file}.new.$$"
    new_key="${key_file}.new.$$"
    previous_certificate_available=false
    deployment_started=false
    deployment_succeeded=false

    cleanup() {
        local status=$?
        trap - EXIT HUP INT TERM
        set +e

        if [[ "${deployment_started}" == true && "${deployment_succeeded}" != true ]]; then
            printf '%s\n' "Deployment failed; rolling back the nginx certificate" >&2
            if [[ "${previous_certificate_available}" == true ]]; then
                install -o root -g kvmd-nginx -m 0444 "${old_cert}" "${cert_file}"
                install -o root -g kvmd-nginx -m 0440 "${old_key}" "${key_file}"
                systemctl reload kvmd-nginx.service
            else
                rm -f -- "${cert_file}" "${key_file}"
            fi
        fi

        rm -f -- "${new_cert}" "${new_key}"
        rm -rf -- "${tmp_dir}"

        exit "${status}"
    }

    trap cleanup EXIT
    trap 'exit 129' HUP
    trap 'exit 130' INT
    trap 'exit 143' TERM

    tailscale cert \
        --min-validity=720h \
        --cert-file="${staged_cert}" \
        --key-file="${staged_key}" \
        "${domain}"

    openssl x509 -in "${staged_cert}" -noout -checkhost "${domain}"
    openssl x509 -in "${staged_cert}" -noout -checkend "${renew_before_seconds}"

    cert_pubkey_hash="$(openssl x509 -in "${staged_cert}" -pubkey -noout |
        openssl pkey -pubin -outform DER 2>/dev/null |
        sha256sum)"
    cert_pubkey_hash="${cert_pubkey_hash%% *}"
    key_pubkey_hash="$(openssl pkey -in "${staged_key}" -pubout -outform DER 2>/dev/null |
        sha256sum)"
    key_pubkey_hash="${key_pubkey_hash%% *}"

    if [[ -z "${cert_pubkey_hash}" || "${cert_pubkey_hash}" != "${key_pubkey_hash}" ]]; then
        printf '%s\n' "ERROR: staged certificate and private key do not match" >&2
        exit 1
    fi

    if [[ -f "${cert_file}" && -f "${key_file}" ]]; then
        cp -a -- "${cert_file}" "${old_cert}"
        cp -a -- "${key_file}" "${old_key}"
        previous_certificate_available=true
    fi

    install -o root -g kvmd-nginx -m 0444 "${staged_cert}" "${new_cert}"
    install -o root -g kvmd-nginx -m 0440 "${staged_key}" "${new_key}"

    deployment_started=true
    mv -f -- "${new_cert}" "${cert_file}"
    mv -f -- "${new_key}" "${key_file}"

    /usr/sbin/nginx -t -p /etc/kvmd/nginx -c /run/kvmd/nginx.conf
    systemctl reload kvmd-nginx.service
    deployment_succeeded=true

    printf '%s\n' "Installed certificate for ${domain}"
    openssl x509 -in "${cert_file}" -noout -subject -issuer -dates
    ```

    Make the script executable:

    ```console
    [root@pikvm ~]# chmod 755 /usr/local/sbin/kvmd-tailscale-cert-renew
    ```

3. Create the certificate directory in persistent storage and point nginx to
    it. The script uses `KVMD_PST_DATA` instead of a fixed path because that
    path can differ between PiKVM versions:

    ```console
    [root@pikvm ~]# kvmd-pstrun -- /usr/bin/bash -c '
        set -eu
        cert_dir="${KVMD_PST_DATA}/tailscale-cert"
        install -d -o root -g kvmd-nginx -m 0750 "${cert_dir}"
        ln -sfn "${cert_dir}/server.crt" /etc/kvmd/nginx/ssl/server.crt
        ln -sfn "${cert_dir}/server.key" /etc/kvmd/nginx/ssl/server.key
    '
    ```

4. Create `/etc/systemd/system/kvmd-tailscale-cert-renew.service`:

    ```ini
    [Unit]
    Description=Renew the PiKVM nginx Tailscale certificate
    Documentation=https://tailscale.com/docs/reference/tailscale-cli#cert
    Wants=network-online.target
    After=network-online.target kvmd-pst.service tailscaled.service
    Requires=kvmd-pst.service tailscaled.service

    [Service]
    Type=oneshot
    EnvironmentFile=/etc/conf.d/kvmd-tailscale-cert-renew
    ExecStart=/usr/bin/kvmd-pstrun -- /usr/local/sbin/kvmd-tailscale-cert-renew
    TimeoutStartSec=5min
    UMask=0077
    ```

5. Create `/etc/systemd/system/kvmd-tailscale-cert-renew.timer`:

    ```ini
    [Unit]
    Description=Check the PiKVM nginx Tailscale certificate daily

    [Timer]
    OnCalendar=daily
    RandomizedDelaySec=1h
    AccuracySec=5m
    Persistent=true
    Unit=kvmd-tailscale-cert-renew.service

    [Install]
    WantedBy=timers.target
    ```

6. Load the units, enable the timer, install the initial certificate,
    and return the filesystem to RO mode:

    ```console
    [root@pikvm ~]# systemctl daemon-reload
    [root@pikvm ~]# systemctl enable --now kvmd-tailscale-cert-renew.timer
    [root@pikvm ~]# systemctl start kvmd-tailscale-cert-renew.service
    [root@pikvm ~]# ro
    ```

7. Check the service log and the next scheduled run:

    ```console
    [root@pikvm ~]# journalctl -u kvmd-tailscale-cert-renew.service
    [root@pikvm ~]# systemctl list-timers kvmd-tailscale-cert-renew.timer
    ```

-----

## Automated Ephemeral Tailscale Certificates Renewal

[`tailscale serve`](https://tailscale.com/kb/1312/serve) can terminate HTTPS
and proxy requests to PiKVM within your tailnet. Tailscale renews its Let's
Encrypt certificates automatically, but it must write certificate and service
state under `/var/lib/tailscale`. Because the PiKVM root filesystem is
read-only, those writes fail and repeated certificate requests can eventually
hit Let's Encrypt rate limits.

The overlay below keeps Tailscale's runtime state writable in RAM. Use the
[nginx renewal setup](#automatic-certificate-renewal-for-nginx) instead if the
certificate must survive reboots.

Here's the command that allows you to seamlessly run HTTPS proxy for your PiKVM:

```console
[root@pikvm ~]# tailscale serve --bg https+insecure://localhost:443
```

And if you want to stop tailscale from serving HTTPS, you can do this by running:

```console
[root@pikvm ~]# tailscale serve --https=443 off
```

### Root cause

Tailscale needs to refresh TLS certificates and write state under `/var/lib/tailscale`.
On PiKVM, the root filesystem is read-only, so direct writes fail.

We can fix this by mounting an **ephemeral overlay filesystem (tmpfs) in RAM** for `/var/lib/tailscale`, backed by a persistent lowerdir (`/root/tailscale-state`).

This ensures that certificate rotation and state writes work without breaking PiKVM’s read-only state.

!!! warning
    The **caveat** is that renewed certificates exist only in RAM. After a reboot, Tailscale falls back to the older certificates on disk, requests fresh ones, and stores them in RAM again.
    If you reboot PiKVM too frequently, this can trigger Let's Encrypt's rate limits.

### Solution

Core idea:
- Mount a **tmpfs** over Tailscale's state folder stored in root's home: /root/tailscale-state. 
- Mount the resulting *merged* layer onto the actual Tailscale state folder at /var/lib/tailscale.
- An **overlayfs** will transparently present this folder to Tailscale, while changes are kept in the RAM-based overlay layer.

**Note**: Overlayfs requires that the upperdir and workdir exist before creating the overlay.
Since these directories live in RAM, they disappear after every reboot.
This means we cannot use fstab to declare the mount points.
Instead, we implement this with a systemd service that runs a setup script during boot, before tailscaled starts.

1. Switch filesystem to RW and copy Tailscale state:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# cp -a /var/lib/tailscale /root/tailscale-state
```

2. Create a helper script, save as `/usr/local/bin/setup-tailscale-overlay.sh`:

```bash
#!/bin/bash
set -e

# Make tmpfs for tailscale overlay
mkdir -p /tmp/tailscale-tmpfs
mountpoint -q /tmp/tailscale-tmpfs || mount -t tmpfs tmpfs /tmp/tailscale-tmpfs

# Prepare overlay dirs
mkdir -p /tmp/tailscale-tmpfs/upper
mkdir -p /tmp/tailscale-tmpfs/work
mkdir -p /tmp/tailscale-merged

# Mount overlay (lowerdir = persistent readonly state in /root)
mountpoint -q /tmp/tailscale-merged || mount -t overlay overlay \
  -o lowerdir=/root/tailscale-state,upperdir=/tmp/tailscale-tmpfs/upper,workdir=/tmp/tailscale-tmpfs/work \
  /tmp/tailscale-merged

# Bind merged to /var/lib/tailscale
mountpoint -q /var/lib/tailscale && umount /var/lib/tailscale || true
mount --bind /tmp/tailscale-merged /var/lib/tailscale
```

Make it executable:

```console
[root@pikvm ~]# chmod +x /usr/local/bin/setup-tailscale-overlay.sh
```

3. Create a systemd unit

We need to run the overlay setup **after `/tmp` is mounted** but **before `tailscaled.service`**.

Save as `/etc/systemd/system/tailscale-overlay.service`:

```ini
[Unit]
Description=Setup overlayfs for Tailscale
After=local-fs.target tmp.mount
Before=tailscaled.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/setup-tailscale-overlay.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

**Notes:**

* `local-fs.target` ensures all local filesystems (including `/tmp` tmpfs from fstab) are mounted.
* `tmp.mount` is added explicitly in case your system defines it.
* Overlay is mounted and bound before `tailscaled` starts.

4. Enable and reload

```console
[root@pikvm ~]# systemctl daemon-reload
[root@pikvm ~]# systemctl enable tailscale-overlay.service
[root@pikvm ~]# ro
```

---

### Boot sequence recap:

1. tmpfs is mounted at `/tmp/tailscale-tmpfs`
2. `upper` + `work` dirs are recreated inside tmpfs
3. overlay is mounted with `/root/tailscale-state` as lowerdir
4. overlay bind-mounted to `/var/lib/tailscale`
5. `tailscaled.service` starts with writable state

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
