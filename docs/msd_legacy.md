---
title: Big DVD images on old PiKVM
description: If you need to emulate DVD images on an old PiKVM, here is how you can do it
---

Since KVMD 4.49, PiKVM is able to emulate DVD images.

Before that, users had to use Vento and other utilities to pre-convert large DVD images
such as the official Windows ISO to Flash.

We strongly recommend updating the PiKVM OS to simplify your Mass Storage experience when using DVDs:

{!_update_os.md!}


-----
### Making Windows Boot Flash Image

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
# This may or may not work for everyone, if it doesn't work, skip and move forward#
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

-----
## An alternative to making a Windows boot image that does not require a physical usb flash drive on a single windows machine

* Physical USB is not needed
* Requires Administrator rights on the windows machine

* Testing was done on a Windows 11 machine with a Windows 11 23H2 ISO

* Requires a windows ISO (can be downloaded from the microsoft website), Rufus (To write the ISO to the VHD) and VirtualBox (Uses VBoxManage to convert VHD to IMG)

1. Create a VHD in Windows, This can be done in two ways that i know of.

    Method 1:
    Open up the windows settings, go to storage, press advanced storage settings and press Disks & Volumes
    Press the Create VHD button, Give the disk a name, set a storage location and set the Virtual hard disk size (for 23H2 i used 6300MB). Set the Virtual hard disk format to VHD and set it to Fixed Size.
    Press Create and then you will get a menu to initialize the disk, press cancel

    Method 2:
    Open up the windows partition manager, make sure you don't have any partitions or disks selected by pressing on empty space, Go to Action and select Create VHD.
    Select a location for the VHD file, set the VHD size (for 23H2 i used 6300MB), Set the Virtual hard disk format to VHD and set it to Fixed Size.
    Press OK

2.
    Download the Windows ISO and Rufus (i use the portable version), open rufus select the NO_LABEL disk that should roughly match size selected when creating the VHD (MiB vs MB).
    Select the ISO you downloaded and press start
    Once it is done close rufus (optionally delete rufus)

3. Unmount the VHD by either opening up windows explorer, right clicking on the windows installer drive and pressing eject or opening up the windows partition manager, right clicking on the virtual disk and detaching the VHD

4.
    Download and install Virtualbox
    Open up a command prompt in the location where you stored the VHD
    ```console
    VBoxManage clonehd input.vhd output.img --format raw
    ```
    Or if virtualbox didn't get added to the system environment variables
    ```console
    "C:\Program Files\Oracle\VirtualBox\VBoxManage.exe" clonehd input.vhd output.img --format raw
    ```
    This will convert the VHD to the IMG ready to be uploaded to the pikvm


* using vboxmanage does have a slight quirk where it writes every conversion to <username>\.VirtualBox\VirtualBox.xml so if you make changes to the vhd and try to convert it again it throws and error that the uuid doesn't match the stored value in VirtualBox.xml and you need to either throw away VirtualBox.xml or edit it and delete the line that matches the error
* this method has also been tested using the windows installer for ventoy (needs enabling show all devices in the windows installer)
