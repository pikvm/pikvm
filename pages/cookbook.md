# This Pi-KVM cookbook has some undocumented recipes for your Pi-KVM
## Take a HDMI screenshot via console on Pi-KVM
```
# curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o screen.jpg
```

## Get installed KVMD version via console
```
# pacman -Q | grep kvmd
```

## Upload .ISO images manually
1. Remount internal storage to rw (read-write):
    ```
    # kvmd-helper-otgmsd-remount rw
    ```
2. Upload the .ISO image(s) to `/var/lib/kvmd/msd/images` via scp or similar.
3. Create an empty file in `/var/lib/kvmd/msd/meta/` with the exact name (case sensitive!) of the uploaded image. This will indicate Pi-KVM that the uploaded image is okay and can be used. For example:
    ```
    /var/lib/kvmd/msd/meta/ubuntu-18.04.4-desktop-amd64.iso.complete
    ```
4. Remount internal storage back to ro (read-only):
    ```
    # kvmd-helper-otgmsd-remount ro
    ```

## Enable serial console on Pi-KVM
This can be used for terminal access from the managed server to the pikvm, or for any other purpose that requires a serial connection. In the last case, you only need to perform step 1 and reboot.

1. Edit `/etc/kvmd/override.yaml` (remove `{}` if this your first configuration entry) and add these lines:
    ``` yaml
    otg:
        devices:
            serial:
                enabled: true
    ```
2. Run the following command:
    ```
    # echo ttyGS0 >> /etc/securetty
    ```
3. Create the directory `/etc/systemd/system/getty@ttyGS0.service.d` and add a file file named `ttyGS0.override` into it. Afterwards edit the file and copy this into it:
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
5. Once Pi-KVM is rebooted you will have access to a virtual serial port on the server that the USB is connected to. Use mingetty, screen, putty, or something like this to access the kvm from the server. The port is called `/dev/ttyAMA0`.

## Enable Ethernet-over-USB connection between the server and Pi-KVM
When combined with configuring a DNS server, FTP, or SMB (for example), this is a powerful way to extend the capabilities of Pi-KVM.

1. Edit `/etc/kvmd/override.yaml` (remove `{}` if this your first configuration entry) and add these lines:
    ``` yaml
    otg:
        devices:
            ethernet:
                enabled: true
                driver: ecm
                host_mac: 48:6f:73:74:50:43
                kvm_mac: 42:61:64:55:53:42
    ```
    The `host_mac` address will be used on the server's network interface. The `kvm_mac` means the address that will be assigned to the local interface on the Pi-KVM. The KVM interface will be called `usb0`.r's network interface. If the `host_mac` or `kvm_mac` is not specified, a random value will be used. The `driver` parameter means the protocol that will be used for the USB network. The default value is `ecm` so it can be passed it this example. Other possible values are `eem`, `ncm` and `rndis`.
2. Perform `reboot`.

:exclamation: When this feature is activated, the Pi-KVM interface and other ports will be available to the host. Use iptables for restrictions.
