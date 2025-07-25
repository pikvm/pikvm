---
title: "KVMD 4.72: A big bunch of big improvements"
date: 2025-05-18
slug: kvmd-4-72-big-bunch-of-big-improvements
description: >
    Now you will see the reason why there is no signal
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v4.72
comments: true
---

This release has gathered a whole bunch of features that some users have been asking. And this is a big step forward in terms of usability.

<!-- more -->

## Web UI

- ⭐ The maximized window continues to be maximized when the browser is resized or the resolution of the remote host is changed. It's meaning the stream will always occupy the maximum workspace without having to constantly press the dot button to remove the black bars from above or below the stream.
- ⭐ The text in the paste menu can now be sent using the hotkey **Ctrl+Enter**.
- ⭐ Added two-finger scrolling on touch devices.
- ⭐ The virtual keyboard supports the key lock mode by clicking the middle button. Hotkeys like **REISUB** are now much more convenient to enter. Long left or short right click for hold like right now, middle for lock.
- Fixed the mouse positioning at the right and bottom edges of the screen.
- Fixed incorrect scrolling inertia when changing the direction. The scrolling algorithm has been significantly improved.
- Fixed the keys overlapping on the virtual keyboard on HiDPI screens.

## VNC

- ⭐ Eliminated the mess with the clipboard. Now, to paste the text, you just need to copy it to the client PC, and then use the magic `LeftAlt,LeftAlt,P` hotkey (quickly in a row, without holding). No more accidental insertion when switching windows.
- ⭐ Hotkeys for switching channels on the PiKVM Switch on any VNC client. If you have one or two switches, you can use `LeftAlt,LeftAlt,1 (1-8)` to switch between 8 channels. For three or more Switches, you need to use double numbers, like `LeftAlt,LeftAlt,3,2` (unit 3, channel 2).
- ⭐ VNC clients showing host information will now display the current active port of PiKVM Switch and KVM name.
- VNCAuth no longer requires you to write the KVMD password in /etc/kvmd/vncpasswd and does not prevent you from using one-time passwords with KVMD. Now you can turn it on if you haven't done it before.

## IPMI

- kvmd-ipmi no longer requires writing the KVMD password in `/etc/kvmd/ipmipasswd` and does not prevent you from using 2FA with KVMD. Now you can turn it on if you haven't done it before.

## PiKVM Switch

- ⭐ Improved VNC integration (see the previous header).
- Option to disable the dummy plug function.

To update:

`pikvm-update`