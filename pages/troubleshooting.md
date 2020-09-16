# Troubleshooting Pi-KVM / FAQ
As a first step we recommend carefully reading our documentation on [GitHub](https://github.com/pikvm/pikvm). Most steps to successfully set up your Pi-KVM are already described there. If you run into any issues you can check this Troubleshooting guide which will list common errors. If that still doesn't help you you're welcome to raise an [issue ticket](https://github.com/pikvm/pikvm/issues) or [join our Discord](https://discord.gg/bpmXfz5) for further help

## Hardware
### LEDs / Switches do not work in ATX control.
- Double check your wiring as per [the documentation](https://github.com/tryallthethings/pikvm/tree/documentation#setting-up-the-v2). Make sure you placed the relays (G3VM-61A1) in the correct orientation. The relays for switches (Power, Reset) have a different orientation than the ones for LEDs.

### Pi-KVM does not show any image from the connected computer.
- Double check if you connected the HDMI-CSI-2 bridge cable correctly. [Check the documentation for details](https://github.com/tryallthethings/pikvm/tree/documentation#for-the-hdmi-csi-bridge) A red LED will light up on the bridge if it is connected properly. 
- Some laptops do not output any signal until you switched the ouput (usually via the FN + and an F5 key on the keyboard). 

## Software
### How do I update Pi-KVM with the latest software?
- Connect to your Pi-KVM via ssh and run 
```
rw
pacman -Syu
reboot
```

### The Pi-KVM web interface does not work correctly in Mozilla Firefox while it works fine in Google Chrome.
- This might be related to your specific hardware combination or browser hardware acceleration. Try [disabling hardware acceleration in Firefox](https://support.mozilla.org/en-US/kb/hardware-acceleration-and-windowblinds-crash) or updating your GPU and chipset drivers.

### I can't copy clipboard contents from the server (the machine controlled via Pi-KVM) to the client.
- The clipboard only works from the client to the server not vice versa. There is currently no way to do it.

