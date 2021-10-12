# Working with video

## Video recording

!!! info
    H.264 is available on Pi 3 and Pi 4. Older boards won't handle it. Best of all this feature only works for HDMI to CSI bridge. For the USB HDMI dongle, there will be a decrease in FPS to 10-15 for 1080p. Work in progress.

1. Perform full system update to get the latest uStreamer and install ffmpeg:

    ```
    # rw
    # pacman -Syu
    # pacman -S ffmpeg
    ```

2. For USB dongle only: Add line `gpu_mem=256` to `/boot/config.txt`.

3. Perform `reboot` command.

4. Run `rw` after the reboot.

6. To record a video, you need to enable the stream (open the web interface or connect via VNC). Then run something like this in the console:

    ```
    # rw
    # ustreamer-dump --sink kvmd::ustreamer::h264 --output - | ffmpeg -use_wallclock_as_timestamps 1 -i pipe: -c:v copy test.mp4
    ```

7. Press `Ctrl+C` to stop recording. Your video will be in the file `test.mp4`.

8. After finishing work, do not forget to switch the file system to read-only mode using `ro` command.


## Take a screenshot via console on PiKVM

!!! note
    You must have a stream running

```
# curl --unix-socket /run/kvmd/ustreamer.sock http://localhost/snapshot -o /tmp/screen.jpg
```
