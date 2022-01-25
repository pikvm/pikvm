# Tailscale VPN

[Tailscale](https://tailscale.com/) can be used to access PiKVM on the internal network. This is a convenient and free (for private use) tool for organizing a small VPN network. This document is provided as an example for accessing your pikvm over the inet but you can also use zerotier or remote.it. Basic support like whats shown below is provided as an example, any other setting or functionality needs to be redirected to the appropriate community.


## Installation

### On the PiKVM side

1. Use these commands:

    ```
    # rw
    # pacman -Syy
    # pacman -S tailscale-pikvm
    # systemctl enable --now tailscaled
    # tailscale up
    ```

2. Follow the link to authorize this installation.

3. After success, perform soft reboot using `reboot` command to make sure that everything will work correctly.

4. Perform command `ip addr show tailscale0` to view the Tailscale IP address.


### For each device you wish to access pikvm

* [Download](https://tailscale.com/download) and install tailscale for your OS.
* Check the [admin page](https://login.tailscale.com/admin/machines) to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see PiKVM web interface.
