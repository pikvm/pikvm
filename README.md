# Open and cheap DIY IP-KVM based on Raspberry Pi
[![Discord](https://img.shields.io/discord/580094191938437144?logo=discord)](https://discord.gg/bpmXfz5) [![Reddit](https://img.shields.io/badge/reddit-join-orange?logo=reddit)](https://www.reddit.com/r/pikvm)

A very simple and fully functional Raspberry Pi-based KVM (Keyboard-Video-Mouse) over IP that you can make with your own hands. This device helps to manage servers or workstations remotely, regardless of the health of the operating system or whether one is installed. You can fix any problem, configure the BIOS, and even reinstall the OS using the virtual CD-ROM or Flash Drive.

The website: [pikvm.org](https://pikvm.org). Also check out [the documentation](https://docs.pikvm.org) and join to the [Discord Community Chat](https://discord.gg/bpmXfz5) for news, questions and support!

| **[>>> DIY Device Getting Started <<<](#diy-getting-started)** | **[>>> PiKVM v3 HAT Getting Started <<<](#pikvm-v3-hat)** |
| --------------------------------------------- | ------------------------------------------ |
| [DIY Review by **Novaspirit Tech**](https://youtu.be/plP9Y1likRg)<br>[**Hackaday**](https://hackaday.com/2020/11/24/true-networked-kvm-without-breaking-the-bank/) & [**Tom's HARDWARE**](https://www.tomshardware.com/how-to/kvm-over-ip-raspberry-pi) & [**Elector MAG**](https://www.elektormagazine.com/news/pikvm-raspberry-pi-as-a-kvm-remote-control)<br>[Our boring presentation for the DIY :)](https://youtu.be/9YhPWjWv5gw) | [PiKVM v3 Review by **Novaspirit Tech**](https://youtu.be/dTchVKxx7Fo)<br>[Another review by **Level1Techs**](https://www.youtube.com/watch?v=LwsznhIBPMc)<br>[Review by **The Geek Freaks** (DE)](https://www.youtube.com/watch?v=fnd6wojrw3c) |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_example.jpg" alt="drawing"/> | <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v3_board.jpg" alt="drawing"/> |

| Web UI                                     |
| ------------------------------------------ |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/screen1.png" alt="drawing" height=200/> |


# Features
* Supported **Raspberry Pi 2**, **3**, **4**, **Zero2W**, **ZeroW**, **RPi1**, **NOTE: RPi1 and ZeroW will still work but has reached EOL and will no longer recieve updates**;
* **FullHD video** using advanced **HDMI-to-CSI bridge** or **USB dongle**;
* Extra low **video latency** with **MJPEG** or **H.264 / WebRTC** (for CSI bridge);
* Bootable **Virtual CD-ROM** and **Flash Drive**;
* USB **Keyboard** and **mouse** (with leds and the wheel), PS/2 keyboard, Bluetooth HID;
* **Control the server power** using ATX functions;
* Access via **Web UI** or **VNC**;
* Ability to use **IPMI BMC**, **IPMI SoL**, **Redfish** and **Wake-on-LAN** to control the server;
* **The ready-made OS** with read-only filesystem;
* **Extensible authorization** and HTTPS out of the box;
* **Health monitoring** of the Pi;
* Control **GPIO** ports and **USB relays**;
* It only costs between $30 and $100 for parts!
* 100% Open Source!

<details>
  <summary><b>More indepth details about the PiKVM features</b></summary>

## Fully-featured and modern IP-KVM
* **Cheaper, but better than commercial solutions**  
  Costs between $30 and $100 depending on the features desired. Even the most expensive configuration will be cheaper than a $500 commercial IP-KVM.
* **Easy to build - For the v0 variant**  
  A ready-to-use OS that can be created just by running `make build` and installed to an SD-card using `make install`. The hardware can be made in half an hour and without soldering.
* **The widest hardware support**  
  There are many ways to build a PiKVM. Video capture devices can be attached using the CSI-2 or USB interfaces. Raspberry Pi models 2, 3, 4, ZeroW or Zero2W may be used. Any combination of hardware is supported, and PiKVM implements the maximum possible set of features.
* **Very low latency**  
  ~100 milliseconds of video latency. This is the smallest delay of all existing solutions.
* **Extra lightweight and fancy Web UI**  
  No weird proprietary clients. No ugly Java applets. Just use your favorite browser to connect to the PiKVM. No flash plugins either!
* **Keyboard and mouse**  
  Mouse usage works directly in the browser. The keyboard emulator supports displaying the state of the keyboard LEDs.
* **Mass Storage Drive**  
  On the Raspberry Pi 4, ZeroW and Zero2W, PiKVM can emulate a virtual CD-ROM or Flash Drive. A live image can be uploaded to boot the attached server.
* **ATX power management**  
  With a very simple circuit that can be assembled on a breadboard, the power button of the attached server can be controlled using the ATX button headers on the motherboard.
* **Security**  
  PiKVM can be opened to the Internet and no one will get access without the password. SSL is used to protect traffic from being intercepted by third parties.
* **Local monitoring**  
  PiKVM monitors the health of the Raspberry Pi board and will warn you if it's too hot or is not receiving enough power.
* **GPIO management**
  You can control GPIO and USB relays via the web interface. The extensible interface allows you to make anything out of it.

## Production-ready  
* **Linux-based embedded OS**  
  The PiKVM OS is based on [Arch Linux ARM](https://archlinuxarm.org) and can be customized for any needs. Thousands of pre-built binary packages are at your service and can be updated with a single command!
* **Read-only filesystem**  
  By default the OS runs in read-only mode, as an embedded system should. This prevents damage to the memory card due to a sudden power outage.
* **VNC server**  
  The managed server and its BIOS can be accessed using a regular VNC client which supports JPEG compression.
* **IPMI BMC and Redfish**  
  Use `ipmitool`, `ipmiutil` or any existing network infrastructure that supports IPMI to monitor and manage the server's power. Redfish and `redfishtool` supported too.
* **Wake-on-LAN**  
  PiKVM can be configured to power up a managed server using WoL. This will be available in the Web menu.
* **Extensible authorization methods**  
  Multiple PiKVMs can be configured to use a [common authorization service](https://github.com/pikvm/kvmd-auth-server). PAM and its rich authorization mechanisms can also be used to integrate PiKVM into your existing authentication infrastructure.
* **Macro scripts**  
  If repetitive actions must be performed on the attached server (or on several different servers), a macro can be recorded with keyboard & mouse actions and can be played back multiple times.


## Open Source
* **Community & support**  
  PiKVM has a large community. Join the [discord chat](https://discord.gg/bpmXfz5) if you have any questions.
* **Extensible**  
  PiKVM was designed as a set of microservices with a plug-in architecture. It's very easy to modify and maintain.
* **Comprehensive API**  
  Everything that can be done via the user interface can also be done via a powerful HTTP API.
* **Know-how**  
  We created [our very own MJPG video server](https://github.com/pikvm/ustreamer) written in C with multi-threading support and GPU video encoding - the fastest streaming solution available to provide the best video quality for PiKVM. We also tested a lot of hardware configurations so that you can be sure devices you assemble will work reliably.
</details>

-----

# DIY Getting Started
## Required hardware
PiKVM supports several different hardware configurations, referred to as **platforms**. Now available: **v2** and **v0**.
* **Recommended**: **v2** is the most modern implementation for **Raspberry Pi 4**, **ZeroW** and **Zero2W** supporting all of the features of PiKVM including the **Mass Storage Drive**. **For Raspberry Pi 4 and Zero2W (not for ZeroW), there is support for H.264 video.**. **It's also the easiest to make**.
* v0 was designed to work with Raspberry Pi 2 and 3 that do not have OTG and requires a few more components for a basic implementation. It also does not support the Mass Storage Drive feature.

## Hardware for v2
* Raspberry Pi board:
  - **Recommended**: Raspberry Pi 4 (2 GB model is enough) for the best performance. However, the 1Gb models will also work.
  - ... or Raspberry Pi Zero2W (no ethernet).
  - ... or Raspberry Pi ZeroW (slower alternative, no ethernet).
* MicroSD card (min 16 GB recommended).
* USB-A 3A charger (female socket) or official rpi recommended power supply.
* Video capture device:
  - **Recommended**: [HDMI to CSI-2 bridge based on TC358743](https://aliexpress.com/item/4000102166176.html) - low latency, more reliable, **H.264 video**.
  - ... or [HDMI to USB dongle](https://aliexpress.com/item/4001043540669.html) (not available for ZeroW and Zero2W) - high latency >200ms, [not very reliable](#a-few-words-about-hdmi-usb-dongle-h264-is-not-officially-supported-at-this-time)), H.264 is not supported.
* Only for Raspberry Pi 4: parts for Y-splitter cable (**one variant at your choice**):
  *  <details><summary>❓ Why is this cable necessary?</summary>
     On a Raspberry Pi only the USB port that receives power is capable of acting as a USB Device. The other USB ports are capable only of acting as USB Hosts. Therefore a special cable must be used on the USB power port that it can simultanously act as USB Device for the PC/server and receive external DC power.
      </details>

  * <details><summary>:exclamation:Variant #1:exclamation:: (No mod solution - Amazon) Y cable with power blocker ends.</summary>
    <ul>
      <li>1x USB-A to USB-A cable (male-male).</li>
      <li>1x Official Power Supply (USB-A or USB-C).</li>
      <li>1x <a href="https://www.amazon.com/dp/B08C5FWQND">splitter</a> - This may need to be searched in your respecitve country.
      <li><a href="https://www.amazon.com/gp/product/B092MLT2J3">USB Power Blocker</a> - Will go into the USB-A end towards the target</li>
    </ul>
    </details>
  * <details><summary>:exclamation:Variant #2:exclamation:: DIY for soldering or twist.</summary>
    <ul>
      <li>1x USB-A to USB-C cable (male-male).</li>
      <li>1x another cable USB-A to any (male-any).</li>
      <li>1x Official Power Supply (USB-A or USB-C) depending on what cable you choose above.</li>
    </ul>
    </details>
  * <details><summary>:exclamation:Variant #3:exclamation:: Ready-made using USB-micro splitter.</summary>
    <ul>
      <li>1x USB/Power Splitter Module (<a href="https://www.tindie.com/products/8086net/usbpwr-splitter">UK</a>/<a href="https://www.pishop.us/product/usb-pwr-splitter/">US</a>/<a href="https://www.buyapi.ca/product/usb-pwr-splitter/">CA</a>).</li>
      <li>1x USB-A to USB-C cable (male-male) for connecting the Raspberry Pi to the splitter.</li>
      <li>1x USB-A to micro USB-B cable (male-male) for connecting the server to the splitter.</li>
      <li>1x USB-A to micro USB-B cable (male-male) to connect into a USB-A wall charger. Or you also can buy the official Raspberry Pi Power Supply with micro USB-B instead.</li>
    </ul>
    </details>
  * <details><summary>:exclamation:Variant #4:exclamation:: Ready-made using USB-C splitter.</summary>
    <ul>
      <li>1x USB-C/Power Splitter Module (<a href="https://www.tindie.com/products/8086net/usb-cpwr-splitter">UK</a>/<a href="https://www.pishop.us/product/usb-c-pwr-splitter/">US</a>/<a href="https://www.buyapi.ca/product/usb-c-pwr-splitter/">CA</a>).</li>
      <li>1x USB-C to USB-C cable (male-male) for connecting the Raspberry Pi to the splitter.</li>
      <li>1x USB-A to USB-C cable (male-male) for connecting the server to the splitter.</li>
      <li>1x USB-A to USB-C cable (male-male) to connect into a USB-A wall charger. Or 1x USB-C to USB-C cable to connect into a USB-C wall charger. Or you also can buy the official Raspberry Pi Power Supply with USB-C instead.</li>
    </ul>
    </details>
    

* Only for Raspberry Pi ZeroW and Zero2W:
  * 2x USB A-to-micro cables (male-male, for power and keyboard & mouse emulator). A power splitter OR a modded cable is required for this 2x usb configuration. 1x USB A-to-Micro is ONLY needed for direct connection to the target.
  * 1x [Raspberry Pi Zero Camera Cable](https://aliexpress.com/item/32953696917.html) (if using HDMI to CSI-2 Bridge, but not compatible with Auvidea B101, check pinout).
* For ATX control (optional):
  - [4x MOSFET relays OMRON G3VM-61A1](https://www.digikey.com/products/en?keywords=G3VM-61A1).
  - 4x 390 Ohm resistors.
  - 2x 4.7k Ohm resistors.
  - A breadboard and wires.
  
#### A few words about HDMI-USB dongle (H.264 is NOT officially supported at this time)
The dongle is completely supported and PiKVM works great with it. But it has some disadvantages compared with recommended [HDMI-CSI bridge](https://aliexpress.com/item/4000102166176.html): USB gives a lot of latency (200ms vs 100ms for MJPEG) and it doesn't support stream compression control (you won't be able to use PiKVM in a place with a poor internet connection). There is no H.264 support at the moment. It also cannot automatically detect screen resolution. All this is caused by the hardware limitations of the dongle itself. In addition, some users report hardware problems: the dongle may not work in the BIOS or simply stop working after a while. It's a black box, and no one knows what's inside it. If you have problems with it, it will not be possible to fix them.
  
## Hardware for v0
* Raspberry Pi 2 or 3.
* MicroSD card (8 GB is enough).
* USB-A 3A charger (female socket) or power supply.
* For keyboard & mouse emulator (HID):
  - Arduino Pro Micro (based on an ATMega32u4).
  - [Logic level shifter](https://www.sparkfun.com/products/12009).
  - 1x NPN transistor (almost any NPN transistor: 2n2222 or similar).
  - 1x 390 Ohm resistor.
  - A breadboard and wires.
* 2x USB A-to-micro cables (male-male, for power and HID).
* HDMI capture device: [see v2 description](#hardware-for-v2).
* ATX control (optional): [see v2 description](#hardware-for-v2).

#### Addition
* If you want to capture VGA from your server instead of HDMI, buy the [VGA-to-HDMI converter](https://aliexpress.com/item/4000553298530.html).
* PiKVM can be powered using PoE, but it is not recommend to use the official PoE HAT: it is unreliable and [not compatible with the HDMI bridge](https://github.com/pikvm/pikvm/issues/6). Use any other PoE hat without an I2C fan controller.
* **Don't use random relay modules or random optocouplers!** Some relays or optocouplers may not be sensitive enough for the Raspberry Pi, some others may be low-level controlled. Either use relays that are activated by a high logic level, or follow the design provided and buy an OMRON. See details [here](https://github.com/pikvm/pikvm/issues/13).  


# How to set up the device can be seen from [here](https://docs.pikvm.org/wiring_examples)

# PiKVM v3 HAT

<img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v3_kit.jpg" alt="drawing" height=200>

We have developed our own HAT for the Raspberry Pi 4.

**[>>> Buy PiKVM v3 HAT right now! <<<](https://pikvm.org/buy)**

**[>>> PiKVM v3 HAT User Guide <<<](https://docs.pikvm.org/v3)**

* **HDMI video capture** for extra low latency with **MJPEG** or **H.264/WebRTC** (1080p 50Hz max).
* **HDMI audio capture** (supported by hardware, software work in progress).
* **USB keyboard** & **mouse**, bootable **Virtual CD-ROM** & **Flash Drive**;
* Ability to simulate "**removal and insertion**" for **USB**.
* **Onboard ATX controller** to manage the server's power.
* **PWM fan controller**.
* **A real-time clock** for accurate logging.
* CISCO-style and USB **serial console port** (to manage PiKVM OS or to connect the server).
* **Optional OLED screen** to display network status or other desired information.
* **No need for soldering or breadboarding**. It's a ready-made, reliable board which you can use yourself or provide to your clients.

Watch the video:
* [PiKVM v3 Review by **Novaspirit Tech**](https://youtu.be/dTchVKxx7Fo)
* [Another review by **Level1Techs**](https://www.youtube.com/watch?v=LwsznhIBPMc)
* [Review by **The Geek Freaks** (DE)](https://www.youtube.com/watch?v=fnd6wojrw3c)

History:
* [PiKVM v3 HAT on Kickstarter (huge success](https://www.kickstarter.com/projects/mdevaev/pikvm-v3-hat)

-----

# Setting up the hardware
## Connecting the video capture
#### For the HDMI-CSI bridge
<details>
  <summary>:exclamation:Click to show the instructions:exclamation:</summary>
Insert the flexible flat cable of the HDMI bridge into the narrow white connector on the Raspberry Pi (the closest one to big USB sockets). It is labeled CAMERA. To insert you need to open the connector first. On the Raspberry Pi side you can gently lift the black part up and a little bit sideways:

| Opening the MIPI CSI-2 slot on the Raspberry Pi                                                  |
| ------------------------------------------------------------------------------------------------ |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/open-MIPI-CSI2-Slot.png" alt="detailed picture of the MIPI-CSI2 slot" width="350"> |

For the HDMI-CSI bridge it depends on the version you bought. Either pull it gently up as on the Raspberry or push it sideways. Make sure that the cable is inserted on the correct side and until it stops, and then push the black latch back. Never connect or disconnect the flat cable from a powered device. This is not Plug-and-Play, and you can damage it. Also use only the cable that was included with the device package, or make sure that the third-party cable has the correct pinout.

| HDMI-CSI-2 bridge connected to Raspberry Pi 4                                                                |
| ------------------------------------------------------------------------------------------------------------ |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/rpi4-hdmi-csi-connection.png" alt="HDMI-CSI-2 bridge connected to Raspberry Pi 4" width="350"> |

</details>

#### For the HDMI-USB dongle
<details>
  <summary>:exclamation:Click to show the instructions:exclamation:</summary>
Connect USB dongle to exactly this port. It is bound in the software so the OS does not confuse the video device with something else.

| Raspberry Pi 2 and 3                                          | Raspberry Pi 4                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_usbcap_rpi2.png" alt="drawing" width="200"/> | <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_usbcap_rpi4.png" alt="drawing" width="200"/> |

There are many revisions of the Raspberry Pi boards and you may come across one that we haven't tested. If the binding fails, the device will be available for all ports. Everything will work, but if you use a webcam and Linux mistakes it for a dongle, [write to us](https://discord.gg/bpmXfz5) and we will fix it.
</details>

## Setting up the v2
<details>
  <summary>:exclamation:Click to show the instructions:exclamation:</summary>
Here is a diagram shows that how to connect all of the pieces (click to full size).

| ATX control board                                 | USB splitter cable (only for Raspberry Pi 4)               |
| ------------------------------------------------- | ---------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2.png" alt="drawing" width="400"/> | <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_splitter.png" alt="drawing" width="400"/> |

**Raspberry Pi 4**: since one USB-C female connector is used to receive power and perform keyboard/mouse/drive emulation a special Y-cable must be made that splits the DATA and POWER lines of USB-C (see [reasons](https://github.com/pikvm/docs/issues/11)). It can be made from two suitable connecting cables, or soldered together from scratch. Be sure to check the circuit diagram below, otherwise you may damage your devices. The appropriate USB pinout(s) can easily be found on Google. Please note that if you make a Y-cable from two no-name cables, the colors of the wires may not match those shown. Use a multimeter to make sure the connections are correct.

**Raspberry Pi Zero (2) W**: This board has two USB micro connectors: one for power supply, the second for emulating a USB OTG device. You need to prevent backpowering as in the RPi4 case. To do this, you need to cut off the red power wire in the OTG wire, or seal the +5v pin in the USB-A connector with electrical tape like this:
<img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_tape_off.png" alt="drawing" width="300"/>
  
** REQUIRED ** A full 8 pair CAT5 or a flat Cisco like serial cable is nessessary for the ATX to function properly.

See video how-tos:
* [Making USB Y-splitter cable](https://www.youtube.com/watch?v=uLuBuQUF61o).
* [Soldering ATX controller](https://www.youtube.com/watch?v=hKnKOuH_f8M).

</details>

## Setting up the v0
<details>
  <summary>:exclamation:Click to show the instructions:exclamation:</summary>

| ATX control board and Arduino HID (keyboard & mouse) |
| ---------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v0.png" alt="drawing" width="400"/>    |

</details>

-----

# The final steps
1. [Flash the operating system](https://docs.pikvm.org/flashing_os).
2. **Carefully read [the "First steps" guide](https://docs.pikvm.org/first_steps)** - how to find a device on the network, how to log in there, change passwords, and so on. **Follow the steps described there and come back here**.
3. V0 only: [flash the Arduino HID](https://docs.pikvm.org/flashing_hid).
4. **Learn about the [basics of working with PiKVM](https://docs.pikvm.org/first_steps) and CHANGE THE PASSWORDS**
5. Note for the HDMI-USB dongle:
    <details>
      <summary>:exclamation:Click to show:exclamation:</summary>

      Many USB video capture devices tell the server's video card that the HDMI cable is supposedly disconnected. This may lead to the fact that if you boot the server without an active stream, the server will not detect your capture card. This is easy to fix:
      * Switch filesystem to RW-mode:
        ```
        # rw
        ```
      * Edit file `/etc/kvmd/override.yaml` and add these lines:
        ```yaml
        kvmd:
            streamer:
                forever: true
                cmd_append: [--slowdown]
        ```
      * Finish:
        ```
        # ro
        # systemctl restart kvmd
        ```

    </details>
6. If you are a happy **PiKVM v3 HAT** user then we have a [special guide for you](https://docs.pikvm.org/v3).
7. [**Explore the features of PiKVM**](https://docs.pikvm.org) using the documentation's table of contents.
8. Configure access to PiKVM from the Internet using [port forwarding](https://docs.pikvm.org/port_forwarding) or [Tailscale VPN](https://docs.pikvm.org/tailscale).
9. **If you encounter a problem**, take a look at the **[FAQ](https://docs.pikvm.org/faq)**, but if nothing helped, contact our **[Discord chat](https://discord.gg/bpmXfz5)** - experienced users and the PiKVM team will definitely help you.

Happy using of PiKVM :)

-----

# Donate
This project is developed by Open Source enthusiasts. If you find PiKVM useful or it has saved you a long trip to check on an unresponsive server, you can support the lead developer by donating a few dollars on [Patreon](https://www.patreon.com/pikvm). With this money, he will be able to buy new hardware (Raspberry Pi boards and other components) to test and maintain various configurations of PiKVM, and generally devote significantly more time to the project. At the bottom of this page are the names of all the people who have helped this project develop with their donations. Our gratitude knows no bounds!

If you wish to use PiKVM in production, we accept orders to modify it for your needs or implement custom features you require. Contact us via [live chat](https://discord.gg/bpmXfz5) or email the lead developer at: mdevaev@gmail.com

-----

# Special thanks
These kind people donated money to the PiKVM project and supported work on it. We are very grateful for their help, and commemorating their names is the least we can do in return.

<details>
  <summary>View all people!</summary>

* A. Isenring
* Aaron Heise
* Accalia
* Adam Goodbar
* Adam S
* adipisicing
* Adrian Basham
* Ahmed Syed
* Alberto Bassi
* alejandro
* Aleksei Brusianskii
* Alessio Curri
* Alex T
* Alexander Martin
* Alexander Pankov
* Alexandre Jablonski
* Alexey Kamenskiy
* alm0241
* Alok Anand
* Alucard
* Ananthaneshan Elampoornan
* Andreas Marufke
* Andreas Schmid
* Andrew Melton
* Andrew Reusch
* Andrew Ruan
* Andrzej V
* Andy
* Andy Keys
* Anish Patel
* Anix
* Anonymous
* Anthony Junk
* Anton Kovalenko
* Armen
* Aron Green
* Aron Perelman
* Artem Simonov
* Arthur Woimbée
* Ashlesh Chaudhari
* Augusto Becciu
* AVS Computer
* awkspace
* baddog
* Bao Tin Hoang
* Bean Co.
* Belf Igor
* Ben Gordon
* Ben Scott
* Benedikt Heine
* Benedikt Meier
* Benjamin Frewert
* Benjamin Melancon
* Benjamin Schwartz
* Benjamin Stegmann
* Benni Stauder
* Bernhard Fitzke
* bikmaek
* bitjoe
* Bits and Bytes Computers LLC
* Bjoern Petsch
* Blue Frog LLC
* Bootstrapper - Programmierung erklärt
* Bosco
* Bradford King
* Brainspore Networks
* Branden Shaulis
* Brandon Daniels
* Brian Moses
* Brian Vecchiarelli
* Brian White
* Bruno Gomes
* Bryan Adams
* Bryan Montgomery
* C P ELSE
* Calanish
* Cameron Tacklind
* Carl Mercier
* Carl-Fredrik Johansson
* Carlos Manuel Torres
* cbad536
* CHINATERA LIMITED
* Chris Burton
* Chris Jackson
* Chris Lewis
* Chris Rizio
* Christian Schlögl
* Christian Svensson
* Christoph Dette
* Christof Maluck
* Christoffer Lund
* Christopher Bulla
* Christopher Hearn
* Christopher Mandlbaur
* Christopher Simms
* Chucktastic
* Cihan VURAL
* clauskj3r
* Clifford Coleman
* Clinton Lee Taylor
* Cole Imhoff
* Colin Goodman
* Corey Layton
* Corey Lista
* Craig Keenan
* Crossfactor
* Cruzzer
* ctag
* Curt Sammer
* CyB0rgg
* DeMentor
* Desmond Whitt
* DailyAneurism
* Damon Meledones
* Dan Berkowitz
* Dan Brakeley
* Daniel Bowder
* Daniel Cabrera
* Daniel Davila
* Danilo Saft
* Danne
* David
* David Brausewetter
* David Godibadze
* David Howell
* David Irvine
* David Klinkman
* David Niemann
* David Shay
* David Ye
* David York
* Denis
* Denis Andreev
* Denis Yatsenko
* Dennis Becker
* Dennis Joslin
* Dennis Lomet
* Derek Yap
* Didrik
* Dimitrij Jedich
* dixon wong
* dizztrukshin
* Dmitry Shilov
* Dominic Phoon
* Dominik Klonowski
* Egan Ford
* Elani Ferri
* Elliot Woo
* Eric Phenix
* ewook
* eye-catcher.com
* Fabiano Sidler
* Far Pin Solutions, LLC
* Felyx Gabryel
* Fergus McKay
* Finn Ebenritter
* floppy
* fo0bar
* Foamy
* Foli Ayivoh
* Folkert Weistra
* Francisco Pavon
* Frank
* Frank Sander
* Frederick Czajka
* Fredrik Idréus
* Garrett Dangerfield
* Ge Men
* Genkinger Andreas
* George Becker
* Georgy Brodsky
* Gerald
* Gerardus Vernimmen
* Gernot Neuschröer
* Giovanni Fulco
* GK
* Glen Dragon
* Greg Winterstein
* Gregory Smith
* Gregory Treantos
* Grey Cynic
* Guenter Honisch
* Guido Bernacchi
* Gustin Johnson
* György Tamás Vizi
* Haiberg GmbH
* Haven Zheng
* Heibunny
* Heikki Tiittanen
* Helio Leonardo Pinheiro e Mota
* Henrik Ählström
* Henry Hood
* HimKo
* HouseFPV
* HyunohRyu
* Icculus
* iks
* Invader Monks
* IT Lifesaver
* Ivan Ganev
* Ivan Josiah Lapis
* Ivan Shapovalov
* J L
* Jaanus
* Jackson Wyatt
* Jacob Karaffa
* Jacob Morgan
* James Cadd
* James Cobb
* James Edwards
* James Kocher
* James Mayhugh
* James Ye
* Jamie Murphy
* Jamie Scott
* Jan Niehusmann
* Jari Hiltunen
* Jason Crossley
* Jason Downey
* Jason Toland
* Jasper Backer
* Jay Davis
* Jay Isaacs
* Jazereel Goh
* Jean-Daniel Croteau
* Jean-Philippe Guilbault
* Jeff
* Jeff Bowman
* Jeff Urlwin
* Jennifer Herting
* Jennifer Rowlett
* Jeremy Abel
* Jeremy Hines
* Jerremy Holland
* Jerry Nall
* Jim Bailey
* Jim Harbin
* Jimmy Burgett
* Jimmy Stanley
* Joachim Bruening
* Joe Hanson
* Joe Hinteregger
* Joe Ventura
* Joel Jacobs
* John Andersen
* John Copeland
* John F Glenn
* John Kelley
* John McGovern
* Johnny Henson
* Jon Ferguy
* Joni Ruuskanen
* Jonathan Slenders
* Jonathan Vaughn
* Joost Backer
* Josh Nethery
* Josh Ricker
* Joshua Futterer
* Jordi Pakey-Rodriguez
* Joris van Embden
* Jozef Riha
* Jörgen Fredriksson
* Julian Forero
* Julian Schneider
* Julien Angelier
* Justin
* Justin Waters
* Kai Hadler
* Kamil Chyba
* Karl Dunne
* Keith Muggleton
* Ken Lee
* Kenneth Younger III
* Kenny Hui
* Kevin Bajohr
* Kevin Schwartz
* Kevin Sherwood
* Kiran Schuler
* Koloman
* Konrad Neitzel
* Krzysztof Żelaśkiewicz
* Lance Ward
* Larry Meaney
* Lars
* Lee Wilkinson
* LeeNX
* Leon Siegl
* Leonard Feineis
* Liviu Dimitriu
* Lizardo Hernandez
* LoCascio
* Lordbob75
* Lothar Schweikle-Droll
* Louis Müller
* LSDTripp
* Luca Di Diomede
* Lucio De Carli
* Lukas Bischof
* Lukas Kammerer
* Lukas Söder
* Maksim Terehin
* Malcolm Cameron
* Manfred Radeschnig
* Marc Khouri
* Marcin Wilk
* Marcio Zimbres
* Marco Rossi
* Marcos Wolf
* Marek Marczykowski-Górecki
* Marius
* Mar. Balske
* Mark Farrell
* Mark Gilbert
* Mark Knam
* Mark Robinson
* Markrosoft
* Markus Halm
* Markus Schicker
* Markus Sobczack
* Marshall Bjerke
* Marten Hermans
* Martin Gasser
* Martin Suelmann
* Martin Wilhelmi
* Marvin Honderboom
* Mateusz Grabowski
* Mathias Uhl
* Matt Kane
* Matthew Cameron
* Mauricio Allende
* Mecky
* Mehmet Aydoğdu
* Michael Bartholomew
* Michael Bombe
* Michael Collins
* Michael Copeland
* Michael Ho
* Michael Kovacs
* Michael Lynch
* Michael Pennington
* Michael Sage
* Michael Thalmann
* MichaelZ
* Michel Bissonnette
* Mikael Wikström
* Mike Mason
* Milan Múčka
* Miles Davis
* Minh Tang
* Moez Tharani
* Morgan Helton
* Myron Weber
* Nathaniel Griswold
* Nelson Lee
* Nicholas Jeppson
* Nicholas Kopas
* Nicholas Walczak
* Nick Leffler
* Nick Roethemeier
* Nico Baumgartner
* Nicolai Kragh-Hansen
* Nihal Fernando
* Nils Orbat
* Nis Wechselberg
* Nithin Philips
* Nod Swal
* Nolan Haynes
* nubbn
* nybble
* Oh Be
* Oliver Schwarz
* Oliver Zimmer
* Omar El-Domeiri
* Omar Siam
* Oscar
* Patrick
* Patrick Fortin-Ducharme
* Patrick McDowell
* Patrick Wagstrom
* Paul Bishop
* Paul De La Rosa
* Paul Pietkiewicz
* Pawel Trofimiuk
* Peder Madsen
* Peter
* Peter Drayton
* Peter Farrelly
* Peter Okelmann
* Petra Lohmann
* Petri Heiskanen
* Phil Wu
* Philip Edwards
* Philip Merricks
* posicat
* pozitron03
* Przemysław Szypowicz
* Qteal
* Quattro Uno
* Quentin Peten
* Ralph Borchers
* Ranc1d
* Randall D Bilbrey
* Ref Chowdhury
* Raphael Schitz
* René Rathenau
* Ricardo Marques
* Richard Bernarts
* Richard Fancher
* Richard Freemantle
* Richard Michael
* Rico Cantrell
* Rob Tongue
* Robert Klauco
* Robert Weemhoff 
* Robin Gfatter
* Rodion DENISYUK
* Rohit Priyadarshi
* Rolfs 3D UG
* Ronald LeBaron
* Ronald Wells
* Ronny Haldorsen
* rotx
* Russell Scott
* Ryan Peacock
* Samed Ozoglu
* Sameul Davies
* Samuel Vetsch
* Samuel Walker
* Sarah Foster
* Sarten X
* Satish Alwani
* Scott
* Scott Gagon
* Scott Spicola
* Scott Tusing
* Scott Worthington
* Sean
* SEAT
* Seonwoo Lee
* Sergey Lukjanov
* Seth Jennings
* Sheran Gunasekera
* Shichun Chen
* Shin Guey Wong
* Simon Evans
* Simon Sundgaard
* Simplistic Realities
* Solve Technology
* srepac
* Stefan Bautz
* Stefan Müller
* Stefan Stemmer
* Stefan Vaillant
* Stephan Schmidt
* Stephen Hocking
* Steve Jones
* Steve Kerr
* Steve Ovens
* Steve Stringham
* Steven Richter
* Stratagem Solutions Ltd
* Sven Breckler
* sudo34
* Tango_Echo_Alpha
* Tarlak Desaydrone
* TechBear
* Ted
* Tejun Heo
* TheSnowedOne
* TheTechGiant
* Thomas Hagenmaier
* Thomas Hedberg Jensen
* Thomas Price
* Thomas Søfteland
* Tim Lenz
* Tim Wilkinson
* Timo Brinkmann
* Timothee Besset
* Tom Lawson
* Tom York
* Tomas Kuchta
* Tomáš hrubý
* Torsten Droste
* Tobias Schafferhans
* Tracy Fitch
* Tristan Schoening
* Truman Kilen
* turbochris
* tutanak
* Tyler
* Udo Schroeter
* Uli Fahrer
* Vasily Lazarev
* Vicente Salvador Cubedo
* Vidru Eduard
* Viktor Aschenbrenner
* Viktor Ekmark
* Vlad Sterescu
* Volker Gropp
* Walter_Ego
* Will Froning
* William Hooper
* William Perrin
* William Stearns
* xMdb
* Yanko Kaneti
* Yaroslav Kulikovskikh
* Yethal
* Yevgeniy Kuksenko
* Yogi
* Yigal Dar
* YURI LEE
* Yurii Ostapchuk
* Zeljko
* zgen
* Zoltan Magyari
* Zsombor Vari
</details>
