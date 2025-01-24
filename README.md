# Open and inexpensive DIY IP-KVM based on Raspberry Pi
[![Discord](https://img.shields.io/discord/580094191938437144?logo=discord)](https://discord.gg/bpmXfz5) [![Reddit](https://img.shields.io/badge/reddit-join-orange?logo=reddit)](https://www.reddit.com/r/pikvm)

A very simple and fully functional Raspberry Pi-based KVM (Keyboard-Video-Mouse) over IP that you can make with your own hands. This device helps to manage servers or workstations remotely, regardless of the health of the operating system or whether one is installed. You can fix any problem, configure the BIOS, and even reinstall the OS using the virtual CD/DVD or Flash Drive.

The website: [pikvm.org](https://pikvm.org). Also check out [the documentation](https://docs.pikvm.org) and join to the [Discord Community Chat](https://discord.gg/bpmXfz5) for news, questions and support!

| Web UI                                     |
| ------------------------------------------ |
| <img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/screen1.png" height=400 /> |


# Features
* Can be made based on **Raspberry Pi 2**, **3**, **4** and **Zero2W**;
    * *Raspberry Pi 5 is not supported right now. It doesn't have GPU video encoders, therefore, there is no point in using it for PiKVM, it will not give any performance boost for this case. The Pi 5 is a great device, just not suitable for PiKVM.*
* **FullHD video** using advanced **HDMI-to-CSI bridge** or **USB dongle**;
* Extra low **video latency** with **MJPEG** or **H.264** via direct HTTP or WebRTC streaming (for CSI bridge);
* Bootable **Virtual CD/DVD** and **Flash Drive**, ability to store images on **NFS**;
* USB **Keyboard** and **mouse** (with leds and the wheel), Bluetooth HID, Mouse jiggler, full support of PS/2;
* **Control the server power** using ATX functions;
* Access via **Web UI** or **VNC**;
* Ability to use **IPMI BMC**, **IPMI SoL**, **Redfish** and **Wake-on-LAN** to control the server;
* **The ready-made OS** with read-only filesystem;
* **Extensible authorization** and HTTPS out of the box;
* **Health monitoring** of the Pi;
* Control **GPIO** ports and **USB relays**;
* 100% Open Source!

# Variants

PiKVM supports several different hardware configurations, referred to as **platforms**.
All of them uses our common open source software stack.

* **PiKVM V4** and **V3** are our own **plug-and-play, fully assembled, industrial grade, robust** devices.<br>
    Supports **H.264 video & two-way audio with microphone** transmission, **host power management**, **mass-storage emulation** and much more.
    They are really well-made, reliable things which you can use yourself or provide to your clients.
    V4 and V3 also have more features than DIY builds.

* **PiKVM V2** and **V1** devices are **DIY** so you can make it with your own hands.<br>
   If you don't know where to put your old Raspberry Pi, here's a great goal.

**Look at what Tech Bloggers are saying about us :)**

<table>
<tr>
    <td align="center"><b>PiKVM V4 Plus &amp; Mini</b></td>
    <td align="center"><b>PiKVM V3</b></td>
    <td align="center"><b>DIY PiKVM</b></td>
</tr>
<tr>
    <td align="center"> <!-- V4 Plus/Mini -->
        <a href=https://youtu.be/2HqbQdZUEmY><b>Novaspirit Tech</b></a><br>
        <a href=https://youtu.be/Kx5MlT2jYxU><b>Level1Techs</b></a><br>
        <a href=https://www.youtube.com/watch?v=PppcpSVYh0E><b>Jeff Geerling</b><br>
    </td>
    <td align="center"> <!-- V3 -->
        <a href=https://www.youtube.com/watch?v=232opnNPGNo><b>~~~ LINUS TECH TIPS ~~~</b></a><br>
        <a href=https://youtu.be/dTchVKxx7Fo><b>Novaspirit Tech</b></a><br>
        <a href=https://www.youtube.com/watch?v=LwsznhIBPMc><b>Level1Techs</b></a><br>
        <a href=https://www.youtube.com/watch?v=aOgcqVcY4Yg><b>Techno Tim</b></a><br>
        <a href=https://www.youtube.com/watch?v=fnd6wojrw3c><b>The Geek Freaks</b> (DE)</a><br>
    </td>
    <td align="center"> <!-- DIY -->
        <a href=https://youtu.be/plP9Y1likRg><b>Novaspirit Tech</b></a><br>
        <a href=https://hackaday.com/2020/11/24/true-networked-kvm-without-breaking-the-bank><b>Hackaday</b></a><br>
        <a href=https://www.tomshardware.com/how-to/kvm-over-ip-raspberry-pi><b>Tom's HARDWARE</b></a><br>
        <a href=https://www.elektormagazine.com/news/pikvm-raspberry-pi-as-a-kvm-remote-control><b>Elector MAG</b></a><br>
        <a href=https://youtu.be/9YhPWjWv5gw>Our boring presentation of DIY</a><br>
    </td>
</tr>
<tr>
    <td align="center"><img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v4.jpg" width=200 /></td>
    <td align="center"><img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v3_preasm.jpg" width=200 /></td>
    <td align="center"><img src="https://raw.githubusercontent.com/pikvm/pikvm/master/img/v2_example.jpg" width=200 /></td>
</tr>
<tr>
    <td align="center"><a href=https://pikvm.org/buy><br><b>~~~ BUY IT NOW ~~~</b></a><br><br></td>
    <td align="center"><a href=https://pikvm.org/buy><br><b>~~~ BUY IT NOW ~~~</b></a><br><br></td>
    <td align="center"><a href=#diy-getting-started><br><b>DIY Getting Started</b></a><br><br></td>
</tr>
</table>

<hr>

**NEW PRODUCT! [PiKVM Switch](https://docs.pikvm.org/switch) will help you to transform PiKVM into a multiport device!**

<a href=https://docs.pikvm.org/switch><img src="https://docs.pikvm.org/switch/switch.png" width=300 /></a>

<hr>

| <div align="center">⭐ ⭐ ⭐ **CORE SYSTEM** ⭐ ⭐ ⭐</div>        | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
|--------------------------------------------------------------------|:-----------:|:-----------:|---|:--------:|---|:----------:|:----------:|
|                                                                    |             |             |   |          |   |            |            |
| **Plug and Play out of box!**                                      | ✅          | ✅          |   | ✅       |   | DIY        | DIY        |
| Base Raspberry unit | CM4<br><sup>Included!</sup> | CM4<br><sup>Included!</sup> | | RPi4<br><sup>Included!</sup> | | RPi4<br>Zero2W | RPi3<br>RPi2<br>Zero2W |
||
||
| <div align="center">⭐ ⭐ ⭐ **VIDEO** ⭐ ⭐ ⭐</div> | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
||
| [**Video passthrough** to local display](https://docs.pikvm.org/pass)        | ✅   | ❌          |   | ❌       |   | ❌         | ❌         |
| **HDMI 1920x1200@60Hz** support<br>for big displays                          | ✅   | ✅          |   | ❌       |   | ❌         | ❌         |
| **HDMI 1920x1080@60Hz** support<br>for better BIOS/UEFI compatibility        | ✅   | ✅          |   | ❌       |   | ❌         | ❌         |
| **HDMI audio** capture                                                       | ✅   | ✅          |   | ✅       |   | ❌         | ❌         |
| **Microphone emulation** for two-way audio                                   | ✅   | ✅          |   | ✅       |   | ❌         | ❌         |
| **Super fast H.264 & MJPEG video:**<br>720p - 60fps, 1080p - 30fps for H.264 | ✅   | ✅          |   | ✅       |   | ✅         | ✅         |
||
||
| <div align="center">⭐ ⭐ ⭐ **PERIPHERY** ⭐ ⭐ ⭐</div> | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
||
| USB keyboard/mouse emulation                                       | ✅          | ✅          |   | ✅       |   | ✅         | ✅         |
| Virtual **Flash Drive** / **CD/DVD** emulation                     | ✅          | ✅          |   | ✅       |   | ✅         | ❌         |
| Ability to simulate **"eject/insert"** for USB                     | ✅          | ✅          |   | ✅       |   | ❌         | ❌         |
| **Onboard ATX controller** for power management of the host        | ✅          | ✅          |   | ✅       |   | DIY        | DIY        |
| **Built-in OLED** with IP and other info                           | ✅          | ✅          |   | ✅       |   | ❌         | ❌         |
| **Multiport KVM switches** support                                 | ✅          | ❌          |   | ✅       |   | ✅         | ✅         |
||
||
| <div align="center">⭐ ⭐ ⭐ **HARDWARE ABILITIES** ⭐ ⭐ ⭐</div> | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
||
| **Internal secured USB 3.0** storage port                          | ✅          | ❌          |   | ❌       |   | ❌         |  ❌        |
| **USB serial** console port                                        | ✅          | ✅          |   | ✅       |   | ❌         |  ❌        |
| **CISCO-style RJ-45** console port                                 | ✅          | ❌          |   | ✅       |   | ❌         |  ❌        |
| A **real-time clock** for accurate logging                         | ✅          | ✅          |   | ✅       |   | ❌         |  ❌        |
| **Locator LED** to find device in the rack                         | ✅          | ✅          |   | ❌       |   | ❌         |  ❌        |
| [**mPCIe slot** with USB lines for **LTE/5G** cards](https://docs.pikvm.org/modem)   | ✅          | ❌          |   | ❌       |   | ❌         |  ❌        |
| **SIM card slot** for modem                                        | ✅          | ❌          |   | ❌       |   | ❌         |  ❌        |
| **External antenna** support                                       | ✅          | ✅          |   | ❌       |   | ❌         |  ❌        |
| USB host support (external USB devices connectivity)               | ✅          | ❌          |   | ✅       |   | ✅         |  ✅        |
||
||
| <div align="center">⭐ ⭐ ⭐ **POWER AND COOLING** ⭐ ⭐ ⭐</div>  | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
||
| Cooling system / fan type                                      | Quiet<br>Radial | Fanless     |   | Axial    |   | DIY        | DIY        |
| PWM fan controller                                                 | ✅          | ❌          |   | ✅       |   | ❌         |  ❌        |
| **Fan speed and health** monitoring                                | ✅          | ❌          |   | ❌       |   | ❌         |  ❌        |
| Power consumption in idle mode                                     | 3.3W        | 2.65W       |   | 3.3W     |   |            |            |
||
||
| <div align="center">⭐ ⭐ ⭐ **MISCELLANEOUS** ⭐ ⭐ ⭐</div>      | **V4 Plus** | **V4 Mini** |   |  **V3**  |   | **DIY V2** | **DIY V1** |
||
| USB relays, lamps, smartplugs control                              | ✅          | ❌          |     | ✅     |   | ✅         | ✅         |
| Pi's GPIO ports control from the Web UI                            | ❌          | ❌          |     | ✅     |   | ✅         | ✅         |


<details>
  <summary><b>More indepth details about the PiKVM features</b></summary>

## Fully-featured and modern IP-KVM
* **Cheaper, but better than commercial solutions**  
  Costs between $30 and $100 depending on the features desired. Even the most expensive configuration will be cheaper than a $500 commercial IP-KVM.
* **Easy to build - For the V1 variant**  
  A ready-to-use OS that can be created just by running `make build` and installed to an SD-card using `make install`. The hardware can be made in half an hour and without soldering.
* **The widest hardware support**  
  There are many ways to build a PiKVM. Video capture devices can be attached using the CSI-2 or USB interfaces. Raspberry Pi models 2, 3, 4 or Zero2W may be used. Any combination of hardware is supported, and PiKVM implements the maximum possible set of features.
* **Very low latency**  
  ~100 milliseconds of video latency. This is the smallest delay of all existing solutions.
* **Extra lightweight and fancy Web UI**  
  No weird proprietary clients. No ugly Java applets. Just use your favorite browser to connect to the PiKVM. No flash plugins either!
* **Keyboard and mouse**  
  Mouse usage works directly in the browser. The keyboard emulator supports displaying the state of the keyboard LEDs.
* **Mass Storage Drive**  
  On the Raspberry Pi 4 and Zero2W, PiKVM can emulate a virtual CD/DVD or Flash Drive. A live image can be uploaded to boot the attached server.
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
PiKVM supports several different DIY platforms. Now available: **V2** and **V1**.
* **Recommended**: **V2** is the most powerful implementation for **Raspberry Pi 4** and **Zero2W** supporting all of the features of PiKVM including the **Mass Storage Drive**. **It's also the easiest to make**.
* **V1** was designed to work with **Raspberry Pi 2** and **3** that do not have USB emulation port and requires a few more components for a basic implementation. It also does not support the Mass Storage Drive feature.

The full list of parts is at the very beginning according to the assembly instructions for the corresponding platform.
You can review both options to decide which one is most suitable for you.

So, again, in short:

* **DIY PiKVM V2:**
  * [Here are the instructions and a complete list of components](https://docs.pikvm.org/v2).
  * Requires Raspberry Pi 4 or Zero 2 W.
  * Supports H.264 (for recommended CSI capture).
  * Supports CD/DVD and Flash Drive (mass storage) emulation.
  * It is recommended as a simpler and more feature-rich way compared to V1.

* **DIY PiKVM V1:**
  * [Here are the instructions and a complete list of components](https://docs.pikvm.org/v1).
  * Requires Raspberry Pi 2 or 3.
  * Requires Raspberry Pi Pico for the keyboard/mouse emulation.
  * Requires extra wiring and little bit more parts.
  * Supports H.264 (for recommended CSI capture).
  * Doesn't support CD/DVD and Flash Drive (mass storage) emulation.

-----

# Donate
This project is developed by Open Source enthusiasts. If you find PiKVM useful or it has saved you a long trip to check on an unresponsive server, you can support us by donating a few dollars on [Patreon](https://www.patreon.com/pikvm) or [Paypal](https://paypal.me/pikvm) or buying our devices. With this money, we will be able to buy new hardware (Raspberry Pi boards and other components) to test and maintain various configurations of PiKVM, and generally devote significantly more time to the project. At the bottom of this page are the names of all the people who have helped this project develop with their donations. Our gratitude knows no bounds!

If you wish to use PiKVM in production, we accept orders to modify it for your needs or implement custom features you require. Contact us via [live chat](https://discord.gg/bpmXfz5) or email the lead developer at: mdevaev@gmail.com

-----

# Special thanks
These kind people donated money to the PiKVM project and supported work on it. We are very grateful for their help, and commemorating their names is the least we can do in return.

<details>
  <summary>View all people!</summary>

* A. Isenring
* Aaron Graubert
* Aaron Heise
* Aaron Stein
* Accalia
* Adam Goodbar
* Adam S
* Adam Stuart
* AdamBomb
* adipisicing
* Adrian Basham
* Adrian Popescu
* Ahmed Syed
* Alberto Bassi
* alejandro
* Aleksei Brusianskii
* Alessio Curri
* Alex T
* Alex Z
* Alexander Karmanov
* Alexander Lahuerta
* Alexander Martin
* Alexander Pankov
* Alexandre Jablonski
* Alexey Kamenskiy
* alm0241
* Alok Anand
* Alucard
* Ananthaneshan Elampoornan
* Andreas Grundler
* Andreas Marufke
* Andreas Schmid
* Andrew Brant
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
* Arthur Mayer
* Arthur Woimbée
* Ashlesh Chaudhari
* Asim Shakour
* Augusto Becciu
* AVS Computer
* awkspace
* Badal Patel
* baddog
* Bao Tin Hoang
* Bean Co.
* Bela Bargel
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
* Beu
* bikmaek
* bitjoe
* Bits and Bytes Computers LLC
* Bjoern Petsch
* Blair Hasler
* Blindside
* Blue Frog LLC
* Bootstrapper - Programmierung erklärt
* Bosco
* Bradford King
* Brainspore Networks
* Branden Shaulis
* Brandon Daniels
* Brian
* Brian Moses
* Brian T Mulcahy
* Brian Vecchiarelli
* Brian White
* brodonalds
* Bruno Gomes
* Bryan Adams
* Bryan Montgomery
* Buzzer
* C P ELSE
* Calanish
* Cameron Hatcher
* Cameron Tacklind
* Carl Mercier
* Carl-Fredrik Johansson
* Carlos Eduardo Porter Herrera
* Carlos Garcia
* Carlos Manuel Torres
* cbad536
* César Nascimento
* CHINATERA LIMITED
* Chris Blackmon
* Chris Burton
* Chris Campbell
* Chris Jackson
* Chris Lewis
* Chris Rizio
* Christi King
* Christian Schlögl
* Christian Svensson
* Christoph Dette
* Christof Maluck
* Christoffer Lund
* Christopher Bulla
* Christopher Gelatt
* Christopher Hearn
* Christopher Mandlbaur
* Christopher Mendoza
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
* Daegara
* DailyAneurism
* Damon Meledones
* Dan Berkowitz
* Dan Brakeley
* Daniel Bowder
* Daniel Cabrera
* Daniel Davila
* Danilo Saft
* Danne
* Dariusz Techmański
* David
* David Brausewetter
* David Davis
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
* Derek Jarvis
* Derek Yap
* Didrik
* digitalbaconbits
* Dimitrij Jedich
* dixon wong
* dizztrukshin
* Dmitry Shilov
* DogeLabs
* Dominic Phoon
* Dominik Klonowski
* Donald Hays
* Edmon Abdul Nur
* Edward Wang
* Egan Ford
* Elani Ferri
* Elliot Woo
* Entt
* Eric Phenix
* Ethan Shold
* Eugene Sukhodolin
* ewook
* eye-catcher.com
* Fabian Druschke
* Fabiano Sidler
* Far Pin Solutions, LLC
* Felyx Gabryel
* Fergus McKay
* Finn Ebenritter
* floppy
* fo0bar
* Foad Yousef
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
* Geekworm
* Genkinger Andreas
* Geijer
* Geoffrey Wright
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
* grewil
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
* Howard Simons
* HyunohRyu
* Icculus
* iks
* INFO TRX INC
* Invader Monks
* Ioannis Karageorgos
* Isaac
* IT Lifesaver
* Ivan Ganev
* Ivan Josiah Lapis
* Ivan Shapovalov
* iwbjhbweriuhf
* J
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
* James Noonan
* James Ye
* Jamie Murphy
* Jamie Scott
* Jan Niehusmann
* Jannick Oursin
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
* Jeremy Combs
* Jeremy Hines
* Jerremy Holland
* Jerry Nall
* Jerry Y. Chen
* Jim Bailey
* Jim Harbin
* Jimmy Burgett
* Jimmy Stanley
* Joachim Bruening
* Joe Hanson
* Joe Hinteregger
* Joe Ventura
* Joel Jacobs
* Johannes Heigermose
* John Andersen
* John Copeland
* John F Glenn
* John Holmes
* John Kelley
* John McGovern
* Johnny Henson
* Jon Ferguy
* Jon-Eric
* Joni Ruuskanen
* Jonas Fischer
* Jonathan Slenders
* Jonathan Vaughn
* Joost Backer
* Joseph Swift
* Josh Nethery
* Josh Ricker
* Josh VanDeraa
* Joshua Futterer
* Jordan Blake
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
* Kari Matti Korpi
* Karl Dunne
* Karl Moos
* Keith Muggleton
* Ken Lee
* Kenneth Younger III
* Kenny Hui
* KeonWoo PARK
* Kevin Bajohr
* Kevin Schwartz
* Kevin Sherwood
* Kiera Kujisawa
* Kiran Schuler
* Koloman
* Konrad Neitzel
* Krzysztof Żelaśkiewicz
* Lance Ward
* Larry Meaney
* Lars
* Lars Reinhardt
* Lee Wilkinson
* LeeNX
* Leon Siegl
* Leonard Feineis
* Lewis Wild
* Liran
* Liviu Dimitriu
* Lizardo Hernandez
* LoCascio
* Lordbob75
* Lothar Schweikle-Droll
* Louis Müller
* LSDTripp
* Ľubor Slušný
* Luca Di Diomede
* Lucio De Carli
* Luiz Bizzio
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
* Martin Hofbauer
* Martin Raine
* Martin Suelmann
* Martin Wilhelmi
* Marvin Honderboom
* Mateusz Grabowski
* Mathias Uhl
* Matt Kane
* Matthew Cameron
* Mauricio Allende
* Max Evans
* Mecky
* Mehmet Aydoğdu
* Michael Bartholomew
* Michael Bell
* Michael Bombe
* Michael Collins
* Michael Copeland
* Michael Ho
* Michael Kovacs
* Michael Lynch
* Michael Pennington
* Michael Sage
* Michael Stella
* Michael Thalmann
* Michael Wu
* MichaelZ
* Michel Bissonnette
* Mikael Wikström
* Mike Mason
* Mikhael Mariano
* Milan Burda
* Milan Múčka
* Miles Davis
* Minh Tang
* Moez Tharani
* Morgan Helton
* Murad Khasawneh
* Myron Weber
* N Patel
* Nathaniel Griswold
* Nelson Lee
* nezu
* Nicholas Jeppson
* Nicholas Kopas
* Nicholas Walczak
* Nick Leffler
* Nick Roethemeier
* Nico Baumgartner
* Nicolai Kragh-Hansen
* Nicolas Christener
* Nigel Smith
* Nihal Fernando
* Nils Orbat
* Nis Wechselberg
* Nithin Philips
* Nod Swal
* Nolan Haynes
* Noxigen LLC
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
* Paul Tan
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
* Pierre Brassart
* Pierre Peine
* posicat
* pozitron03
* Przemysław Szypowicz
* P_Dmitrij
* Qteal
* Quattro Uno
* Quentin Peten
* Ralph Borchers
* Ranc1d
* Randall D Bilbrey
* RandomJerk
* Ref Chowdhury
* Raphael Schitz
* René Rathenau
* ReysDad
* Ricardo Marques
* Richard
* Richard Bernarts
* Richard Fancher
* Richard Freemantle
* Richard Michael
* Rico Cantrell
* Rob
* Rob Holden
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
* Rufo Sanchez
* Russell Scott
* Ryan
* Ryan Peacock
* Samed Ozoglu
* Sameul Davies
* Samuel Cote
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
* Scuba
* Sean
* Sean Akers
* Sean c Rickard
* SEAT
* Sebastian
* Seonwoo Lee
* Sergey Lukjanov
* Seth Jennings
* Shane Selling
* Shawn Butts
* Sheran Gunasekera
* Shichun Chen
* Shin Guey Wong
* Simon Evans
* Simon Sundgaard
* Simplistic Realities
* Sirmo
* Snowy Maslov
* Solve Technology
* srepac
* Stefan Bautz
* Stefan Müller
* Stefan Stemmer
* Stefan Vaillant
* Stephan Schmidt
* Stephen
* Stephen Hocking
* Steve Jones
* Steve Kerr
* Steve Ovens
* Steve Stringham
* Steven Richter
* Stratagem Solutions Ltd
* Sven Breckler
* sudo34
* SuperHiTech
* Tango_Echo_Alpha
* Tarlak Desaydrone
* TechBear
* techlobo
* Ted
* Tejun Heo
* TheSnowedOne
* TheTechGiant
* Thomas Charisoulis
* Thomas Gitlin
* Thomas Hagenmaier
* Thomas Hedberg Jensen
* Thomas Price
* Thomas Søfteland
* Tim Lenz
* Tim Wilkinson
* Timo Brinkmann
* Timothee Besset
* TitomusPrime
* Tom Lawson
* Tom York
* Tomas Kuchta
* Tomáš hrubý
* Torsten Droste
* Torsten Knoll
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
* Venmo
* Vicente Salvador Cubedo
* Vidru Eduard
* Viktor Aschenbrenner
* Viktor Ekmark
* Vincent Chov
* Vlad Sterescu
* Volker Gropp
* Walli
* Walter_Ego
* William Wenzel
* Will Froning
* William Hooper
* William Perrin
* William Stearns
* Woojin Son
* xMdb
* Yanko Kaneti
* Yaroslav Kulikovskikh
* Yethal
* Yevgeniy Kuksenko
* Yew Kay Yan
* Yogi
* Yigal Dar
* YURI LEE
* Yurii Ostapchuk
* Zeljko
* zgen
* Zoltan Magyari
* Zsombor Vari
</details>
