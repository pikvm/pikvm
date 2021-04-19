# FAQ & Troubleshooting
As a first step we recommend carefully reading our documentation on [GitHub](https://github.com/pikvm/pikvm). Most steps to successfully set up your Pi-KVM are already described there. If you run into any issues you can check this page which will list common errors. If that still doesn't help you you're welcome to raise an [issue ticket](https://github.com/pikvm/pikvm/issues) or [join our Discord](https://discord.gg/bpmXfz5) for further help.

-----

## Common questions
<details>
  <summary><b>Can I connect multiple servers to a single Pi-KVM?</b></summary>

* Yes, but it will require additional work to set up. See [this page](multiport.md).
</details>

<details>
  <summary><b>Can I use Pi-KVM with non-Raspberry Pi boards (Orange, Nano, etc)?</b></summary>

* Yes, but you will have to prepare the operating system yourself. As for the Pi-KVM software, you will need to replace some config files (such as UDEV rules). If you are a developer or an experienced system administrator, you will not have any problems with this. In addition, we are open to patches. If you need help with this, please contact us via [Discord](https://discord.gg/bpmXfz5).
</details>

-----

## First steps
<details>
  <summary><b>Where is the Pi-KVM configuration located?</b></summary>

* Almost all KVMD (the main daemon controlling Pi-KVM) configuration files located in `/etc/kvmd`. You can also find nginx configs and SSL certificates there. KVMD configs use [YAML](config.md) syntax. The specific platform parameters can be found in the file `/etc/kvmd/main.yaml` and **you should never edit it**. Use `/etc/kvmd/override.yaml` to redefine the system parameters.
  
  Another files that are also not recommended for editing have read-only permissions. If you edit any of these files, you will need to manually make changes to them when you upgrade your system. You can view the current configuration and all available KVMD parameters using the command `kvmd -m`.
</details>

<details>
  <summary><b>I can't edit any file on Pi-KVM. Why is the system in read-only mode?</b></summary>

* The Pi-KVM file system is always mounted in read-only mode. This measure prevents it from being damaged by a sudden power outage. To change the configuration you must first switch the filesystem to write mode using the command `rw` from root. After the changes, be sure to run the command `ro` to switch it back to read-only.
</details>

<details>
  <summary><b>How do I update Pi-KVM with the latest software?</b></summary>

* Pi-KVM OS is based on Arch Linux ARM and is fully updated from the repository by a regular package manager. Connect to your Pi-KVM via ssh and run:
  ```
  rw
  pacman -Syu
  reboot
  ```
  
  :exclamation: Pacman saves all installed packages in a compressed format so that you can roll back to the old version if something goes wrong. After you've updated and made sure everything works, it makes sense to clear the package cache so that it doesn't take up space on the SD card: `rw; rm -rf /var/cache/pacman/pkg; ro`.
</details>
