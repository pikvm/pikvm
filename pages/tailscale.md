# Tailscale VPN
You can use [Tailscale](https://tailscale.com/) to access Pi-KVM on the internal network. This is a convenient and free (for private use) tool for organizing a small VPN network.

# Installation
## On the Pi-KVM side
1. Use these commands:
  ```
  # rw
  # pacman -Syy
  # pacman -S tailscale
  # systemctl enable --now tailscaled.service
  # tailscale up
  ```
2. Follow the link to authorize this installation.
3. After success, perform soft reboot using `reboot` command to make sure that everything will work correctly.
4. Perform command `ip addr show tailscale0` to view the Tailscale IP address.

## On the workstation side
* Download and install tailscale for your OS: https://tailscale.com/download
* Check the page https://login.tailscale.com/admin/machines to view your VPN network.
* Follow the URL in the web browser: `https://<tailscale_kvm_ip>` and you will see Pi-KVM web interface.
