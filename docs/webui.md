---
title: Getting to know the web UI
description: How to get started with using the web interface for your PiKVM
---

## Logging in

After following the first steps document on setup, you will be presented with the following pages (Chrome is being used in the following examples)

<img src="Page1.jpg" width="400" />

Click Advanced

<img src="Page2.jpg" width="400" />

Click Proceed

!!! note "Credentials are found in the first steps document that is located to the left"

<img src="Login.jpg" width="400" />

This is where you fill in the login credentials, please be sure to
review the first steps document first. This is also where you configure
the 2FA token.

## Initial screen

<img src="Portal.jpg" width="400" />

??? note "Please expand to see what each number represents"

    1. This is where your PiKVM name will go - Please reference the first steps document on how to change this
    2. This is where you can access the display for the Target system
    3. You can open a web terminal and put in commands that you will find within these documents
    4. By default this will not show up till its activated, this will tell you the VNC address you need to use
    5. This is so you can logout of your PiKVM
    6. Please read carefully
    7. These are links to the PiKVM project, current documentation and support
    8. **NOT SHOWN**, in the lower left of the KVM screen is some information that when you mouse over, will let you know what they are for

## Web UI Stream window
<img src="kvm window.jpg" />
    1. Video mode
    2. Resolution/bitrate/FPS
    3. View modifiers, from left to right
        * Fullscreen
        * Stretch to fill tab (micro fullscreen, hides the menu in a side button)
        * Fit stream to client resolution (within constraints of the canvas, will shrink if window is smaller than client resolution)
        * Maximize within window (keeping PiKVM UI Toolbar)
        * Close stream (saves bandwidth)
## Web UI toolbar

<img src="Toolbar.jpg" />

??? note "Please expand to see what each number represents"

    1. This is the system setting, more details will be shown below
    2. This is the interface to controlling the ATX, will ONLY work if wired up correctly
    3. This is part of the MSD and will show you what images/iso's are available
    4. This is where you can program in a Macro (Ex. Hitting F2 to get into the bios, setting Infinite loop playback to on and doing other tasks)
    5. This is where you can SEND text to the Target or using OCR, you can copy FROM the target, be mindful that OCR can make mistakes, please review before finalizing
    6. This is where you can find most Shortcuts (Windows only, for now) (Not editable)
    7. This is placed here to give you an idea what you can achieve if you make your own menu item

## The System menu

<img src="System.jpg" width="400" />

!!! note "The following is self explanatory but will highlight the important parts"


??? note "Please expand to see what each number represents"
    1. System Icons

        ETH Icon = PiKVM network connectivity

        Monitor Icon = Shows if the target is sending an active signal

        KeyBoard Icon = Shows if data for the KB is active, will likely show Orange/Green as data is passed and goes idle

        Mouse Icon = Same as above
    2. These are additional buttons for important acitivies

        Term = Can launch a quick Web Terminal along with the active KVM

        About = Shows everything About your PiKVM, including PiKVM Hardware and version

        Log = Shows the current log from your PiKVM

    3. ONLY for MJPEG mode
    4. ONLY for H.264 (WebRTC) mode

## The ATX menu

<img src="ATX.jpg" width="400" />

This ONLY works if you have the hardware connected to the MB, otherwise will not work

## The Drive menu

<img src="Drive.jpg" width="400" />

This is where you can select the IMG or ISO's that are stored

## The Macro menu

<img src="Macro.jpg" width="400" />

1. Please read and understand this section
2. This is where you can upload or download your scripts

## The Text menu

<img src="Text.jpg" width="400" />

!!! note
    This is not like VNC/AnyDesk/TeamViewer as these are software solutions, this is a hardware solution therefor cannot change the behavior of the target system.
    This does not act like a clipboard

1. This will allow you to paste text to the target system—be mindful whats being pasted to the target and how.

2. This will allow you to ONLY copy text from the target—be mindful that OCR will do its best to recognize text but may fail at it.

## The Shortcuts menu

<img src="Shortcuts.jpg" width="400" />

This is an expanded view and shows the shortcuts mostly for Windows.
