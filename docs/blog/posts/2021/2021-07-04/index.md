---
title: "KVMD 3.7 + Some V3 news"
date: 2021-07-04
slug: kvmd-3-7-some-v3-news
description: >
    This release comes with several improvements, we also have some V3 news for you
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v3.7
comments: true
---

This release comes with several improvements, we also have some V3 news for you.

<!-- more -->

- Now the video mode is saved in the browser. If you have chosen WebRTC by default, then it will remain the same for this browser.

- The Yen key in the Japanese keyboard now works.

- Added a link to the configuration documentation and possible problems with WebRTC (right next to the mode switch).

- The OS images on the site will be updated in the near future. Now the size of rootfs has been increased from 4 to 6 gigabytes to avoid problems with updates. The size of the partition in old images on already installed OS will not be increased.

To update:

```console
rw
pacman -Syu
reboot 
```

As for the first batch of v3: it was delayed at russian customs. Let's wish health to these wonderful people. I'll deal with it. Btw the second batch is planned for September. There will be no such problems with this since it will be produced in China. 