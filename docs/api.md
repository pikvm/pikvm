---
title: HTTP API reference
description: Documentation for all functions of PiKVM microservices exposed via RESTful APIs
---

This document describes the PiKVM API. Since the system consists of microservices, here is a common API with a common entry point provided by Nginx. The below examples use `curl` and [`websocat`](https://github.com/vi/websocat) with the `-k` option disables SSL certificate verification, since the self-signed certificates are used in the default installation.

There is a [third-party library](https://github.com/guanana/pikvm-lib) for using the PiKVM API. Please note that this is an unofficial library, so use it carefully.

-----
## Authentication

All APIs are restricted to authentication. To make requests, you either need to auth each request individually, or get a token and pass it as a cookie with each request.

With enabled [2FA](auth.md#two-factor-authentication), you will need to add the one-time code to the password without spaces. That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password.

The code can be generated using any TOTP library, for example in Python:

```python
import requests
import pyotp

user = "admin"
passwd = "admin"
secret = "3OBBOGSJRYRBZH35PGXURM4CMWTH3WSU"  # Can be found in /etc/kvmd/totp.secret

print(requests.get(
    url="https://pikvm/api/info",
    verify=False,  # For self-signed SSL certificate
    headers={
        "X-KVMD-User": user,
        "X-KVMD-Passwd": passwd + pyotp.TOTP(secret).now(),
    },
).text)
```

Since in the borderline case of the 2FA code lifetime, the code may be invalid,
it makes sense to either handle error 403 by repeating the request in seconds.

A more correct way is to combine this method and check the remaining lifetime
and postpone the request if there is a second or so left. You can find out how much
time is left in this way:

```python
totp = pyotp.TOTP(secret)
now = int(time.time())
remaining = now - (now % totp.interval)
```

### Single-request authentication

There are two options here:

* **Using X-headers.** Just pass `X-KVMD-User` and `X-KVMD-Passwd` with the request:

    ```
    $ curl -k -H X-KVMD-User:admin -H X-KVMD-Passwd:admin https://<pikvm-ip>/api/auth/check
    ```

* **Using HTTP Basic Auth.** Please note: contrary to the standard, this method DOES NOT use the `WWW-Authenticate` header. HTTP Basic Auth in this implementation is intended only for compatibility with other systems, such as [Prometheus](prometheus.md).

    ```console
    $ curl -k -u admin:admin https://<pikvm-ip>/api/auth/check
    ```

### Session-based cookie auth

1. Get the access token for the user using `POST /api/auth/login`:

    ```console
    $ curl -k -v -X POST --data user=admin --data passwd=admin https://pikvm/api/auth/login
    ...
    < Set-Cookie: auth_token=796cb83b11de4fcb749bc1bad14a91fb06dede84672b2f847fef1e988e6900de; Path=/
    ...
    ```

    On success the cookie `auth_token` will be received with `200 OK`. On invalid user or password you will get `403 Forbidden`.

2. The handle `GET /api/auth/check` can be used for check the auth status. Return of `200 OK` will signal that user is authenticated. If the token or any of the single-request auth methods are missing, `401 Unauthorized` will be returned. In case of incorrect credentials or token, `403 Forbidden` will be returned.

3. The handle `POST /api/auth/logout` can be used to invalidate session token. The response codes will be similar to the previous handle.


### Session-based login using HTML form

You can submit PiKVM credentials from another site and go directly to the KVM page by passing the redirect parameter as follows:

```html
<html>
<body>
    <form method="POST" action="https://pikvm/api/auth/login">
        <input name="user" value="admin">
        <input name="passwd" value="admin">
        <input name="expire" value="0">
        <input name="redirect" value="/kvm/"> <!-- Available since KVMD 4.108 -->
        <button type="submit">Open PiKVM</button>
    </form>
</body>
<html>
```


-----
## WebSocket events

Most of the data during the user's work with PiKVM is transmitted over WebSocket. This includes mouse events, keyboard input, and changing the state of the various subsystems (such as ATX and Mass Storage Drive). Each event type will be described in the corresponding paragraph for its component. When connecting via WebSocket, the client receives current states as separate events. Then, as the states change, it will receive new events.

In a normal situation, opening a socket session triggers the video streamer to start. The streamer works as long as there is at least one client connected via WebSocket. After the last connection is closed and the client timeout expires, the streamer will also be terminated.

It is possible create a session that will not start the streamer and will not be counted when counting clients to stop the streamer. To do this, use the URL parameter `stream=0`:

```console
$ websocat -k wss://<pikvm-ip>/api/ws?stream=0 -H X-KVMD-User:admin -H X-KVMD-Passwd:admin
```

??? example "Output with initial events"
    ```js
    {"event_type": "gpio_model_state", "event": {"scheme": {"inputs": {"led1": {"hw": {"driver": "__gpio__", "pin": 19}}, "led2": {"hw": {"driver": "__gpio__", "pin": 16}}}, "outputs": {"button1": {"switch": false, "pulse": {"delay": 0.1, "min_delay": 0.1, "max_delay": 0.1}, "hw": {"driver": "__gpio__", "pin": 26}}, "button2": {"switch": false, "pulse": {"delay": 0.1, "min_delay": 0.1, "max_delay": 0.1}, "hw": {"driver": "__gpio__", "pin": 20}}, "relay1": {"switch": true, "pulse": {"delay": 0.1, "min_delay": 0.1, "max_delay": 0.1}, "hw": {"driver": "relay", "pin": 0}}, "relay2": {"switch": true, "pulse": {"delay": 2.0, "min_delay": 0.1, "max_delay": 5.0}, "hw": {"driver": "relay", "pin": 1}}}}, "view": {"header": {"title": "Switches"}, "table": [[{"type": "label", "text": "Generic GPIO leds"}], null, [{"type": "label", "text": "Test 1:"}, {"type": "input", "channel": "led1", "color": "green"}, {"type": "output", "channel": "button1", "text": "Click"}], [{"type": "label", "text": "Test 2:"}, {"type": "input", "channel": "led2", "color": "green"}, {"type": "output", "channel": "button2", "text": "Click"}], null, [{"type": "label", "text": "HID Relays /dev/hidraw0"}], null, [{"type": "label", "text": "Relay #1:"}, {"type": "output", "channel": "relay1", "text": "Boop 0.1"}], [{"type": "label", "text": "Relay #2:"}, {"type": "output", "channel": "relay2", "text": "Boop 2.0"}]]}}}
    {"event_type": "info_extras_state", "event": {"vnc": {"name": "VNC", "description": "Show VNC information", "icon": "share/svg/vnc.svg", "path": "vnc", "keyboard_cap": false, "daemon": "kvmd-vnc", "port": 5900, "place": 20, "enabled": true}, "ipmi": {"name": "IPMI", "description": "Show IPMI information", "icon": "share/svg/ipmi.svg", "path": "ipmi", "keyboard_cap": false, "daemon": "kvmd-ipmi", "port": 623, "place": 21, "enabled": true}}}
    {"event_type": "info_hw_state", "event": {"platform": {"type": "rpi", "base": "Virtual Raspberry Pi"}, "health": {"temp": {"cpu": 36.511, "gpu": 35.0}, "throttling": {"raw_flags": 0, "parsed_flags": {"undervoltage": {"now": false, "past": false}, "freq_capped": {"now": false, "past": false}, "throttled": {"now": false, "past": false}}}}}}
    {"event_type": "info_meta_state", "event": {"server": {"host": "localhost.localdomain"}, "kvm": {}}}
    {"event_type": "info_system_state", "event": {"kvmd": {"version": "1.102"}, "streamer": {"app": "ustreamer", "version": "1.25", "features": {"WITH_OMX": false, "WITH_GPIO": false, "WITH_PTHREAD_NP": true, "WITH_SETPROCTITLE": true, "HAS_PDEATHSIG": true}}, "kernel": {"system": "Linux", "release": "5.8.10-arch1-1", "version": "#1 SMP PREEMPT Thu, 17 Sep 2020 18:01:06 +0000", "machine": "x86_64"}}}
    {"event_type": "wol_state", "event": {"enabled": false, "target": {"ip": "255.255.255.255", "port": 9, "mac": ""}}}
    {"event_type": "gpio_state", "event": {"inputs": {"led1": {"online": true, "state": false}, "led2": {"online": true, "state": false}}, "outputs": {"button1": {"online": true, "state": false, "busy": false}, "button2": {"online": true, "state": false, "busy": false}, "relay1": {"online": false, "state": false, "busy": false}, "relay2": {"online": false, "state": false, "busy": false}}}}
    {"event_type": "hid_state", "event": {"online": true, "keyboard": {"online": true, "leds": {"caps": false, "scroll": false, "num": false}}, "mouse": {"online": true}}}
    {"event_type": "atx_state", "event": {"enabled": true, "busy": false, "leds": {"power": false, "hdd": false}}}
    {"event_type": "msd_state", "event": {"enabled": true, "online": true, "busy": false, "storage": {"size": 234950152192, "free": 23514271744, "images": {}, "uploading": false}, "drive": {"image": null, "connected": false, "cdrom": true}, "features": {"multi": true, "cdrom": true}}}
    {"event_type": "streamer_state", "event": {"limits": {"max_fps": 40}, "params": {"desired_fps": 30, "quality": 80}, "snapshot": {"saved": null}, "streamer": null, "features": {"quality": true, "resolution": false}}}
    {"event_type": "loop", "event": {}}
    ```

After connecting the client receives a bundle of states of all KVMD subsystems. After the batch is completed, it sends a `loop` event, which means that the websocket has entered event loop mode. Now it will send new states and respond to client's requests.

Another type of event is `ping`, which can be sent by the client: `{"event_type": "ping", "event": {}}`. If the server is running, it will respond with pong: `{"event_type": "pong", "event": {}}`.

??? example "Sending key events using Python"
    For keypresses, set `event_type` to `key` and fill in the `event` structure with `key` and `state`, where `key` is the key from mapping and `state` is boolean that determines if the key is pressed or released: 

    ```python
    # python, install websocket-client
    import websocket
    import ssl, time
    uri = "wss://10.0.0.7/api/ws?stream=0"
    headers = {"X-KVMD-User": "admin", "X-KVMD-Passwd": "admin"}
    ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})
    ws.connect(uri, header=headers)
    # Key codes: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
    ws.send('{"event_type": "key", "event": {"key": "Enter", "state": true}}')
    time.sleep(0.05)
    ws.send('{"event_type": "key", "event": {"key": "Enter", "state": false}}')
    ws.close()
    ```

-----
## System functions

### Get system info

**Method**: `GET`

**Route**: `/api/info`

**Description**: Returns the general information about the PiKVM device.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `fields` | string | optional | Return only specified categories | `auth`, `extras`, `fan`, `hw`, `meta`, `system` |

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/info?fields=hw
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "hw": {
                "health": {
                    "cpu": {
                        "percent": 2
                    },
                    "mem": {
                        "available": 1568993280,
                        "percent": 14.6,
                        "total": 1836331008
                    },
                    "temp": {
                        "cpu": 45.277
                    },
                    "throttling": {
                        "ignore_past": false,
                        "parsed_flags": {
                            "freq_capped": {
                                "now": false,
                                "past": false
                            },
                            "throttled": {
                                "now": false,
                                "past": false
                            },
                            "undervoltage": {
                                "now": false,
                                "past": false
                            }
                        },
                        "raw_flags": 0
                    }
                },
                "platform": {
                    "base": "Raspberry Pi 4 Model B Rev 1.5",
                    "board": "rpi4",
                    "model": "v3",
                    "serial": "10000000C8DA432D",
                    "type": "rpi",
                    "video": "hdmi"
                }
            }
        }
    }⏎  
    ```

Each category is represented by its own event in the websocket (`info_hw_state`, `info_system_state`, etc). The event content has the same format as the category content in the API.

### Get system log

**Method**: `GET`

**Route**: `/api/log`

**Description**: Displays logs from all KVMD services as plain text.

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `follow` | boolean | optional | Turns the request into long-polling mode and follow log messages in real time | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `seek` | integer | optional | Runs the log for the specified time in seconds | `≥0` |

**Example of use**: the following query returns commit messages for the last 1 hour and enables the long-polling mode:

```console
$ curl -k -u admin:admin 'https://<pikvm-ip>/api/log?follow=1&seek=3600'
```

??? note "Example output"
    ```
    [2025-06-10 22:38:07 kvmd.service] --- kvmd.apps.kvmd.auth               INFO --- Authorized user 'admin' via auth service 'htpasswd'
    [2025-06-10 22:38:15 kvmd.service] --- kvmd.apps.kvmd.auth               INFO --- Authorized user 'admin' via auth service 'htpasswd'
    ```

-----
## HID

The PiKVM HID (Human Interface Device) API provides remote control capabilities for keyboard and mouse input devices. It allows users to perform the following operations:

- Get the device state and set/reset parameters.
- Send keyboard shortcuts and text to be typed in the host system.
- Send various mouse events: move to absolute coordinates and relatively, click virtual mouse buttons, and scroll the virtual mouse wheel.

### Get devices state

**Method**: `GET`

**Route**: `/api/hid`

**Description**: Gets the current HID devices state.

**Query parameters**: none.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/hid
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "busy": false,
            "connected": null,
            "enabled": true,
            "jiggler": {
                "active": false,
                "enabled": true,
                "interval": 60
            },
            "keyboard": {
                "leds": {
                    "caps": false,
                    "num": false,
                    "scroll": false
                },
                "online": false,
                "outputs": {
                    "active": "",
                    "available": []
                }
            },
            "mouse": {
                "absolute": true,
                "online": false,
                "outputs": {
                    "active": "usb",
                    "available": [
                        "usb",
                        "usb_rel"
                    ]
                }
            },
            "online": true
        }
    }⏎
    ```

### Set parameters

**Method**: `POST`

**Route**: `/api/hid/set_params`

**Description**: Configures HID device parameters, such as the type of emulated keyboard and mouse.

**Query parameters**:

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `keyboard_output` | string | optional | Sets the type of the emulated keyboard | `usb`, `ps2`, `disabled` |
| `mouse_output` | string |  optional | Sets the type of the emulated mouse | `usb`, `usb_win98`, `usb_rel`, `ps2`, `disabled` |
| `jiggler` | boolean | optional | Enable/disable [mouse jiggler](mouse_jiggler.md) functionality | `true`

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/hid/set_params?jiggler=0
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎ 
    ```

### Set the connected state

**Method**: `POST`

**Route**: `/api/hid/set_connected`

**Description**: Sets the HID devices connection state.

**Query parameters**:

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `connected` | boolean | required | Sets the connection state | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/hid/set_connected?connected=0
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎ 
    ```

### Reset devices' state

**Method**: `POST`

**Route**: `/api/hid/reset`

**Description**: Resets HID devices to their initial state.

**Query parameters**: none

**Example of use**:

```console
$ curl -k -X POST -u admin:admin https://<pikvm-ip>/api/hid/reset
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Get keyboard layouts

**Method**: `GET`

**Route**: `/api/hid/keymaps`

**Description**: Gets available keyboard layouts and the current defaults for use with `POST /api/hid/print`.

**Query parameters**: none

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/hid/keymaps
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "keymaps": {
                "available": [
                    "ar",
                    "bepo",
                    "cz",
                    "da",
                    "de",
                    "de-ch",
                    "en-gb",
                    "en-us",
                    "en-us-altgr-intl",
                    "en-us-colemak",
                    "es",
                    "et",
                    "fi",
                    "fo",
                    "fr",
                    "fr-be",
                    "fr-ca",
                    "fr-ch",
                    "hr",
                    "hu",
                    "is",
                    "it",
                    "ja",
                    "lt",
                    "lv",
                    "mk",
                    "nl",
                    "no",
                    "pl",
                    "pt",
                    "pt-br",
                    "ru",
                    "sl",
                    "sv",
                    "th",
                    "tr"
                ],
                "default": "de"
            }
        }
    }⏎ 
    ```

### Type text remotely

**Method**: `POST`

**Route**: `/api/hid/print`

**Description**: Transmits user-defined text to emulate typing it on the PiKVM by sequencing key presses.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `limit` | integer | optional | Maximum characters to process | 0 = no limit. No maximum value. Default: 1024 |
| `keymap` | string | optional | Keymap to use (defaults to system default) | Any keymap listed in the output of `GET /hid/keymaps` |
| `slow` | boolean | optional | Enables slow typing mode (regular large intervals between key presses), `false` by default | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `delay` | float | optional | How many seconds to delay the transmission of keys by in the `slow` mode. Defaults to `0.02` when `slow` is enabled, otherwise defaults to `0` | `0..5.0` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    -d "Einige Worte" \
    https://<pikvm-ip>/api/hid/print?keymap=de
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎ 
    ```

### Send a keyboard shortcut

**Method**: `POST`

**Route**: `/api/hid/events/send_shortcut`

**Description**: Sends a keyboard shortcut, or key combination, to be typed on the PiKVM.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `keys` | string | required | Comma-separated list of key names | For a full list of supported values, please [see here](https://github.com/pikvm/kvmd/blob/master/keymap.csv). Use values from the `web_name` column |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/hid/events/send_shortcut?keys=ControlLeft,KeyL
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎
    ```

### Send a single key event

**Method**: `POST`

**Route**: `/api/hid/events/send_key`

**Description**: Transmits a command to emulate a single key press on the PiKVM.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `key` | string | required | Key identifier to send | For a full list of supported values, please [see here](https://github.com/pikvm/kvmd/blob/master/keymap.csv) |
| `state` | boolean | optional | Key state: `true` for press, `false` for release | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `finish` | boolean | optional | Releases non-modifier keys right after pressing them so that they don't get stuck when the connection is not stable. Defaults to `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/hid/events/send_key?key=Delete
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎
    ```

### Send mouse button events

**Method**: `POST`

**Route**: `/api/hid/events/send_mouse_button`

**Description**: Sends mouse button press/release events.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `button` | string | required | Mouse button identifier | `left`, `middle`, `right`, `up`, `down` |
| `state` | boolean | optional | Mouse button state: `true` for press, `false` for release | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/hid/events/send_mouse_button?button=left
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎
    ```

### Move the mouse pointer

**Method**: `POST`

**Route**: `/api/hid/events/send_mouse_move`

**Description**: Sends a command to move the mouse pointer to user-defined coordinates where 0,0 is the center of the screen. Only works if the mouse mode is set to `absolute` in the configuration.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `to_x` | integer | required | Target X coordinate | Any negative or positive integer value |
| `to_y` | integer | required | Target Y coordinate | Any negative or positive integer value |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/hid/send_mouse_move?to_x=0&to_y=50'
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎  
    ```

### Move the mouse pointer relatively

**Method**: `POST`

**Route**: `/api/hid/events/send_mouse_relative`

**Description**: Sends a command to move the mouse pointer by a relative offset in pixels. Only works if the mouse mode is set to `absolute` in the configuration.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `delta_x` | integer | required | Horizontal movement delta | Any negative or positive integer value |
| `delta_y` | integer | required | Vertical movement delta | Any negative or positive integer value |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/hid/send_mouse_relative?delta_x=20&delta_y=200'
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎  
    ```

### Send mouse wheel scroll events

**Method**: `POST`

**Route**: `/api/hid/events/send_mouse_wheel`

**Description**: Sends mouse wheel scroll events to be emulated on the host by PiKVM.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `delta_x` | integer | required | Horizontal scroll delta | Any negative or positive integer value |
| `delta_y` | integer | required | Vertical scroll delta | Any negative or positive integer value |

**Example of use**: Sends mouse wheel scroll events.

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/hid/send_mouse_wheel?delta_x=0&delta_y=200'
```

??? note "Example output"
    ```json
    {
    "ok": true,
    "result": {}
    }⏎  
    ```

-----
## ATX power management

The PiKVM ATX API provides control over ATX (Advanced Technology eXtended) power management functions. It allows users perform the following operations:

- Get the current ATX state.
- Change the ATX state.
- Send an ATX button press event.

### Get ATX state

**Method**: `GET`

**Route**: `/api/atx`

**Description**: Shows the current ATX state

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/atx
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "busy": false, // True if ATX is busy performing an operation and does not accept commands
            "enabled": true,
            "leds": {
                "hdd": false,
                "power": false
            }
        }
    }
    ```

### Set ATX power

**Method**: `POST`

**Route**: `/api/atx/power`

**Description**: Changes the ATX power state to desired.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `action` | string | optional | Specifies desired state | `on` - Turn on (do nothing in case PSU is already on). `off` - Turn off (aka soft-off), emulates click on the power button. `off_hard` - Perform long press on the power button (5+ seconds). `reset_hard` - Emulate pressing reset button (hardware hot reset) |
| `wait` | boolean | optional | Says if call should return immediately or just after finishing operation. | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/atx/power?action=on
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎
    ```

### Click ATX button

**Method**: `POST`

**Route**: `/api/atx/click`

**Description**: Sends the ATX button press event.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `button` | string | optional | Specifies the desired PC case button | `power` - Short click on the power button. `power_long` - Long press on the power button (5+ seconds). `reset` - Short click on the reset button. |
| `wait` | boolean | optional | Says if call should return immediately or just after finishing operation. | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/atx/click?button=power
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

-----
## Mass Storage Drive

The PiKVM Mass Storage Drive API provides controls for remote management of disk images that can be mounted as virtual storage devices. It allows users perform the following operations:

- Get current MSD status and configuration
- Upload, download, and delete disk images
- Fetch disk images directly from URLs with progress streaming
- Connect/disconnect virtual storages, enable CD-ROM and read-write modes
- Set image names, access modes, and device type settings

### Get MSD state

**Method**: `GET`

**Route**: `/api/msd`

**Description**: Retrieves the current state of the Mass Storage Device.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/msd
```

??? note "Example output"
    ``` json
    {
        "ok": true,
        "result": {
            "busy": false,
            "drive": {
                "cdrom": true,
                "connected": false,
                "image": null,
                "rw": false
            },
            "enabled": true,
            "online": true,
            "storage": {
                "downloading": null,
                "images": {},
                "parts": {
                    "": {
                        "free": 24358789120,
                        "size": 24375590912,
                        "writable": true
                    }
                },
                "uploading": null
            }
        }
    }⏎
    ```

### Upload MSD image

**Method**: `POST`

**Route**: `/api/msd/write`

**Description**: uploads an ISO to the Mass Storage Device.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `image` | string | required | Specifies the name of the image. Binary data should be passed to the POST body | `filename.iso` |

**Example of use**:

```console
$ # create a test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST --data-binary @test.iso -k \
    -u admin:admin \
    https://<pikvm-ip>/api/msd/write?image=test.iso
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Upload MSD image by URL

**Method**: `POST`

**Route**: `/api/msd/write_remote`

**Description**: Downloads an image from HTTP(S) URL to the MSD.

!!! note
    This is a long-polling request. Do not interrupt the request until the download is complete, otherwise the download will stop.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `url` | string | required | Image URL | Any URL using HTTP(S) |
| `image` | string | optional | Image name | Any alphanumeric name like `image321.iso` |
| `timeout` | integer | optional |  Remote request timeout, 10 seconds by default | `≥0` |

**Example of use**:

```console
$ # create test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST -k \
    -u admin:admin \
    https://<pikvm-ip>/api/msd/write_remote?url=http://example.com/test.iso
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Set MSD parameters

**Method**: `POST`

**Route**: `/api/msd/set_params`

**Description**: Changes the current image and/or set drive parameters.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `image` | string | optional | Change the current image | `filename.iso` |
| `cdrom` | boolean | optional | Change the media type to the CD-ROM or Flash. | `1` (CD-ROM) or `0` (Flash) |
| `rw` | boolean | optional | Sets read-write or read-only mode. Ignored (always read-only) when `cdrom=1` | `1` (read-write) or `0` (read-only) |

**Example of use**:

```console
$ curl -X POST -k \
    -u admin:admin \
    'https://<pikvm-ip>/api/msd/set_params?image=test.iso&cdrom=1'
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Control MSD

**Method**: `POST`

**Route**: `/api/msd/set_connected`

**Description**: Connects or disconnects the MSD to/from the host.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `connected` | boolean | required | Changes the state | `1` connects the MSD, `0` disconnects it |

**Example of use**:

```console
$ curl -X POST -k \
    -u admin:admin \
    https://<pikvm-ip>/api/msd/set_connected?connected=1
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Remove MSD image

**Method**: `POST`

**Route**: `/api/msd/remove`

**Description**: Removes the specified image.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `image` | string | required | Name of the image to remove | `filename.iso` |

**Example of use**:

```console
$ curl -X POST -k \
    -u admin:admin \
    https://<pikvm-ip>/api/msd/remove?image=test.iso
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

### Reset MSD

**Method**: `POST`

**Route**: `/api/msd/reset`

**Description**: Drops all the custom parameters you set before and resets the Mass Storage Device to its default state.

**Query parameters**: None.

**Example of use**:

```console
$ curl -X POST -k \
    -u admin:admin \
    https://<pikvm-ip>/api/msd/reset
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎   
    ```

-----
## GPIO

This is a PiKVP API for controlling User GPIO (General Purpose Input/Output) pins. It allows users perform the following operations:

- Read GPIO states.
- Switch pins on/off.
- Send pulses to GPIO channels.

### Get GPIO state

**Method**: `GET`

**Route**: `/api/gpio`

**Description**: Retrieves the current state of all GPIO channels.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/gpio
```

??? note "Example output"
    ``` json
    {
        "ok": true,
        "result": {
            "model": {
                "scheme": {
                    "inputs": {},
                    "outputs": {
                        "__v3_usb_breaker__": {
                            "hw": {
                                "driver": "__gpio__",
                                "pin": "5"
                            },
                            "pulse": {
                                "delay": 0.0,
                                "max_delay": 0.0,
                                "min_delay": 0.0
                            },
                            "switch": true
                        }
                    }
                },
                "view": {
                    "header": {
                        "title": [
                            {
                                "text": "GPIO",
                                "type": "label"
                            }
                        ]
                    },
                    "table": []
                }
            },
            "state": {
                "inputs": {},
                "outputs": {
                    "__v3_usb_breaker__": {
                        "busy": false,
                        "online": true,
                        "state": true
                    }
                }
            }
        }
    }⏎ 
    ```

### Switch GPIO channel

**Method**: `POST`

**Route**: `/gpio/switch`

**Description**: Sets a GPIO channel to a specific state (on/off).

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `channel` | string | required | The GPIO driver channel | Alphanumeric channel name, e.g., `__v3_usb_breaker__` |
| `state` | boolean | required | The new switch state | `1` to switch on, `0` to switch off |
| `wait` | boolean | optional | Defines when a call should return | `1` return immediately, `0` return after finishing operation |

**Example of use**:

```console
# Switch GPIO channel led1 to OFF state without waiting
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/gpio/switch?channel=led1&state=0&wait=0
```

??? note "Example output"
    ``` json
    {
        "ok": true,
        "result": {}
    }⏎
    ```

### Pulse GPIO channel

**Method**: `POST`

**Route**: `/api/gpio/pulse`

**Description**: Sends a pulse signal to a GPIO channel (briefly activates then deactivates). Only works for channels that support the pulse mode.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `channel` | string | required | The GPIO driver channel | Alphanumeric channel name, e.g., `led1` |
| `delay` | float | optional | The pulse time in seconds | Any float number, `0` for default delay |
| `wait` | boolean | optional | Defines when a call should return | `1` return immediately, `0` return after finishing operation |

**Example of use**:

```console
# Send a pulse to GPIO channel led1 with 2 sec delay without waiting
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/gpio/pulse?channel=led1&delay=2.0&wait=0'
```

??? note "Example output"
    ``` json
    {
        "ok": true,
        "result": {}
    }⏎
    ```

----
## Streamer

The PiKVM Streamer API provides remote access to video stream capture and management functionality of PiKVM devices. It allows users perform the following operations:

- Capture screenshots.
- Perform optical character recognition (OCR) on captured images.
- Monitor the streamer's operational status.

### Get streamer state

**Method**: `GET`

**Route**: `/api/streamer`

**Description**: Retrieves the current state of the streamer.

**Query parameters**: None

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/streamer
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "features": {
                "h264": true,
                "quality": true,
                "resolution": false
            },
            "limits": {
                "desired_fps": {
                    "max": 70,
                    "min": 0
                },
                "h264_bitrate": {
                    "max": 20000,
                    "min": 25
                },
                "h264_gop": {
                    "max": 60,
                    "min": 0
                }
            },
            "params": {
                "desired_fps": 40,
                "h264_bitrate": 5000,
                "h264_gop": 30,
                "quality": 80
            },
            "snapshot": {
                "saved": null
            },
            "streamer": {
                "encoder": {
                    "quality": 80,
                    "type": "M2M-IMAGE"
                },
                "h264": {
                    "bitrate": 5000,
                    "fps": 60,
                    "gop": 30,
                    "online": true
                },
                "instance_id": "",
                "sinks": {
                    "h264": {
                        "has_clients": true
                    },
                    "jpeg": {
                        "has_clients": false
                    }
                },
                "source": {
                    "captured_fps": 59,
                    "desired_fps": 40,
                    "online": true,
                    "resolution": {
                        "height": 720,
                        "width": 1280
                    }
                },
                "stream": {
                    "clients": 0,
                    "clients_stat": {},
                    "queued_fps": 0
                }
            }
        }
    }⏎  
    ```

### Take snapshot

**Method**: `GET`

**Route**: `/api/streamer/snapshot`

**Description**: Captures a snapshot from the video stream. Can optionally perform OCR text recognition or generate a preview image. For optical character recognition, the coordinates origin starts at top left.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `save` | boolean | optional | Whether to save the snapshot, default: `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `load` | boolean | optional | Whether to load an existing snapshot, default: `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `allow_offline` | boolean | optional | Whether to allow taking snapshots when offline, default: `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `ocr` | boolean | optional | Whether to perform OCR text recognition on the snapshot, default: `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `ocr_langs` | string | optional | Comma-separated list of language codes for OCR recognition | Typically, a 3-letter  code, such as `eng` for English or `deu` for German. Run `pacman -Ss tesseract-data` on PiKVM to get the full list |
| `ocr_left` | integer | optional | X coordinate of the top left corner of the OCR region, default: `-1` | `≥0` |
| `ocr_top` | integer | optional | Y coordinate of the top left corner of the OCR region, default: `-1` | `≥0` |
| `ocr_right` | integer | optional | Width of the OCR region, default: `-1` | `≥0` |
| `ocr_bottom` | integer | optional | Height of the OCR region, default: `-1` | `≥0` |
| `preview` | boolean | optional | Whether to generate a preview image, default: `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `preview_max_width` | integer | optional | Maximum width for preview image, default: `0` | Any positive integer value |
| `preview_max_height` | integer | optional | Maximum height for preview image, default: `0` | Any positive integer value |
| `preview_quality` | integer | optional | JPEG quality for preview (valid stream quality value), default: `80` | Any integer value in the 0..100 range |

