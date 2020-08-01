# Flashing the Arduino HID
This operation can be done using your RPi. **Before starting, disconnect the RESET wire from the Arduino board, otherwise the firmware will not be uploaded.** Connect the Arduino and RPi with a suitable USB cable. Log in to the RPi and upload the firmware. Then connect the RESET wire, disconnect the USB cable, and reboot the RPi.
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

On this you may encounter the following error:
```
/root/.platformio/packages/tool-avrdude/avrdude: error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory
```
Create a symlink for this library:
```bash
[root@pikvm ~]# ln -s /usr/lib/libtinfo.so.6 /usr/lib/libtinfo.so.5
```
And run `make install` again.

If you have any problems or questions, contact us using Discord: https://discord.gg/bpmXfz5
