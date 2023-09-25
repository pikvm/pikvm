# First steps

!!! note
    Before this guide:

    * V4 device: please follow this [first](v4.md)
    * V3 HAT/Pre-Assembled: follow [this](v3.md)
    * V0-V2 DIY: follow [this](https://github.com/pikvm/pikvm)


-----
## First power on

??? example "Optional setting up Wi-Fi"
    !!! warning "Please read the following caveats" 
        1. There is nothing more reliable than wired Ethernet, so it's better to use the **cable**. But who are we to stop you... :)
        2. Adding FIRSTBOOT=1 or FIRSTBOOT=1 will erase the msd partition, if used afterwords as a means of switching wifi networks, do not include this option. Instead, use different supplicant files for each wifi SSID, mv files to the supplicant dir as needed and reboot.
        3. `pikvm.txt` will be removed once its been used. You will need to recreate it again if you did not provide the correct info

    If you want to connect PiKVM to a Wi-Fi network, you need to tell the device ESSID and password before first boot.
    To do this, mount the first partition of the memory card (FAT32) and edit or make the `pikvm.txt` file there.
    Do not remove line `FIRSTBOOT=1` or `FIRST_BOOT-1` for first time booting, just add your wifi settings like this:

    ```
    FIRSTBOOT=1
    WIFI_ESSID='mynet'
    WIFI_PASSWD='p@s$$w0rd'
    ```
    
    There is a possibility that, in countries that support CH13, the device will not connect.
    You will need to configure your router to disable channels 12-14 or disable Auto scan mode so it will connect.
        
    Save, unmount and follow the next step.
    
**Power up the device.**

!!! warning "Do not turn off the device until it's fully booted for the first time"
    After turning on the power, PiKVM OS will generate unique SSH keys and certificates and will perform all necessary operations on the memory card.


-----
## Getting access to PiKVM

By default, PiKVM receives a dynamic IP address via DHCP. V3+ devices show IP on the built-in display. If you don't have a display, use the tips below:

??? example "Finding PiKVM in the network"
    To determine the IP address of your PiKVM, use one of the following methods:

    * **Common way:** Open the web interface of your router and find the list of issued IP addresses there. It depends on the router model.
    * **Linux-only:** Use command `arp-scan --localnet`.
    * **Linux, MacOS, Windows:** Download and run [Angry IP Scanner](https://angryip.org).
    * **Windows PowerShell:** Use command `arp -a`.
    
    In order to find your RaspberryPi using the arp commands, you need to look for the following MAC Address's: B827EB, DCA632 or E45F01

For future examples, let's assume that your PiKVM has received the address **192.168.0.100**, which you have successfully detected using the instructions above. Then your device was assigned a hostname: **pikvm**.

??? example "Access to PiKVM Web Interface"
    In *most* networks you should be able to reach PiKVM via any browser with the URL `https://192.168.0.100/` OR `https://pikvm/`. Google Chrome (Chromium), Firefox and Safari work best with 0 extensions enabled, if one works but the other does not, this might be a browser/extension issue. Its advised you use private window or incognito mode. Internet Explorer and the pre-Chromium version of Microsoft Edge are not supported.

    **The default user is `admin`, the password is also `admin`, and no 2FA code.** After logging in, you will get access to the menu with the main functions. Using the Web Terminal, you can change system settings and passwords.

    *The latest versions of Chrome on Mac OS do not allow access to the page with a self-signed certificate, which is used in PiKVM by default. You can proceed by typing `thisisunsafe` and Chrome will then load the page.*

??? example "Access to PiKVM via SSH"
    SSH is the most common remote access method in the Linux world. PiKVM is accessible via SSH. This method is used to manage the device:

    * **Linux, MacOS:** Open any terminal application and run: `ssh root@192.168.0.100` or `ssh root@pikvm`.
    * **Windows:** Use [PuTTY](https://www.putty.org/) for this.

    **The default `root` password is `root`.**

??? example "OPTIONAL: Update PiKVM software"
    This part is not nessessary for a working OOB experience and should only be performed if you are physically at the PiKVM to recover it, you however, may benefit from performing the below actions. These are the instructions:

    ```
    rw
    pacman -Syu
    reboot
    ```

{!_passwd.md!}


-----
## Configuring PiKVM

Most of the PiKVM settings are done through configuration files. All configuration changes must be made from under the `root` user (= the administrator).

!!! tip "Obtaining root access"
    * If you have logged in via SSH, then most likely you are already `root`.
    * To get `root` in the Web Terminal, use command `su -` and enter the root password.

The PiKVM memory card is mounted in read-only mode. It protects the filesystem from damage in case of sudden power outage. To edit any files and make changes, it is necessary to remount the file system to the read-write mode.

!!! tip "Enabling write mode"
    * To enable write-mode, run command `rw` (under `root`).
    * To disable it, run command `ro`.
    * If you receive the message "Device is busy", perform `reboot`.

In this handbook, you will often find instructions for editing configuration files. The simplest and most beginner-friendly text editor is `nano`, but you can also use `vim`.

??? example "Editing files in the Web Terminal"
    ```
    $ su -
    # rw
    # nano /etc/kvmd/override.yaml
    # ro
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


-----
## FAQ and Troubleshooting

If you have any questions or run into problems, take a look at the [FAQ](faq.md).
Seriously, it's really useful!

For any other help and support, you can contact us via the [Discord chat](https://discord.gg/bpmXfz5).
