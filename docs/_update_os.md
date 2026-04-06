---
search:
    exclude: true
---


??? note "Updating PiKVM OS"

    !!! tip

        We recommend updating PiKVM OS only if you have physical access to the device, or in the most extreme cases.
        The update process is very reliable, but there is always a small chance that something may go wrong
        so reflashing will be required. PiKVM cannot be bricked, but you need physical access to the memory card
		for this operation.

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
