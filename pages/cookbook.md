# This Pi-KVM cookbook has some undocumented recipes for your Pi-KVM
## Take a HDMI screenshot via console
``` shell
curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o screen.jpg
```

## Get installed KVMD version via console
``` shell
pacman -Q | grep kvmd
```

## Upload .ISO images manually
1. Remount internal storage to rw (read-write)
``` shell
kvmd-helper-otgmsd-remount rw
```
2. Upload the .ISO image(s) to `/var/lib/kvmd/msd/images` via scp or similar
3. Create an empty file in `/var/lib/kvmd/msd/meta/` with the exact name (case sensitive!) of the uploaded image. This will indicate Pi-KVM that the uploaded image is okay and can be used. For example:
``` shell
var/lib/kvmd/msd/meta/ubuntu-18.04.4-desktop-amd64.iso.complete
```
4. Remount internal storage back to ro (read-only)
``` shell
kvmd-helper-otgmsd-remount ro
```

## Enable serial console on Pi-KVM
1. Edit `/etc/kvmd/override.yaml` (Remove `{}` if this your first configuration entry) and add these lines:
``` yaml
otg:
    acm:
        enabled: true
```
2. Run the following command
``` shell
echo ttyGS0 >> /etc/securetty
```
3. Create the directory `/etc/systemd/system/getty@ttyGS0.service.d` and add a file file named `ttyGS0.override` into it. Afterwards edit the file and copy this into it:
```
[Service]
TTYReset=no
TTYVHangup=no
TTYVTDisallocate=no
```
4. Run these comands
``` shell
systemctl enable getty@ttyGS0.service
reboot
```
5. Once Pi-KVM is rebooted you will have access to a virtual serial port on the server that the USB is connected to. Use mingetty, screen, putty, or something like this to access the kvm from the server. The port is called `/dev/ttyAMA0`.
