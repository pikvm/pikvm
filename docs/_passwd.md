??? danger "✮ ✮ ✮ CHANGE THE PASSWORDS! ✮ ✮ ✮"
    PiKVM comes with the following default passwords:

    * **Linux admin** (SSH, console, etc.): user `root`, password `root`.
    * **PiKVM Web Interface** ([API](api.md), [VNC](vnc.md)...): user `admin`, password `admin`, no 2FA code.

    **These are two separate entities with independent accounts.**

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
    [root@pikvm ~]# kvmd-htpasswd set <user> # Set a new user with password or change of an existing one
    [root@pikvm ~]# kvmd-htpasswd del <user> # Remove/delete a user
    ```

    **Optionally you can enable the [two-factor authentication](auth.md#two-factor-authentication) for more security.**

    *Changing the [VNCAuth passkey](vnc.md) and [IPMI password](ipmi.md) at the first start of PiKVM is not required,
    since these services are disabled by default. But it is here just so that you remember their existence.*
