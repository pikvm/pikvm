# Authentication

PiKVM comes with the following default passwords:

* **Linux admin** (SSH, console, etc.): user `root`, password `root`.
* **PiKVM Web Interface, API, VNC...**: user `admin`, password `admin`, no 2FA code.

**These are two separate entities with independent accounts.**
To change passwords, you will need to use the terminal access via SSH or Web Terminal.
If you are using the Web Terminal, use the `su -` command to get root access (enter the root user password).


## Linux authentication

```
# rw
# passwd root
# ro
```

## KVM authentication

```
# rw
# kvmd-htpasswd set admin
# ro
```

Please note that admin is the default user. It is possible to create several different users
with different passwords to access the Web UI, but keep in mind that they all have the same rights:

```
# kvmd-htpasswd set <user> # Sets a new user with password
# kvmd-htpasswd del <user> # Removes/deletes a user
```


## Two-factor authentication

This is a new method of strengthening the protection of PiKVM, available since `KVM >= 3.196`.
It is strongly recommended to enable it if you expose the PiKVM in the big and scary Internet.

!!! warning
    Using 2FA eliminates the possibility of using [IPMI](ipmi) and [VNC with vncauth](vnc) (not used by default).
    It also slightly affects the use of API and regular VNC with user/password, read below.

Steb-by step to enable 2FA:

1. Update OS: `rw && pacman -Syu && reboot`.

2. **Make sure that NTP is running otherwise you will not be able to access** (`timedatectl` command). The timezone doesn't matter.

3. Install **Google Authenticator** app to your phone ([iOS](https://apps.apple.com/us/app/google-authenticator/id388497605), [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)). It will generate one-time access codes.

4. Create a secret for one-time codes on PiKVM:
   ```
   rw
   kvmd-totp init
   ro
   ```

5. Run **Google Authenticator** and scan the QR code.

6. Now, on the PiKVM login page, you will need to add 6 digits to the **2FA code** field.

Now all Web UI users will be required to enter a one-time password. In other words, the secret is the same for all users.

!!! note
    With 2FA for API or VNC authentication, you will need to add the one-time code to the password without spaces.
    That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password.

To view the current QR code of the secret use `kvmd-totp show`.

To disable 2FA, use `kvmd-totp del`.
