# Flashing the OS image
Download the appropriate memory card image from https://pikvm.org/download.html. Select it based on the board, platform, and the video capture device you are using. For example: choose **v2-hdmi-rpi4.img.bz2** for Raspberry Pi 4 with HDMI-to-CSI capture bridge.

Note: right now, pre-compiled images are only available for the Raspberry Pi 4. In all other cases, you will need to build the operating system yourself. But don't worry, it's [very simple](building_os.md).


## Using Linux CLI
Decompress and flash image and follow to the [final steps](#the-final-steps). Be careful when choosing your device path:
```bash
# bzip2 -d v2-hdmi-rpi4.img.bz2
# dd if=v2-hdmi-rpi4.img of=/dev/mmcblkX
```


## Using Balena Etcher (Linux, MacOS and Windows)
1. Download and install [Balena Etcher](https://www.balena.io/etcher).

2. Decomress the image using your File Manager. If you don't have an archiver (on Windows for example) - the [7-Zip](https://www.7-zip.org) is a great choice. Please note: Balena Etcher have ability to flash compressed images directly, but it is much slower and the process consumes a huge amount of RAM. We strongly recommend you to decompress the image first.

3. Run Balena Etcher:

    <img src="../img/balena-1.png" alt="drawing" height="300"/>

4. Press **Flash from file** and choose the image:

    <img src="../img/balena-2.png" alt="drawing" height="300"/>

5. Insert memory card to the card reader. Press **Select target** and choose your memory card:

    <img src="../img/balena-3.png" alt="drawing" height="300"/>

6. Press **Flash!** button.

    <img src="../img/balena-4.png" alt="drawing" height="300"/>

7. Wait for the finish. If an error occurs during flashing, repeat the process:

    <img src="../img/balena-5.png" alt="drawing" height="300"/>


## The final steps
1. When the process is complete, pull out the memory card and insert it into the Raspberry Pi. Turn the power on. Your device will obtain the IP address via DHCP automatically.

2. After power-up, Pi-KVM OS generates unique SSH keys and certificates. Do not turn off the Raspberry Pi until it's fully booted.

3. Congratulations! Your Pi-KVM will be available via SSH (`ssh root@<addr>` with password `root` by default) and HTTPS (try to open in a browser the URL `https://<addr>`, the login `admin` and password `admin` by default). For HTTPS a self-signed certificate is used by default.

4. To change the root password use command `passwd` via SSH or webterm. To change Pi-KVM web password use `kvmd-htpasswd set admin`. As indicated on the login screen use `rw` to make the root filesystem writable, before issuing these commands. After making changes, make sure to run the command `ro`.

5. After installation, we recommend you to update your operating system:
    ```shell
    # rw
    # pacman -Syu
    # reboot
    ```
    
6. **27.08.2020 note about systemd**: the latest version of Arch Linux has a slightly broken systemd. The problem is that SSH to the Pi-KVM host may not work the first time, but the second or third. The Pi-KVM build environment contains a workaround for this problem: in the file `/etc/pam.d/system-login` line `-session   optional   pam_systemd.so` is commented. This does not have any negative impact on the PI-KVM functionality, but if you want to, after fixing the systemd (in a couple of months with the next update), you can uncomment this line.

If you have any problems or questions, contact us using Discord: https://discord.gg/bpmXfz5
