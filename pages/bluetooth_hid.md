# Bluetooth HID
Pi-KVM is able to emulate a Bluetooth keyboard & mouse.
This is not the main case of using Pi-KVM since you still need it to pair with a remote host, but can be used for something like mobile KVM.

:exclamation: Using Bluetooth HID requires additional configuration of the operating system. For v2, this means losing the UART port,
since it will be used by Bluetooth. Also, Bluetooth operation was tested only on RPi4 and v2 platform. Other boards may require different system service settings.

:exclamation: Bluetooth mouse can work only in [relative mode](mouse.md). The reason is that many Bluetooth host drivers do not correctly implement HID descriptors.

### Configuring OS
1. Switch filesystem to RW-mode, perform update and install some packages:
    ```
    # rw
    # pacman -Syu
    # pacman -S bluez bluez-utils raspberrypi-bluetooth
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
7. Perform reboot: `reboot`.

### Using Bluetooth HID
* After a reboot, the Pi-KVM will be ready for detection and peering. You will see the `Pi-KVM HID` device.
* Once the server is connected, Pi-KVM will no longer be discoverable and available to other clients until you unpair the server.
* If something went wrong, use the web menu `System -> Reset keyboard & mouse`. This will cause unpair the device and switch the Pi-KVM to public mode before the first client is connected.
