??? danger "✮ ✮ ✮ CHANGE THE PASSWORDS! ✮ ✮ ✮"
    PiKVM comes with the following default passwords:

    * **Linux admin** (SSH, etc.): user `root`, password `root`.
    * **PiKVM Web Interface**: user `admin`, password `admin`, no 2FA code.

    **These are two separate entities with independent accounts.** To change passwords, you will need to use the terminal (read below) access via SSH or Web Terminal. If you are using the Web Terminal, use the `su -` command to get root access (enter the root user password).

    ```
    # rw
    # passwd root
    # kvmd-htpasswd set admin
    # ro
    ```
    If you require additional user for the Web UI access, use the following:
    ```
    # kvmd-htpasswd set <user> # Sets a new user with password
    # kvmd-htpasswd del <user> # Removes/deletes a user
    ```

    **Optionally you can enable the [two-factor authentication](auth.md#two-factor-authentication) for more security.**
