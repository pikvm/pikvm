---
title: Configure USB 3.0 support
description: How to configure USB 3.0 support on PiKVM V4 Plus
---

# USB 3.0 support

PiKVM V4 Plus has an internal USB port. It supports USB 3.0, but only works with USB 2.0 devices by default to minimize the power consumption. You need to flash the USB controller to enable USB 3.0. To do so, follow these steps:

1. Open a terminal window and log into the PiKVM via SSH:

    ```console
    $ ssh user@host
    ```

2. Flash the USB controller using the built-in `flashrom` utility. Choose `usb3` for USB 3.0 support:

    ```console
    [root@pikvm ~]# flashrom-vl805 usb3
    ```

    If you need to disable USB 3.0 support at any time later, run the same command, but use `default` instead:

    ```console
    [root@pikvm ~]# flashrom-vl805 default
    ```

3. Perform the soft reboot:

    ```console
    [root@pikvm ~]# reboot
    ```

4. After the soft reboot, perform the **reboot by power**: unplug and plug again the power cable.