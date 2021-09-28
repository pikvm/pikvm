# Tailscale VPN
As an example, You can use [Tailscale](https://tailscale.com/) to access PiKVM on the internal network. This is a convenient and free (for private use) tool for organizing a small VPN network. This document is provided as an example for accessing your pikvm over the inet but you can also use zerotier or remote.it. Basic support like whats shown below is provided as an example, any other setting or functionality needs to be redirected to the appropriate community.

# Installation
## On the PiKVM side
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

## On the workstation side
* Download and install tailscale for your OS: https://tailscale.com/download
* Check the page https://login.tailscale.com/admin/machines to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see PiKVM web interface.
