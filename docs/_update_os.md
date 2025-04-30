---
search:
    exclude: true
---


??? note "Updating PiKVM OS"

    To update, run following commands under the `root` user:

    ```console
    [root@pikvm ~]# pikvm-update
    ```

    If you encounter an error like:

    ```console
    [root@pikvm ~]# pikvm-update
    bash: pikvm-update: command not found
    ```

    It's most likely you have an old OS release. You can update the OS as follows:

    ```console
    [root@pikvm ~]# rw
    [root@pikvm ~]# pacman -Syy
    [root@pikvm ~]# pacman -S pikvm-os-updater
    [root@pikvm ~]# pikvm-update
    ```

    Next time you will be able to use the usual method with `pikvm-update`.
