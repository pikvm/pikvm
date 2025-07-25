---
title: "KVMD 1.65: VNC improvements and new API"
date: 2020-06-01
slug: kvmd-1-65-vnc-improvements-and-new-api
description: >
    What time is it? Release time! Meet the new version of KVMD: 1.65
categories:
    - Releases
authors:
    - mdevaev
links:
    - PiKVM: https://pikvm.org
    - Discord: https://discord.gg/bpmXfz5
    - KVMD release: https://github.com/pikvm/kvmd/releases/tag/v1.65
comments: true
---

What time is it? Release time! Meet the new version of KVMD: 1.65

<!-- more -->

- If you haven't updated to previous intermediate builds, this release will provide many VNC improvements: for example, you can now insert text from the client to the server. In addition, we fixed an annoying bug related to interrupting the broadcast when it is impossible to resume it without restarting the server.

- A new API was added for inserting text with the ability to select the keyboard layout of the target computer. For example: `curl -k -X POST -H 'Content-Type: text/plain' -H 'X-KVMD-User: admin' -H 'X-KVMD-Passwd: admin' --data "some text" https://pikvm/api/hid/print?keymap=en-us`. To get a list of supported layouts, use `/api/hid/keymaps`. You can change the default layout in the settings using `/etc/kvmd/override.yaml` like this:

```yaml
kvmd:
    hid:
        keymap: /usr/share/kvmd/keymaps/en-gb
```

This does not currently affect the virtual keyboard in the web interface, but this issue will be resolved in the future. Also please note that language switching is not supported yet.

- Extended API for getting screenshots and previewing screenshots: /api/streamer/snapshot. The last screenshot can be saved in the memory of the KVM. Unfortunately, we have not yet reached the stage of drawing up detailed documentation, so you can find the full list of parameters in the sources: https://github.com/pikvm/kvmd/blob/master/kvmd/apps/kvmd/api/streamer.py#L57

- A large refactoring of internal libraries has been carried out, so that now it is easier to add an alternative protocol for communication with KVM, such as RDP.

- Work has been carried out to improve security. No vulnerabilities were found in the process, but the added additional checks will help me avoid them in the future.

And this is the first release in which I included a list of all those who decided to support the Pi-KVM project. Just as I promised. Thank you again to all these kind people. You make the world of open source a better place and help me survive 😄

To update use `rw; pacman -Syu; reboot`. If pacman will report a problem with kernel dependencies, you will need to add them to `IgnorePkg` in `/etc/pacman.conf`. Find the IgnorePkg string, uncomment it, and add two packages that pacman swore at, like `IgnorePkg = linux-raspberrypi linux-raspberrypi-headers` for zero or `IgnorePkg = linux-raspberrypi4 linux-raspberrypi4-headers`. After that re-run `pacman -Syu` again and reboot.