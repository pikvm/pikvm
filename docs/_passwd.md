---
search:
    exclude: true
---


??? note "Changing PiKVM Passwords"
    PiKVM comes with the following default passwords:

    * **Linux OS-level admin** (SSH, console...):
        * Username: `root`
        * Password: `root`

    * **KVM user** (Web Interface, [API](api.md), [VNC](vnc.md)...):
        * Username: `admin`
        * Password: `admin`
        * No 2FA code

    **They are two separate accounts with independent passwords.**

    To change passwords, you will need to use the console access via SSH or the Web Terminal.
    If you are using the Web Terminal, enter the `su -` command to get the `root` access (enter the `root` user password).

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# passwd root
    [root@pikvm ~]# kvmd-htpasswd set admin
    [root@pikvm ~]# ro
    ```

    If you require additional user for the Web UI access, use the following:

    ```console
    [root@pikvm ~]# kvmd-htpasswd add <user> # Add a new user with password
    [root@pikvm ~]# kvmd-htpasswd del <user> # Remove/delete a user
    ```

    **Optionally you can enable the [two-factor authentication](auth.md#two-factor-authentication) for more security.**

    *Changing the [VNCAuth key](vnc.md) and [IPMI password](ipmi.md) at the first start of PiKVM is not required,
    since these services are disabled by default. But it is here just so that you remember their existence.*
