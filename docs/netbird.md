---
title: NetBird VPN
description: How to configure the access to your PiKVM using NetBird VPN
---

[NetBird](https://netbird.io/) can be used to access PiKVM from the Internet
if configuring [port forwarding](port_forwarding.md) is not possible or more
security is desired. NetBird is an open-source, self-hostable WireGuard-based mesh
VPN that connects devices peer-to-peer without a central gateway. NetBird also offers a free (for private use)
hosted management service. 

Because PiKVM's root filesystem is read-only, NetBird requires an overlay
filesystem so it can write runtime state without modifying the underlying disk.

-----

## Setting up the overlay

The NetBird client stores its state in `/var/lib/netbird`. On PiKVM this path must be
writable at runtime, so we mount an overlay backed by tmpfs over a persistent
copy of the state.

1. Switch to read-write mode and create the persistent state directory:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# mkdir -p /root/netbird-state
    ```

2. Create the helper script. Save as `/usr/local/bin/setup-netbird-overlay.sh`:

    ```bash
    #!/bin/bash
    set -e

    # Mount a tmpfs for writable NetBird state
    mkdir -p /tmp/netbird-state
    mount -t tmpfs tmpfs /tmp/netbird-state

    # Copy persistent state into the writable tmpfs
    if [ -d /root/netbird-state ]; then
        cp -a /root/netbird-state/. /tmp/netbird-state/
    fi

    # Bind mount over /var/lib/netbird so NetBird sees the writable copy
    mkdir -p /var/lib/netbird
    mountpoint -q /var/lib/netbird && umount /var/lib/netbird || true
    mount --bind /tmp/netbird-state /var/lib/netbird
    ```

    Make it executable:

    ```console
    [root@pikvm ~]# chmod +x /usr/local/bin/setup-netbird-overlay.sh
    ```

3. Create a systemd unit to run the setup before NetBird starts and save
    state back on stop. Save as `/etc/systemd/system/netbird-overlay.service`:

    ```ini
    [Unit]
    Description=Setup tmpfs overlay for NetBird
    After=local-fs.target tmp.mount
    Before=netbird@netbird.service

    [Service]
    Type=oneshot
    ExecStart=/usr/local/bin/setup-netbird-overlay.sh
    ExecStop=/bin/sh -c 'cp -a /tmp/netbird-state/. /root/netbird-state/'
    RemainAfterExit=yes

    [Install]
    WantedBy=multi-user.target
    ```

5. Enable the overlay service:

    ```console
    [root@pikvm ~]# systemctl daemon-reload
    [root@pikvm ~]# systemctl enable netbird-overlay.service
    ```

-----

## Installing NetBird

NetBird is installed from the [AUR](https://aur.archlinux.org/packages/netbird-bin)
using `makepkg`. The `netbird-bin` package provides pre-built binaries with SHA256
checksum verification, avoiding the need to compile from source on the Pi.

!!! note
    `makepkg` must not run as root. PiKVM provides the unprivileged `kvmd-webterm`
    user for this purpose.

1. Update the system and install the build dependencies, then clone the AUR package:

    ```console
    [root@pikvm ~]# pacman -Syu --needed git base-devel
    [root@pikvm ~]# cd /tmp
    [root@pikvm tmp]# git clone https://aur.archlinux.org/netbird-bin.git
    [root@pikvm tmp]# chown -R kvmd-webterm:kvmd-webterm netbird-bin
    ```

2. Build the package as the `kvmd-webterm` user:

    ```console
    [root@pikvm tmp]# su -s /bin/bash kvmd-webterm -c 'cd /tmp/netbird-bin && makepkg'
    ```

    This will download the NetBird binary for your architecture, verify its
    SHA256 checksum, and create a pacman package.

3. Install the built package:

    ```console
    [root@pikvm tmp]# pacman -U /tmp/netbird-bin/netbird-bin-*.pkg.tar.*
    ```

4. Clean up the build directory:

    ```console
    [root@pikvm tmp]# rm -rf /tmp/netbird-bin
    [root@pikvm tmp]# cd ~
    ```

5. Create a systemd override to adapt the service for PiKVM's read-only filesystem:

    ```console
    [root@pikvm ~]# mkdir -p /etc/systemd/system/netbird@.service.d
    ```

    Save the following as `/etc/systemd/system/netbird@.service.d/pikvm.conf`:

    ```ini
    [Unit]
    After=netbird-overlay.service
    Requires=netbird-overlay.service

    [Service]
    ExecStart=
    ExecStart=/usr/bin/netbird service run --log-file syslog --daemon-addr unix:///var/run/netbird/%i.sock
    LogsDirectory=
    Environment=NB_DISABLE_SSH_CONFIG=true
    ```

    The key changes from the default service file are:

    * **`After=` and `Requires=`** include `netbird-overlay.service` so the
        overlay is mounted before NetBird starts.
    * **`ExecStart=`** is cleared then set with `--log-file syslog` instead of
        a file path, since `/var/log` is read-only.
    * **`LogsDirectory=`** is cleared to prevent systemd from trying to create
        a log directory on the read-only filesystem.
    * **`NB_DISABLE_SSH_CONFIG=true`** prevents NetBird from writing SSH
        shortcut configuration to `/etc/ssh/ssh_config.d/99-netbird.conf`,
        which would fail on the read-only filesystem. This only disables
        the convenience of `ssh <peer-name>` -- SSH over NetBird still works
        using the peer's IP address directly.

    !!! note
        The empty `ExecStart=` line is **not a typo**. In systemd, `ExecStart`
        is a list-type setting. An empty assignment clears the previous value so
        the next line replaces it rather than appending to it.

6. Enable and start the services:

    ```console
    [root@pikvm ~]# systemctl daemon-reload
    [root@pikvm ~]# systemctl enable netbird@netbird.service
    [root@pikvm ~]# systemctl start netbird-overlay.service
    [root@pikvm ~]# systemctl start netbird@netbird.service
    ```

-----

## Updating NetBird

Since NetBird is installed from the AUR rather than an official repository,
updates must be performed manually by rebuilding the package.

```console
[root@pikvm ~]# rw
[root@pikvm ~]# cd /tmp
[root@pikvm tmp]# git clone https://aur.archlinux.org/netbird-bin.git
[root@pikvm tmp]# chown -R kvmd-webterm:kvmd-webterm netbird-bin
[root@pikvm tmp]# su -s /bin/bash kvmd-webterm -c 'cd /tmp/netbird-bin && makepkg'
[root@pikvm tmp]# pacman -U /tmp/netbird-bin/netbird-bin-*.pkg.tar.*
[root@pikvm tmp]# rm -rf /tmp/netbird-bin
[root@pikvm tmp]# cd ~
[root@pikvm ~]# systemctl restart netbird@netbird
[root@pikvm ~]# ro
```

-----

## Registering the device

There are two ways to register your PiKVM with NetBird. The `--disable-dns`
flag is used in both cases to prevent NetBird from trying to write to
`/etc/resolv.conf` on the read-only filesystem.

### Option 1: Setup key (recommended)

Setup keys allow registration without any browser interaction, making them
ideal for headless devices like PiKVM.

1. Log in to the [NetBird dashboard](https://app.netbird.io/) and navigate to
    **Setup Keys**. Create a new key.

2. Register your PiKVM using the setup key:

    ```console
    [root@pikvm ~]# netbird up --setup-key <YOUR_SETUP_KEY> --disable-dns
    ```

### Option 2: Interactive SSO login

You can also use the standard SSO login flow. PiKVM does not have a browser,
but the activation URL can be opened on any other device.

1. Start the login flow:

    ```console
    [root@pikvm ~]# netbird up --disable-dns
    ```

2. NetBird will print an activation URL in the terminal, for example:

    ```
    Please do the SSO login in your browser.
    If your browser didn't open automatically, use this URL to log in:

    https://login.netbird.io/activate?user_code=XXXX-XXXX
    ```

3. Copy this URL and open it in a browser on your computer or phone.
    Complete the login there. The PiKVM terminal will proceed automatically
    once authentication is confirmed.

### Verifying and persisting

1. Verify the connection:

    ```console
    [root@pikvm ~]# netbird status
    ```

    You should see `Status: Connected` and a NetBird IP address (e.g. `100.x.x.x`).

2. Persist the authentication state so it survives reboots:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# cp -a /tmp/netbird-state/. /root/netbird-state/
    [root@pikvm ~]# ro
    ```

3. Reboot to verify everything starts automatically:

    ```console
    [root@pikvm ~]# reboot
    ```

!!! warning "Persist state after configuration changes"
    Because the overlay uses tmpfs, any changes NetBird writes at runtime
    (authentication tokens, key rotations, etc.) exist only in RAM. After making
    configuration changes or re-authenticating, always persist the state:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# cp -a /tmp/netbird-state/. /root/netbird-state/
    [root@pikvm ~]# ro
    ```

-----

## Configuring a client device

* [Download](https://www.netbird.io/download) and install the NetBird client
    on the system you are using (not the system you want to control).
* Check the [NetBird dashboard](https://app.netbird.io/) to see your connected peers.
* Open `https://<netbird_kvm_ip>` in your browser to access the PiKVM web interface.

-----

## Troubleshooting

* **Service fails with `status=209/STDOUT`**: The service is trying to write
    logs to a file on the read-only filesystem. Make sure the systemd override
    includes `--log-file syslog` as described above.

* **`mount: tmpfs: mount failed`**: The tmpfs mount in the overlay script is
    failing. Check that `/tmp` is writable and that the script is executable
    (`chmod +x /usr/local/bin/setup-netbird-overlay.sh`).

* **DNS lookup failures (`DeadlineExceeded`)**: If NetBird cannot reach
    `api.netbird.io`, check that your PiKVM has working DNS resolution:

    ```console
    [root@pikvm ~]# curl -v --max-time 10 https://api.netbird.io:443
    ```

    If DNS is broken, verify `/etc/resolv.conf` contains a valid nameserver.
    A stale NetBird daemon process can also cause this; restart the service:

    ```console
    [root@pikvm ~]# systemctl restart netbird@netbird
    ```

* **Need to re-authenticate after reboot**: You forgot to persist the state.
    Run `netbird up --setup-key <KEY> --disable-dns` again, then persist:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# cp -a /tmp/netbird-state/. /root/netbird-state/
    [root@pikvm ~]# ro
    ```

* If something does not work, the usual advice is to completely remove NetBird
    and perform a clean installation:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# netbird down
    [root@pikvm ~]# systemctl stop netbird@netbird
    [root@pikvm ~]# systemctl disable netbird@netbird netbird-overlay
    [root@pikvm ~]# pacman -Rns netbird-bin
    [root@pikvm ~]# rm -rf /var/lib/netbird /root/netbird-state
    [root@pikvm ~]# rm -rf /etc/systemd/system/netbird@.service.d
    [root@pikvm ~]# reboot
    ```

    Now follow the instructions from the beginning to re-install.
