---
title: "KVMD 3.13: Upload images by URL + dual mouse mode"
date: 2021-08-02
slug: kvmd-3-13-upload-images-by-url-dual-mouse-mode
description: >
    You can now download the image for mass storage from the HTTP(S) URL and you no longer have to choose between relative and absolute mouse
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.13
comments: true
---

Two new great features!

<!-- more -->

- Now you can tell Pi-KVM to **download the image for mass storage from the HTTP(S) URL**, and not just upload from your local computer. The new MSD API has also become more convenient if you are a curl guru.

- For v2/v3/OTG, **you will no longer have to choose between relative and absolute mouse, you will be able to use both modes and switch between them without changing the config and reboot**. This is very convenient if your BIOS does not understand the absolute mouse and only wants a relative one, while the absolute one is more convenient for everyday work in the OS. This dual mouse mode is disabled by default for compatibility reasons (perhaps, especially buggy bioses may not support two mice at once), to enable it, after updating, add to `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    hid:
        mouse_alt:
            device: /dev/kvmd-hid-mouse-alt
```

Turn off the relative mode for the mouse in the config if it was enabled earlier. And make sure that you merged files `/etc/udev/99-kvmd.rules.pacnew` with `/etc/udev/99-kvmd.rules`. 

To update:

```console
rw
pacman -Syu
reboot 
```