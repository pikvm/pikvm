---
title: "KVMD 1.102: Improvement for the HDMI USB dongle"
date: 2020-09-18
slug: kvmd-1-102-improvement-for-the-hdmi-usb-dongle
description: >
    The new version features further work on libgpiod and an improvement for the HDMI USB dongle
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.102
comments: true
---

The new version features further work on libgpiod and an improvement for the HDMI USB dongle.

<!-- more -->

* Continue working with libgpiod. It turned out that I didn't use the correct symbolic names for the IO ports. This does not affect the operation, but the kernel warns that it does not like it. Fixed in the this version. If you are interested in more details, then we are talking about the fact that libgpiod allows you to view active ports using the gpioinfo command:

```
gpiochip0 - 54 lines:
... 
        line  20:     "GPIO20"       unused   input  active-high 
        line  21:     "GPIO21"       unused   input  active-high 
        line  22:     "GPIO22" "kvmd::atx-gpio::leds" input active-high [used]
        line  23:     "GPIO23" "kvmd::atx-gpio::power_switch" output active-high [used]
        line  24:     "GPIO24" "kvmd::atx-gpio::leds" input active-high [used]
...
```

I used names like kvmd/foo/bar, but the correct names are `kvmd::foo::bar`.

* Slight improvement for the HDMI USB dongle. Now you can always keep the stream active, regardless of whether you have a browser or VNC open. This may be necessary because the server recognizes the dongle only when it is actually streaming. If not, the video card does not see the dongle. I'm not sure if this is the case with all dongles, but the one I have behaves exactly like this.

To include the everlasting stream use file `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    streamer:
        forever: true
```

To reduce power consumption and CPU usage, you can use the `--slowdown` option for ustremaer (rewrite the cmd section from `main.yaml` and add a line with the option).