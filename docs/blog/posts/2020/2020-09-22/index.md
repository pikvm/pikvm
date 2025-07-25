---
title: "We need help testing uStreamer"
date: 2020-09-22
slug: we-need-help-testing-ustreamer
description: >
    I need the community's help in testing the new version of ustreamer (the video server of Pi-KVM)
categories:
    - Development
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
comments: true
---

I need the community's help in testing the new version of ustreamer (the video server of Pi-KVM).

<!-- more -->

I found that some drivers for capture devices and cameras contain a bug that causes video buffers that are already used by the application to be given to it twice from the queue (TL;DR kernel magic). This can potentially corrupt memory, at least the part of it where the image is contained.

I investigated this issue and added code to ustreamer that prevents access to such a memory area. Now I want to know if our video capture devices (CSI bridge and USB dongle) are really affected by this problem. And if so, how often does this occur?

Therefore, I need the maximum cooperation of all users. You don't need to conduct comprehensive testing, just need to check your case. If you find the time to help me, you need to install ustreamer from source. This is very easy to do.

```console
# rw
# mv /usr/bin/ustremer /usr/local/bin/ustreamer.bak
# git clone https://github.com/pikvm/ustreamer
# cd ustreamer
# make -j5 WITH_OMX=1
# make PREFIX=/usr install
# ro
```

After that reboot Pi-KVM (or just restart stream using web ui system menu).

If a memory problem occurs, ustreamer will quickly restart the video. In other words, you will see the NO SIGNAL message for a couple of seconds (or a gray screen). This situation will be reflected in the log with a message V4L2 error: grabbed device buffer is already used. It is useful to check the presence of this entry in the log every few hours using the command journalctl -u kvmd | grep 'grabbed device'.

Depending on whether this problem occurs and how often, I will look for some other solution for it, or keep the current one if it doing well.

If the problem suddenly appears and prevents you from working, please let me know and restore the old ustreamer: mv /usr/local/bin/ustreamer.bak /usr/bin/ustreamer.

Thank you to everyone who responds!