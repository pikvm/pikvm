# Mass Storage Drive

This powerful feature that is available on all PiKVM V2+ devices.
It allows PiKVM to emulate a virtual CD-ROM or Flash Drive for the target host
which will be available even in BIOS/UEFI when you need live disk to revive the OS
or even reinstall it.

!!! warning "Legacy note"
    This document is relevant for `KVMD >= 3.249`. If you are using an older version, please update the PiKVM OS.

| Take a look at the `Drive` menu in the Web UI |
|-----------------------------------------------|
| <img src="drive_menu.png" width="400" /> |

The following actions are available here:

* Uploading an image to the internal storage of PiKVM.
* Selecting an image to connect to the target host.
* Changing the media type and write availability mode.
* Downloading an image from the PiKVM storage.
* Drive connection management and much more.

!!! warning
    Never turn off the power of the PiKVM while the image is being uploaded
    or while the image is connected to the target host in write mode.
    This may cause file corruption.

    The rest of the time, power off is safe because the PiKVM filesystem
    will be in read-only mode.

!!! info "The max CD-ROM image size is 2.2 GB"
    This is a [Linux kernel limitation](https://github.com/pikvm/pikvm/issues/322) on PiKVM,
    which currently cannot emulate a DVD drive.
    To use a larger boot image, please use a Flash Drive emulation.
    If this is not possible (the image does not support Flash, for example, for Windows),
    you can try [this recipe](#create-a-windows-based-flash-disk-image).

!!! info "Changing the media type between CD-ROM and Flash is possible only when the device is reconnected"
    On PiKVM V3 and V4, this can be done using the `System -> Connect main USB` switch in the Web UI.

    In this case, the **media type is determined at the time of connecting the image, and not by clicking on the switch**.
    The switch affects the settings of the future connection. For non-V3/V4 devices,
    you need to either reboot your target host or otherwise reinitialize the drive.


-----
## Manual images uploading

PiKVM stores images in a special memory card partition mounted in `/var/lib/kvmd/msd`.

Most of the time, the partition is read-only, and is remounted for writing automatically
if the appropriate drive emulation mode is enabled, or to upload a new image.
This protects the data from damage in the event of a sudden loss of power.

??? example "Step by step: Manual image uploading using SCP or rsync"

    1. Remount internal storage to read-write mode manually:

        ```console
        [root@pikvm ~]# kvmd-helper-otgmsd-remount rw
        ```

    2. Upload the image(s) to `/var/lib/kvmd/msd` using `scp` or some other tool.

    3. Remount internal storage back to safe read-only mode:

        ```console
        [root@pikvm ~]# kvmd-helper-otgmsd-remount ro
        ```

!!! tip
    An HTTP API for Mass Storage management is also [available](api.md#mass-storage-drive) for advanced use.


-----
## Writable Flash Drive

When emulating Flash Drive on PiKVM, you can allow the target host to write files to the image.
After stopping the drive, this image can be downloaded and opened on the local host.
This is useful if you need to get some files from the target host.

The file system image for the virtual Flash Drive must be prepared in advance.
This can be done either on the local host or in the PiKVM console.

Here some options:

??? example "Step by step: Creating simple FAT32 image on PiKVM"

    1. Remount internal storage to read-write mode manually:

        ```console
        [root@pikvm ~]# kvmd-helper-otgmsd-remount rw
        ```

    2. Create an empty image file in `/var/lib/kvmd/msd` (this is the internal storage of PiKVM images)
       of desired size (512MB in this example) and format it to FAT32:

        ```console
        [root@pikvm ~]# dd if=/dev/zero of=/var/lib/kvmd/flash.img bs=1M count=512 status=progress
        [root@pikvm ~]# loop=$(losetup -f)
        [root@pikvm ~]# echo -e 'o\nn\np\n1\n\n\nt\nc\nw\n' | fdisk /var/lib/kvmd/flash.img
        [root@pikvm ~]# losetup -P $loop /var/lib/kvmd/flash.img
        [root@pikvm ~]# mkfs.vfat ${loop}p1
        [root@pikvm ~]# losetup -d $loop
        ```

    3. Remount internal storage back to safe read-only mode:

        ```console
        [root@pikvm ~]# kvmd-helper-otgmsd-remount ro
        ```

??? example "Step by step: Creating an image on a local macOS"

    1. Open `Disk Utility`.

    2. Click menu `File -> New Image -> Blank Image`.

    3. Set some options:

        | `Format` and `Partitions` are very important |
        |----------------------------------------------|
        | <img src="macos_flash_dmg.png" width="400"> |

    4. Click `Save`. The drive will automatically be mounted.

    5. Copy files (such as BIOS updates) onto the new image (via terminal or drag and drop in Finder).

    6. Eject image.

    7. Rename the image file from `.dmg` to `.img`.

    8. Upload the image to PiKVM.

The image `flash.img` now should be available in the `Drive` menu in Web UI.
Change drive mode to the `Flash` position and enable `Writable` switch.
Connect the image, do whatever is necessary, with files, and disconnect it.
The modified image containing your files can be downloaded to a local host
by selecting it from the menu and clicking the floppy disk icon.


-----
## NFS storage

It is possible to create a shared image storage for an entire fleet of PiKVMs using [NFS](https://en.wikipedia.org/wiki/Network_File_System).

If you have some shares, you can easily connect them to PiKVM by creating mount points and adding relevant records to `/etc/fstab`.
At the same time, you will be able to upload images via PiKVM Web UI to NFS, and still use local storage.

??? example "Step by step: Connecting NFS storage"

    1. Make some preparations:

        ```console
        [root@pikvm ~]# rw
        [root@pikvm ~]# pacman -Syu
        [root@pikvm ~]# pacman -S nfs-utils
        [root@pikvm ~]# kvmd-helper-otgmsd-remount rw
        [root@pikvm ~]# mkdir -p /var/lib/kvmd/msd/NFS_Primary
        [root@pikvm ~]# mkdir -p /var/lib/kvmd/msd/NFS_Secondary
        [root@pikvm ~]# kvmd-helper-otgmsd-remount ro
        ```

    2. Add NFS shares to `/etc/fstab`:

        ```fstab
        server:/srv/nfs/NFS_Primary    /var/lib/kvmd/msd/NFS_Primary    nfs vers=3,timeo=1,retrans=1,soft,nolock  0 0
        server:/srv/nfs/NFS_Secondary  /var/lib/kvmd/msd/NFS_Secondary  nfs vers=3,timeo=1,retrans=1,soft,nolock  0 0
        ```

    3. Perform `reboot` to apply all changes.

Make sure that the `kvmd` user has the *read* access from these directories. You can also give the *write* access if needed.
For the best performance, it is required to ensure reliable connectivity with NFS server and use minimum `timeo` and `retrans` values.
**Using the `soft` option is mandatory, `nolock` is recommended.**

Note if an image is added to the NFS storage from the outside, PiKVM will not be able to track this event, so it is required to use
`Drive -> Reset` in the Web UI to update the list of images.

Configuring an NFS server is beyond the scope of this guide.


-----
## Multiple drives

By default, PiKVM creates one virtual drive for Mass Storage emulation.
However, if necessary, you can create additional ones and manage them using console utility.
This is useful if there is a need to boot the target host from the first drive,
and then connect the second to exchange files.

!!! note
    The first virtual drive is available for management both in the Web UI (the `Drive` menu)
    and using [the console utility](#second-writable-flash-drive). Extra drives are controlled only from console.


The issue of additional drives concerns compatibility.
There is an assumption that multiple drives on the same USB may confuse some BIOS/UEFI.
So for paranoid reasons, this feature requires manual activation.
It is recommended setting up the drives in advance, making sure that booting from ISO CD or Flash is still working
with your specific target host, and then using the drives as planned.

Also additional drives consumes extra endpoints, read more under the spoiler:

{!_usb_limits.md!}

So, to add a second virtual drive, follow this:

??? example "Step by step: Enabling an additional drive"

    1. Switch the filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit `/etc/kvmd/override.yaml` and add the extra drive config section:

        ```yaml
        otg:
            devices:
                drives:
                    enabled: true  # Set it to true to enable
                    count: 1  # +1 drive, default value
                    default:  # Default configuration for the all extra drives
                        cdrom: false  # Default value (false for the generic flash drive)
                        rw: false # Read-only by default
        ```

        The `count` parameter determines the number of additional drives (remember the limit on endpoints).
        Each of the drives will be created with the same initial parameters described in the `default` section.

    3. Perform reboot:

        ```console
        [root@pikvm ~]# reboot
        ```


-----
## Manual drives management

The `kvmd-otgmsd` console utility is used to manage additional (and the first main one) drives.
The full list of options can be found by running `kvmd-otgmsd --help`.

??? example "Step by step: Creating the flash drive image to get some files from the target host"

    1. Switch the filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Create an empty image file with desired size (1GB in this example):

        ```console
        [root@pikvm ~]# dd if=/dev/zero of=/root/flash.img bs=1M count=1000 status=progress
        ```

    3. Connect it to the drive `1` (the creation process is described in the previous section):

        ```console
        [root@pikvm ~]# kvmd-otgmsd -i 1 --set-rw=1 --set-cdrom=0 --set-image=/root/flash.img
        ```

        !!! note
            Index `0` represents the main drive that is controlled via the Web UI and API.

    4. On this step, you will be able to access the flash drive from the target host
        and format the it in the usual way.

    5. View the drive state:

        ```console
        [root@pikvm ~]# kvmd-otgmsd -i 1
        Image file:  /root/flash.img
        CD-ROM flag: no
        RW flag:     yes
        ```

    6. To disable the flash drive and view the files on it from the PiKVM, run:

        ```console
        [root@pikvm ~]# kvmd-otgmsd -i 1 --unlock --eject
        ```

    7. Don't forget to remount the root filesystem to read-only mode:

        ```console
        [root@pikvm ~]# ro
        ```

    8. You can download the resulting image via SCP or mount it as a loop device on the PiKVM:

        ```console
        [root@pikvm ~]# mount -o loop /root/flash.img /mnt
        [root@pikvm ~]# ls /mnt
        [root@pikvm ~]# umount /mnt
        ```

!!! tip
    The main drive can also be switched to read-write mode, this can be done from the Web UI.

    In this case, the image will have to be prepared outside of PiKVM, and upload it to use,
    then download it back to your local host for files extraction.


-----
## Disabling Mass Storage

In rare cases, it may be necessary to disable Mass Storage emulation if the BIOS/UEFI
does not recognize it correctly and even refuses to work with USB keyboard and mouse.

??? example "Step by step: Permanent disabling Mass Storage"

    1. Switch the filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit `/etc/kvmd/override.yaml` and add the extra drive config section:

        ```yaml
        kvmd:
            msd:
                type:  disabled

        ```

    3. Perform reboot:

        ```console
        [root@pikvm ~]# reboot
        ```

!!! tip
    As an alternative method may be to use the [dynamic USB configuration](usb_dynamic.md),
    which allows you to temporarily disable any of the emulated devices, including Mass Storage Drive.


-----
## Making Windows Boot Flash Image

An alternative version of this can be found below that does not require a physical usb flash

This procedure will create a disk image of a USB stick.
This is mostly required for Windows based images since they are larger than the CDROM based limit of 2.2GB.
You can create a bootable USB stick with the normal Microsoft tools, e.g. Media Creation Tool.
Creating a bootable USB stick can also be made from an ISO file with other tools like [Rufus](https://rufus.ie).

Without resizing, the full size of the USB stick will be used, so keep the stick as small as possible (e.g. 4GB or 8GB)
but still large enough for all Windows files. The Media Creation tool will tell you what the minimum size is.

Before creating the image file, you can use a tool like
[EaseUS Partition Master Free](https://www.easeus.com/partition-manager/epm-free.html) or [GParted](https://gparted.org)
to resize the main FAT32 partition on the USB stick. This will save space on PiKVM.

You can also perform these steps on a separate UNIX machine and transfer the image over to PiKVM.
Or, on Windows you could use a program like PassMark ImageUSB (only for full USB size images)
or `dd` for Windows to create the image.

Once you have the desired USB stick perform the following on the RPi to create the image directly to the PiKVM image storage folder.

1. Insert Windows based USB stick into Pi4, generated with Microsoft USB creation tool. SSH to PiKVM as root.

    ```console
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

    ```console
    # kvmd-helper-otgmsd-remount rw
    ```

3. Create image of USB data PARTITION to an image file, this will take some time, in this case about 12 minutes (RPi4).

    ```console
    # dd if=/dev/sda1 of=/var/lib/kvmd/msd/windows10-2004.bin bs=8M status=progress
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736 s, 6.1 MB/s
    531+1 records in
    531+1 records out
    4458545152 bytes (4.5 GB, 4.2 GiB) copied, 736.213 s, 6.1 MB/s
    ```

4. Correct ownership of new image and make sure the website reports the file as complete.

    ```console
    # chown kvmd:kvmd /var/lib/kvmd/msd/windows10-2004.bin
    ```

5. Remount msd folder as read only

    ```console
    # kvmd-helper-otgmsd-remount ro
    ```

6. On PiKVM webpage, under Storage select the new image and connect it in Drive Mode: Flash to the server.

Boot the server and select boot device like you normally would.
E.g. in a AMI BIOS the boot device is called "Linux File-CD Gadget 0504".


-----
## An alternative to making a Windows boot image that does not require a physical usb flash drive

* Physical USB is not needed but external system is mandatory.
* Create Ventoy image (on Ubuntu x86 machine) (Unaware of a windows version).
* There is an assumption that you know basic linux to understand that not all dev devices are named exactly like the below

```console
# dd if=/dev/zero of=ventoy.img bs=1M count=4700 status=progress
```

* This makes a ventoy.img file, I would name this what it is EG: `ventoy_win10.img`
* At the same time, download Media Creation Tool and select iso

* On the Ubuntu machine
* At the time of this, it was 1.0.51, change to latest version

```console
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

```console
sudo cp windows.iso /media/XXX/ventoy
sudo umount /dev/loopXX 
# This is going to be different for everyone, please choose the same one you mounted earlier
sudo losetup -d /dev/loopXX 
# This may or may not work for everyone, if it doesnt work, skip and move forward#
```

ssh into the Ubuntu system (Or whatever OS you are using)

* On PiKVM

```console
# cd /var/lib/kvmd/msd
# mount -o remount,rw .
```

* On Ubuntu

```console
# scp ventoy.img root@pikvm:/var/lib/kvmd/msd
```

* Mount `ventoy.img` as normal flash and select the PiKVM boot device, it should popup with the VenToy logo with the window.iso as a selection 
