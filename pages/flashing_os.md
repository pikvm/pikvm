# Flashing the OS image
Download the appropriate memory card image from https://pikvm.org/download.html. Select it based on the board, platform, and the video capture device you are using. For example: choose **v2-hdmi-rpi4.img.bz2** for Raspberry Pi 4 with HDMI-to-CSI capture bridge.

Note: right now, pre-compiled images are only available for the Raspberry Pi 4. In all other cases, you will need to build the operating system yourself. But don't worry, it's [very simple](building_os.md).

For Linux guru: decompress and flash image to the memory card using CLI. Be careful be careful when choosing your device path:
```bash
$ bzip2 -d v2-hdmi-rpi4.img.bz2
$ sudo dd if=v2-hdmi-rpi4.img of=/dev/mmcblk0
```

If you prefer a graphical interface or don't have Linux at hand install [Balena Etcher](https://www.balena.io/etcher). It's available for the Linux, MacOS and Windows. Follow the instructions bellow:

1. Decomress the image using your File Manager. If you don't have an archiver (on Windows for example) - the [7-Zip](https://www.7-zip.org) is a great choice.

2. Run Balena Etcher:

    <img src="../img/balena-1.png" alt="drawing" height="300"/>

3. Press **Flash from file** and choose the image:

    <img src="../img/balena-2.png" alt="drawing" height="300"/>

4. Insert memory card to the card reader. Press **Select target** and choose your memory card:

    <img src="../img/balena-3.png" alt="drawing" height="300"/>

    <img src="../img/balena-4.png" alt="drawing" height="300"/>

5. Press **Flash!** button and wait for the finish. If an error occurs during flashing, repeat the process:

    <img src="../img/balena-5.png" alt="drawing" height="300"/>

6. When the process is complete, pull out the memory card and insert it into the Raspberry Pi. Turn the power on. Your device will obtain the IP address via DHCP automatically.

7. After power-up, Pi-KVM OS generates unique SSH keys and certificates. Do not turn off the Raspberry Pi until it's fully booted.

8. Congratulations! Your Pi-KVM will be available via SSH (`ssh root@<addr>` with password `root` by default) and HTTPS (try to open in a browser the URL `https://<IP addr>`, the login `admin` and password `admin` by default). For HTTPS a self-signed certificate is used by default.

9. To change root password use command `passwd` via SSH or webterm. To change Pi-KVM web password use `kvmd-htpasswd set admin`.

10. After installation, we recommend that you update your operating system:
    ```shell
    # rw
    # pacman -Syu
    # reboot
    ```

If you have any problems or questions, contact us using Discord: https://discord.gg/bpmXfz5
