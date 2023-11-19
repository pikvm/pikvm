# API

This document describes the PiKVM API. Since the system consists of microservices, here is a common API with a common entry point provided by Nginx. The examples above use `curl` and [`websocat`](https://github.com/vi/websocat) with the `-k` option to disable SSL certificate verification, since the self-signed certificateis used in the default installation.


-----
## Authentication

All APIs are restricted to authentication. To make requests, you either need to auth each request individually,
or get a token and pass it as a cookie with each request.

With enabled [2FA](auth.md#two-factor-authentication), you will need to add the one-time code to the password without spaces.
That is, if the password is `foobar` and the code is `123456`, then you need to use `foobar123456` as the password.

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


### Single request auth

There are two options here:

* **Using X-headers.** Just pass `X-KVMD-User` and `X-KVMD-Passwd` with the request:

    ```
    $ curl -k -H X-KVMD-User:admin -H X-KVMD-Passwd:admin https://<pikvm-ip>/api/auth/check
    ```

* **Using HTTP Basic Auth.** Please note: contrary to the standard, this method DOES NOT use the `WWW-Authenticate` header. HTTP Basic Auth in this implementation is intended only for compatibility with other systems, such as [Prometheus](prometheus.md).

    ```
    $ curl -k -u admin:admin https://<pikvm-ip>/api/auth/check
    ```


### Session-based cookie auth

1. Get the access token for the user using `POST /api/auth/login`:

    ```
    $ curl -k -v -X POST --data user=admin --data passwd=admin https://pikvm/api/auth/login
    ...
    < Set-Cookie: auth_token=796cb83b11de4fcb749bc1bad14a91fb06dede84672b2f847fef1e988e6900de; Path=/
    ...
    ```

    On success the cookie `auth_token` will be received with `200 OK`. On invalid user or password you will get `403 Forbidden`.

2. The handle `GET /api/auth/check` can be used for check the auth status. Return of `200 OK` will signal that user is authenticated. If the token or any of the single-request auth methods are missing, `401 Unauthorized` will be returned. In case of incorrect credentials or token, `403 Forbidden` will be returned.

3. The handle `POST /api/auth/logout` can be used to invalidate session token. The response codes will be similar to the previous handle.


-----
## WebSocket events

Most of the data during the user's work with pikvm is transmitted over WebSocket. This includes mouse events, keyboard input, change the state of the various subsystems (such as ATX and Mass Storage Drive). Each event type will be described in the corresponding paragraph for its component. When connecting via WebSocket, the client receives current states as separate events. Then, as the states change, it will receive new events.

In a normal situation, opening a socket session triggers the video streamer to start. The streamer works as long as there is at least one client connected via WebSocket. After the last connection is closed and the client timeout expires, the streamer will also be terminated.

It is possible create a session that will not start the streamer and will not be counted when counting clients to stop the streamer. To do this, use the URL parameter `stream=0`:

```
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
    ws.send('{"event_type": "key", "event": {"key": "Enter", "state": true}}')
    time.sleep(0.05)
    ws.send('{"event_type": "key", "event": {"key": "Enter", "state": false}}')
    ws.close()
    ```


-----
## System functions

### Get system info

The `GET /api/info` handle returns the general information about the PiKVM device.

Parameters:

* `fields=...` *(optional)* - Only specified categories will be returned, for example `fields=system,hw`. By default all categories will be displayed.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/info
```

??? note "Click to expand"
    ```js
    {
        "ok": true,
        "result": {
            "extras": { // Installed applications; null on internal error
                "ipmi": {
                    "daemon": "kvmd-ipmi",
                    "description": "Show IPMI information",
                    "enabled": true,
                    "icon": "share/svg/ipmi.svg",
                    "keyboard_cap": false,
                    "name": "IPMI",
                    "path": "ipmi",
                    "place": 21,
                    "port": 623
                },
                "vnc": {
                    "daemon": "kvmd-vnc",
                    "description": "Show VNC information",
                    "enabled": true,
                    "icon": "share/svg/vnc.svg",
                    "keyboard_cap": false,
                    "name": "VNC",
                    "path": "vnc",
                    "place": 20,
                    "port": 5900
                }
            },
            "hw": { // Hardware info
                "health": {
                    "temp": {
                        "cpu": 36.511, // /sys/class/thermal/thermal_zone0/temp / 1000; null on error
                        "gpu": 35.0    // vcgencmd measure_temp; null on error
                    },
                    "throttling": { // vcgencmd get_throttled; null on error
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
                    "base": "Raspberry Pi 4 Model B Rev 1.1", // /proc/device-tree/model; null on error
                    "serial": "0000000000000000", // /proc/device-tree/serial-number; null on error
                    "type": "rpi"
                }
            },
            "meta": {  // /etc/kvmd/meta.yaml; null on error
                "kvm": {},
                "server": {
                    "host": "localhost.localdomain"
                }
            },
            "system": {
                "kernel": {
                    "machine": "x86_64",
                    "release": "5.8.14-arch1-1",
                    "system": "Linux",
                    "version": "#1 SMP PREEMPT Wed, 07 Oct 2020 23:59:46 +0000"
                },
                "kvmd": {
                    "version": "2.1"
                },
                "streamer": {
                    "app": "ustreamer",
                    "features": { // {} on error
                        "HAS_PDEATHSIG": true,
                        "WITH_GPIO": false,
                        "WITH_OMX": false,
                        "WITH_PTHREAD_NP": true,
                        "WITH_SETPROCTITLE": true
                    },
                    "version": "2.1" // "" on error
                }
            }
        }
    }
    ```

Each category is represented by its own event in the websocket (`info_hw_state`, `info_system_state`, etc). The event content has the same format as the category content in API.


### Get system log

The `GET /api/log` handle displays logs from all KVMD services as plain text.

Parameters:

* `follow=1` *(optional)* - Turns the request into long-polling mode and follow log messages in real time.
* `seek=N` *(optional)* - Runs the log for the specified time in seconds, for example `seek=3600` will show the log for the last hour.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/log
```

-----
## ATX power management

### Get ATX state

The `GET /api/atx` handle shows the current ATX state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/atx
```

??? note "Click to expand"
    ```js
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

The `POST /api/atx/power` handle changes ATX power state to desired.

Parameters:

* `action=...` - Describes desired state:
    * `on` - Turn on (do nothing in case PSU is already on).
    * `off` - Turn off (aka soft-off), emulates click on the power button.
    * `off_hard` - Perform long press on the power button (5+ seconds).
    * `reset_hard` - Emulates pressing reset button (hardware hot reset).
* `wait=1` *(optional)* - Says if call should return immediately or just after finishing operation.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/atx/power?action=on
```


### Click ATX button

The `POST /api/atx/click` handle sends the ATX button press event.

Parameters:

* `button=...` - Specifies the desired PC case button:
    * `power` - Short click on the power button.
    * `power_long` - Long press on the power button (5+ seconds).
    * `reset` - Short click on the reset button.
* `wait=1` *(Optional)* - Says if call should return immediately or just after finishing operation.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/atx/click?button=power
```


-----
## Mass Storage Drive

### Get MSD state

The `GET /api/msd` handle shows the current MSD state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/msd
```


### Upload MSD image

The `POST /api/msd/write` uploads an image to MSD.

Parameters:

* `image=...` - Specifies the name of the image.
* Binary data should be passed to the POST body.

```
$ # create a test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST --data-binary @test.iso -k -u admin:admin https://<pikvm-ip>/api/msd/write?image=test.iso
```


### Upload MSD image by URL

The `POST /api/msd/write_remote` handle downloads an image from HTTP(S) URL to the MSD.

Parameters:

* `url=...` - Image URL.
* `image=...` *(optional)* - Image name.
* `timeout=N` *(optional)* - Remote request timeout, 10 seconds by default.

!!! note
    This is a long-polling request. Do not interrupt the request until the download is complete, otherwise the download will stop.

```
$ # create test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/write_remote?url=http://example.com/test.iso
```


### Set MSD parameters

The `POST /api/msd/set_params` handle changes the current image and/or set drive parameters

Parameters:

* `image=...` *(optional)* - Change the current image.
* `cdrom=1|0` *(optional)* - Change the media type to the CD-ROM on `1`, otherwise to the Flash.

```
$ curl -X POST -k -u admin:admin "https://<pikvm-ip>/api/msd/set_params?image=test.iso&cdrom=1"
```


### Control MSD

The `POST /api/msd/set_connected` connects or disconnect the MSD to the host.

Parameters:

* `connected=1|0` - Change the state.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/set_connected?connected=1
```


### Remove MSD image

The `POST /api/msd/remove` handle removes the specified image.

Parameters:

* `image=...` - The image name.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/remove?image=test.iso
```


### Reset MSD

The `POST /api/msd/reset` handle resets the drive.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/reset
```


-----
## GPIO

### Get GPIO state

The `GET /api/gpio` handle shows the current GPIO state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/gpio
```


### Switch GPIO channel

The `POST /api/gpio/switch` handle interacts with selected GPIO driver channel in `switch` mode.

Parameters:

* `channel=...` - The GPIO driver channel.
* `state=1|0` - The new switch state.
* `wait=1` *(optional)* - Says if call should return immediately or just after finishing operation.


### Pulse GPIO channel

The `POST /api/gpio/pulse` handle interacts with selected GPIO driver channel in `pulse` mode.

Parameters:

* `channel=...` - The GPIO driver channel.
* `delay=N.N` *(optional)* - The pulse time in seconds (float), `0` for default delay.
* `wait=1` *(optional)* - Says if call should return immediately or just after finishing operation.


----
## Misc

### Get Prometheus metrics

The `GET /api/export/prometheus/metrics` handle returns the Prometheus metrics. Also see [here](prometheus.md) for details.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/export/prometheus/metrics
```

-----
# To be continued ===>

You can find all existing APIs in the [KVMD source tree](https://github.com/pikvm/kvmd/tree/master/kvmd/apps/kvmd/api). We would appreciate your help with documentation.