**Example of use**: the following command will capture a snapshot of the current video stream and save it to a JPEG file.

```console
$ curl -k \
    -u admin:admin \
    'https://<pikvm-ip>/api/streamer/snapshot?save=1&preview_quality=95' \
    --output=file.jpg
```

??? note "Example output"
    ```console
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100  107k  100  107k    0     0   619k      0 --:--:-- --:--:-- --:--:--  619k
    ```

**Example of use**: the following command will capture a region of the current video stream (left corner starts at the top left, extends 1000px to the right and 150px to the bottom), run it through Tesseract for optical character recognition (language defined as English), and output the recognized text into the console.

```console
$ curl -k \
    -u admin:admin \
    'https://<pikvm-ip>/api/streamer/snapshot?ocr=true&ocr_left=0&ocr_top=0&ocr_right=1000&ocr_bottom=150&ocr_langs=eng'
```

**Responses**:

- When `ocr=true`:
    - Content-Type: `text/plain`
    - Body: Recognized text from the image
- When `preview=true` or default:
    - Content-Type: `image/jpeg`
    - Body: JPEG image data (either preview or full snapshot)
- When snapshot unavailable:
    - Status: 503 Service Unavailable
    - Error: UnavailableError

### Remove snapshot

**Method**: `DELETE`

