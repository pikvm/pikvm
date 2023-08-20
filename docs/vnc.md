# VNC

As an alternative to the Web UI, a regular VNC client can be used to access to the PiKVM.
The main advantage of VNC over the browser is the ability to expand the image to the full screen,
as well as complete interception of all keyboard shortcuts. In some cases, VNC will be more responsive
than the browser, especially on weak client computers.

!!! warning
    Don't use VNC without X.509 or TLS encryption on untrusted networks!
    Otherwise your password will be transmitted over the network in plain text.
    Unfortunately, this is the reality of the VNC protocol.
    
!!! note
    The performance of VNC on PiKVM does not make sense to compare with regular VNC servers
    or a similar remote access tool at the OS level.
    PiKVM will run a little slower due to the fact that access is done at the hardware level.

    A typical video processing chain looks like this:

    * Regular VNC/RDP/TeamViewer/Etc: `OS -> Remote access server -> Network -> Client`.
    * PiKVM: `OS -> Video card -> PiKVM video capture -> PiKVM server -> Network -> Client`.


-----
## Enabling VNC on the PiKVM side

1. The recommended client is [TigerVNC](https://github.com/TigerVNC/tigervnc/releases).

2. Switch the PiKVM filesystem to read-write mode using command `rw`.

3. ??? tip "Optional for *non-TigerVNC* clients: Change the keybobard layout for non-US keyboard"

        This step is nessessory if you're using a client that does not support
        the direct keyboard access.

        In this case you can force the client layout in `/etc/kvmd/override.yaml`:

        ```yaml
        vnc:
            keymap: /usr/share/kvmd/keymaps/ru
        ```

        All available keymaps are located in `/usr/share/kvmd/keymaps`:

        <img src="keymaps.png" />

4. ??? warning "Optional for *non-TigerVNC* and NOT RECOMMENDED: Enable VNCAuth method"

        This step is nessessory if you're using a client that does not support the user/password
        auth method like TightVNC (don't confuse it with TigerVNC).

        In this case you can enable VNCAuth passphrases mode in `/etc/kvmd/override.yaml`:

        ```yaml
        vnc:
            auth:
                vncauth:
                    enabled: true
        ```

        To set passphrases edit the file `/etc/kvmd/vncpasswd`.

        **But once again: THIS IS AN UNSAFE AUTHORIZATION METHOD and it is better to use TigerVNC.**

5. Enable `kvmd-vnc` daemon. VNC will be available on the port 5900: `systemctl enable --now kvmd-vnc`.

6. Switch filesystem back to read-only: `ro`.

!!! note
    With enabled [2FA](auth.md#two-factor-authentication), you will need to append the one-time code
    to the password without spaces. That is, if the password is `foobar` and the code is `123456`,
    then the string `foobar123456` should be used as a password.

    Also note that `vncauth` (step 3) will not work with 2FA.


-----
## Configuring the client

We recommend [TigerVNC](https://tigervnc.org) for a better experience on a desktop.

If you're using PiKVM V3+ or DIY based on CSI bridge, you can try
the [latest version (>= 1.13.0) of TigerVNC with H.264 support](https://github.com/TigerVNC/tigervnc/releases).
It will improve performance and save traffic.

H.264 video mode is available in binary builds for Windows, for other OS it needs to be compiled manually
(`ffmpeg` libraries required to build).

Here are our recommended settings for TigerVNC:

| Compression tab | Security tab |
|-----------------|--------------|
| <img src="tigervnc_compression.png" width="300" /> | <img src="tigervnc_security.png" width="300" /> |
| If your client does not support H.264, choose **Tight** | |

For iOS and Android the recommended application is bVNC:

* [Google Play](https://play.google.com/store/apps/details?id=com.iiordanov.bVNC)
* [App Store](https://apps.apple.com/us/app/bvnc-pro/id1506461202)


-----
## Unsupported clients

* **RealVNC** - Does not support most widely used open VNC protocol extensions.
* **Remmina** - Slightly imperfect algorithms for matching settings with the server, we are working on it.
* **Guacamole** - Incorrectly implements vencrypt, no JPEG compression.
* **Vinagre** - Incorrectly implements vencrypt, dead.
