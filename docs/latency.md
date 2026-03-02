---
title: Latency in KVM systems
description: What is a KVM latency, where does it come from, and how to measure it?
---

## What is latency in KVM?

When you move your mouse in PiKVM, you can see how the remote cursor lags behind the local one (which is indicated by a blue dot). This is *latency* — the delay between your keyboard/mouse input and the remote host's response to the video.

Latency defines how responsive a KVM-over-IP device *feels* to users:

- Less than 30ms feels nearly instantaneous but is impossible to achieve in remote sessions.
- 30–50ms is the next best thing and works for most tasks.
- 50–100ms generally works, but slight delays are visible during rapid movement.
- Anything above 100ms is usually perceived as sluggish and undesirable.

!!! tip "Our latency measurements"

    PiKVM has **around 35-50 milliseconds of total latency**, from capture to displaying, with the following conditions:

    * [PiKVM V4](v4.md) device
    * Resolution: 1920x1080 at 60Hz
    * WebRTC H.264 video mode (default)
    * H.264 kbps = 5000 (default)
    * H.264 gop = 0 (default)
    * [H.264 boost enabled](video.md#boost-pikvm-v4-to-60fps-h264)
    * Access via a local network or good internet connection

    Currently, **PiKVM offers a proven lowest end-to-end latency** among all other KVM-over-IP devices available on the market.

Next, we'll explain how we arrived at these numbers and how you can replicate them yourself to verify our results.

-----
## Video pipeline

PiKVM works with the physical world: it captures video from a cable, encodes it, and sends it to your browser over a network.

```
+--= Host =--+           +-------= PiKVM =-------+           +---= Browser =---+
|            |   HDMI    |                       |           |                 |
|  Source    |==========>|-->[Capturing] (17ms)  |           |   [Rendering]   |
| 1920x1080  |   Cable   |        |              |           |        ^        |
|    60Hz    |           |        V              |           |        |        |
|            |           |   [Encoding]  (13ms)  |           |   [Buffering]   |
+------------+           |        |              |           |        ^        |
                         |        V      (~0ms)  |  Network  |        |        |
                         |   [Queuing]---------->|==========>|-->[Assembling]  |
                         |                       |           |                 |
                         +-----------------------+           +-----------------+
```

Let's go through the stages.

### 1. Host

The host generates an image in the video memory to send it to a physical monitor. This time is very negligible. Next, the host takes this image and converts it into a video signal, which is usually sent to the monitor. PiKVM pretends to be a real monitor and provides a set of supported display resolutions and refresh rates (frequencies) measured in Hz for the host to use. The host selects the most appropriate mode to produce a signal to HDMI cable.

### 2. HDMI cable

The HDMI cable transmits the data at the frequency set by the operating system. Since it's not part of the PiKVM signal path, we do not account for it either. Even if we did, a 1-meter cable adds approx. 5–10 nanoseconds of delay. That's also a negligible amount of latency.

### 3. PiKVM

Inside PiKVM, the latency accumulates in three stages: capturing, encoding, and queuing. The data transfer between them takes almost zero time due to the use of DMA or a small amount of already compressed video data.

### 3.1 Capturing

This is where we start measuring latency.

A display refresh rate of 60Hz means that 60 frames per second are sent over the HDMI cable. So it takes `1s / 60 = 0.017s` or 17ms from the beginning to the end of frame. For 24-bit RGB 1920x1080px video, this means that the HDMI cable should able to transmit approx 6MB of video data every 17ms.

Video capture on PiKVM is always the same as the host's frequency. However, it isn't possible to start processing the frame until it is fully received. [PiKVM V4](v4.md) can capture the 1080p signal at 60Hz, but [V3](v3.md) and DIY devices can handle only 50Hz. Thus:

- PiKVM V4: `1s / 60 = 17ms`
- PiKVM V3/DIY: `1s / 50 = 20ms`

In other words, the higher the frequency, the shorter the frame transmission time and the less the latency.

So, this is the first source of the latency: **17ms for 1080p 60Hz video**.

### 3.2. Encoding

PiKVM sends the captured frame to the hardware H.264 encoder. There is no special magic happening here. Encoding can happen with or without boost:

- With boost: 13ms to encode 60 frames per second for 1080p.
- Without boost: 20ms to encode 30 frames per second for 1080p, every second frame is skipped.

Thus, with boost we can add another **13ms of encoding** to the total latency. That's 30ms total at this stage.

### 3.3. Queuing

The encoded frames are transmitted to the WebRTC server, split into RTP video packets along with meta information and suggestions about browser settings, and sent over the network as soon as possible.

Own latency at this stage is **less than 1ms**, so still approximately 30ms total so far.

### 4. Network

The general rule of thumb here is that the smaller the frame size is, the faster it will be transmitted over the network. The size of each regular frame in PiKVM is only a few kilobytes,
so it all depends on the quality of the connection, geography, and the distance between the PiKVM and you. We cannot influence any of these things.

The encoding parameters that we use by default are optimal for a regular Internet connection. If you reduce the bit rate, you can gain some bandwidth and latency.

A local network adds **less than 1ms latency**. We are still in the 30ms territory here.

### 5. Browser

The browser assembles the WebRTC RTP stream, buffers it, and then renders the image. All modern browsers use Google's WebRTC stack, and it works almost equally fast. What makes the differences is which H.264 decoders the browser uses (hardware or software), which RTP extensions are implemented, and so on.

In our experience, Chrome or Chromium works best, followed by Safari and Firefox. Brave and other browsers don't always handle real-time streaming, despite the fact that they also could use the Blink or WebKit engine.

To achieve minimal delays, PiKVM uses some special RTP settings here to reduce buffering time to almost zero. However, the browser internals and rendering still add some latency.

Additionally, the physical rendering time of the frame that goes from the graphics card to the display works exactly the same as an HDMI cable to PiKVM (even if you use a laptop for browsing). The higher the refresh rate of your monitor, the lower the latency.

We can assume that **an average of 10-20ms is added here** for decoding and other things, depending on the client's display frequency.

-----
## Measuring the latency

There are two ways to measure latency:

1. A simple way using a browser. Gets you a realistic, but not 100% reliable estimation. Doesn't take the rendering time in the browser into account.
2. A more complex way using special equipment. Gets you accurate measurements.

### Browser-based method

The measurements performed using this method covers a full video processing chain starting from PiKVM capture and finishing in the browser, except the rendering on display. The starting point is the moment when the first byte of the HDMI frame enters the PiKVM video capture chip. This timestamp is saved, and then transmitted via WebRTC to the browser using the RTP extension [abs-capture-time](http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time). The browser extracts the time from the last received frame every second and outputs to the Web UI the difference between the current time and the timestamp.

When using this method, the clocks on the client computer with the browser and on the PiKVM must be precisely synchronized via NTP. Also we recommend to perform measurement in the local network, because when measured over the internet, the clock may be inaccurate due to divergence even with NTP.

Measurements are only possible in Chromium or Chrome because they have support for the required [abs-capture-time](http://www.webrtc.org/experiments/rtp-hdrext/abs-capture-time) extension.

If you use Linux, you can install [chrony](https://chrony-project.org/) for very accurate NTP synchronization. In our case, we used Chromium on Arch Linux, and the preparations were as follows:

```console
[root@localhost ~]# pacman -Syy
[root@localhost ~]# pacman -S chrony
[root@localhost ~]# systemctl stop systemd-timesyncd
[root@localhost ~]# systemctl start chronyd
```

Similar on PiKVM:

* Start from updating your device:

    {!_update_os.md!}

* Install and run `chrony`:

    ```console
    [root@pikvm ~]# pacman -Syy
    [root@pikvm ~]# pacman -S chrony
    [root@pikvm ~]# systemctl stop systemd-timesyncd
    [root@pikvm ~]# systemctl start chronyd
    ```

Ideally, you should use the same NTP servers on the client and on PiKVM. They can be configured in `/etc/chrony.conf`.

To take measurements, follow to PiKVM Web UI and add the `show_webrtc_latency=1` URL parameter like this: `https://pikvm/kvmd/?show_webrtc_latency=1`. Switch the video mode to WebRTC in the system menu if necessary. After establishing and stabilizing the connection, you will see the calculated delay in the stream window:

![Measured WebRTC Latency](latency/webrtc_latency.webp)

As already mentioned, the measured value does not include the rendering and display time on the physical display with the browser. For 60Hz, it will be +17ms, for 144Hz it will be +6ms. In both cases, you get a latency **around or less than 50ms**.

### Local screen-to-screen method

```
+------= Host =-----+           +--= PiKVM =--+           +-----= Monitor =-----+
| +-= Timer app =-+ |  HDMI IN  |             |  HDMI OUT |  +-= Timer app =-+  |
| |               | |==========>|             |==========>|  |               |  |
| |               | |  Cable 1  |             |  Cable 2  |  |               |  |
| +---------------+ |           |             |           |  +---------------+  |
| +-= Browser =-+   |           |             |           |  +-= Browser =-+    |
| |             |   |  Network  |             |           |  |             |    |
| |  PiKVM UI   |<--|<==========|             |           |  |  PiKVM UI   |    |
| |             |   |           |             |           |  |             |    |
| +-------------+   |           |             |           |  +-------------+    |
+-------------------+           +-------------+           +---------------------+
```

The best possible way to measure screen-to-screen latency is run a stopwatch that displays millisecond and take a screenshot of the base time source and the PiKVM preview of the same time source on one screen. The difference in captured time readings will be your latency.

For a stopwatch on Linux, you can use the Stopwatch application by Don Libes (NIST).