**Route**: `/api/streamer/snapshot`

**Description**: Removes/deletes the current snapshot from memory.

**Query parameters**: None

**Example of use**:

```console
$ curl -k -X DELETE \
    -u admin:admin \
    https://<pikvm-ip>/api/streamer/snapshot
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {}
    }⏎ 
    ```

### Get OCR state

**Method**: GET

**Route**: `/api/streamer/ocr`

**Description**: Retrieves the current state and configuration of the optical character recognition (OCR) service.

**Query parameters**: None

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/streamer/ocr
```

??? note "Example output"
    ```json
    {
        "ok": true,
        "result": {
            "ocr": {
                "enabled": true,
                "langs": {
                    "available": [
                        "eng",
                        "osd"
                    ],
                    "default": [
                        "eng"
                    ]
                }
            }
        }
    }⏎
    ```

----
## Switch

The PiKVM Switch API provides handles to control the [PiKVM Switch](switch.md): get information, set active ports, and control beacons.

The API heavily relies on specifying ports on the PiKVM Switch. There are two ways to do that: with continuous numbering or with float numbers. Both options are equally valid and supported.

1. With continuous numbering, ports enumeration starts at 0 and ends at 19, because you can create up to 20 ports by adding more PiKVM Switch devices to the first Switch's downlink.
2. If you use a float value, the integer part specifies the number of the unit in the downlink, while the fractional part specifies the number of the port on that unit.

### Get Switch state

**Method**: `GET`

**Route**: `/api/switch`

**Description**: Returns the information about the PiKVM Switch state.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/switch
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set active port (previous)

**Method**: `POST`

**Route**: `/api/switch/set_active_prev`

**Description**: Switches to the previous active port.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/switch/set_active_prev
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set active port (next)

**Method**: `POST`

**Route**: `/api/switch/set_active_next`

**Description**: Switches to the next active port.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/switch/set_active_next
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set active port (specific)

**Method**: `POST`

**Route**: `/api/switch/set_active`

**Description**: Switches to a specific port.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `port` | float | required | Specifies the port number | Integer in the 0..19 range or float (0,0 through 4,3) |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/switch/set_active?port=2,2
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set beacon

**Method**: `POST`

**Route**: `/api/switch/set_beacon`

**Description**: Controls beacon lights on ports or uplink/downlink units.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `state` | boolean | required | Turn beacon on/off | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `port` | float | optional | Specify the port beacon | Integer in the 0..19 range or float (0,0 through 4,3) |
| `uplink` | integer | optional | Number of the uplink beacon, same as the port | Integer in the 0..19 range or float (0,0 through 4,3) |
| `downlink` | integer | optional | Number of the downlink beacon, same as the port | Integer in the 0..19 range or float (0,0 through 4,3) |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/switch/set_beacon
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set port parameters

**Method**: `POST`

**Route**: `/api/switch/set_port_params`

**Description**: Configures parameters for a specific port.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `port` | float | required | Specifies the port number | `0..19` |
| `edid_id` | string | optional | EDID identifier (allows default value) | Alphanumeric string like `ca3d7114-79ca-47fc-80b4-b80ac63fc329` |
| `dummy` | boolean | optional | When enabled, the switch will pretend the host has a display attached | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |
| `name` | string | optional | String port name, none set by default | Any combination of ASCII letters and numbers |
| `atx_click_power_delay` | float | optional | ATX power click delay value | `0..10` |
| `atx_click_power_long_delay` | float | optional | ATX long power click delay value | `0..10` |
| `atx_click_reset_delay` | float | optional | ATX reset click delay value | `0..10` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/set_port_params?port=2&name=PORT3'
```

