# Flashing the Arduino HID
This operation can be done using your RPi. Here the common steps:

* Disconnect the RESET wire from the Arduino board.
* Connect the Arduino and RPi with a suitable USB cable.
* Log in to the Raspberry Pi using SSH (`ssh root@<addr>` with password `root` by default) or using keyboard and monitor. The Raspberry Pi obtains the network address over DHCP.
* Next, upload the firmware.
* Connect the RESET wire, disconnect the USB cable, and reboot the RPi.

Here the commands to SSH and upload the firmware:

```shell
[user@localhost os]$ ssh root@<addr>
[root@pikvm ~]# rw
[root@pikvm ~]# systemctl stop kvmd
[root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
[root@pikvm ~]# cd ~/hid
[root@pikvm hid]# make
[root@pikvm hid]# make install
[root@pikvm hid]# reboot
```

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
