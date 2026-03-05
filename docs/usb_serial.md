---
title: Serial-over-USB connection
description: How to configure a serial-over-USB connection on PiKVM V2+
---

Specifically to V2+. This can be used for terminal access from the target host to the PiKVM, or for any other purpose that requires a serial connection. In the last case, you only need to perform step 1 and reboot.

{!_usb_limits.md!}

1. Update your PiKVM:

    {!_update_os.md!}

2. Edit `/etc/kvmd/override.yaml` and add these lines:

    ```yaml
    otg:
        devices:
            serial:
                enabled: true
    ```

3. Run the following command:

    ```console
    [root@pikvm ~]# echo ttyGS0 >> /etc/securetty
    ```

4. Run these comands:

    ```console
    [root@pikvm ~]# systemctl enable kvmd-otg-getty@ttyGS0.service
    [root@pikvm ~]# reboot
    ```

5. Once PiKVM is rebooted you will have access to a virtual serial port on the server that the USB is connected to. Use mingetty, screen, putty, or something like this to access the kvm from the server. The port is called `/dev/ttyAMA0`.