??? note "Example output"
    ```json
    FIXME
    ```

### Set beacon color

**Method**: `POST`

**Route**: `/api/switch/set_colors`

**Description**: Sets the beacon color for the PiKVM Switch and all switches in the downlink (where applicable).

**Query parameters**:

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `beacon` | hex | required | Sets color, brightness, and blink interval (ms) | A valid hex value (see example below) |

**Example of use**: Let's set the beacon to be orange at 75% of full brightness, blinking with an interval of 40ms.

```console
$ curl -k -X POST \
    -u admin:admin \
    -d "FFA500:BF:0028" \
    https://<pikvm-ip>/api/switch/set_colors
```

??? note "Example output"
    ```json
    FIXME
    ```

### Reboot the device

**Method**: `POST`

**Route**: `/api/switch/reset`

**Description**: Reboots the PiKVM Switch with an option to enter the reflashing mode after the reboot.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `unit` | integer | required | Specifies the unit number | `0..4` |
| `bootloader` | boolean | optional | Whether to enter the reflashing mode after rebooting, defaults to `false` | Enable: `1`, `true`, or `yes`. Disable: `0`, `false`, or `no` |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/reset?unit=0&bootloader=1'
```

??? note "Example output"
    ```json
    FIXME
    ```

### Create a new EDID configuration

**Method**: `POST`

**Route**: `/api/switch/edids/create`

**Description**: Creates a new EDID configuration from user-specified EDID name and data.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `name` | string | required | EDID name | Alphanumeric name (see example below) |
| `data` | string | required | EDID data | Hexadecimal string (see example below) |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/edids/create?name=Gigabyte-GA-H77-DS3H&data=00FFFFFFFFFFFF0052628888008888881C150103800000780AEE91A3544C99260F505425400001000100010001000100010001010101D51B0050500019400820B80080001000001EEC2C80A070381A403020350040442100001E000000FC0050492D4B564D20566964656F0A000000FD00323D0F2E0F0000000000000000014D02030400DE0D20A03058122030203400F0B400000018E01500A04000163030203400000000000018B41400A050D011203020350080D810000018AB22A0A050841A3030203600B00E1100001800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045'
```

