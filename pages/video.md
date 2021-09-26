# Video
Currently, PiKVM uses MJPEG for video transmission. This is a simple and widely supported, but not very effective video format.
In the near future, it is planned to support H264, and then switch to it as the main one.

The H264 implementation is still under development, but right now you can use it to record video from your server.
To do this, uStreamer supports simultaneous MJPEG and H264 encoding since version 3.0.

### Video recording
:exclamation: Best of all this feature only works for HDMI to CSI bridge. For the USB HDMI dongle, there will be a decrease in FPS to 10-15 for 1080p. Work in progress.

* Perform full system update to get the latest uStreamer and install ffmpeg:
  ```
  rw
  pacman -Syu
  pacman -S ffmpeg
  ```
* For USB dongle only: Add line `gpu_mem=256` to `/boot/config.txt`.
* Perform `reboot` command.
* Run `rw` after the reboot.
* Add memory sink options to `/etc/kvmd/override.yaml`. This is necessary to get a dump of the video stream:
  ```yaml
  kvmd:
      streamer:
          cmd_append:
              - "--h264-sink=kvmd::ustreamer::h264"
  ```
* Restart kvmd: `systemctl restart kvmd`. H264 encoding is almost CPU-free, so if you use RPi4 or RPi3, you can leave the option permanently.
* To record a video, you need to enable the stream (open the web interface or connect via VNC). Then run something like this in the console:
  ```
  rw
  ustreamer-dump --sink kvmd::ustreamer::h264 --output - | ffmpeg -use_wallclock_as_timestamps 1 -i pipe: -c:v copy test.mp4
  ```
* Press `Ctrl+C` to stop recording. You video will be in the file `test.mp4`.
* After finishing work, do not forget to switch the file system to read-only mode using `ro` command.
