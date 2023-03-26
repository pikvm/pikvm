??? warning "USB limitations"
    **TL;DR: By default, you can add only one additional device to choose from, such as USB Ethernet, or USB Serial, or an extra Mass Storage Drive.**

    There is a hardware limit on the number of devices that can be emulated at the same time.
    Each USB device uses so-called endpoints to communicate with the host.
    Depending on the type, the device consumes a different number of endpoints,
    while their total number is limited by the capabilities of the chip, **for Raspberry Pi it is 8**.

    It is quite difficult to calculate the number of endpoints used, but in the case of PiKVM,
    you can focus on the following numbers:

    | Device | Endpoints |
    |--------|-----------|
    | Keyboard, mouse | 1 for each |
    | Mass Storage Drive | 2 for each |
    | USB Ethernet, USB Serial | 3 for each |

    V2 and V3 emulates one mouse by default, V4 emulates two mouses. Thus, V2 and V3 use 4 endpoints, and V4 uses 5 by default.

    Creating an axtra Mass Storage Drive consumes additional endpoints, as well as USB Serial and USB Ethernet,
    so only a limited number of devices can be selected for the final configuration, for example, one USB Ethernet.

    If you need something more non-standard, you can [disable the regular Mass Storage Drive](msd.md#disable-msd)
    and the additional mouse (on V4) to free up some extra endpoints.

    The `kvmd-otg` service is responsible for setting up USB emulation. If the endpoint limit is exceeded,
    the service will not be able to start and no emulated USB device will work.

    In the log it looks something like this:

    ```
    # journalctl -u kvmd-otg
    ...
    kvmd-otg[382]: kvmd.apps.otg                     INFO --- ===== Preparing complete =====
    kvmd-otg[382]: kvmd.apps.otg                     INFO --- Enabling the gadget ...
    kvmd-otg[382]: kvmd.apps.otg                     INFO --- WRITE --- /sys/kernel/config/usb_gadget/kvmd/UDC
    kvmd-otg[382]: OSError: [Errno 524] Unknown error 524
    kvmd-otg[382]: During handling of the above exception, another exception occurred:
    kvmd-otg[382]: Traceback (most recent call last):
    kvmd-otg[382]:   File "/usr/bin/kvmd-otg", line 9, in <module>
    kvmd-otg[382]:     main()
    kvmd-otg[382]:   File "/usr/lib/python3.10/site-packages/kvmd/apps/otg/__init__.py", line 348, in main
    kvmd-otg[382]:     options.cmd(config)
    kvmd-otg[382]:   File "/usr/lib/python3.10/site-packages/kvmd/apps/otg/__init__.py", line 278, in _cmd_start
    kvmd-otg[382]:     _write(join(gadget_path, "UDC"), udc)
    kvmd-otg[382]:   File "/usr/lib/python3.10/site-packages/kvmd/apps/otg/__init__.py", line 83, in _write
    kvmd-otg[382]:     with open(path, "w") as file:
    kvmd-otg[382]: OSError: [Errno 524] Unknown error 524
    systemd[1]: kvmd-otg.service: Main process exited, code=exited, status=1/FAILURE
    systemd[1]: kvmd-otg.service: Failed with result 'exit-code'.
    systemd[1]: Failed to start PiKVM - OTG setup.
    ```

    In this case, you need to disable some of the previously enabled devices and restart PiKVM.
