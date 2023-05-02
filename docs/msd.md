# Mass Storage Drive

## Basics

This is a feature available on PiKVM v2+ that allows you to emulate a CD-ROM or Flash Drive.

There are some subtleties that you should know:

!!! info "The size of the CD-ROM image is limited to 2.2 GB"
    This is a [limitation](https://github.com/pikvm/pikvm/issues/322) of the Linux kernel, which currently cannot emulate a DVD.
    To use a larger boot image, use Flash emulation. If this is not possible (the image does not support Flash, for example, for Windows),
    use [this](#create-a-windows-based-flash-disk-image) recipe.

!!! info "Changing the media type between CD-ROM and Flash is possible only when the device is reconnected"
    For PiKVM v3 HAT, this can be done using the switch `System -> Connect main USB`.
    In this case, the **media type is determined at the time of connecting the image, and not by clicking on the switch**.
    The switch affects the settings of the future connection. For non-v3 devices,
    you need to either reboot your server or otherwise reinitialize the connection.

-----
## Upload images manually (without Web UI)

!!! info "This instruction is relevant for KVM >= 3.203. If you are using a previous version, then update OS."

1. Remount internal storage to rw (read-write):

    ```
    # kvmd-helper-otgmsd-remount rw
    ```

2. Upload the .ISO image(s) to `/var/lib/kvmd/msd` via scp or similar.

3. Create an empty file in `/var/lib/kvmd/msd` with the exact name (case sensitive!) of the uploaded image + prefix `.__` and suffix `.complete`. This will indicate PiKVM that the uploaded image is okay and can be used. For example:

    ```
    /var/lib/kvmd/msd/.__ubuntu-18.04.4-desktop-amd64.iso.complete

    ```

4. Remount internal storage back to ro (read-only):

    ```
    # kvmd-helper-otgmsd-remount ro
    ```


-----
## NFS storage

!!! info "This instruction is relevant for KVM >= 3.206. If you are using a previous version, then update OS."

It is possible to create a shared image storage for an entire fleet of PiKVMs using [NFS](https://en.wikipedia.org/wiki/Network_File_System).

If you have some shares, you can easily connect them to PiKVM by creating mount points and adding relevant records to `/etc/fstab`.
At the same time, you will be able to upload images via PiKVM Web UI to NFS, and still use local storage.

```
# rw
# pacman -Syu
# pacman -S nfs-utils
# kvmd-helper-otgmsd-remount rw
# mkdir -p /var/lib/kvmd/msd/NFS_Primary
# mkdir -p /var/lib/kvmd/msd/NFS_Secondary
# kvmd-helper-otgmsd-remount ro
```

Edit fstab:

```fstab
server:/srv/nfs/NFS_Primary    /var/lib/kvmd/msd/NFS_Primary    nfs vers=3,timeo=1,retrans=1,soft,nolock  0 0
server:/srv/nfs/NFS_Secondary  /var/lib/kvmd/msd/NFS_Secondary  nfs vers=3,timeo=1,retrans=1,soft,nolock  0 0
```

And perform `reboot`.

Make sure that the `kvmd` user has read access rights from these directories. You can also give write access if needed.
For the best performance, it is required to ensure reliable connectivity with NFS server and use minimum `timeo` and `retrans` values.
**Using the `soft` option is mandatory, `nolock` is recommended.**

Note if an image is added to the NFS storage from the outside, PiKVM will not be able to track this event, so it is required to use
`Drive -> Reset` in the Web UI to update the list of images.

Configuring an NFS server is beyond the scope of this guide.


-----
## Multiple and writable drives

Unless explicitly [disabled](#disable-msd) by default, PiKVM creates only one drive for Mass Storage emulation.
However, you can create additional drives and manage them manually via the terminal.
This is useful if you want to boot the server from a ISO CD (specified in the web interface), then connect a virtual flash drive
to the server and download some files from to PiKVM from it.

!!! info
    The presence of an additional Mass Storage Drive should not interfere with the boot, but for reasons of compatibility paranoia, this is disabled by default. We recommend setting up the drives in advance, making sure that booting from the ISO CD is still working, and then using the drives as needed.

{!_usb_limits.md!}


### How to enable extra drives

1. Switch the root filesystem to `rw` mode.

2. Edit `/etc/kvmd/override.yaml` and add these lines:

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

3. Perform `reboot`.


### How to create a second RW flash drive

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

    After that you will have access to the flash drive from the target server. **Drive 0 represents a drive that is controlled via a web interface and API. Don't use it with kvmd-otgmsd if you don't know exactly what you're doing.**

4. View the driver state:

    ```
    # kvmd-otgmsd -i 1
    Image file:  /root/flash.img
    CD-ROM flag: no
    RW flag:     yes
    ```

5. To disable the flash drive and view the files on it from the KVM, run:

    ```
    # kvmd-otgmsd -i 1 --unlock --eject
    ```

    **This command will interrupt the current IO operation on ALL DRIVES** including the one that is managed via the web interface. The same result is achieved by clicking the disable media button in the web interface. Right now, the Linux kernel does not allow to distinguish between internal threads that manage different drives. It is recommended to eject the media when you know that this will not cause problems for the other media.

6. Don't forget to remount the root filesystem to read-only mode:

    ```
    # ro
    ```

7. You can download the resulting image via SCP or mount it as a loop device on the PiKVM.


-----
## Disable MSD

To disable mass storage emulation altogether, you can place the following piece of configuration into `/etc/kvmd/override.yaml`:

``` yaml
kvmd:
    msd:
        type:  disabled
``` 


-----
## Create a Windows based Flash disk image

An alternative version of this can be found below that does not require a physical usb flash

This procedure will create a disk image of a USB stick. This is mostly required for Windows based images since they are larger than the CDROM based limit of 2.2GB.
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

    USB devices shows as `sda`. We will use `sda1` as the Windows partition.

2. mount msd folder as read/write

    ```
    # kvmd-helper-otgmsd-remount rw
    ```

3. Create image of USB data PARTITION to an image file, this will take some time, in this case about 12 minutes (RPi4).

    ```
    # dd if=/dev/sda1 of=/var/lib/kvmd/msd/windows10-2004.bin bs=8M status=progress
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736 s, 6.1 MB/s
    531+1 records in
    531+1 records out
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736.213 s, 6.1 MB/s
    ```

4. Correct ownership of new image and make sure the website reports the file as complete (pay attention to the different folder).

    ```
    # chown kvmd:kvmd /var/lib/kvmd/msd/windows10-2004.bin
    # touch /var/lib/kvmd/msd/.__windows10-2004.bin.complete
    ```

5. Remount msd folder as read only

    ```
    # kvmd-helper-otgmsd-remount ro
    ```

6. On PiKVM webpage, under Storage select the new image and connect it in Drive Mode: Flash to the server.

Boot the server and select boot device like you normally would.
E.g. in a AMI BIOS the boot device is called "Linux File-CD Gadget 0504".


-----
## Create a drive image on macOS

1. Open Disk Utility.
2. `File > New Image > Blank Image`.
3. Save As: `pikvm-image.dmg`. Name: `pikvm-image`. Size: 100 MB (or whatever size you want). Format: `MS-DOS (FAT)`. Partitions: `Single partition - GUID Partition Map`. Image Format: `read/write disk image`.
4. Click Save.
5. The drive will automatically be mounted.
6. Copy files (such as BIOS updates) onto the new image (via terminal or drag and drop in Finder).
7. Eject image.
8. Rename file to .img
9. Upload image to PiKVM interface under "Drive".
10. Select Drive Mode: `Flash` and then `Connect drive to Server`.

You should be able to then mount it locally on the server, or reboot the device to do things like BIOS updates.


-----
## An alternative to making a Windows boot image that does not require a physical usb flash drive

* Physical USB is not needed but external system is mandatory.
* Create Ventoy image (on Ubuntu x86 machine) (Unaware of a windows version).
* There is an assumption that you know basic linux to understand that not all dev devices are named exactly like the below

```
# dd if=/dev/zero of=ventoy.img bs=1M count=4700 status=progress
```

* This makes a ventoy.img file, I would name this what it is EG: `ventoy_win10.img`
* At the same time, download Media Creation Tool and select iso

* On the Ubuntu machine
* At the time of this, it was 1.0.51, change to latest version

```
# wget https://github.com/ventoy/Ventoy/releases/download/v1.0.51/ventoy-1.0.51-linux.tar.gz
# tar zxvf ventoy-1.0.51-linux.tar.gz
# sudo losetup -f ventoy.img
# sudo losetup -l | grep ventoy (To locate which loop device was used)
# sudo sh ~/ventoy-1.0.51/Ventoy2Disk.sh -i /dev/loopXX (This will make a loopXXp1 and a loopXXp2 and will format both partitions
# cd /media/XXX (Usually your login)
# mkdir ventoy
# sudo mount /dev/loopXXp1 /media/XXX/ventoy
```

* Either cp/scp over the .iso you downloaded from the Media tool or use a NFS mount

```
sudo cp windows.iso /media/XXX/ventoy
sudo umount /dev/loopXX 
# This is going to be different for everyone, please choose the same one you mounted earlier
sudo losetup -d /dev/loopXX 
# This may or may not work for everyone, if it doesnt work, skip and move forward#
```

ssh into the Ubuntu system (Or whatever OS you are using)

* On PiKVM

```
# cd /var/lib/kvmd/msd
# mount -o remount,rw .
```

* On Ubuntu

```
# scp ventoy.img root@pikvm:/var/lib/kvmd/msd
```

* On PiKVM

```
# touch /var/lib/kvmd/msd/.__ventoy.img.complete
```

* Mount `ventoy.img` as normal flash and select the PiKVM boot device, it should popup with the VenToy logo with the window.iso as a selection 
