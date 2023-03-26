# Serial-over-USB connection

Specifically to V2+. This can be used for terminal access from the managed server to the PiKVM, or for any other purpose that requires a serial connection. In the last case, you only need to perform step 1 and reboot.

{!_usb_limits.md!}

1. Edit `/etc/kvmd/override.yaml` and add these lines:

    ```yaml
    otg:
        devices:
            serial:
                enabled: true
    ```

2. Run the following command:

    ```
    # echo ttyGS0 >> /etc/securetty
    ```

3. Create the directory `/etc/systemd/system/getty@ttyGS0.service.d` and add a file file named `override.conf` into it. Afterwards edit the file and copy this into it:

    ```ini
    [Service]
    TTYReset=no
    TTYVHangup=no
    TTYVTDisallocate=no
    ```

4. Run these comands:

    ```
    # systemctl enable getty@ttyGS0.service
    # reboot
    ```

5. Once PiKVM is rebooted you will have access to a virtual serial port on the server that the USB is connected to. Use mingetty, screen, putty, or something like this to access the kvm from the server. The port is called `/dev/ttyAMA0`.
