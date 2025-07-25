---
title: "KVMD 3.126: Writable flash drive storage"
date: 2022-07-24
slug: kvmd-3-126-writable-flash-drive-storage
description: >
    Now you can upload the flash drive image to MSD, write some files to it, or even install entire OS to the PiKVM MSD drive
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.126
comments: true
---

Now you can upload the flash drive image to MSD, write some files to it, or even install entire OS to the PiKVM MSD drive (I don't know why, but you can), and download the image back. Use the new feature wisely.

<!-- more -->

Okay, here is an obvious question: is it possible to download not the entire image, but one file from it? This will be implemented later. For now, only the entire image.

Another recent change affects V3 and CSI bridges owners. I changed the display name from `Toshiba-H2C` to `PiKVM` and the manufacturer id from `TSB` to `LNX`. You may need to specify the preferred monitor resolution in your OS again. If you used a custom EDID (for example, turned on the sound), then nothing will change for you.

To update:

```console
rw
pacman -Syu
reboot
```