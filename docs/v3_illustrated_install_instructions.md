---
title: Assembling PiKVM V3 HAT
description: How to build PiKVM V3 HAT from the assembly kit
---

# Assembling PiKVM V3 HAT

PiKVM V3 HAT is an assembly kit. You can build it without any case whatsoever, order a metallic case separately, or 3D-print a case yourself. These videos cover all those use cases.

??? tip "Video guide: Assembly with a metal case" 
    NOTE: OLED will not light up till step 5 is performed, video was performed after it was already configured, heat sinks NOT included.
    ![type:video](https://www.youtube.com/embed/jdqiwHKQcD4)

??? tip "Video guide: Assembly with or without a 3D-printed case"
    ![type:video](https://www.youtube.com/embed/-SRL92VJ870)

## Step 1

Get the parts that are not in the assembly kit:

* Raspberry Pi 4 with 1Gb RAM or more
* Heat sinks (Optional)
* MicroSD card (at least 16Gb, class 10 recommended)
* USB-C to USB-A cable
* HDMI cable
* [Straight Ethernet cable](./atx_board/straight.png)
* Power supply unit (5.1V 3A USB-C, recommended by the Raspberry Pi)

!!! tip
    * Please review the back of the box. All parts are required before the HAT is fully functional.
    * The USB-C bridge is located in with the ATX end which includes a pink foam spacer.
    * Please assemble the HAT onto the RPi and test all of the parts before installing in the case, it's easier to install in the case than to dissasemble it.
    * If going from a V2 to a V3, the splitter is **no longer needed**.

## Step 2

Remove contents from assembly kit box:

* 8x M.2 5x12mm screws for the case
* 4x M.2 5x12mm screws for the fan
* 4x bolts for the fan
* 1x fan (30x30x7mm 5v)
* 1x case top
* 1x case bottom
* 1x OLED display (0.91 IIC 128x32 LCD)
* 2x bottom plastic risers
* 1x plastic top riser
* 1x plastic OLED holder that is also a front riser
* 2x small FCC ribbon cables
* 1x small rubber square that break out to 4x small rubber feet

!!! warning "OLED is sensitive to pressure, do NOT push down on the very thin glass as it will crack and become non-functional"

## Step 3

Take bottom part of the case, insert the RPI4 into the bottom case at an angle, you will need to flex the other side ever so slightly to get it to slot in.

<img src="RPI4_insert_into_case.jpg" width="400" />

??? note "IF you bought heatsink's (sold seperatly), it's advised to install them now before installing the HAT"

## Step 4

Insert HAT at the same angle, take care to line up the pins on the Rpi with the HAT pin sleeve, the trick to this is to push the Rpi all of the way to the left then all of the way to the right for proper alignment, do NOT force till the pins are aligned. If properly aligned the pins will match up without issue.

<img src="HAT_insert_into_case.jpg" width="400" />

<img src="HAT2_insert_into_case.jpg" width="400" />

??? note "ALTERNATIVE: As an alternative to the above, you can pre assemble the hat+fcc cable onto the RPI4, then insert them into the bottom portion of the case however you will need to flex the sides more whereby creating a bigger gap when fully assembled."

## Step 5

There are 2 ways to insert the FCC cable, you can add it when you insert the RPI in Step 2 OR wait till you also have the HAT installed and slide it into the slot.

<img src="FCC_HAT_Ribbon_Cable_install.jpg" width="400" />

??? note "The blue stripes on the ends of the cable will ALWAYS face the side that will be used to tighten the FCC to the camera port or have it positioned towards the power - Ignore the smaller FCC cable that plugs into the USB, was phased out during the KS campaign. This image was used as a means of illustrating FCC placement and orientation"

## Step 6

Install the USB-C bridge.

??? note "This is packaged with the ATX board"
<img src="PiKVM_ATX_Packaging.png" width="400" />

<img src="HAT_install_usbc_bridge.jpg" width="400" />

??? note "If you do not install this bridge, mouse/kb will not work"
??? note "HAT will still power on without this bridge installed"

## Step 7

Turn the bottom of the case upside down, install the 2 bottom plastic risers, it's best to install in a wing formation. Top first by inserting the top screws then slide the bottom part aligning the plastic to the holes then inserting the screws. At this point its OK to tighten the bottom screws. There is no need to use force, just tighten enough to prohibit movement.

<img src="HAT_install_plastic_risers_bottom.jpg" width="400" />

## Step 8

Take the plastic OLED holder, turn the OLED over where the back side is facing you and insert at an angle so as to create a space between the OLED and holder arm, take a flat head screwdriver (medium normal) and twist it enough so you can clear the electronics on the bottom of the OLED and continue to gently slide in the remaining OLED till its fully inserted.

<img src="HAT_install_OLED_into_holder.jpg" width="400" />

!!! warning "Be careful on handling this display, slight pressure will damage the OLED, however in the event that this does happen, replacements are cheap and can be found in most electronic stores or Amazon, look for any IIC (I2C) .91 inch display for Arduino" 

## Step 9

Insert the OLED holder with the OLED display into the plug by gently rocking it back and forth till it's fully inserted.

<img src="HAT_install_OLED_holder.jpg" width="400" />

## Step 10

Install plastic spacer.

<img src="HAT_install_plastic spacer.jpg" width="400" />

## Step 11

Install the screws and bolts to secure the fan, it does not matter the orientation of the fan, push or pulling air will result in the same behavior, its personal preference.

<img src="HAT_install_fan_to_top.jpg" width="400" />

## Step 12

Insert the fan leads and align Red with positive and Black with negative.

<img src="HAT_install_fan_to_HAT_board.jpg" width="400" />

!!! warning "You can damage the fan if installed incorrectly"

## Step 13

Install the top of the case to the bottom, use the 4 remaining screws to secure the top.

<img src="HAT2_insert_top_part_of_case.jpg" width="400" />

## Step 14

Please follow the [V3 quick start](../v3/) guide to activate your PiKVM.
