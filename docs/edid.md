# EDID

!!! warning
    This will only apply to the CSI/v3 models, USB is not compatable.
    Modifing the EDID may or may not work in some instances where a "no signal" might be a result of outside factors.


EDID is information about the video modes supported by the video capture device.
In the case of PiKVM, this is an HDMI CSI bridge. Usually, you don't need to change this, since the default configuration is quite flexible,
but sometimes, for example for strange UEFIs/BIOSes, this may be necessary (the [story](https://github.com/pikvm/pikvm/issues/78)).

The EDID is stored on the PiKVM in the file `/etc/kvmd/tc358743-edid.hex`. If you write new data there, it will be applied after rebooting.

You can also apply the new EDID without rebooting to make sure it works:

* Switch filesystem to RW-mode: `rw`.
* Create the new EDID file `/root/edid.hex` (examples of file contents are shown below).
* Apply EDID using the command `kvmd-edidconf --edid=/root/edid.hex --apply`.
* DO NOT REBOOT the PiKVM. Just your PC. Check the UEFI/BIOS.
* If everything works, you can write the same data to `/etc/kvmd/tc358743-edid.hex`.
* Switch filesystem to RO-mode: `ro`.

The examples below are tested on these devices, but they are also suitable for others. To edit or create EDID you can use [AW EDID Editor](https://www.analogway.com/emea/products/software-tools/aw-edid-editor).


## Editing EDID

To edit EDID, it is best to use third-party utilities, such as the recommended advanced
[AW EDID Editor](https://www.analogway.com/emea/products/software-tools/aw-edid-editor) for Windows (it's working great in wine)
or [wxEDID](https://sourceforge.net/projects/wxedid). Both editors work with the binary EDID format, but you can easily import and export it
to PiKVM using the `kvmd-edidconf` utility.

So, to tune EDID on PiKVM, use the following steps:

1. Switch filesystem to RW-mode: `rw`.

2. Export the system edid to the binary file `myedid.bin`:
   ```
   # kvmd-edidconf --export-bin=/root/myedid.bin
   ```

3. Copy this file to your PC with the editor. Use SCP, Putty or something like that. Open this binary file in the editor and change the necessary parameters. Edit, save and copy it back to PiKVM.

4. Convert the binary file to the HEX and test it:
   ```
   # kvmd-edidconf --import=/root/myedid.bin --edid=/root/myedid.hex --apply
   ```

5. If everything works fine, install the new EDID file into the system:
   ```
   # cp /root/myedid.hex /etc/kvmd/tc358743-edid.hex
   ```

6. Alternative to step (4) and (5): if you are confident in your abilities, you can immediately install the new `myedit.bin` into the system and apply it instantly, without the need to use the temporary `myedid.hex`:
   ```
   # kvmd-edidconf --import=/root/myedid.bin --apply
   ```

7. Switch filesystem to RO-mode: `ro`.

The `kvmd-edidconfig` utility has the ability to change some simple parameters without using an external editor. For example you can change the vendor, model name and enable [HDMI audio](audio.md) on the PiKVM virtual display:

```
# kvmd-edidconf --set-mfc-id=LNX --set-monitor-name=PiKVM --set-audio=1
# reboot
```
!!! note
    Windows cache's drivers and registry settings so changing the monitor name is not enough, you will also need to change the product ID and/or the serial number along with the monitor name:
    `# kvmd-edidconf --set-monitor-name=TOSHIBA --set-mfc-id=TTP --set-product-id=34953 --set-serial=2290649089 --apply`


## Custom EDIDs

Copy the contents into a file, ex: myedid.hex then follow the same steps as above starting at step 5.

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

??? example "1920x1080 as preferred. Useful for Gigabyte GA-H77-DS3H, Intel NUC or [ASRock H670 PG Riptide](https://github.com/pikvm/pikvm/issues/715)"
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


## Default EDID

If for some reason you need to go back to the default EDID (changing attached device etc), you can find it locally on the Pi at `/usr/share/kvmd/configs.default/kvmd/tc358743-edid.hex`:

```
# cp /usr/share/kvmd/configs.default/kvmd/tc358743-edid.hex /etc/kvmd/tc358743-edid.hex
```

... or in the [kvmd repo](https://github.com/pikvm/kvmd/blob/master/configs/kvmd/tc358743-edid.hex).
