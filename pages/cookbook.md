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
See [here](usb_ethernet.md).

## Mass Storage Drives
Specifically to v2/v3. Unless explicitly [disabled](#disable-mass-storage-emulation) by default, Pi-KVM creates only one drive for Mass Storage emulation. However, you can create additional drives and manage them manually via the terminal. This is useful if you want to boot the server from a ISO CD (specified in the web interface), then connect a virtual flash drive to the server and download some files from to Pi-KVM from it.

:exclamation: The presence of an additional Mass Storage device should not interfere with the boot, but for reasons of compatibility paranoia, this is disabled by default. We recommend setting up the drives in advance, making sure that booting from the ISO CD is still working, and then using the drives as needed.

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
                    cdrom: false  # Default value (false for the generic flash drive)
                    rw: false # Read-only by default
    ```
    If you specify `count: N`, you will create `N` additional drives configured the same way, as described in the `default` section.
3. Reboot.

How to create RW flash drive:
1. Switch the root filesystem to `rw` mode:
    ```
    # rw
    ```
2. Create the empty image file of the desire size (1Gb in this example).
    ```
    # dd if=/dev/zero of=/root/flash.img bs=1M count=1000 status=progress
    ```
3. Connect it to the drive 1:
    ```
    # kvmd-otgmsd -i 1 --set-rw=1 --set-cdrom=0 --set-image=/root/flash.img
    ```
    After that you will have access to the flash drive from the server.  
    :exclamation: Drive 0 represents a drive that is controlled via a web interface and API. Don't use it with kvmd-otgmsd if you don't know exactly what you're doing.
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

### Disable mass storage emulation
To disable mass storage emulation altogether, you can place the following piece of configuration into /etc/kvmd/override.yaml 
``` yaml
    kvmd:
        msd:
            type:  disabled
```   

## Create a Microsoft Windows based Flash disk image
This procedure will create a disk image of a USB stick. This is mostly required for Microsoft Windows (TM) based images since they are larger than the CDROM based limit of 2.2GB.
You can create a bootable USB stick with the normal Microsoft tools, e.g. Media Creation Tool.
Creating a bootable USB stick can also be made from an ISO file with other tools like Rufus.

Without resizing, the full size of the USB stick will be used, so keep the stick as small as possible (e.g. 4GB or 8GB) but still large enough for all Windows files. The Media Creation tool will tell you what the minimum size is.

Before creating the image file, you can use a tool like "EaseUS Partition Master Free" or "GParted" to resize the main FAT32 partition on the USB stick. This will save space on PiKVM.

You can also perform these steps on a separate unix machine and transfer the image over to pikvm with e.g. SCP.
Or, on Windows you could use a program like PassMark ImageUSB (only for full USB size images) or 'dd' for Windows to create the image. Then use WinSCP to transfer the image over to PiKVM.

Once you have the desired USB stick perform the following on the RPi to create the image directly to the PiKVM image storage folder.

1. Insert Windows based USB stick into Pi4, generated with Microsoft USB creation tool. SSH to PiKVM as root.
    ```
    # dmesg
    [ 3025.025401] usb-storage 2-1:1.0: USB Mass Storage device detected
    [ 3025.038911] scsi host0: usb-storage 2-1:1.0
    [ 3026.132248] scsi 0:0:0:0: Direct-Access     Kingston DataTraveler 3.0 PMAP PQ: 0 ANSI: 6
    [ 3026.771425] sd 0:0:0:0: [sda] 15360000 512-byte logical blocks: (7.86 GB/7.32 GiB)
    [ 3026.790276] sd 0:0:0:0: [sda] Write Protect is off
    [ 3026.802530] sd 0:0:0:0: [sda] Mode Sense: 23 00 00 00
    [ 3026.804450] sd 0:0:0:0: [sda] No Caching mode page found
    [ 3026.814082] sd 0:0:0:0: [sda] Assuming drive cache: write through
    [ 3026.908712]  sda: sda1
    [ 3026.922794] sd 0:0:0:0: [sda] Attached SCSI removable disk
    [root@pikvm ~]#
    ```
    USB devices shows as "sda". We will use "sda1" as the Microsoft Windows (TM) partition.

2. mount msd folder as read/write
    ```
    # kvmd-helper-otgmsd-remount rw
    ```
3. Create image of USB data PARTITION to an image file, this will take some time, in this case about 12 minutes (RPi4).
    ```
    # dd if=/dev/sda1 of=/var/lib/kvmd/msd/images/windows10-2004.bin bs=8M status=progress
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736 s, 6.1 MB/s
    531+1 records in
    531+1 records out
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736.213 s, 6.1 MB/s
    ````
4. Correct ownership of new image and make sure the website reports the file as complete (pay attention to the different folder).
    ```
    # chown kvmd:kvmd /var/lib/kvmd/msd/images/windows10-2004.bin
    # touch /var/lib/kvmd/msd/meta/windows10-2004.bin.complete
    ```
5. Remount msd folder as read only
    ```
    # kvmd-helper-otgmsd-remount ro
    ````

6. On PiKVM webpage, under Storage select the new image and connect it in Drive Mode: Flash to the server.

    Boot the server and select boot device like you normally would.
    E.g. in a AMI BIOS the boot device is called "Linux File-CD Gadget 0504".

## Create a drive image on macOS
1. Open Disk Utility.
2. File > New Image > Blank Image.
3. Save As: `pikvm-image.dmg`. Name: `pikvm-image`. Size: 100 MB (or whatever size you want). Format: `MS-DOS (FAT)`. Partitions: `Single partition - GUID Partition Map`. Image Format: `read/write disk image`.
4. Click Save.
5. The drive will automatically be mounted.
6. Copy files (such as BIOS updates) onto the new image (via terminal or drag and drop in Finder).
7. Eject image.
8. Upload image to Pi-KVM interface under "Drive".
9. Select Drive Mode: `Flash` and then `Connect drive to Server`.

You should be able to then mount it locally on the server, or reboot the device to do things like BIOS updates.

## Using Ethernet wiznet w5500 with ZeroW
Read [here](https://github.com/pikvm/pikvm/issues/158#issuecomment-768305834)
