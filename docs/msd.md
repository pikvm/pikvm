---
title: Mass Storage Drive
description: Mass storage drive allows PiKVM to emulate a virtual CD/DVD or Flash Drive for the target host
---

This powerful feature that is available on all PiKVM V2+ devices.
It allows PiKVM to emulate a virtual CD/DVD or Flash Drive for the target host
which will be available even in BIOS/UEFI when you need live disk to revive the OS
or even reinstall it.

!!! warning
    This document is relevant for `KVMD >= 4.230`.

    If you are using an older version, please update the PiKVM OS:

    {!_update_os.md!}

| Take a look at the `Drive` menu in the Web UI |
|-----------------------------------------------|
| <img src="drive_menu.png" width="400" /> |

The following actions are available here:

* Uploading an image to the internal storage of PiKVM.
* Binding remote image by URL.
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


-----
## Switching between CD/DVD and Flash

Changing the media type between CD/DVD and Flash is possible only when the virtual drive
is reconnected since it is required by the host OS driver.

On PiKVM V3 and V4, this can be done using the `System -> Connect main USB` switch in the Web UI.

In this case, the **media type is determined at the time of connecting the image,
and not by clicking on the switch**. The switch affects the settings of the future connection.

For non-V3/V4 devices, you need to either reboot your target host or otherwise reinitialize the drive.


-----
## Binding remote images

Typically, PiKVM uses images uploaded into internal storege to emulate a virtual drive.

Instead, you can use a remote image if you have a fast network.
This saves memory card resources and avoid waiting you for the image to upload into PiKVM.
When a host uses such an image, PiKVM transparently sends requests over the network
to a server where the image is located.

PiKVM can take images over HTTP(S), SMB, SFTP, and NBD protocols via the specified URL.

To use this function, go to the `Drive` menu and click `Bind remote image`.
Paste the URL and optional user credentials, press `Bind` button, and then `Connect`.

To cancel the binding, simply click `Disconnect` and select any other image in the dropdown.

The following URLs are supported:

* `http://...`, `https://host:port/path/to/image.iso` - read-only access over HTTP(S). Default ports are `80` and `443`.

* `smb://host:port/sharename/path/to/image.iso` - read-write access to Samba share. Default port is `445`.

* `nfs://host:port/path/to/image.iso` - read-write access to NFSv3/NFSv4 share. Default port is `2049`.

* `sftp://host:port/path/to/image.iso` - read-write access via the SSH. Default port is `22`.

* `nbd://host:port/exportname` - read-write access via the unencrypted NBD. Default port is `10809`.

    If the export name is empty, use url like `nbd://host` or `nbd://host/`. If the export name should be started from the slash, use this: `nbd://host//exportname`.

    Keep in mind that PiKVM requests the export twice before connecting to it, so the NBD server must be configured for multiple connections. We recommend to use `qemu-nbd` server with `-t/--persistent` option, for example: `qemu-nbd -f raw image.iso -p 10809 -x image.iso -t`.

There are few optional parameters for each protocol: 

| Parameter | Type    | HTTP | SMB | NFS | SFTP | NBD |
|-----------|---------|------|-----|-----|------|-----|
| `user`    | string  | Yes  | Yes |     | Yes  |     |
| `passwd`  | string  | Yes  | Yes |     | Yes  |     |
| `verify`  | boolean | Yes  |     |     |      |     |


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
        [root@pikvm ~]# fallocate -l 512M /var/lib/kvmd/msd/flash.img
        [root@pikvm ~]# loop=$(losetup -f)
        [root@pikvm ~]# echo -e 'o\nn\np\n1\n\n\nt\nc\nw\n' | fdisk /var/lib/kvmd/msd/flash.img
        [root@pikvm ~]# losetup -P $loop /var/lib/kvmd/msd/flash.img
        [root@pikvm ~]# mkfs.vfat ${loop}p1
        [root@pikvm ~]# losetup -d $loop
        [root@pikvm ~]# chmod 666 /var/lib/kvmd/msd/flash.img
        ```

    3. Remount internal storage back to safe read-only mode:

        ```console
        [root@pikvm ~]# kvmd-helper-otgmsd-remount ro
        ```
        
!!! note

    * For PiKVM V3+ you'll need to toggle the USB connection using the Web UI: Switch `System -> Connect Main USB` to off, then on.
    * For V2 you'l need to reboot the target host.
    
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

    1. Update OS:

        {!_update_os.md!}

    2. Make some preparations:

        ```console
        [root@pikvm ~]# rw
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
## Samba/CIFS storage

If you already have a local samba server e.g. Unraid or another NAS you can use the isos from there.

To refresh the list of available isos on the share it is currently necessary to reboot.

??? example "Step by step: Connecting Samba/CIFS storage"

    1. Update OS:

        {!_update_os.md!}

    2. Make some preparations:

        ```console
        [root@pikvm ~]# rw
        [root@pikvm ~]# pacman -S cifs-utils
        [root@pikvm ~]# kvmd-helper-otgmsd-remount rw
        [root@pikvm ~]# mkdir -p /var/lib/kvmd/msd/isos
        [root@pikvm ~]# kvmd-helper-otgmsd-remount ro
        ```

    2. Add Samba/CIFS shares to `/etc/fstab`:

        ```fstab
        //192.168.0.1/isos   /var/lib/kvmd/msd/isos   cifs  guest,_netdev,nofail 0 0
        ```

    3. Perform `reboot` to apply all changes.

