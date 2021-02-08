# VNC
As an alternative to the web interface, you can use VNC with various desktop clients. The main advantage of VNC over the browser is the ability to expand the image to the full screen, as well as complete interception of all keyboard keys. In some cases, VNC will be more responsive than the browser, especially on weak computers.

:exclamation: **Please note: we strongly advise against using VNC on untrusted networks! (i.e. Internet, public WiFi and similar networks)** 

The current VNC implementation uses either weak TLS encryption or no encryption at all (depending on your client). In the latter case, your password will be transmitted over the network in plain text. Unfortunately, this is the reality of the VNC protocol.

# Enabling VNC on the Pi-KVM side
1. Switch Pi-KVM filesystem to read-write mode using command `rw`.
2. _Optional:_ Change client's keyboard layout if you're using an non-US keyboard. To do this edit file `/etc/kvmd/override.yaml`
    
    :exclamation: **(remove `{}` before adding lines)**:
    ```yaml
    vnc:
        keymap: /usr/share/kvmd/keymaps/ru
    ```
    _All available keymaps are located in /usr/share/kvmd/keymaps:_

    ![VNC keymaps](/img/vnc-keymaps.png)

3. _Optional:_ Some VNC clients (for example TightVNC) can't use user/password authentication. In this case you can enable passhrases mode in `/etc/kvmd/override.yaml`:
    ```yaml
    vnc:
        auth:
            vncauth:
                enabled: true
    ```
    To set passphrases edit file `/etc/kvmd/vncpasswd`.
4. Enable `kvmd-vnc` daemon. VNC will be available on the port 5900: `systemctl enable --now kvmd-vnc`.
5. Switch filesystem back to read-only: `ro`.

# Configuring the client
We recommend [TigerVNC](https://tigervnc.org) for a better experience.
Here are our recommended settings for TigerVNC:
* **Compression** tab:
  - Choose **Tight** encoding as preferred and color-level **Full**.
  - Disable automatic quality adjust settings **Auto Select**.
  - Enable **Allow JPEG compression**.
* **Security** tab:
  - Enable **None** and **Anonymous TLS** encryption.
  - Enable **Username and password** authentication.
