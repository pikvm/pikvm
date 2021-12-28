# Wake-on-LAN

## Simplified method (one host)

To use Wake-on-LAN with your server you must define some options such as the server's MAC address and (optionally) IP address. Use `/etc/kvmd/override.yaml`. The format is:

```yaml
kvmd:
    wol:
        mac: ff:ff:ff:ff:ff:ff
```

Replace `ff:ff:ff:ff:ff:ff` with the MAC of your server. By default, a packet is sent via a broadcast request to the entire IPv4 network (`255.255.255.255`, port `9`), but you can address it to a specific static address:

```yaml
kvmd:
    wol:
        mac: ff:ff:ff:ff:ff:ff
        ip: 192.168.0.100
        # port: 9  # By default
```

... then restart `kvmd` using `systemctl restart kvmd`. It will now show up in the system button in the upper right corner.


## GPIO method (multiple hosts)

Follow the [manual for building the GPIO menu](gpio.md) and use the `wol` driver to build a menu with many buttons tied to different hosts.
