---
title: "KVMD 3.206: NFS storage for virtual media"
date: 2023-03-21
slug: kvmd-3-206-nfs-storage-for-virtual-media
description: >
    This is a performance update that affects the mouse events protocol
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - uStreamer release: https://github.com/pikvm/kvmd/releases/tag/v3.206
comments: true
---

Now you can create NFS share for a common images storage for your PiKVMs fleet. The images will be available on all devices.

<!-- more -->

Here is the documentation for the new feature: https://docs.pikvm.org/msd/#nfs-storage

This release also comes with Mass Storage Device API (`/api/msd` and  and WebSocket event `msd_state`) changes required for NFS support:

- Removed the `features` field. The flags in it don't make sense since we dropped relay msd a year ago (does anyone even know what it is?)
- Removed the `storage.free` and `storage.size` fields. Instead, use `storage.parts[""].free` and `storage.parts[""].size`. The new mechanism provides MSD placement on several local/NFS partitions at the same time. `""` means the default partition.
- Removed the `storage.images[...].name` field. Use the object key instead. 

For those who use only Web UI or VNC, nothing changes.

To update:

```console
rw
pacman -Syu
reboot
```
