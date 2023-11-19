# First steps

!!! note "Before this guide"

    * PiKVM V4 device: please follow this [first](v4.md)
    * PiKVM V3 HAT/Pre-Assembled: follow [this](v3.md)
    * DIY V0-V2: follow [this](https://github.com/pikvm/pikvm)


-----
## First power on

1. Optional: [setting up Wi-Fi](on_boot_config.md) before booting.<br>
    *There is nothing more reliable than wired Ethernet, so it's better to use a cable.*

2. **Power up the device.**

3. **Do not turn off the device until it's fully booted for the first time.**<br>
    *After turning on the power, PiKVM OS will generate unique SSH keys and certificates
    and perform all necessary operations on the memory card. It takes a few minutes.*


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

!!! tip "Obtaining root access"
    * If you have logged in via SSH, then most likely you are already `root`.
    * To get `root` in the Web Terminal, use command `su -` and enter the root password.

PiKVM OS often receives software updates. After installation, it makes sense to update the OS.
It's best to do this now, when you have physical access to the device, because if something goes wrong
(for example, the power goes out during the update), you will need to [reflash the memory card](flashing_os.md).

??? example "Updating PiKVM OS"

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


-----
## FAQ and Troubleshooting

If you have any questions or run into problems, take a look at the [FAQ](faq.md).
Seriously, it's really useful!

For any other help and support, you can contact us via the [Discord chat](https://discord.gg/bpmXfz5).
