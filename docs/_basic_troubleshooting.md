---
search:
    exclude: true
---


* Ensure that you are using the right [OS image](flashing_os.md) for your platform
    by running the following command: `pacman -Q | grep kvmd-platform`.

* If you are not getting a display, run the two following commands:

    * `dmesg | egrep 'tc35|1-1.4|uvc'`
    * `systemctl status kvmd-tc358743`

    If you see a failed message on that output, be sure verify the orientation of the CSI cable or try reseating it.

    Note that this is not a hotplug device, and you must first turn off the power.