??? note "Example output"
    ```json
    FIXME
    ```

### Change EDID configuration

**Method**: `POST`

**Route**: `/api/switch/edids/change`

**Description**: Modifies an existing EDID configuration.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `id` | string | required | EDID identifier | Alphanumeric id (see example below) |
| `name` | string | optional | New EDID name | Alphanumeric name (see example below) |
| `data` | string | optional | New EDID data | Hexadecimal string (see example below) |


**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/edids/change?id=ca3d7114-79ca-47fc-80b4-b80ac63fc329&name=Gigabyte-GA-H77-DS3H&data=00FFFFFFFFFFFF0052628888008888881C150103800000780AEE91A3544C99260F505425400001000100010001000100010001010101D51B0050500019400820B80080001000001EEC2C80A070381A403020350040442100001E000000FC0050492D4B564D20566964656F0A000000FD00323D0F2E0F0000000000000000014D02030400DE0D20A03058122030203400F0B400000018E01500A04000163030203400000000000018B41400A050D011203020350080D810000018AB22A0A050841A3030203600B00E1100001800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045'
```

??? note "Example output"
    ```json
    FIXME
    ```

### Remove EDID configuration

**Method**: `POST`

**Route**: `/api/switch/edids/remove`

**Description**: Deletes an EDID configuration.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `id` | string | required | EDID identifier | Alphanumeric id (see example below) |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    https://<pikvm-ip>/api/switch/edids/remove?id=ca3d7114-79ca-47fc-80b4-b80ac63fc329
```

