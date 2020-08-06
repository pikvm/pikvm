# Flashing the Arduino HID
This operation can be done using your RPi. Here the common steps:

1. Disconnect the RESET wire from the Arduino board.
2. Connect the Arduino and RPi with a suitable USB cable.
3. Log in to the Raspberry Pi using SSH (`ssh root@<addr>` with password `root` by default) or using keyboard and monitor. The Raspberry Pi obtains the network address over DHCP.
4. Upload the firmware (USB keyboard & mouse is used by default, on this step [you can choose PS/2 keyboard](arduino_hid.md#ps2_keyboard)):
    ```shell
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl stop kvmd
    [root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
    [root@pikvm ~]# cd ~/hid
    [root@pikvm hid]# make
    [root@pikvm hid]# make install
    [root@pikvm hid]# reboot
    ```
5. Connect the RESET wire, disconnect the USB cable, and reboot the RPi.

On `make install` you may encounter the following error:
```
/root/.platformio/packages/tool-avrdude/avrdude: error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory
```
Create a symlink for this library:
```bash
[root@pikvm ~]# ln -s /usr/lib/libtinfo.so.6 /usr/lib/libtinfo.so.5
```
And run `make install` again.

If you have any problems or questions, contact us using Discord: https://discord.gg/bpmXfz5
