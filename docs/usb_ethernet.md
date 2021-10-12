# Ethernet-over-USB network

## Basic configuration

Specifically to v2+. When combined with configuring a DNS server, FTP, or SMB (for example), this is a powerful way to extend the capabilities of PiKVM.

1. Edit `/etc/kvmd/override.yaml` and add these lines:

    ``` yaml
    otg:
        devices:
            ethernet:
                enabled: true
                driver: ecm
                host_mac: 48:6f:73:74:50:43
                kvm_mac: 42:61:64:55:53:42
    ```

    The `host_mac` address will be used on the server's network interface. The `kvm_mac` means the address that will be assigned to the local interface on the PiKVM. The KVM interface will be called `usb0`network interface. If the `host_mac` or `kvm_mac` is not specified, a random value will be used. The `driver` parameter means the protocol that will be used for the USB network. The default value is `ecm` so it can be passed it this example. Other possible values are `eem`, `ncm` and `rndis`.

2. To automatically configure the USB network on the server recommended using the service `kvmd-otgnet`. It configures the firewall, assigns an address to the local PiKVM interface `usb0` and starts DHCP so the managed server can get the IPv4 address. By default, the address `169.254.0.1/28` to interface `usb0` will be assigned. One of the other addresses from the network `169.254.0.0./28` will be assigned to the server when it requests it via DHCP. For security reasons, all incoming connections from the server to the PiKVM side are blocked (except for ICMP and UDP port 67 which is used for DHCP). If you want to allow access from the server to the PiKVM interface, then you need to add ports 80 and 443 to the whitelist using `/etc/kvmd/override.yaml` file like this:

    ```yaml
    otgnet:
        firewall:
            allow_tcp: [80, 443]
    ```

    To view other available configuration parameters, use the command `kvmd -m`.

3. To enable the service, use the command `systemctl enable kvmd-otgnet`.

4. Perform `reboot`.


## Routing via PiKVM

By default, `kvmd-otgnet` will configure network connection between PiKVM and the server host only. The server host will not be able to reach other hosts beyond PiKVM. If the full network access is required from the server host through the USB-Ethernet feature (access all hosts PiKVM can access), additional settings are needed in `/etc/kvmd/override.yaml`.

1. Run `echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-kvmd-extra.conf`.

2. Add network interface to forward requests to (default gateway) by adding a line `forward_iface: <interface name>` under `firewall:`. Typically it would be `eth0` if the built-in ethernet port is used::

    ```yaml
    otgnet:
        firewall:
            forward_iface: eth0
    ```

3. Add DNS server to provide host name resolution service. For example, adding `8.8.8.8` as DNS server requires addition of `dnsmasq` dhcp options. This can be done by adding following lines to `/etc/kvmd/override.yaml`:

    ```yaml
    otgnet:
        commands:
            post_start_cmd_append:
            - "--dhcp-option=6,8.8.8.8"
    ```

4. Combining above two together::

    ```yaml
    otgnet:
        firewall:
            forward_iface: eth0
        commands:
            post_start_cmd_append:
            - "--dhcp-option=6,8.8.8.8"
    ```

5. Don't forget to `reboot`.