??? note "Example output"
    ```json
    FIXME
    ```

### ATX Power Control

**Method**: `POST`

**Route**: `/api/switch/atx/power`

**Description**: Controls ATX power states for a specific port.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `port` | float | required | Specifies the port number | 0..19 |
| `action` | string | required | Power action | `on` - Power on, `off` - Power off, `off_hard` - Hard power off, `reset_hard` - Hard reset |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/atx/power?port=0&action=reset_hard'
```

??? note "Example output"
    ```json
    FIXME
    ```

### ATX Button Click

**Method**: `POST`

**Route**: `/api/switch/atx/click`

**Description**: Simulates ATX button clicks for a specific port.

**Query parameters**: 

| Parameter | Type | Optionality | Description | Acceptable values |
|-----------|------|-------------|-------------|-------------------|
| `port` | float | required | Specifies the port number | `0..19` |
| `button` | string | required | Power action | `power` - Power button click, `power_long` - Long power button press, `reset` - Reset button click |

**Example of use**:

```console
$ curl -k -X POST \
    -u admin:admin \
    'https://<pikvm-ip>/api/switch/atx/click?port=0&button=power_long'
```

??? note "Example output"
    ```json
    FIXME
    ```

----
## Redfish

The PiKVM Redfish API implements the industry-standard [DMTF Redfish specification](https://www.dmtf.org/standards/redfish) for remote server control. It allows you to monitor and control the power of the target system.

Most endpoints require authentication using your PiKVM credentials. You can interact with the API using standard HTTP clients, `curl`, or the [specialized Redfish tools](https://github.com/DMTF/Redfishtool).

### Root service discovery

**Method**: `GET`

**Route**: `/api/redfish/v1`

**Description**: Returns the basic Redfish service information and links to available resources. Doesn't require authentication.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k https://<pikvm-ip>/api/redfish/v1
```

