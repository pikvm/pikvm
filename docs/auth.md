---
title: "Authentication"
description: Regular and 2FA authentication on PiKVM
---

!!! info
    PiKVM supports additional authentication methods commonly used on enterprise networks. [See here](auth_advanced.md) for detailed documentation.

!!! warning "PiKVM comes with the following default passwords"

    * **Linux OS-level admin** (SSH, console...):
        * Username: `root`
        * Password: `root`

    * **KVM user** (Web Interface, [API](api.md), [VNC](vnc.md)...):
        * Username: `admin`
        * Password: `admin`
        * No 2FA code

    **They are two separate accounts with independent passwords.**

!!! danger "Don't forget to change BOTH passwords on the new device"

    This page describes how to do this and enable two-factor authentication.

    The 2FA is also strongly recommended if you plan to expose PiKVM to the internet
    or use it in untrusted networks.

In addition to the KVM user and Linux root, there are some other auth entities:

* **The OS user `kvmd-webterm`**<br>
    This is a special user with non-privileged rights in PiKVM OS.
    It can't be used for login or remote access via SSH. Password access and `sudo` are also disabled.
    It is used only for the Web Terminal. These restrictions are set for security reasons.

* [**VNCAuth key**](vnc.md) - disabled by default.<br>

* [**IPMI password**](ipmi.md) - disabled by default.<br>


-----
## Root access in the Web Terminal

As mentioned above, the Web Terminal runs under user `kvmd-webterm` with disabled `sudo` and password access.
However, most PiKVM administration commands require the `root` access.
To obtain it in the Web Terminal, type `su -` and then enter the `root` user password:

```console
[kvmd-webterm@pikvm ~]$ su -
...
[root@pikvm kvmd-webterm]#
```

??? example "Step by step: Disabling the Web Terminal"

    Sometimes the actual owner of a PiKVM device and the user who is allowed to use it are different people.
    So you may want to disable console access from the Web UI. To do this, use the following:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl disable --now kvmd-webterm
    [root@pikvm ~]# ro
    ```

    For your own access to PiKVM OS, you still have SSH.


-----
## Changing the Linux password

```console
[root@pikvm ~]# rw
[root@pikvm ~]# passwd root
[root@pikvm ~]# ro
```


-----
## Changing the KVM password

This password is used, among the Web UI login, to access the [API](api.md), [VNC](vnc.md) (if enabled)
and other functions that do not concern the OS shell.

By default, an authentication method similar to Apache Server is configured: users and passwords
are stored encrypted in the `/etc/kvmd/htpasswd` file. To manage them, there is a utility `kvmd-htpasswd`.

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-htpasswd set admin
[root@pikvm ~]# ro
```

The `admin` is a name of a default user.

??? example "Step by step: Add KVM users"

    It is possible to create several different KVM users with different passwords to access
    the Web UI and VNC, but keep in mind that they all have the same rights:

    ```console
    [root@pikvm ~]# kvmd-htpasswd add <user> # Add a new user with password
    [root@pikvm ~]# kvmd-htpasswd list # Show the list of users
    [root@pikvm ~]# kvmd-htpasswd del <user> # Removes/deletes a user
    ```

    At the moment there is no way to create any ACL for different KVM users.


-----
## Two-factor authentication

Two-factor authentication (2FA) is a new method of strengthening the protection of PiKVM, available since `KVM >= 3.196`.
It is strongly recommended to enable it if you expose the PiKVM in the big and scary Internet.

!!! warning
    Please note that 2FA does not concern the Linux OS access for the `root` user, so take care of a strong password
    for it for SSH access (or setup the [key access](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)).

??? example "Step by step: Enabling 2FA on PiKVM"

    1. Update OS and reboot:

        {!_update_os.md!}

    2. **Make sure that NTP is running otherwise you will not be able to access** (`timedatectl` command).
        The timezone doesn't matter.

    3. Install the **Google Authenticator** app to your mobile device
        ([iOS](https://apps.apple.com/us/app/google-authenticator/id388497605),
        [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)). It will generate one-time access codes.

    4. Create a secret for one-time codes on PiKVM:

       ```console
       [root@pikvm ~]# rw
       [root@pikvm ~]# kvmd-totp init
       [root@pikvm ~]# ro
       ```

    5. Run the Google Authenticator and scan the QR code.

    6. Now, on the PiKVM login page, you will need to add 6 digits to the `2FA code` field.

All Web UI users will be required to enter a one-time password on login.
In other words, **the secret is the same for all users**.

!!! note
    With 2FA for API or VNC authentication (except VNCAuth mode), you will need to append the one-time code to the password without spaces.
    That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password.

To view the current QR code of the secret use command `kvmd-totp show`.

To disable 2FA and remove the secret, use command `kvmd-totp del`.


----
## Session expiration

Since KVMD 4.53, on the PiKVM Web UI login page, you can choose the maximum duration of the authentication session:
1 hour, 12 hours or infinite (until PiKVM is rebooted or the `kvmd` system service is restarted).
The selected session duration is valid for this browser and this user.
When the time is up, the auth cookie will be revoked.
It will not affect other sessions for the same user in other browsers.

Note if you click the **Logout** button on the main page, it will log out all sessions of this user in all browsers.

!!! note "Long-lived connections"

    PiKVM actively uses websockets and long-lived HTTP connections for video streaming.

    If the session has expired, this will cause its authorization cookie to be revoked
    and new connections with this auth cookie will not be able to be established.
    However, long-lived connections will not be terminated until the user closes the browser tab.
    The session expiration feature is primarily intended to "clean up" when the user closes
    the browser but don't hit the Logout button.

    In the future, we plan to add immediate termination of expired connections.

??? example "Step by step: Set a global session expiration limit"

    You can set the default expiration time to limit the user's ability to create endless sessions.
    This will be an invisible limit valid on KVM login for Web UI (but **not for VNC**, please note that VNC sessions are always endless).

    1. Switch filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit the file `/etc/kvmd/override.yaml`:

        ```yaml
        kvmd:
            auth:
                expire: 21600  # 21600 seconds is 6 shours
        ```

    3. Restart the `kvmd` service and make sure that the limit is applied:

        ```console
        [root@pikvm ~]# systemctl restart kvmd
        [root@pikvm ~]# journalctl -u kvmd -g 'Maximum user session'
        ... INFO --- Maximum user session time is limited: 6:00:00
        ```

    4. Switch filesystem to read-only mode back:

        ```console
        [root@pikvm ~]# ro
        ```


----
## Disabling authentication

If necessary, you can disable authentication for KVM access (Web UI, VNC, etc. except SSH).

!!! warning

    Don't do this in untrusted networks, because you can give a potential attacker access to your target machine.

    If you really need this, please consider to disable the Web Terminal so as not to open the shell access to PiKVM console.
    You still can use SSH to access to the console.


??? example "Step by step: Disabling authentication"

    1. Switch filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit the file `/etc/kvmd/override.yaml`:

        ```yaml
        kvmd:
            auth:
                enabled: false
        ```

    3. Restart `kvmd`, optionally disable web terminal switch filesystem to read-only mode:

        ```console
        [root@pikvm ~]# systemctl restart kvmd
        [root@pikvm ~]# systemctl disable --now kvmd-webterm  # Optional if you have SSH access
        [root@pikvm ~]# ro
        ```
