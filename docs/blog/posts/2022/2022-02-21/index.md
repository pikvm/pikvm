---
title: "KVMD 3.55: Copying text FROM the target machine"
date: 2022-02-21
slug: kvmd-3-55-copying-text-from-target-machine
description: >
    Introducing a new big feature—the ability to copy text from a managed machine to the clipboard
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.55
comments: true
---

Introducing a new big feature—the ability to copy text from a managed machine to the clipboard.

<!-- more -->

As you know, the clipboard inside the machine is a system feature and has no hardware connection with PiKVM. Therefore, in order to copy the text, we made it possible to recognize the selected image on the screen using the Tesseract OCR library, which converts it into text.

![type:video](./copy-text-from-target-machine.webm)

Image recognition works locally on your Raspberry Pi and does not use any Skynet clouds. In addition, recognition works ONLY on your demand, that is, the OCR library does not see the image until you give it to it explicitly, so if you are afraid to raise an evil AI, then you can relax.

For reasons of concern about paranoids, OCR library are not installed by default yet 🙂

```console
rw
pacman -Syu
pacman --assume-installed tessdata -S tesseract tesseract-data-eng
reboot
```

Install any OCR language by searching it in `pacman -Ss tesseract-data`. 