??? note "Example output"
    ```json
    {
        "@odata.id": "/redfish/v1",
        "@odata.type": "#ServiceRoot.v1_6_0.ServiceRoot",
        "Id": "RootService",
        "Name": "Root Service",
        "RedfishVersion": "1.6.0",
        "Systems": {
            "@odata.id": "/redfish/v1/Systems"
        }
    }⏎
    ```

### Systems collection

**Method**: `GET`

**Route**: `/api/redfish/v1/Systems`

**Description**: Returns collection of available computer systems.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/redfish/v1/Systems
```

??? note "Example output"
    ```json
    {
        "@odata.id": "/redfish/v1/Systems",
        "@odata.type": "#ComputerSystemCollection.ComputerSystemCollection",
        "Members": [
            {
                "@odata.id": "/redfish/v1/Systems/0"
            }
        ],
        "Members@odata.count": 1,
        "Name": "Computer System Collection"
    }⏎
    ```

### Individual system information

**Method**: `GET`

**Route**: `/api/redfish/v1/Systems/0`

**Description**: Returns detailed information about the specific system, including power state, hostname, and available actions.

**Query parameters**: None.

**Example of use**:

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/redfish/v1/Systems/0
```

??? note "Example output"
    ```json
    {
        "@odata.id": "/redfish/v1/Systems/0",
        "@odata.type": "#ComputerSystem.v1_10_0.ComputerSystem",
        "Actions": {
            "#ComputerSystem.Reset": {
                "ResetType@Redfish.AllowableValues": [
                    "On",
                    "ForceOff",
                    "GracefulShutdown",
                    "ForceRestart",
                    "ForceOn",
                    "PushPowerButton"
                ],
                "target": "/redfish/v1/Systems/0/Actions/ComputerSystem.Reset"
            },
            "#ComputerSystem.SetDefaultBootOrder": {
                "target": "/redfish/v1/Systems/0/Actions/ComputerSystem.SetDefaultBootOrder"
            }
        },
        "Boot": {
            "BootSourceOverrideEnabled": "Disabled",
            "BootSourceOverrideTarget": null
        },
        "HostName": "pikvm",
        "Id": "0",
        "PowerState": "Off"
    }⏎
    ```

