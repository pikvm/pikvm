---
title: EDID
description: How to manipulate the EDID information on your PiKVM
---

!!! info

    This applies to [PiKVM V3](v3.md), [V4](v4.md) and DIY based on CSI bridge.
    It is impossible to change the EDID for the HDMI-USB dongle.


The EDID provides an information about the video modes supported by the video capture device.
In the case of PiKVM, this is an HDMI CSI bridge.
Usually, you don't need to change this, since the default configuration is quite flexible,
but sometimes, for example for strange UEFIs/BIOSes, this may be necessary
([a story](https://github.com/pikvm/pikvm/issues/78)).


-----
## Basics

The EDID is stored on the PiKVM in the file `/etc/kvmd/tc358743-edid.hex` in HEX format.
When booting PiKVM OS, it is used by `kvmd-tc358743.service` and loaded into the video capture chip.

If you replace the EDID in this file, the EDID can be applied manually without rebooting
using the command `kvmd-edidconf --apply`.

If you just want to change the monitor's identification, we don't recommend that you change the entire EDID.
Just use `kvmd-edidconf` and its built-in EDID changing options.

!!! note

    Windows caches drivers and registry settings so changing the monitor name is not enough,
    you will also need to change the product ID and/or the serial number along with the monitor name:

    ```console
    [root@pikvm ~]# kvmd-edidconf --set-monitor-name=TOSHIBA --set-mfc-id=TTP --set-product-id=34953 --set-serial=2290649089 --apply
    ```

{!_edidconf_options.md!}

Typical examples of working with EDID and the full cycle of using custom EDID will be shown below.


-----
## Adopt real display indentifiers on V4 Plus

PiKVM V4 Plus has a simple way read and adopt display identifiers like model and serial number
from the physical monitor connected to `OUT2` port (it's also used for [HDMI passthrough](pass.md)).
This way, the target host will recognize PiKVM as your display.

To adopt display identifiers, connect the display to `OUT2` port and run these commands:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-display-ids --apply
[root@pikvm ~]# ro
```

Now the display can be unplugged. PiKVM will remember the new settings.


-----
## Restore default EDID

If you need to restore the default EDID you can easily do this with `kvmd-edidconf`, for example:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-preset=v4plus --apply
[root@pikvm ~]# ro
```
Available options: `v0`, `v1`, `v2`, `v3`, `v4mini` and `v4plus`.

Also defaults edid can be found locally on your PiKVM: `/usr/share/kvmd/configs.default/kvmd/edid`,
or in the [kvmd repo](https://github.com/pikvm/kvmd/blob/master/configs/kvmd/edid).


-----
## Force 1080p by default on PiKVM V0-V3

PiKVM V3 (or DIY V0-V2) has a hardware limit of 50Hz for 1080p mode, and this is a less common frequency than 60Hz.
Therefore, on V3, the default mode is 720p. Some OS (like Proxmox) may not work well with 720p,
so you can force 1080p resolution by default:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-preset=v3.1080p-by-default --apply  # Or, for example, v1.1080p-by-default
[root@pikvm ~]# ro
```


-----
## Disable 1920x1200 on PiKVM V4

PiKVM V4 supports the advanced capture mode with 1920x1200. If it bothers you
(for example, if you use a physical monitor 1920x1080 with [video passthrough](pass.md)),
you can easily disable it and use only 1920x1080:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --import-preset=v4plus.no-1920x1200 --apply  # Or v4mini.no-1920x1200
[root@pikvm ~]# ro
```


-----
## Applying a custom EDID

PiKVM is able to emulate a physical display with a specific EDID.
You can find EDID examples in the [community database](https://github.com/linuxhw/EDID)
and then use it on PiKVM.

At the same time, you should pay attention to the hardware capabilities of PiKVM
and the EDID capabilities that you use. For example, if EDID reports 8K support,
then this obviously won't work: your host will try to send an 8K signal,
while PiKVM can process no more than 1080p.

* PiKVM V1-V3: The maximum resolution is 1920x1080 at 50Hz.
* PiKVM V4: The maximum is 1920x1200 at 60Hz.

In the case of the [PiKVM V4](v4.md), almost any EDID for 1080p monitors will work.
All EDIDs that are suitable for [PiKVM V3](v3.md) will work too.

#### Example EDIDs for V4

??? example "Acer B246WL, 1920x1200, with audio"
    Taken [here](https://github.com/linuxhw/EDID/blob/master/Digital/Acer/ACR0565/CCF78B30FE61), as described above.
    ```
    00FFFFFFFFFFFF00047265058A3F6101
    101E0104A53420783FC125A8554EA026
    0D5054BFEF80714F8140818081C08100
    8B009500B300283C80A070B023403020
    360006442100001A000000FD00304C57
    5716010A202020202020000000FC0042
    323436574C0A202020202020000000FF
    0054384E4545303033383532320A01F8
    02031CF14F9002030405060701111213
    1415161F2309070783010000011D8018
    711C1620582C250006442100009E011D
    007251D01E206E28550006442100001E
    8C0AD08A20E02D10103E960006442100
    0018C344806E70B028401720A8040644
    2100001E000000000000000000000000
    00000000000000000000000000000096
    ```

??? example "ASUS PA248QV, 1920x1200, with audio"
    Taken [here](https://github.com/linuxhw/EDID/blob/master/Digital/ASUS/AUS2487/2B473481CAE6), as described above.
    ```
    00FFFFFFFFFFFF0006B3872401010101
    021F010380342078EA6DB5A7564EA025
    0D5054BF6F00714F8180814081C0A940
    9500B300D1C0283C80A070B023403020
    360006442100001A000000FD00314B1E
    5F19000A202020202020000000FC0050
    4132343851560A2020202020000000FF
    004D314C4D51533035323135370A014D
    02032AF14B900504030201111213141F
    230907078301000065030C001000681A
    00000101314BE6E2006A023A80187138
    2D40582C450006442100001ECD5F80B0
    72B0374088D0360006442100001C011D
    007251D01E206E28550006442100001E
    8C0AD08A20E02D10103E960006442100
    001800000000000000000000000000DC
    ```

??? example "DELL D2721H to avoid black screen on some HDMI splitters, 1920x1080, no audio"
    Taken [here](https://github.com/linuxhw/EDID/blob/master/Digital/Dell/DEL2013/EEE824E681BF), as described above.
    ```
    00FFFFFFFFFFFF0010AC132045393639
    201E0103803C22782ACD25A3574B9F27
    0D5054A54B00714F8180A9C0D1C00101
    010101010101023A801871382D40582C
    450056502100001E000000FF00335335
    475132330A2020202020000000FC0044
    454C4C204432373231480A20000000FD
    00384C1E5311000A2020202020200181
    02031AB14F9005040302071601061112
    1513141F65030C001000023A80187138
    2D40582C450056502100001E011D8018
    711C1620582C250056502100009E011D
    007251D01E206E28550056502100001E
    8C0AD08A20E02D10103E960056502100
    00180000000000000000000000000000
    0000000000000000000000000000004F
    ```

#### Example EDIDs for V1-V3

??? example "1280x1024 as preferred. Useful for Gigabyte GA-H77-DS3H"
    ```
    00FFFFFFFFFFFF005262888800888888
    1C150103800000780AEE91A3544C9926
    0F505425400001000100010001000100
    010001010101D51B0050500019400820
    B80080001000001EEC2C80A070381A40
    3020350040442100001E000000FC0050
    492D4B564D20566964656F0A000000FD
    00323D0F2E0F0000000000000000014D
    02030400DE0D20A03058122030203400
    F0B400000018E01500A0400016303020
    3400000000000018B41400A050D01120
    3020350080D810000018AB22A0A05084
    1A3030203600B00E1100001800000000
    00000000000000000000000000000000
    00000000000000000000000000000000
    00000000000000000000000000000045
    ```

??? example "1920x1080 as preferred. Useful for motherboards such as [ASRock H670 PG Riptide](https://github.com/pikvm/pikvm/issues/715), Gigabyte GA-H77-DS3H, MSI series such as B550M, B660M, Z690-A and X570. Also the Intel NUC."
    ```
    00FFFFFFFFFFFF005262888800888888
    1C150103800000780AEE91A3544C9926
    0F505425400001000100010001000100
    010001010101D32C80A070381A403020
    350040442100001E7E1D00A050001940
    3020370080001000001E000000FC0050
    492D4B564D20566964656F0A000000FD
    00323D0F2E0F000000000000000001C4
    02030400DE0D20A03058122030203400
    F0B400000018E01500A0400016303020
    3400000000000018B41400A050D01120
    3020350080D810000018AB22A0A05084
    1A3030203600B00E1100001800000000
    00000000000000000000000000000000
    00000000000000000000000000000000
    00000000000000000000000000000045
    ```

??? example "1280x1024 as preferred, disabled 1080p at all. This may be necessary in extremely rare cases if the BIOS is completely buggy. In the future, we will provide a way to dynamically switch EDID"
    ```
    00FFFFFFFFFFFF005262888800888888
    1C150103800000780AEE91A3544C9926
    0F50542FCF0001000100010001000100
    0100010101018C2300A050001E403020
    370080001000001E000000FC0050492D
    4B564D20566964656F0A000000FD0032
    3D0F2E0F000000000000000000000010
    0000000000000000000000000000016B
    02030400DE0D20A03058122030203400
    F0B400000018E01500A0400016303020
    3400000000000018B41400A050D01120
    3020350080D810000018AB22A0A05084
    1A3030203600B00E1100001800000000
    00000000000000000000000000000000
    00000000000000000000000000000000
    00000000000000000000000000000045
    ```

#### Applying a choosen custom EDID

To apply the selected EDID, follow these steps:

1. Switch filesystem to RW-mode:

    ```console
    [root@pikvm ~]# rw
    ```

2. Open the file `/etc/kvmd/tc358743-edid.hex` with any text editor, for example, with Nano:

    ```console
    [root@pikvm ~]# nano /etc/kvmd/tc358743-edid.hex
    ```

3. Replace the HEX data with the new, save and close the editor.

4. Apply the EDID:

    ```console
    [root@pikvm ~]# kvmd-edidconf --apply
    ```

5. Sometimes it may be necessary to reboot the target host. Check the OS on the host, UEFI/BIOS.
    If everything works, then your goal has been achieved and proceed to the last step.
    If something went wrong, you can always undo these changes and [restore the default EDID](#restore-default-edid).

6. Don't forget to switch filesystem to the RO-mode:

    ```console
    [root@pikvm ~]# ro
    ```


-----
## Editing EDID

To edit the EDID, it is best to use third-party utilities, such as the recommended advanced
[AW EDID Editor](https://www.analogway.com/emea/products/software-tools/aw-edid-editor) for Windows (it's working great in wine)
or [wxEDID](https://sourceforge.net/projects/wxedid). Both editors work with the binary EDID format, but you can easily import and export it
to PiKVM using the `kvmd-edidconf` utility.

So, to tune EDID on PiKVM, use the following steps:

1. Switch filesystem to RW-mode:

    ```console
    [root@pikvm ~]# rw
    ```

2. Export the system EDID to the binary file `myedid.bin`:

    ```console
    # kvmd-edidconf --export-bin=/root/myedid.bin
    ```

3. Copy this file to your PC using SCP, Putty or something like that.
    Open this binary file in the EDID editor and change the necessary parameters.
    Save your changes and copy the binary file back to PiKVM.

4. Convert the binary file to the HEX and test it:

    ```console
    [root@pikvm ~]# kvmd-edidconf --import=/root/myedid.bin --apply
    ```

5. Sometimes it may be necessary to reboot the target host. Check the OS on the host, UEFI/BIOS.
    If everything works, then your goal has been achieved and proceed to the last step.
    If something went wrong, you can always undo these changes and [restore the default EDID](#restore-default-edid).

6. Don't forget to switch filesystem to the RO-mode:

    ```console
    [root@pikvm ~]# ro
    ```
