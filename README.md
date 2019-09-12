# DIY IP KVM System with WEB-interface using Raspberry Pi
Stand-alone IP KVM device with web interface with various video capture options and bunch of features like keyboard/mouse control, ATX control (power/reset/ HDD load), Mass-Storage Device. 

![Screenshot](image1.png)

## Minimal hardware implementation
- Raspberry Pi 2, 3 or 4(work in progress)
- MicroSD card
- Raspberry Pi power supply

**Video capture side for lowcost S-Video**
- Easycap UTV007 device (https://www.amazon.com/dp/B0126O0RDC)
- HDMI to S-Video (not all options work, but these two have been tested) (https://www.amazon.com/dp/B012MDMWLM or https://www.amazon.com/gp/product/B01E56CV42)
  
**Video capture side for HDMI**
- B101 HDMI to CSI-2 Bridge (https://auvidea.eu/b101-hdmi-to-csi-2-bridge-15-pin-fpc/)

**HID Subsystem and ATX control**
- Arduino Pro Micro with hardware USB for HID sub-system
- GPIO cables
- 2-Channel Relay Module
- Optocouplers



## Setting up the hardware
Here is a diagram of how you connect all of the pieces:

![Screenshot](image2.png)

## Quick Install
The quick method of installation is to simply run the install script on the Pi3 as the `pi` user:
```
git clone https://github.com/pi-kvm/pi-builder

make binfmt os BOARD=rpi3 STAGES="__init__ os watchdog ro __cleanup__"

cat .build/Dockerfile

find .build/stages

можешь запустить make shell
оно тебе даст поковыряться в армовом корне

CARD ?= /dev/sdb
CARD_BOOT ?= $(CARD)1
CARD_ROOT ?= $(CARD)2

попробуешь снова собрать?
git checkout .
git pull
<поправить путь к карточке в Makefile>
make binfmt os BOARD=rpi3 BUILD_OPTS=--no-cache STAGES="__init__ os watchdog ro sshkeygen __cleanup__"
make install






git clone https://github.com/pi-kvm/os
отредактируй мейкфайл
потом делай make v1-vga-rpi3
потом make install
в начале файла будет пачка переменных
.......................................................................................................
CARD ?= /dev/sdb
CARD_BOOT ?= $(CARD)1
CARD_ROOT ?= $(CARD)2

BOARD ?= rpi2
PLATFORM ?= v1-vga
STAGES ?= "__init__ os watchdog ro pikvm-common-init pikvm-$(PLATFORM) pikvm-common-final rootssh sshkeygen __cleanup__"

BUILD_OPTS ?=

HOSTNAME ?= pikvm
LOCALE ?= en_US.UTF-8
TIMEZONE ?= Europe/Moscow
REPO_URL ?= http://mirror.yandex.ru/archlinux-arm

WEBUI_ADMIN_PASSWD ?= admin
.......................................................................................................
заменяешь CARD, в STAGES убираешь rootssh, потом билдишь
make v1-vga-rpi3
make install
всё
пользователь в морду admin, пароль admin



mdevaevВчера в 17:36
если есть время - попробуй пересобрать квм
я там всякой мелочи прикольной допилил
только надо в os сделать make clean-all
и в самом репе сделать git pull
много перепилил
чекни урл /extras/webterm/gotty/
там консоль

1. 
make clean-all
git checkout .
git pull
2. 
nano Makefile
CARD ?= /dev/sdb
CARD_BOOT ?= $(CARD)1
CARD_ROOT ?= $(CARD)2
3.
make v1-vga-rpi3
make install




make clean-all
git pull --rebase
make v1-vga-rpi3
make install


make v1-vga-rpi3 install
```
Everything will be done on the Pi3 and Pi0 automatically with the video input defaulting to s-video.

If you would like to manage multiple servers with one IPMI system, please see the [Managing multiple servers](#managing-multiple-servers) section below.

Be sure to check the bottom of this README for [Tips](#tips) and [Troubleshooting](#troubleshooting)!

## The long way
If you would like to do things step by step to understand how things work, the following instructions can be used.

#### Setting up the Pi 3
First, let's get all the software we need:
```
sudo apt-get update

```

#### Access the IPMI
You should now be able to access the IPMI console at `http://<RaspberryPi3IP>/`. From here you can set up SSL and port forwarding to the device as your situation requires.

## Managing multiple servers

## Tips

## Troubleshooting