### System configuration update

**Method**: `PATCH`

**Route**: `/api/redfish/v1/Systems/0`

**Description**: This handle was added to aid in scenarios where installing OKD (Kubernetes) using installer-provisioned infrastructure involves expecting two fields to be returned and the patch request to return a 204. Hence, this handle is currently a no-op that just returns success.

**Query parameters**: None

**Example of use**:

```console
$ curl -k -X PATCH -u admin:admin https://<pikvm-ip>/api/redfish/v1/Systems/0
```

There will be zero output for this command by design.

**Responses**:

| Code | Description |
|------|-------------|
| 204 | Returns success | 

### System power control

**Method**: `POST`

**Route**: `/api/redfish/v1/Systems/0/Actions/ComputerSystem.Reset`

**Description**: Performs power control actions on the system.

**Query parameters**: This handles expects JSON with `ResetType` in the request body and one of the following values:

- `On` - Power on
- `ForceOff` - Hard power off
- `GracefulShutdown` - Graceful power off
- `ForceRestart` - Hard reset
- `ForceOn` - Force power on
- `PushPowerButton` - Simulate power button press

**Example of use**:

```console
$ curl -k -X POST \
    -H "Content-Type: application/json" \
    -u admin:admin \
    -d '{"ResetType": "ForceRestart"}' \
    https://<pikvm-ip>/api/redfish/v1/Systems/0/Actions/ComputerSystem.Reset
```

There will be zero output for this command by design.

**Responses**:

| Code | Description |
|------|-------------|
| 204 | Success |
| 400 | Invalid or missing ResetType |

----
## Misc

### Get Prometheus metrics

The `GET /api/export/prometheus/metrics` handle returns the Prometheus metrics. Also see [here](prometheus.md) for details.

```console
$ curl -k -u admin:admin https://<pikvm-ip>/api/export/prometheus/metrics
```

----
## Video

PiKVM has 3 different ways to receive video and audio, depending on the device.
This is also [reflected](video.md) in the web interface.

| Mode |

### Get raw H.264 video stream
