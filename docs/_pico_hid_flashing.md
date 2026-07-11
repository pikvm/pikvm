---
search:
    exclude: true
---


To upload the firmware to Pico HID, you can use any computer with a USB port.

1. [Download](https://github.com/pikvm/kvmd/raw/refs/heads/master/firmware/org.pikvm.hid.v1.rp2040/firmware.uf2) the latest release of the firmware.
2. Press and hold the white button on the Pico board.
3. While still holding the button, plug it in the computer using a USB cable.
4. Release the button.
5. The Pico board appears as a flash drive on your computer.
6. Copy the `firmware.uf2` file to this flash drive.
7. Safely eject the USB device.

If you want to compile the firmware yourself, you can find the source code [here](https://github.com/pikvm/kvmd/tree/master/hid/pico).
