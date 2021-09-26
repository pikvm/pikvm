# API
This document describes the PiKVM API. Since the system consists of microservices, here is a common API with a common entry point provided by Nginx. The examples above use `curl` and [`websocat`](https://github.com/vi/websocat) with the `-k` parameter to disable SSL certificate verification, since the self-signed certificateis used in the default installation.

## Authorization: `/api/auth`
All APIs are restricted to authorization. To make requests, you either need to authorize each request individually,
or get a token and pass it as a cookie with each request.

### Single request auth
There are two options here:
* Using X-headers. Just pass `X-KVMD-User` and `X-KVMD-Passwd` with the request:
    ```
    $ curl -k -H X-KVMD-User:admin -H X-KVMD-Passwd:admin https://<pikvm-ip>/api/auth/check
    ```
* Using HTTP Basic Auth. Please note: contrary to the standard, this method DOES NOT use the `WWW-Authenticate` header.
  HTTP Basic Auth in this implementation is intended only for compatibility with other systems, such as [Prometheus](prometheus.md).
    ```
    $ curl -k -u admin:admin https://<pikvm-ip>/api/auth/check
    ```
### Session-based cookie auth
1. Authorize and get token for the user using `POST /api/auth/login`:
    ```
    $ curl -k -v -X POST --data user=admin --data passwd=admin https://pikvm/api/auth/login
    ...
    < Set-Cookie: auth_token=796cb83b11de4fcb749bc1bad14a91fb06dede84672b2f847fef1e988e6900de; Path=/
    ...
    ```
    On success the cookie `auth_token` will be received with `200 OK`. On invalid user or password you will get `403 Forbidden`.
2. The handle `GET /api/auth/check` can be used for check the auth status. Return of `200 OK` will signal that user is authenticated.
  If the token or any of the single-request auth methods are missing, `401 Unauthorized` will be returned.
  In case of incorrect credentials or token, `403 Forbidden` will be returned.
3. The handle `POST /api/auth/logout` can be used to invalidate session token. The response codes will be similar to the previous handle.

## The main web socket: `/api/ws`
Most of the data during the user's work with pikvm is transmitted over a web socket. This includes mouse events, keyboard input, change the state of the various subsystems (such as ATX and Mass Storage Drive). Each event type will be described in the corresponding paragraph for its component. When connecting via a web socket, the client receives current states as separate events. Then, as the states change, it will receive new events.

In a normal situation, opening a socket session triggers the video streamer to start. The streamer works as long as there is at least one client connected via a web socket. After the last connection is closed and the client timeout expires, the streamer will also be terminated.

It is possible create a session that will not start the streamer and will not be counted when counting clients to stop the streamer. To do this, use the URL parameter `stream=0`:

```
$ websocat -k wss://<pikvm-ip>/api/ws?stream=0 -H X-KVMD-User:admin -H X-KVMD-Passwd:admin
```
<details>
    <summary>Output with initial events</summary>

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
</details>

After connecting the client receives a bundle of states of all KVMD subsystems. After the batch is completed, it sends a `loop` event, which means that the websocket has entered event loop mode. Now it will send new states and respond to client's requests.

Another type of event is `ping`, which can be sent by the client: `{"event_type": "ping", "event": {}}`. If the server is running, it will respond with pong: `{"event_type": "pong", "event": {}}`.

### Sending keypress events

For keypresses, set `event_type` to `"key"` and fill in the `"event"` structure with `key` and `state`, where `key` is the key from mapping and `state` is boolean that determines if the key is pressed or released: 

```python
# python, install websocket-client
import websocket
uri = "wss://10.0.0.7/api/ws?stream=0"
header = {"X-KVMD-User": "admin", "X-KVMD-Passwd": "admin"}
ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})
ws.connect(uri, header=header)
ws.send(r'{"event_type": "key", "event": {"key": "Enter", "state": true}}')
time.sleep(0.05)
ws.send(r'{"event_type": "key", "event": {"key": "Enter", "state": false}}')
ws.close()
```

## System info: `/api/info`
On `GET` this handle will return general information about the PiKVM device. If you specify the `fields` query parameter, only the requested category will be selected, like `fields=system,hw`. By default all categories will be displayed:

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/info
```

<details>
    <summary>Example</summary>

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
</details>

Each category is represented by its own event in the websocket (`info_hw_state`, `info_system_state`, etc). The event content has the same format as the category content in API.

## System log: `/api/log`
On `GET` this handle will display messages from all KVMD services as plain text. The `follow=1` request parameter turns the request into an infinite one and you will receive new log messages in real time. The seek parameter runs the log for the specified time in seconds. For example, `seek=3600` will show the log for the last hour. Both the `seek` and `follow` parameters can be used together.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/log
```

## Get ATX state: `/api/atx`
On `GET` it will show current ATX state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/atx
```

<details>
    <summary>Example</summary>

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
</details>

### Set ATX PSU state: `/api/atx/power`
On `POST` it will change ATX power supply state to desired.
Parameters:
- `action` describes desired state:
  * `on` - turned on (do nothing in case PSU is already on);
  * `off` - turned off (aka soft-off), emulates short-press on the power button;
  * `off_hard` - emulates long (5+ seconds) press on the power button;
  * `reset_hard`  emulates pressing reset button (hardware hot reset).
- `wait` - Boolean. Says if call should return immediately or just after finishing operation.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/atx/power?action=on
```

### Emulate pressing buttons on computer case: `/api/atx/click`
On `POST` send button press events to {front-}panel header (like you pressing buttins on your computer's case).
Parameters:
- `button` specifies the desired computer case button you would like to press. Currently supported options are: 
  * `power` — for short press on power button;
  * `power_long` — for pressing POWER button for 4+ seconds (force OFF);
  * `reset` — to initiate cold-reset.
- `wait` Boolean. Says if call should return immediately or just after finishing operation.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/atx/click?button=power
```

## Get Mass Storage Drive (*msd*) state: `/api/msd`
On `GET` it will show current *msd* state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/msd
```

### Upload image: `/api/msd/write`
On `POST` upload an image to the drive. This API uses HTTP POST data.
Parameters:
- `image` specify the image name.
- `data` multipart POST data to be uploaded.

```
$ # create test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST --data-binary @test.iso -k -u admin:admin https://<pikvm-ip>/api/msd/write?image=test.iso
```

### Upload image by URL: `/api/msd/write_remote`
On `POST` download an image to the drive from HTTP(S) URL.
Parameters:
- `image` specify the image name.
- `timeout` remote request timeout, 10 seconds by default.

```
$ # create test image
$ dd if=/dev/zero of=test.iso bs=1M count=1

$ # upload it to pikvm
$ curl -v -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/write_remote?url=http://example.com/test.iso
```

### Set *msd* parameters: `/api/msd/set_params`
On `POST` select the image and change media type. Parameters:
- `image` specify the image name.
- `cdrom` Boolean. Select media type:
  * `true` - CD-ROM;
  * `false` - Flash.

```
$ curl -X POST -k -u admin:admin "https://<pikvm-ip>/api/msd/set_params?image=test.iso&cdrom=true"
```

### Connect the device: `/api/msd/set_connected`
On `POST` select if the drive should be connected. Parameters:
- `connected` Boolean. Connect drive:
  * `true` - connect drive;
  * `false` - disconnect drive.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/set_connected?connected=true
```

### Remove image: `/api/msd/remove`
On `POST` select the image that should be removed. Parameters:
- `image` specify the image name.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/remove?image=test.iso
```

### Reset *msd*: `/api/msd/reset`
On `POST` resets the mass storage drive.

```
$ curl -X POST -k -u admin:admin https://<pikvm-ip>/api/msd/reset
```

## Get GPIO state: `/api/gpio`
On `GET` it will show current GPIO state.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/gpio
```

### Switch GPIO driver channel: `/api/gpio/switch`
On `POST` it will interact with selected GPIO driver channel in `switch` mode. Parameters:
- `channel` specify the GPIO driver channel.
- `state` Boolean. Select the new switch state.
- `wait` Boolean. Says if call should return immediately or just after finishing operation.

### Pulse GPIO driver channel: `/api/gpio/pulse`
On `POST` it will interact with selected GPIO driver channel in `pulse` mode. Parameters:
- `channel` specify the GPIO driver channel.
- `delay` Float. Defines the pulse time in seconds, `0` for disable pulsing.
- `wait` Boolean. Says if call should return immediately or just after finishing operation.

## Get Prometheus metrics: `/api/export/prometheus/metrics`
On `GET` it will return the exported Prometheus metrics. Also see [here](prometheus.md) for details.

```
$ curl -k -u admin:admin https://<pikvm-ip>/api/export/prometheus/metrics
```


# To be continued ===>
Unfortunately, the developer doesn't have enough time to fully describe the API. You can find all existing APIs in the [KVMD source tree](https://github.com/pikvm/kvmd/tree/master/kvmd/apps/kvmd/api). We would appreciate your help with documentation.
