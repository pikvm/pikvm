# Authentication

PiKVM OS is based on a regular Linux system, so everything about authorization in this OS is also true for PiKVM.
It comes with the following default passwords:

* **Linux admin** (SSH, console, etc.): user `root`, password `root`.
* **PiKVM Web Interface, API, VNC...**: user `admin`, password `admin`, no 2FA code.

**These are two separate entities with independent accounts.**

Also there is another Linux special user: `kvmd-webterm`.
It can't be used for login or remote access to PiKVM OS and has the non-privileged rights in the OS.
Password access and `sudo` is disabled for it. It is used to launch the `Web Terminal` in the Web UI.

The basic idea is that the Web UI user can access the OS at the level of a regular user,
but cannot control the core functions of PiKVM or break the OS.


-----
## Root access in the Web Terminal

As mentioned above, the `Web Terminal` runs under user `kvmd-webterm` with disabled `sudo` and password access.
However, most PiKVM administration commands require the `root` access.

To change the user to root in the `Web Terminal`, type `su -` and then enter the `root` password:

```
[kvmd-webterm@pikvm ~]$ su -
...
[root@pikvm kvmd-webterm]#
```


-----
## Changing the Linux password

```
[root@pikvm ~]# rw
[root@pikvm ~]# passwd root
[root@pikvm ~]# ro
```


-----
## Changing the KVM password

```
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-htpasswd set admin
[root@pikvm ~]# ro
```

Please note that `admin` is a name of a default user. It is possible to create several different users
with different passwords to access the Web UI, but keep in mind that they all have the same rights:

```
# kvmd-htpasswd set <user> # Sets a new user with password
#
# kvmd-htpasswd del <user> # Removes/deletes a user
```

-----
## Two-factor authentication

This is a new method of strengthening the protection of PiKVM, available since `KVM >= 3.196`.
It is strongly recommended to enable it if you expose the PiKVM in the big and scary Internet.

!!! warning
    Using 2FA eliminates the possibility of using [IPMI](ipmi) and [VNC with vncauth](vnc) (both disabled by default).
    It also slightly affects the use of [API](api.md) and regular VNC with user/password, read below.

    Please note that 2FA does not concern the Linux OS access for the `root` user, so take care of a strong password
    for it for SSH access (or setup the [key access](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)).

??? example "Step by step: Enabling 2FA on PiKVM"

    1. Update OS and reboot:

        ```
        [root@pikvm ~]# rw
        [root@pikvm ~]# pacman -Syu
        [root@pikvm ~]# reboot
        ```

    2. **Make sure that NTP is running otherwise you will not be able to access** (`timedatectl` command).
        The timezone doesn't matter.

    3. Install the `Google Authenticator` app to your mobile device
        ([iOS](https://apps.apple.com/us/app/google-authenticator/id388497605),
        [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)). It will generate one-time access codes.

    4. Create a secret for one-time codes on PiKVM:
       ```
       [root@pikvm ~]# rw
       [root@pikvm ~]# kvmd-totp init
       [root@pikvm ~]# ro
       ```

    5. Run the `Google Authenticator` and scan the QR code.

    6. Now, on the PiKVM login page, you will need to add 6 digits to the `2FA code` field.

All Web UI users will be required to enter a one-time password on login.
In other words, **the secret is the same for all users**.

!!! note
    With 2FA for API or VNC authentication, you will need to append the one-time code to the password without spaces.
    That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password.

To view the current QR code of the secret use command `kvmd-totp show`.

To disable 2FA and remove the secret, use command `kvmd-totp del`.
