To update, run following commands under the `root` user:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# pacman -Syu
[root@pikvm ~]# reboot
```

If you encounter any error during the upgrade, it is most likely due to the upgrade of the Arch Linux ARM repository upstream.
In this case, just use our script, which fixes this:

```console
[root@pikvm ~]# curl https://files.pikvm.org/update-os.sh | bash
```

Next time you will be able to use the usual method with `pacman -Syu`.

Pacman saves all installed packages in a compressed format so that you can roll back to the old version if something goes wrong.
After you've updated and made sure everything works, it makes sense to clear the package cache so that it doesn't take up space
on the SD card (under the `root`): `rw; rm -rf /var/cache/pacman/pkg; ro`.
