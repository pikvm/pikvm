# Some random and useful recipes

## Disabling authorization
Edit the file `/etc/kvmd/override.yaml`:
```yaml
kvmd:
    auth:
        enabled: false
```
then restart `kvmd`:
```
[root@pikvm ~]# systemctl restart kvmd
```

## Disabling ATX and hiding the menu
If you don't need ATX power control you can disable the relevant Web-UI menu in `/etc/kvmd/override.yaml`:
```yaml
kvmd:
    atx:
        type: disabled
```
then restart `kvmd`:
```
[root@pikvm ~]# systemctl restart kvmd
```

## Disabling webterm
```
[root@pikvm ~]# systemctl disable --now kvmd-webterm
```

## Take a HDMI screenshot via console on PiKVM
```
# curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o screen.jpg
```

## Get installed KVMD version via console
```
# pacman -Q | grep kvmd
```

## Enable Serial-over-USB connection
Specifically to v2. This can be used for terminal access from the managed server to the PiKVM, or for any other purpose that requires a serial connection. In the last case, you only need to perform step 1 and reboot.

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
5. Once PiKVM is rebooted you will have access to a virtual serial port on the server that the USB is connected to. Use mingetty, screen, putty, or something like this to access the kvm from the server. The port is called `/dev/ttyAMA0`.

## Enable Ethernet-over-USB network
See [here](usb_ethernet.md).

## Using Ethernet wiznet w5500 with ZeroW
See [here](https://github.com/pikvm/pikvm/issues/158#issuecomment-768305834).

## Disable mass storage emulation
See [here](msd.md#disable-msd).

## Upload .ISO images manually
See [here](msd.md#upload-images-manually-without-web-ui).

## Mass Storage Drives
See [here](msd.md#multiple-and-writable-drives).

## Create a Microsoft Windows based Flash disk image
See [here](msd.md#create-a-microsoft-windows-based-flash-disk-image).

## Create a drive image on macOS
See [here](msd.md#create-a-drive-image-on-macos).
