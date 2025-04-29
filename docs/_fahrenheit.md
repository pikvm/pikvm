??? note "Choose Fahrenheit over Celsius to display on the OLED"

    Create a directory for a configuration file:

    ```console
    [root@pikvm ~]# mkdir -p /etc/systemd/system/kvmd-oled.service.d
    ```

    Create file `/etc/systemd/system/kvmd-oled.service.d/override.conf`:

    ```ini
    [Service]
    ExecStart=
    ExecStart=/usr/bin/kvmd-oled --clear-on-exit --fahrenheit
    ```
