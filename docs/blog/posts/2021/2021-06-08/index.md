---
title: "KVMD 2.83: Uploading large images"
date: 2021-06-08
slug: kvmd-2-83-uploading-large-images
description: >
    We improved the behavior of mass storage when uploading large images
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v2.83
comments: true
---

We have improved the behavior of mass storage when uploading large images.

<!-- more -->

Previously, the progress bar could be displayed incorrectly due to the features of different browsers (for example, chrome on some win 10), so now the download progress is calculated on the server side and transmitted to the client.

We also recently accelerated the uploading of images to Mass Storage by two to three times.

Work continues on the implementation of H264 and WebRTC. Presumably, the release will be within a week.

To update: 

```console
rw
pacman -Syu
reboot
```