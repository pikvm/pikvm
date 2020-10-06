# Some random and useful recipes
## Take a HDMI screenshot via console on Pi-KVM
```
# curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o screen.jpg
```

## Get installed KVMD version via console
```
# pacman -Q | grep kvmd
```

## Upload .ISO images manually
Specifically to v2.

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

## Enable Serial-over-USB connection
Specifically to v2. This can be used for terminal access from the managed server to the Pi-KVM, or for any other purpose that requires a serial connection. In the last case, you only need to perform step 1 and reboot.

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

## Enable Ethernet-over-USB network
Specifically to v2. When combined with configuring a DNS server, FTP, or SMB (for example), this is a powerful way to extend the capabilities of Pi-KVM.

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

## Adding extra Mass Storage Drives
Specifically to v2. By default, Pi-KVM creates only one drive for Mass Storage emulation. However, you can create additional drives and manage them manually via the terminal. This is useful if you want to boot the server from a ISO CD (specified in the web interface), then connect a virtual flash drive to the server and download some files from to Pi-KVM from it.

:exclamation: The presence of an additional Mass Storage device should not interfere with the download, but for reasons of compatibility paranoia, this is disabled by default. We recommend setting up the drives in advance, making sure that booting from the ISO CD is still working, and then using the drives as needed.

How to enable extra drives:
1. Switch the root filesystem to `rw` mode.
2. Edit `/etc/kvmd/override.yaml` (remove `{}` if this your first configuration entry) and add these lines:
    ``` yaml
    otg:
        devices:
            drives:
                enabled: true  # Set it to true to enable
                count: 1  # +1 drive, default value
                default:  # Default configuration for the all extra drives
                    cdrom: false  # Defaut value (false for the generic flash drive)
                    rw: false # Read-only by default
    ```
    If you specify `count: N`, you will create `N` additional drives configured the same way, as described in the `default` section.
3. Reboot.

How to create RW flash drive:
1. Switch the root filesystem to `rw` mode:
    ```
    # rw
    ```
2. Create the empty image file of the desire size (1Gb in this example.
    ```
    # dd if=/dev/zero of=/root/flash.img bs=1024
    ```
3. Connect it to the drive 1:
    ```
    # kvmd-otgmsd -i 1 --set-rw=1 --set-cdrom=0 --set-image=/root/flash.img
    ```
    After that you will have access to the flash drive from the server.  
    :exlcamation: Drive 0 represents a drive that is controlled via a web interface and API. Don't use it with kvmd-otgmsd if you don't know exactly what you're doing.
4. View the driver state:
    ```
    # kvmd-otgmsd -i 1
    Image file:  /root/flash.img
    CD-ROM flag: no
    RW flag:     yes
5. To disable the flash drive and view the files on it from the KVM, run:
    ```
    # kvmd-otgmsd -i 1 --unlock --eject
    ```
    :exclamation: This command will interrupt the current IO operation on **ALL DRIVES** including the one that is managed via the web interface. The same result is achieved by clicking the disable media button in the web interface. Right now, the Linux kernel does not allow to distinguish between internal threads that manage different drives. It is recommended to eject the media when you know that this will not cause problems for the other media.
6. Don't forget to remount the root filesystem to read-only mode:
    ```
    # ro
    ```
7. You can download the resulting image via SCP or mount it as a loop device on the Pi-KVM.
