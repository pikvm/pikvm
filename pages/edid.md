# EDID

EDID is information about the video modes supported by the video capture device.
In the case of PiKVM, this is an HDMI CSI bridge. Usually, you don't need to change this, since the default configuration is quite flexible,
but sometimes, for example for strange UEFIs/BIOSes, this may be necessary (the [story](https://github.com/pikvm/pikvm/issues/78)).

The EDID is stored on the PiKVM in the file `/etc/kvmd/tc358743-edid.hex`. If you write new data there, it will be applied on the PiKVM reboot.

You can also apply the new EDID without rebooting to make sure it works:
* Switch filesystem to RW-mode: `rw`.
* Create file with EDID `/root/edid.hex` (examples of file contents are shown below).
* Apply EDID using the command `v4l2-ctl --device=/dev/kvmd-video --set-edid=file=/root/edid.hex --fix-edid-checksums`.
* DO NOT REBOOT the PiKVM. Just your PC. Check the UEFI/BIOS.
* If everything works, you can write the same data to `/etc/kvmd/tc358743-edid.hex`.
* Switch filesystem to RO-mode: `ro`.

The examples below are tested on these devices, but they are also suitable for others. To edit or create EDID you can use [AW EDID Editor](https://www.analogway.com/emea/products/software-tools/aw-edid-editor).

### 1280x1024 as preferred resolution, Gigabyte GA-H77-DS3H
`00 FF FF FF FF FF FF 00 52 62 88 88 00 88 88 88 1C 15 01 03 80 00 00 78 0A EE 91 A3 54 4C 99 26 0F 50 54 25 40 00 01 00 01 00 01 00 01 00 01 00 01 00 01 01 01 01 D5 1B 00 50 50 00 19 40 08 20 B8 00 80 00 10 00 00 1E EC 2C 80 A0 70 38 1A 40 30 20 35 00 40 44 21 00 00 1E 00 00 00 FC 00 50 49 2D 4B 56 4D 20 56 69 64 65 6F 0A 00 00 00 FD 00 32 3D 0F 2E 0F 00 00 00 00 00 00 00 00 01 4D 02 03 04 00 DE 0D 20 A0 30 58 12 20 30 20 34 00 F0 B4 00 00 00 18 E0 15 00 A0 40 00 16 30 30 20 34 00 00 00 00 00 00 18 B4 14 00 A0 50 D0 11 20 30 20 35 00 80 D8 10 00 00 18 AB 22 A0 A0 50 84 1A 30 30 20 36 00 B0 0E 11 00 00 18 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 45`

### 1920x1080 as preferred resolution, Gigabyte GA-H77-DS3H, Intel NUC
`00 FF FF FF FF FF FF 00 52 62 88 88 00 88 88 88 1C 15 01 03 80 00 00 78 0A EE 91 A3 54 4C 99 26 0F 50 54 25 40 00 01 00 01 00 01 00 01 00 01 00 01 00 01 01 01 01 D3 2C 80 A0 70 38 1A 40 30 20 35 00 40 44 21 00 00 1E 7E 1D 00 A0 50 00 19 40 30 20 37 00 80 00 10 00 00 1E 00 00 00 FC 00 50 49 2D 4B 56 4D 20 56 69 64 65 6F 0A 00 00 00 FD 00 32 3D 0F 2E 0F 00 00 00 00 00 00 00 00 01 C4 02 03 04 00 DE 0D 20 A0 30 58 12 20 30 20 34 00 F0 B4 00 00 00 18 E0 15 00 A0 40 00 16 30 30 20 34 00 00 00 00 00 00 18 B4 14 00 A0 50 D0 11 20 30 20 35 00 80 D8 10 00 00 18 AB 22 A0 A0 50 84 1A 30 30 20 36 00 B0 0E 11 00 00 18 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 45`

### 1280x1024 as preferred, disabled 1080p at all
This may be necessary in extremely rare cases if the BIOS is completely buggy. In the future, we will provide a way to dynamically switch EDID.
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

# Default EDID

If for some reason you need to go back to the default EDID (changing attached device etc), you can find it locally on the Pi at `/usr/share/kvmd/configs.default/kvmd/tc358743-edid.hex` (`cp /usr/share/kvmd/configs.default/kvmd/tc358743-edid.hex /etc/kvmd/tc358743-edid.hex`) or in the [kvmd repo](https://github.com/pikvm/kvmd/blob/master/configs/kvmd/tc358743-edid.hex).
