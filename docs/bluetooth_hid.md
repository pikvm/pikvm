---
title: Bluetooth HID
description: How to configure PiKVM to emulate a Bluetooth keyboard & mouse
---

PiKVM is able to emulate a Bluetooth keyboard & mouse.
This is not the main case of using PiKVM since you still need it to pair with a remote host, but can be used for something like mobile KVM.

!!! warning
    Using Bluetooth HID requires additional configuration of the operating system. For v2+, this means losing the UART port, since it will be used by Bluetooth. Also, Bluetooth operation was tested only on RPi4 and v2+ platform. Other boards may require different system service settings. Making the required changes for BT to work will also disable normal KB/MOUSE functionality therefor this will need to be disabled before normal operation can occur.

!!! note
    Bluetooth mouse can work only in [relative mode](mouse.md). The reason is that many Bluetooth host drivers do not correctly implement HID descriptors. Horizontal scrolling is not supported for the same reason.


## Configuring the OS

1. Switch filesystem to RW-mode and install some packages:

    ```
    # rw
    # pacman -Syy	
    # pacman -Su bluez bluez-utils raspberrypi-bluetooth
    ```

2. Edit `/boot/config.txt` and comment these lines:

    ```
    #enable_uart=1
    #dtoverlay=disable-bt
    ```

3. Create an empty directory `/var/lib/bluetooth` and add mountpoint to `/etc/fstab`:

    ```
    # mkdir /var/lib/bluetooth
    # echo 'tmpfs /var/lib/bluetooth tmpfs nodev,nosuid,mode=0755 0 0' >> /etc/fstab
    ```

4. Override and enable the services:

    ```
    # mkdir /etc/systemd/system/bluetooth.service.d
    # cat << EOF > /etc/systemd/system/bluetooth.service.d/override.conf
    [Service]
    ExecStart=
    ExecStart=/usr/lib/bluetooth/bluetoothd --noplugin=*
    EOF
    # systemctl enable bluetooth
    # systemctl enable raspberrypi-btuart
    ```

5. Override `kvmd` service:

    ```
    # mkdir /etc/systemd/system/kvmd.service.d
    # cat << EOF > /etc/systemd/system/kvmd.service.d/override.conf
    [Service]
    AmbientCapabilities=CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_ADMIN CAP_SETUID CAP_SETGID CAP_CHOWN
    CapabilityBoundingSet=CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_ADMIN CAP_SETUID CAP_SETGID CAP_CHOWN
    EOF
    ```

6. Add following lines to `/etc/kvmd/override.yaml`:

    ```yaml
    kvmd:
        hid:
            type: bt
    ```

7. Perform `reboot`.

8. To reverse, uncomment lines from Step 2 and remove lines in Step 6, and `reboot`.


## Using Bluetooth HID

* After a reboot, the PiKVM will be ready for detection and pairing with no auth. You will see the `PiKVM HID` device.

* Once the server is connected, PiKVM will no longer be discoverable and pairable to other clients until you unpair the server.

* If something went wrong, use the web menu `System -> Reset keyboard & mouse`. This will cause unpair the device and switch the PiKVM to public mode before the first client is connected.
