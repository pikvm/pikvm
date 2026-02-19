---
title: Latency in KVM systems
description: What is a KVM latency, where does it come from, and how to measure it
---

# Brief description

When you move your mouse in PiKVM, you can see how the remote cursor lags behind the local one (which is indicated by a blue dot).
So, this is a *latency* - the delay between your keyboard/mouse input and the remote host's response to the video.

!!! tip "Our latency measurements"

    PiKVM has **33-40 milliseconds in total** (from capture to displaying) with the following conditions:

    * [PiKVM V4](v4.md) device
    * Resolution: 1920x1080 at 60Hz
    * WebRTC H.264 video mode (default)
    * H.264 kbps = 5000 (default)
    * [H.264 gop = 0](video.md) (default)
    * H.264 boost enabled
    * Access via a local network or good internet connection

    Currently, **PiKVM offers a proven lowest end-to-end latency** among all other KVM over IP available on the market.

Next, we'll look at what these numbers are made up of and how to take measurements yourself to compare with our results.


-----
# Video pipeline

PiKVM works with the physical world: it captures video from a cable, encodes it, and sends it to your browser over a network.

```
+--= Host =--+           +-------= PiKVM =-------+           +---= Browser =---+
|            |   HDMI    |                       |           |                 |
|  Source    |==========>|-->[Capturing] (17ms)  |           |   [Rendering]   |
| 1920x1080  |   Cable   |        |              |           |       ^         |
|    60Hz    |           |        V              |           |       |         |
|            |           |   [Encoding]  (13ms)  |           |   [Buffering]   |
+------------+           |        |              |           |       ^         |
                         |        V      (~0ms)  |  Network  |       |         |
                         |   [Queuing]---------->|==========>|-->[Assembling]  |
                         |                       |           |                 |
                         +-----------------------+           +-----------------+
```

Let's go through the stages.


### Host stage

A remote host generates a video, which is usually sent to the monitor (but now we have PiKVM, and this is no different here).
1920x1080 at 60Hz means that frames are sent over the cable 60 times per second.
For 24-bit RGB video, each frame is almost 6 megabytes in size, and all these frames follow each other without notable gaps.

It takes `1s / 60 = 0.017s` or 17ms from the beginning to the end of frame.


### PiKVM Stage

A lot of magic happens inside PiKVM, and the latency accumulates in three stages.
Data transfer between them takes negligible time due to the use of DMA or a small amount of already compressed video data.

#### Capturing

Video capture in PiKVM always runs on the host frequency.
However, it is not possible to start processing the frame until it is fully received.
[PiKVM V4](v4.md) is able to capture 1080p 60Hz, but [V3](v3.md) and DIY devices can handle only 50Hz,
so this minimum latency will be 20ms for them.

The higher the frequency, the shorter the frame transmission time and the less the latency.
So, this is the first source of the latency: **17ms for 1080p 60Hz video**.

#### Encoding

The captured frame is sent to the hardware encoder H.264.
Nothing special happens here, and this stage takes 13ms with boost and about 20ms without boost.
With boost, PiKVM is able to encode 60 frames per second for 1080p, without boost only 30 and every second frame is skipped.

With boost we can add another **13ms of encoding** to the total latency.

#### Queuing

The encoded frames are transmitted to the WebRTC server, split into RTP video packets
provided with meta information and suggestions about browser settings
and sent over the network as soon as possible.

Own latency at this stage **less than 1ms**.


### Network stage

Everything is simple here: the smaller the frame size, the faster it will be transmitted over the network.
The size of each regular frame in PiKVM is only a few kilobytes,
so it all depends on the quality of the connection, geography,
distance between PiKVM and you - we cannot influence these things.

The encoding parameters that we use by default are optimal for "just a regular internet connection."
If you reduce the bitrate, you can gain some bandwidth and latency.

A local network add **less than 1ms latency here**.


### Browser stage

The browser assembles the WebRTC RTP stream, buffers it, and then renders the image.
All modern browsers use Google's WebRTC stack, and it works almost equally fast.
The differences are which H.264 decoders the browser uses (hardware or software), which RTP extensions are implemented, and so on.
In our experience, Chrome or Chromium works best, followed by Safari and Firefox.
Brave and other browsers don't always handle real-time streaming, despite the fact that they also could the Blink or WebKit engine.

To achieve minimal delays, PiKVM uses some special RTP settings here to reduce buffering time to almost zero.

However, the browser internals and rendering still add some latency.
Plus, the physical rendering time of the frame that goes from the graphics card to the display
works exactly the same as an HDMI cable to PiKVM (even if you use a laptop for browsing).
The higher the refresh rate of your monitor, the lower the latency.

We can assume that an **average of 10ms is added here** for decoding and other things.
