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

    PiKVM has **30-50 milliseconds of total latency**, from capture to displaying, with the following conditions:

    * [PiKVM V4](v4.md) device
    * Resolution: 1920x1080 at 60Hz
    * WebRTC H.264 video mode (default)
    * H.264 kbps = 5000 (default)
    * [H.264 gop = 0](video.md) (default)
    * H.264 boost enabled
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

The encoded frames are transmitted to the WebRTC server, split into RTP video packets along with meta information and suggestions about browser settings and sent over the network as soon as possible.

Own latency at this stage is **less than 1ms**, so still approximately 30ms total so far.

### 4. Network

The general rule of thumb here is that the smaller the frame size is, the faster it will be transmitted over the network. The size of each regular frame in PiKVM is only a few kilobytes,
so it all depends on the quality of the connection, geography, distance between PiKVM and you. We cannot influence any of these things.

The encoding parameters that we use by default are optimal for "just a regular Internet connection". If you reduce the bit rate, you can gain some bandwidth and latency.

A local network adds **less than 1ms latency**. We are still in the 30ms territory here.

### 5. Browser

The browser assembles the WebRTC RTP stream, buffers it, and then renders the image. All modern browsers use Google's WebRTC stack, and it works almost equally fast. What makes the differences is which H.264 decoders the browser uses (hardware or software), which RTP extensions are implemented, and so on.

In our experience, Chrome or Chromium works best, followed by Safari and Firefox. Brave and other browsers don't always handle real-time streaming, despite the fact that they also could the Blink or WebKit engine.

To achieve minimal delays, PiKVM uses some special RTP settings here to reduce buffering time to almost zero. However, the browser internals and rendering still add some latency.

Additionally, the physical rendering time of the frame that goes from the graphics card to the display works exactly the same as an HDMI cable to PiKVM (even if you use a laptop for browsing). The higher the refresh rate of your monitor, the lower the latency.

We can assume that an **average of 10-20ms is added here** for decoding and other things, depending on the client's display frequency.


## Measurement the latency

There is a simple way using a browser that allows to estimate the latency without taking into account the rendering time in the browser, and a more complex way using special equipment to accurately measure the latency.

### Browser-based method

This method does not take into account the time it takes for the browser and the client computer to display the image received from the host. It takes into account everything that happens on PiKVM, the network and buffering and decoding in the browser.

Please note that outside the local network, measurement readings using this method may be false due to diverging clocks, even when using chrony.

To use this method, it is necessary that the clocks on PiKVM and the client computer with the browser are very precisely synchronized via NTP. To do this, we recommend using [chrony](https://chrony-project.org/). In case of Arch Linux on the client, you can easily install it (and do the same on PiKVM):

```console
# pacman -Syy
# pacman -S chrony
# systemctl stop systemd-networkd
# systemctl start chrony
```

Next, follow to PiKVM Web UI with Chrome or Chromium (other browsers can't handle RTP timings) and add a URL paramether `show_webrtc_latency=1` (like this: `https://pikvm/kvmd/?show_webrtc_latency=1`). Switch the video mode to WebRTC in the system menu if necessary. After establishing and stabilizing the connection, you will see the calculated delay in the stream window:

![Measured WebRTC Latency](latency/webrtc_latency.webp)

As already mentioned, the measured value does not include the rendering and display time on the physical display with the browser. For 60Hz it will be +17ms, for 144Hz it will be +6ms. In both cases, you get a latency **around or less than 50ms**.
