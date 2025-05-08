---
title: Overriding system settings
description: How to override PiKVM defaults the right way
---

PiKVM OS has various low-level settings you can customize: timeout for the `kvmd` daemon, default keymap for the emulated keyboard, scroll rate for VNC sessions, logs formatting, etc. To do that, you need to override default settings.

## How overrides work in PiKVM OS

Main default settings are stored in `/etc/kvmd/main.yaml`. However, you should **never edit that file**. To override these and other defaults, you need to edit `/etc/kvmd/override.yaml` instead.

PiKVM OS applies settings from `main.yaml` first and then applies anything it finds in `override.yaml`. This approach helps keeping defaults and customizations safely separate from each other.

## How `override.yaml` is structured

The `/etc/kvmd/override.yaml` file has YAML syntax. All configurations are stored as key-value pairs.

Consider this example:

```yaml
file: /etc/kvmd/ipmipasswd
```

Here, `file` is a key, or the name of a configuration entry, and `/etc/kvmd/ipmipasswd` is the value. Keys and values are separated by a semicolon.

YAML files can have nested key-value pairs:

```yaml
ipmi:
    auth:
        file: /etc/kvmd/ipmipasswd
```

To nest key-value pair correctly, **use four spaces** rather than tabulation for indentation.

There is no need to copy and paste an entire configuration tree of key-value pairs to change just one setting. For example, if you want to change just the `kvmd` timeout, you only need the `timeout` setting and its parent keys:

```yaml
vnc:
    kvmd:
        timeout: 7.0
```

Anything that start with `#` is considered a comment. This is useful when you need to document your customizations, e.g. write down the rationale for changing a particular default.

You can start new lines with comments if you need to write a longer explanation.

```yaml
# 2025-05-08: changed the default timeout to 7.0 after some troubleshooting.
vnc:
    kvmd:
        timeout: 7.0
```

You can also write inline comments like this:

```yaml
vnc:
    kvmd:
        timeout: 7.0 #this seems to work better
```

Let's practice changing a default setting by switching to a German keyboard map by default.

## Change file system access to read-write

For safety reasons, access to the file system of PiKVM OS is read-only by default. You need to temporarily change it to read-write to be able to save changes to the configuration file. To do it, use the `rw` command:

```sh
[root@pikvm ~]# rw
```

## Identify the configuration entry

Before you start editing, you need to find the setting you will need to override. Run `kvmd -m` to look up configuration entries you can redefine. This command will print the entire list. We need the `keymap` setting somewhere in the `kvmd` group:

![keymap in kvmd](kvmd-hid-keymap.png)

So, the correct hierarchy is `kvmd/hid/keymap`, and the path to keymaps is `/usr/share/kvmd/keymaps/`.

List all keymaps in that directory:

```sh
[root@pikvm ~]# ls /usr/share/kvmd/keymaps/
ar    cz  de     en-gb  en-us-altgr-intl  es  fi  fr     fr-ca  hr  is  ja  lv  nl  pl  pt-br  sl  th
bepo  da  de-ch  en-us  en-us-colemak     et  fo  fr-be  fr-ch  hu  it  lt  mk  no  pt  ru     sv  tr
```

You will need `de`, which is a two-letter code for German.

## Edit `override.yaml`

Now, let's open `override.yaml` for editing. PiKVM ships with both `nano` and `vim`. We generally recommend `nano` over `vim` for new users:

```sh
[root@pikvm ~]# nano /etc/kvmd/override.yaml
```

`nano` has a console user interface, so it displays the text file right in the terminal window:

![override.yaml in nano](nano-start.png)

Scroll down to the bottom of the file (use **Ctrl+End**, **PageDown**, or **ArrowDown** keys). Type this:

```yaml
kvmd:
    hid:
        keymap: /usr/share/kvmd/keymaps/de
```

Don't forget to indent each child key with four spaces.

## Save the file

Now, you need to save the configuration file and exit. Nano displays hints on the most important keyboard shortcuts at the bottom of its window.

![Save and exit](save-exit.png)

`^` stands for **Ctrl** on Windows and Linux, and for **Cmd** on macOS. `M` stands for **Alt**.

Press **Ctrl+O** to save the configuration file and then **Ctrl+X** to quit nano.

## Validate the configuration

Before attempting to make your changes take effect, you should always validate `override.yaml`. To do that, run `kvmd -m`. If there are any syntax errors, `kvmd` will complain about them.

For example, if you accidentally used a semicolon instead of a colon between the key and the value like this:

```yaml
keymap; /usr/share/kvmd/keymaps/de
```

`kvmd -m` will display this message instead of outputting all configuration entries:

```
ConfigError: The node 'vnc' must be a dictionary
```

If you see any errors in the output, fix them, and run `kvmd -m` again to verify that the error is gone.

Note that `kvmd -m` does not validate configuration entries for correct key names. So if your changes don't work, that's #1 thing to check for when troubleshooting.

## Change access to read-only

Before you go to the next step, change the file system access mode to read-only. To do that, run the `ro` command:

```sh
[root@pikvm kvmd-webterm]# ro
```

## Reboot your PiKVM

There's close to a dozen various system daemons that depend on configuration settings. The easiest way to apply your changes is to simply reboot your PiKVM:

```sh
[root@pikvm ~]# reboot
```

Once the device restarts, you changes take effect.