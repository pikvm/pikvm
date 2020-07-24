# Open and cheap DIY IP-KVM based on Raspberry Pi
Join to comunity chat for questions and support!

[![Discord](https://img.shields.io/discord/580094191938437144?logo=discord)](https://discord.gg/bpmXfz5)

-----

A very simple and fully functional IP-KVM based on Raspberry Pi that you can make with your own hands. This device will help you to manage your server or workstation remotely, regardless of the operating system's health. You can fix any problem, configure the BIOS and even reinstall the OS using the CD-ROM and Flash Drive emulator.

![Screenshot](screen1.png)

-----

## Fully-featured and modern IP-KVM
* **Cheaper, but better than commercial solutions**  
  You will spend from $30 to $100 depending on what you want. Even the most expensive configuration will be cheaper than a commercial IP-KVM for $500.
* **Easy to build**  
  A ready-to-use OS that can be assembled just using `make build` and installed to SD-card using `make install`. Hardware can be maked in half an hour without soldering.
* **The widest hardware support**  
  There are many ways to build KVM. You can use the video capture device with CSI-2 or USB interface; the Raspberry Pi of different models: 2, 3, 4 or Zero W. Any build is supported, and Pi-KVM implements its maximum possible set of features.
* **Very low latency**  
  ~100 milliseconds of video latency. This is the smallest delay of all existing solutions.
* **Extra lightweight and fancy Web-UI**  
  No weird proprietary clients. No ugly Java applets. Just use your favorite browser to connect to Pi-KVM. Oh, and no flash plugin either!
* **Keyboard and mouse**  
  The mouse works directly in the browser. And the keyboard emulator supports displaying the key LEDs state.
* **Mass Storage Drive**  
  On the Raspberry Pi 4 and Zero Pi-KVM can emulate the virtual CD-ROM or Flash Drive. You can upload a live image and boot your server from it.
* **ATX power management**  
  With a very simple circuit that can be assembled on a breadboard you can control the power of your server using the ATX buttons on the motherboard.
* **Security**  
  You can open Pi-KVM to the Internet and be sure that no one will get access to your server without password. SSL encryption protect the traffic from being intercepted by third parties. 
* **Local monitoring**  
  Pi-KVM monitors the health of the Raspberry Pi board and will tell you if it's too hot or not enough power.

## Production-ready
* **Linux-based embedded OS**  
  The Pi-KVM OS is based on [Arch Linux ARM](https://archlinuxarm.org). It can be customized for any needs. Thousands of pre-built binary packages at your service. Update with a single command!
* **Read-only filesystem**  
  By default, the OS runs in read-only mode, as an embedded system should. You don't have to worry about the memory card being damaged due to a sudden power outage.
* **VNC server**  
  The managed server and its BIOS can be accessed using a regular VNC client which supports JPEG compression.
* **IPMI BMC**  
  Use `ipmitool`, `ipmiutil` or any thing in your network infrastructure that supports IPMI to monitor and manage the server's power.
* **Wake-on-LAN**
  Pi-KVM can be configured to power up a managed server using WoL. This will be available in the Web menu.
* **Extensible authorization methods**  
  Multiple Pi-KVMs can be configured to use a [common authorization service](https://github.com/pikvm/kvmd-auth-server). You can also use PAM and its rich authorization mechanisms to integrate Pi-KVM into your existing auth infrastructure.
* **Macro scripts**  
  If you need to perform repetitive actions on your server (or on different servers), you can record the macro with keyboard & mouse actions and play it back many times.


## Open Source
* **Community & support**  
  Pi-KVM has a large community. Join the [discord chat](https://discord.gg/bpmXfz5) chat if you have any questions.
* **Extensible**  
  Pi-KVM was designed as a set of microservices with a plug-in architecture. It's very easy to fix and modify.
* **Handy API**  
  Everything that can be done via the interface can also be done via the powerful HTTP API.
* **Know-how**  
  We created [very own MJPG video server](https://github.com/pikvm/ustreamer) written on C with multi-threading and GPU video encoding - fastest streaming solution available to provide the best video quality for Pi-KVM. We also made many other things and tested a lot of hardware so that you could just assemble the device and it would work immediately without any problems.


## Note
This project is developing on a non-commercial basis by Open Source enthusiasts. The goal is to create a cheap and functional alternative to expensive closed IP-KVM devices. If you found Pi-KVM useful or it saved you from a long trip to a dead computer, you can support the main developer by donating a few bucks via [Patreon](https://www.patreon.com/pikvm) or [PayPal](https://www.paypal.me/mdevaev). With this money, he will be able to buy a new hardware (Raspberry Pi and other) to test and maintain various configurations of Pi-KVM, and generally devote much more time to this project. At the bottom of this page are listed the names of all the people who helped this project develop with their donations. Our gratitude knows no bounds!

If you want to use Pi-KVM in production, we are ready to accept an order for modification for your needs and implementation of various features specifically for you. Contact us via live chat or email of the main developer: mdevaev@gmail.com

**Q**: **What is the status of this project?**  
**A:** Although this documentation page is rarely updated, the project is maintained and developed. You can verify it by checking the activity in other repositories in our organization.

**Q:** **Does this support the cheap HDMI-USB dongle from [AliExpress](https://aliexpress.ru/item/4001043540669.html)?**  
**A:** In short, **YES**, but not out of the box right now. After installation, you will have to manually add a couple of options and everything will work fine (contact us at discord to find out more). In the next couple of weeks, we will add a fully maintained conifiguration. If you want to do it right now, write to us in discord and we will help you set it up. **However, it should be noted that the USB dongle has several disadvantages compared to the HDMI-CSI bridge: USB gives you a lot of latency (200ms vs 100ms for CSI2); it doesn't support stream compression control (you won't be able to use KVM in a place with a poor internet connection); it can't automatically detect screen resolution.** You can use it, but is the $10 savings worth losing all of these features? The choice is yours.

-----

# Required hardware
Pi-KVM supports several different hardware configurations, which called **platforms**. At the moment, there are two main ones: **v0** and **v2**.
* **v0** platform was designed to work with Raspberry Pi that do not have OTG (**Raspberry Pi 2** and **3**) and requires a little more spare parts for the basic implementation. Also there does not work mass-storage drive.
* **v2** is is the most modern implementation supporting all the features of Pi-KVM. It was designed to work with **Raspberry Pi 4** and **ZeroW**.

**We recommend v2 since it supports all features including the Mass Storage Drive. It's also easiest to make.**

**Hardware for v2**
* Raspberry Pi 4 (1Gb is enough) or ZeroW. We recommend 4 because Zero is very slow.
* MicroSD card (min 16 Gb recommended).
* USB-A 3A charger or power supply.
* HDMI to CSI-2 bridge board: [Lusya or any other based on Toshiba TC358743](https://aliexpress.com/item/4000102166176.html).
* Only for Raspberry Pi 4:
  * Parts for Y-splitter cable (Raspberry Pi 4 only):
    - One USB-A to USB-C cable.
    - One another cable USB-A to any.
* Only for Raspberry Pi Zero W:
  * Two USB A-to-micro cables (for power and HID).
* ATX control (optional):
  - [4x MOSFET relay OMRON G3VM-61A1](https://www.digikey.com/products/en?keywords=G3VM-61A1).
  - 4x 390 Ohm resistors.
  - 2x 4.7k Ohm resistors.
  - Breadboard.
  
**Hardware for v0**
* Raspberry Pi 2 or 3.
* MicroSD card (8GB is enough).
* USB-A 3A charger or power supply.
* Keyboard & mouse emulator (HID):
  - Arduino Pro Micro (based on ATMega32u4).
  - [Logic levels shifter](https://www.sparkfun.com/products/12009).
  - NPN transistor (almost any NPN transistor: 2n2222 or similar).
  - 1x 390 Ohm resistor.
  - Breadboard.
* Two USB A-to-micro cables (for power and HID).
* HDMI capture device: see v2 description.
* ATX control (optional): see v2 description.

**Addition**
* If you want to capture VGA, buy the [VGA-to-HDMI converter](https://aliexpress.ru/item/4000553298530.html).

**PS: Don't use random relay modules or random optocouplers!** Some relays or optocouplers may not be sensitive enough for the Raspberry Pi, some others may be low-level controlled. Either use relays that are controlled by a high level, or follow the scheme and buy an OMRON. See details [here](https://github.com/pikvm/pikvm/issues/13).

<img src="no_relays.png" alt="drawing" width="100"/>

-----

# Setting up the hardware
Here is a diagram of how you connect all of the pieces (click to full size). Build everything as shown in the diagram and insert the flexible cable of HDMI bridge into the narrow white connector on the Raspberry Pi (the closest one to the USB).


## v2 Diagram
<img src="v2.png" alt="drawing" width="400"/>

**Raspberry Pi 4 note**: since it uses one USB-C female connector to giving power and keyboard/mouse/drive emulation you also need to make a special Y-cable to split DATA and POWER lines of USB-C (see [reasons](https://github.com/pikvm/docs/issues/11)). You can make it from two suitable connecting cables, or solder from scratch. Be sure to check the circuit diagram, otherwise you may damage your devices. Pinout specific used connectors you can easily find on request "USB pinout" in Google. Please note that if you will make a cable based on the two different manufecturers, the colors of the wires may not match those shown in the picture. Use a multimeter to make sure the connections are correct.

<img src="v2_splitter.png" alt="drawing" width="400"/>

See video howtos:
* [Making USB Y-splitter cable](https://www.youtube.com/watch?v=uLuBuQUF61o).
* [Soldering ATX controller](https://www.youtube.com/watch?v=hKnKOuH_f8M).

Also check out small PCB for ATX (if you know how to make PCBs): https://easyeda.com/mark.gilbert/zerow-kvm-v1


## v0 Diagram
<img src="v0.png" alt="drawing" width="400"/>

-----

# Building OS
Pi-KVM OS is based on Arch Linux ARM and contains all required packages and configs to work. To build the OS you will need any Linux machine with a fresh version of Docker (we recommand >= 1:19) with privileged mode (for fdisk and some other commands, check Makefiles if you don't trust us :).

0. For a clean OS (Like Ubuntu 18) you need to install and configure docker (after adding user in the docker group a relogin is needed), as well as git and make.
    ```shell
    [user@localhost ~]$ sudo apt-get install git make curl binutils -y
    [user@localhost ~]$ curl -fsSL https://get.docker.com -o get-docker.sh
    [user@localhost ~]$ sudo sh get-docker.sh
    [user@localhost ~]$ sudo usermod -aG docker $USER
    ```
    Re-login to apply changes.

1. Checkout build toolchain:
    ```shell
    [user@localhost ~]$ git clone https://github.com/pikvm/os
    [user@localhost ~]$ cd os
    ```

2. Determine the target hardware configuration (platform). Choose the board (`BOARD=rpi4` for Raspberry Pi 4 or `BOARD=zerow`, `BOARD=rpi2`, `BOARD=rpi3` for other options). Next, choose the platform: `PLATFORM=v2-hdmi` for RPi4 or ZeroW; `PLATFORM=v0-hdmi` for RPi 2 or 3. Other options are for legacy or specialized Pi-KVM boards (WIP).

3. Create config file `config.mk` for the target system. You must specify the path to the SD card on your local computer (this will be used to format and install the system) and the version of your Raspberry Pi and platform. You can change other parameters as you wish. Please note: if your password contains the # character, you must escape it using a backslash like `ROOT_PASSWD = pass\#word`.
    ```Makefile
    [user@localhost os]$ cat config.mk
    # rpi3 for Raspberry Pi 3; rpi2 for the version 2, zerow for ZeroW
    BOARD = rpi4
    
    # Hardware configuration
    PLATFORM = v2-hdmi
    
    # Target hostname
    HOSTNAME = pikvm
    
    # ru_RU, etc. UTF-8 only
    LOCALE = en_US
    
    # See /usr/share/zoneinfo
    TIMEZONE = Europe/Moscow
    
    # For SSH root user
    ROOT_PASSWD = root
    
    # Web UI credentials: user=admin, password=<this>
    WEBUI_ADMIN_PASSWD = admin
    
    # IPMI credentials: user=admin, password=<this>
    IPMI_ADMIN_PASSWD = admin
    
    # SD card device
    CARD = /dev/mmcblk0
    ```
    
    If you want to configure wifi (for ZeroW board for example) you must add these lines to `config.mk`:
    ```Makefile
    WIFI_ESSID = "my-network"
    WIFI_PASSWD = "P@$$word"
    ```

4. Build OS. It may take about one hour depending on your Internet connection:
    ```shell
    [user@localhost os]$ make os
    ```
    
5. Put SD card into card reader and install OS (**you should disable automounting before: `systemctl stop udisk2` or something like that**):
    ```shell
    [user@localhost os]$ make install
    ```
    
6. After installation remove the SD card and insert it into your RPi. Turn on the power. RPi will try to get ad IP address using DHCP on your LAN. It will be available via SSH.

7. If you can't find the device's address, try using the following command:
    ```shell
    [user@localhost os]$ make scan
    ```

8. **Only for v0**. Now you need to flash Arduino. This can be done using your RPi. **Before starting this operation, disconnect the RESET wire from Arduino, otherwise the firmware will not be uploaded. Connect the Arduino and RPi with a suitable USB cable.** Log in to RPi and upload the firmware. Then connect RESET wire back, disconnect USB and reboot RPi.
    ```
    [user@localhost os]$ ssh root@<addr>
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl stop kvmd
    [root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
    [root@pikvm ~]# cd ~/hid
    [root@pikvm hid]# make
    [root@pikvm hid]# make install
    [root@pikvm hid]# reboot
    ```
9. Congratulations! Your Pi-KVM will be available via SSH (`ssh root@<addr>`) and HTTPS (try to open it in a browser at `https://<addr>`). For HTTPS a self-signed certificate is used by default.

-----

# Tips
* The Pi-KVM file system is always mounted in read-only mode. This prevents it from being damaged by a sudden power outage. To change the configuration you must first switch FS to write mode using the command `rw` from root. After the changes, be sure to run the command `ro` to switch it back to read-only.

* NEVER edit `/etc/kvmd/main.yaml`. Use `/etc/kvmd/override.yaml` to redefine the system parameters. All other files that are also not recommended for editing have read-only permissions. If you edit any of these files, you will need to manually make changes to them when you upgrade your system. You can view the current configuration and all available KVMD parameters using the command `kvmd -m`.

* Almost all KVMD (the main daemon controlling Pi-KVM) configuration files use [YAML](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html) syntax. Read about it if you don't know how to use it.

* If you want to disable the web terminal use these commands:
    ```yaml
    [root@pikvm ~]# systemctl disable kvmd-webterm
    [root@pikvm ~]# systemctl stop kvmd-webterm
    ```
    
* To disable authorization completely edit file `/etc/kvmd/override.yaml`:
    ```yaml
    kvmd:
        auth:
            enabled: false
    ```
    then restart `kvmd`:
    ```
    [root@pikvm ~]# systemctl restart kvmd
    ```

* If you don't need to control ATX you can disable relevant Web-UI menu in `/etc/kvmd/override.yaml`:
    ```yaml
    kvmd:
        atx:
            type: disabled
    ```
    then restart kvmd.
    
* To use Wake-on-LAN on your server you must define some options such as server MAC and (optional) IP address. Use `/etc/kvmd/override.yaml`. Write this:
    ```yaml
    kvmd:
        wol:
            mac: ff:ff:ff:ff:ff:ff
    ```
    Replace `ff:ff:ff:ff:ff:ff` to MAC of your server. By default, a packet is sent by a broadcast request to the entire IPv4 network (`255.255.255.255`, port `9`), but you can address it to a specific static address:
    ```yaml
    kvmd:
        wol:
            mac: ff:ff:ff:ff:ff:ff
            ip: 192.168.0.100
            # port: 9  # By default
    ```
    
* To use IPMI BMC you need to set up an appropriate account and run the `kvmd-ipmi` daemon (`systemctl start kvmd-ipmi` and `systemctl enable kvmd-ipmi`). Although Pi-KVM supports the IPMI protocol, we strongly recommend that you do not use outside trusted of networks due to its [insecurity](https://github.com/NitescuLucian/nliplace.com.blog.drafts). Refer to the file `/etc/kvmd/ipmipasswd` to configure IPMI account.

* To use VNC you need to change the keyboard layout for non-US client keyboard using `/etc/kvmd/override.yaml`. For example:
  ```yaml
  vnc:
      keymap: /usr/share/kvmd/keymaps/ru
  ```
  By default the username and password authorization is used. This is not supported by all clients (we recommend [TigerVNC](https://tigervnc.org)). To enable passphrase authorization, you need to edit the file `/etc/kvmd/vncpasswd` to set passphrases and enable this feature in `/etc/kvmd/override.yaml`:
  ```yaml
  vnc:
      auth:
          vncauth:
              enabled: true
  ```
  After that you can enable `kvmd-vnc` daemon (`systemctl start kvmd-vnc` and `systemctl enable kvmd-vnc`). VNC will be available on port 5900 by default.  
  We recommend disabling automatic quality adjust if there is one in your client (this is called "Auto-Select"in TigerVNC).  
  Please note: we strongly don't recommend you to use VNC in untrusted networks. The current implementation does not use encryption, and your passwords are transmitted over the network in a plain text. The existing anonymous TLS mode is also not secure enough.

-----

# Troubleshooting
* On step 8 (`make install`), you may encounter the following error:
    ```
    /root/.platformio/packages/tool-avrdude/avrdude: error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory
    ```
    Create a symlink for this library:
    ```bash
    [root@pikvm ~]# ln -s /usr/lib/libtinfo.so.6 /usr/lib/libtinfo.so.5
    ```
    And run `make install` again.
    
    
* **Unexpected interruption of loading the image to Mass Storage Drive**

    If problems occur when uploading even a small disk image it may be due to unstable network operation or antivirus software. It is well known that Kaspersky antivirus cuts off Pi-KVM connections for uploading, so you should add the site to the list of exceptions or not filter web requests with the antivirus. Antivirus can also affect the performance of certain interface elements, for example the quality slider.

    Regarding Kaspersky...the solution is to set the website of pikvm in network in the exclusion list (**Protection -> Private browsing -> Categories and exclusions -> Exclusions**).


* **Glitchy/Wrong BIOS resolution**

    On some motherboards, the BIOS may be displayed at a lower resolution, or with some rendering issues/glitches, specially on newer ASUS ones.

    e.g

    <img src="bios_glitch.png" alt="ASUS BIOS glitch" width="400"/>

    This can be solved by enabling **Compatibility Support Module (CSM)** on your BIOS, usually under the **Boot** options.

    If you can't or don't want to enable CSM, you can try connecting a DisplayPort monitor, or a [dummy plug](http://amazon.com/s?k=displayport+dummy+plug). If you remove the DP cable/adapter the bug will show up again.

    If none of this works, try connecting the DP cable first, boot into the BIOS, disable CSM and shutdown (do not restart) your PC. Boot into the BIOS and enable CSM then shutdown your PC. Then connect the HDMI and turn it on again.

* If you have any problems or questions, you can contact us using Discord: https://discord.gg/bpmXfz5

-----

# Special thanks
These kind people donated money to the Pi-KVM project and supported the work on it. We are very grateful for their help, and memorializing their names is the least we can do in gratitude.
* Aleksei Brusianskii
* Arthur Woimbée
* Ben Gordon
* Branden Shaulis
* Brian White
* Christof Maluck
* Corey Lista
* David Howell
* Denis Yatsenko
* Ge Men
* Grey Cynic
* Jacob Morgan
* Jason Toland
* Jeff Bowman
* John McGovern
* Mark Gilbert
* Mark Robinson
* Mauricio Allende
* Michael Lynch
* Samed Ozoglu
* Truman Kilen
* Walter_Ego
