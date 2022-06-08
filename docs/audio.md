# PiKVM V3 Audio

This feature allows you to receive audio over an HDMI cable and transmit it to the browser in WebRTC mode.

!!! warning
    * This is only supported by PiKVM V3 devices right now.
    * Please note the feature is experimental. Nothing will explode for you, but something may not work. Please report about problems [here](https://discord.gg/bpmXfz5) (preferred) or [here](https://github.com/pikvm/pikvm/issues/97).

## Preparing
1. Make sure that you have not removed the [jumpers related to audio (4)](v3.md#atx-connection) on the V3 board and have not deleted or commented out the `dtoverlay=tc358743-audio` line in `/boot/config.txt`. Return everything as it was, if you changed it.

2. Update the OS:
   ```
   # rw
   # pacman -Syu
   ```

3. Edit `/etc/kvmd/janus/janus.plugin.ustreamer.jcfg` and add the following lines at the end:
   ```
   audio: {
       device = "hw:0,0"
       tc358743 = "/dev/kvmd-video"
   }
   ```

4. Enable the basic audio in the EDID:
   ```
   # kvmd-edidconf --set-audio=yes
   ```

5. Reboot the device:
   ```
   # reboot
   ```

6. Your host will detect the possibility of audio output via HDMI. Mac OS usually connects automatically, Windows requires manual indication, Linux will require a ritual shamanic dance. In any case, make sure that the audio is output via HDMI on your host.

7. Open the PiKVM Web UI. Click the **System** menu and switch the video mode to **H.264 / WebRTC**. After that, the volume slider will appear under the switch. Increase it to the maximum and have fun.

!!! warning
    * After the page is reloaded, the audio slider will be reset. This is a technical limitation in all browsers to avoid annoying audio ads.
    * If something doesn't work, check the log: `journalctl -u kvmd-janus`.
    * Please report about problems [here](https://discord.gg/bpmXfz5) (preferred) or [here](https://github.com/pikvm/pikvm/issues/97).
