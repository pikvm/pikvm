# VNC

As an alternative to the web interface, you can use VNC with various desktop clients. The main advantage of VNC over the browser is the ability to expand the image to the full screen, as well as complete interception of all keyboard keys. In some cases, VNC will be more responsive than the browser, especially on weak computers.

!!! warning
    Don't use VNC without X.509 or TLS encryption on untrusted networks! Otherwise your password will be transmitted over the network in plain text. Unfortunately, this is the reality of the VNC protocol.
    
!!! note 
    VNC and its varients/TeamViewer/RDP to a system uses the target systems framebuffer IE local display, VNC usage for PiKVM accesses the stream, there will still be a 100-200ms latency and cannot be compared with the other software solutions.

      * NORMAL USAGE: *VNC/TM/RDP -> Target system*
      * PiKVM USAGE: *VNC -> PiKVM (hardware capture, processing) -> Target system*


## Enabling VNC on the PiKVM side

1. Switch PiKVM filesystem to read-write mode using command `rw`.

2. *Optional:* Change client's keyboard layout if you're using an non-US keyboard. To do this edit file `/etc/kvmd/override.yaml`:

    ```yaml
    vnc:
        keymap: /usr/share/kvmd/keymaps/ru
    ```

    All available keymaps are located in `/usr/share/kvmd/keymaps`:

    <img src="keymaps.png" />

3. *Optional:* This step is not nessessory if using TigerVNC as it uses the webgui user:pass. Some VNC clients (for example TightVNC) can't use user/password authentication. In this case you can enable passphrases mode in `/etc/kvmd/override.yaml`:

    ```yaml
    vnc:
        auth:
            vncauth:
                enabled: true
    ```

    To set passphrases edit file `/etc/kvmd/vncpasswd`.

4. Enable `kvmd-vnc` daemon. VNC will be available on the port 5900: `systemctl enable --now kvmd-vnc`.

5. Switch filesystem back to read-only: `ro`.

!!! note
    With enabled [2FA](auth.md#two-factor-authentication), you will need to add the one-time code to the password without spaces. That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password. Also note that `vncauth` (step 3) will not work with 2FA.


## Configuring the client

We recommend [TigerVNC](https://tigervnc.org) for a better experience on desktop.

If you are using PiKVM V3+ or DIY based on CSI bridge, you can try the [latest version (>= 1.13.0) of TigerVNC with H.264 support](https://github.com/TigerVNC/tigervnc/releases). It will improve performance and save traffic.

H.264 is available in binary builds for Windows, for other OS it needs to be compiled manually (before that, you need to install ffmpeg libraries).

Here are our recommended settings for TigerVNC:

| Compression tab | Security tab |
|-----------------|--------------|
| <img src="tigervnc_compression.png" width="300" /> | <img src="tigervnc_security.png" width="300" /> |
| If your client does not support H.264, choose **Tight** | |

For iOS and Android the recommended application is bVNC:

* [Google Play](https://play.google.com/store/apps/details?id=com.iiordanov.bVNC)
* [App Store](https://apps.apple.com/us/app/bvnc-pro/id1506461202)


## Unsupported clients

* **RealVNC** - Does not support most widely used open VNC protocol extensions.
* **Remmina** - Slightly imperfect algorithms for matching settings with the server, we are working on it.
* **Guacamole** - Incorrectly implements vencrypt, no JPEG compression.
* **Vinagre** - Incorrectly implements vencrypt, dead.
