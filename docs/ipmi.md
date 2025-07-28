---
title: IPMI & Redfish
description: How to use IPMI and Redfish for remote PiKVM management
---

!!! info
    This page is about the server-side IPMI emulation if you want to manage PiKVM using `ipmitool` or something similar.
    If you want to use the PiKVM Web UI to manage the server using IPMI (that is, as an IPMI client),
    see [GPIO functions with IPMI plugin](gpio.md).

!!! warning
    Although PiKVM supports the IPMI protocol, we strongly recommend that you **DO NOT USE IT** outside of trusted networks
    due to the protocol's [insecurity](http://fish2.com/ipmi/).

    Please consider to using the Redfish or [KVMD API](api.md) instead of it.


----
## IPMI BMC

IPMI is a [legacy protocol](https://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface) for remote server management.
It can be useful for managing a large number of machines with PiKVM. Its advantage is that it is supported by many enterprise systems.

??? example "Step by step: Enabling IPMI server on PiKVM"

    1. Switch the filesystem to the RW-mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Set up IPMI account in file `/etc/kvmd/ipmipasswd` (see the comment inside it).

    3. Enable the `kvmd-ipmi` daemon:

        ```console
        [root@pikvm ~]# systemctl enable --now kvmd-ipmi
        ```

    4. Switch the filesystem back to the RO:

        ```console
        [root@pikvm ~]# ro
        ```

    5. Try some commands on the client PC:

        ```console
        $ ipmitool -I lanplus -U admin -P admin -H pikvm power status
        $ ipmitool -I lanplus -U admin -P admin -H pikvm power on
        ```


----
## IPMI SoL

IPMI supports the ability to get console access to the server using Serial-over-LAN.
With this feature PiKVM will act as a proxy for your server's COM port.

To use this feature, you will need a USB-COM adapter that you need to connect to the PiKVM.
The COM port of the adapter need to be connected to the server.

??? example "Step by step: Enabling IPMI SoL for USB-COM adapter"

    As with IPMI BMC, you need to configure `kvmd-ipmi` server (see the previous chapter about IPMI BMC)
    and add the following configuration to `/etc/kvmd/override.yaml`:

    ```yaml
    ipmi:
        sol:
            device: /dev/ttyUSB0  # Path of your USB-COM adapter
            speed: 115200
    ```

    Then restart the `kvmd-ipmi` server: `systemctl restart kvmd-ipmi`.

    All requests that it receives over the network regarding the COM port will be forwarded to your server. For example:

    ```console
    [root@pikvm ~]$ ipmitool -I lanplus -U admin -P admin -H pikvm sol activate
    ```


----
## Redfish

[Redfish](https://www.dmtf.org/standards/redfish) is a more modern server management protocol designed to replace IPMI.
It is based on HTTP and fixes many security issues. If possible, we recommend using it instead of IPMI, or using the [KVMD API](api.md).

PiKVM supports the Redfish natively and provides a power management handles with it.

To access the Redfish API, use HTTP Basic Auth methods. Also you can use the [redfishtool](https://github.com/DMTF/Redfishtool):

```console
[root@pikvm ~]$ redfishtool -S Never -r pikvm root
[root@pikvm ~]$ redfishtool -S Never -u admin -p admin -r pikvm Systems
[root@pikvm ~]$ redfishtool -S Never -u admin -p admin -r pikvm Systems reset ForceOff
```
