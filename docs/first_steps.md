# First steps


-----
## First power on

1. Optional: [setting up Wi-Fi or static IP](on_boot_config.md) before booting.<br>
    *Remember that there is nothing more reliable than wired Ethernet.*

2. **Power up the device.**

3. **Do not turn off the device until it's fully booted for the first time.**<br>
    *After turning on the power, PiKVM OS will generate unique SSH keys and certificates
    and perform all necessary operations on the memory card. It takes a few minutes.*


-----
## Getting access to PiKVM

By default, PiKVM receives a dynamic IP address via DHCP. PiKVM V3+ devices show it on the built-in OLED display.

??? example "PiKVM without OLED: finding device in the network"

    To determine the IP address of your PiKVM, use one of the following methods:

    * **Common way:** Open the web interface of your router and find the list of issued IP addresses there.
    * **Linux-only:** Use command `arp-scan --localnet`.
    * **Linux, MacOS, Windows:** Download and run [Angry IP Scanner](https://angryip.org).
    * **Windows PowerShell:** Use command `arp -a`.
    
    In order to find PiKVM using the ARP commands, you need to look for the following MACs: `B8:27:EB`, `DC:A6:32` or `E4:5F:01`.

For future examples, let's assume that PiKVM has received the address `192.168.0.100`,
which you have successfully detected using the instructions above. The device has also been assigned a hostname `pikvm`.

??? example "Access to PiKVM Web Interface"

    **We recommend using the latest Google Chrome or Chromium**, as they support the largest number of PiKVM features.
    Safari and Firefox are in second place. Internet Explorer and the pre-Chromium versions of Microsoft Edge are not supported.

    For the first time, it is better to use a browser without extensions or incognito mode,
    as some extensions may disrupt the work of PiKVM.

    **Type the URL in the browser's address bar and press Enter: `https://192.168.0.100/` or `https://pikvm/`.**

    **The default user is `admin`, the password is also `admin`, and no 2FA code.**

    After logging in, you will get access to the menu with the main functions.
    Using the Web Terminal, you can change system settings and passwords.

    *The latest versions of Google Chrome on Mac OS do not allow access to the page with a self-signed certificate,
    which is used in PiKVM by default. You can proceed by typing `thisisunsafe` and Chrome will then load the page.*

??? example "Access to PiKVM via SSH"

    SSH is the most common remote access method in the Linux world. PiKVM is accessible via SSH. This method is used to manage the device:

    * **Linux, MacOS:** Open any terminal application and run: `ssh root@192.168.0.100` or `ssh root@pikvm`.
    * **Windows:** Use [PuTTY](https://www.putty.org/) for this.

    **The default `root` password is `root`.**

??? example "Access to PiKVM via serial"

    Serial is sometimes needed to recover your PiKVM or review what it's doing due to boot failures or due to general network issues

    * **Step 1.** Remove the PiKVM from the Target system

    * **Step 2.** You can reuse the OTG cable for this step, place the USB-C end into the IOIOI port (CON port on the v3), V2 you'll need to get the right TTY to USB cable, we recommend the [RPi Debug Probe](https://www.pishop.us/product/raspberry-pi-debug-probe/) and follow existing RPi TTY serial setups.

    * **Step 3.** Place the USB-A end into the port you want serial to be accessed, typically done on the host

    * **Step 4.** For windows you may need to install this [driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers), other OS's may not need one

    * **Step 5.** Install Putty (Windows) or use GNU screen (may need to install this on your Host if using another OS)

    * **Step 6.** Select the COM port in Putty (you can verify this looking in Device Manager), then select 115200 or use `screen /dev/ttyUSB0 115200` for other OS's

    * **Step 7.** You should now be able to see and interact with the Serial Port

!!! tip "Obtaining root access"

    * If you have logged in via SSH, then most likely you are already `root`.
    * To get `root` in the Web Terminal, use command `su -` and enter the root password.

PiKVM OS (and the underlying Arch Linux ARM upstream) often receives software updates.
After installation, it makes sense to update the OS.
It's best to do this now, when you have physical access to the device, because if something goes wrong
(for example, the power goes out during the update or some upstream change),
you will need to [reflash the memory card](flashing_os.md).

{!_update_os.md!}

**And now, after all...**

{!_passwd.md!}


-----
## Configuring PiKVM

Most of the PiKVM settings are done through configuration files. All configuration changes must be made from under the `root` user (i.e. the administrator).

The PiKVM memory card is mounted in read-only mode. It protects the filesystem from damage in case of sudden power outage. To edit any files and make changes, it is necessary to remount the file system to the read-write mode.

!!! tip "Enabling write mode"

    * To enable write-mode, run command `rw` (under `root`).
    * To disable it, run command `ro`.
    * If you receive the message "Device is busy", perform `reboot`.

In this handbook, you will often find instructions for editing configuration files. The simplest and most beginner-friendly text editor is `nano`, but you can also use `vim`.

??? example "Editing files in the Web Terminal"

    ```console
    [kvmd-webterm@pikvm ~]$ su -
    [root@pikvm ~]# rw
    [root@pikvm ~]# nano /etc/kvmd/override.yaml
    [root@pikvm ~]# ro
    [root@pikvm ~]# exit
    [kvmd-webterm@pikvm ~]$
    ```

-----
## Structure of configuration files

Most of the PiKVM configuration files are located in the `/etc/kvmd` directory.

The `/etc/kvmd/main.yaml` file defines the platform config and **you should never edit it**. To redefine system parameters use the file `/etc/kvmd/override.yaml`. All other files that are also not recommended for editing have read-only permissions.

In the `/etc/kvmd/meta.yaml` file you can specify some information regarding the host that this PiKVM manages.

!!! tip
    A complete list of all parameters can be viewed using the `kvmd -m` command.

Files with the suffix `*.yaml` uses the [YAML syntax](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)
and describes a parameter tree with key-value pairs of different types.
To define the parameters within one section, an indent of 4 spaces is used.
Comments starts with the `#` symbol.

!!! warning "Only 4 spaces should be used for indentation"
    Be careful when editing YAML and follow this rule.
    Invalid indentation or tabs instead of spaces will cause an error when starting the services.

??? example "Sections under the same keys should be merged"
    * **Wrong:**

        ```yaml
        kvmd:
            gpio:
                drivers: ...
        kvmd:
            gpio:
                scheme: ...
        ```

    * **Correct:**

        ```yaml
        kvmd:
            gpio:
                drivers: ...
                scheme: ...
        ```


-----
## What's next?

* Set up Internet access using [port forwarding](port_forwarding.md) or [Tailscale VPN](tailscale.md).
* Explore PiKVM features using the table of contents on the left.
* Join our [Discord](https://discord.gg/bpmXfz5) to contact the community and developers.
* Check out the [GitHub](https://github.com/pikvm) - PiKVM is a fully Open Source project!
* For Mac OS client: [pin your PiKVM device as an app](https://github.com/pikvm/pikvm/issues/965) for quick access.


-----
## FAQ and Troubleshooting

If you have any questions or run into problems, take a look at the [FAQ](faq.md).
Seriously, it's really useful!

For any other help and support, you can contact us via the [Discord chat](https://discord.gg/bpmXfz5).
