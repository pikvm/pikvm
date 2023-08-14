??? danger "✮ ✮ ✮ CHANGE THE PASSWORDS! ✮ ✮ ✮"
    PiKVM comes with the following default passwords:

    * **Linux admin** (SSH, etc.): user `root`, password `root`.
    * **PiKVM Web Interface**: user `admin`, password `admin`, no 2FA code.

    **These are two separate entities with independent accounts.**
    To change passwords, you will need to use the terminal (read below) access via SSH or Web Terminal.
    If you are using the Web Terminal, use the `su -` command to get root access (enter the root user password).

    ```
    # rw
    # passwd root
    # kvmd-htpasswd set admin
    # ro
    ```
    If you require additional user for the Web UI access, use the following:
    ```
    # kvmd-htpasswd set <user> # Set a new user with password or change of an existing one
    # kvmd-htpasswd del <user> # Remove/delete a user
    ```

    **Optionally you can enable the [two-factor authentication](auth.md#two-factor-authentication) for more security.**

    *Changing the [VNCAuth passkey](vnc.md) and [IPMI password](ipmi.md) at the first start of PiKVM is not required,
    since these services are disabled by default. But it is here just so that you remember their existence.*