-----
### exFAT filesystem warning

Using the existing USB ports you can reduce writes to the internal SSD card by storing
images on a USB thumb drive.  This is mounted as would NFS or Samba, above. As recent
drives are starting to come formatted with `exfat` instead of `fat` or `NTFS`, the
linux kernel will default to 'root' ownership of the mountpoint.  This means the
volume will be visible in the 'Media' menu, but will be marked as `[read-only]`, without
any obvious reason.

First, you need to find out UID of the `kvmd` user:

```console
[root@pikvm ~]# id kvmd
uid=966(kvmd) ...
```

The correct `/etc/fstab` entry for a USB drive that presents as `/dev/sda1` with an
exfat filesystem is (use your actual UID of `kvmd`):

        ```fstab
        /dev/sda1   /var/lib/kvmd/msd/usb   exfat  auto,nofail,rw,umask=0133,uid=966  0 0
        ```
This says to mount it automatically, do not fail if it's missing, mount it read/write by
default, and allow all users and groups access to it.

Don't forget to create `/var/lib/kvmd/msd/usb` directory:

```console
[root@pikvm ~]# kvmd-helper-otgmsd-remount
[root@pikvm ~]# mkdir -p /var/lib/kvmd/msd/usb
[root@pikvm ~]# kvmd-helper-otgmsd-remount ro
```


-----
## Multiple drives

By default, PiKVM creates one virtual drive for Mass Storage emulation.
However, if necessary, you can create additional ones and manage them using console utility.
This is useful if there is a need to boot the target host from the first drive,
and then connect the second to exchange files.

!!! note
    The first virtual drive is available for management both in the Web UI (the `Drive` menu)
    and using the `kvmd-otgmsd` console utility ([see below](#manual-drives-management)).
    Extra drives are controlled only from console.


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
                        cdrom: false  # Default value (false for the generic flash drive, true for CD/DVD)
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
        [root@pikvm ~]# fallocate -l 1000M /root/flash.img
        ```

    3. Connect it to the drive `1` (the creation process is described in the previous section):

        ```console
        [root@pikvm ~]# kvmd-otgmsd -i 1 --set-rw=1 --set-cdrom=0 --set-image=/root/flash.img
        ```

        !!! note

            * Index `0` represents the main drive that is controlled via the Web UI and API.

            * If `--set-cdrom=1`, the drive will work as CD-ROM for small images, and as DVD-ROM for big.
              Please note that CD/DVD can't be writable (you should use `--set-rw=0` in this case).

    4. On this step, you will be able to access the flash drive from the target host
        and format the it in the usual way.

    5. View the drive state:

        ```console
        [root@pikvm ~]# kvmd-otgmsd -i 1
        Image file:  /root/flash.img
        CD/DVD flag: no
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

!!! note "Known affected hardware"
    Some Dell (OptiPlex / Pro Micro 7020 and similar) and HP (EliteDesk 800 G4 and similar)
    machines use a UEFI framework that can't handle the combination of Mass Storage and HID
    (keyboard/mouse) on a single USB port. Typical symptoms are a black screen, a boot loop,
    or lost date/BIOS settings after exiting the BIOS or powering on the host while the PiKVM
    USB cable is connected. Disabling Mass Storage as shown below resolves this.

There are two ways to do this, depending on whether you still want to be able to use
Mass Storage on demand.

### Disable at startup, keep available on demand (recommended)

This keeps the Mass Storage device configured but **does not start it** when PiKVM boots,
so a problematic BIOS/UEFI is not confused. You can still enable it dynamically later
(for example, to boot an installer image) using [dynamic USB configuration](usb.md).

??? example "Step by step: Disabling Mass Storage at startup"

    1. Switch the filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit `/etc/kvmd/override.yaml` and add:

        ```yaml
        otg:
            devices:
                msd:
                    start: false
        ```

        !!! warning
            Use the `msd` section as shown above. Do **not** confuse it with the `drives`
            section, which controls the [additional drives](#multiple-drives) and does not
            affect the main Mass Storage device.

    3. Perform reboot:

        ```console
        [root@pikvm ~]# reboot
        ```

    When you need Mass Storage, enable it on the fly:

    ```console
    [root@pikvm ~]# kvmd-otgconf -e mass_storage.usb0
    ```

    And disable it again before exiting the BIOS or rebooting the target host:

    ```console
    [root@pikvm ~]# kvmd-otgconf -d mass_storage.usb0
    ```

### Disable completely

This fully disables the Mass Storage subsystem. The `Drive` menu in the Web UI
will be unavailable, and Mass Storage can't be re-enabled dynamically without
reverting this change.

??? example "Step by step: Permanent disabling Mass Storage"

    1. Switch the filesystem to read-write mode:

        ```console
        [root@pikvm ~]# rw
        ```

    2. Edit `/etc/kvmd/override.yaml` and add:

        ```yaml
        kvmd:
            msd:
                type: disabled
        ```

    3. Perform reboot:

        ```console
        [root@pikvm ~]# reboot
        ```
