??? example "Updating PiKVM OS"

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
    [root@pikvm ~]# curl https://files.pikvm.org/update-os.sh | bash
    ```

    Next time you will be able to use the usual method with `pikvm-update`.
