# GPIO
[GPIO (general-purpose input/output)](https://en.wikipedia.org/wiki/General-purpose_input/output) is a series of digital interfaces that can be used to connect relays, LEDs, sensors, and other components.

:exclamation: Note: Using GPIO on a Pi-KVM was designed as a feature for advanced users, so please familiarize yourself with the topic to make sure you understand how to use use it before setting it up. Otherwise you might damage your Raspberry Pi or components.

When talking about Pi-KVM and GPIO it refers not solely to the [physical interface of the Raspberry Pi](https://www.raspberrypi.org/documentation/usage/gpio), but also to various plugins (for example, for [USB relays](http://vusb.wikidot.com/project:driver-less-usb-relays-hid-interface)) that can also be used transparently by emulating an abstract GPIO API.

# Configuration
Setting up GPIO is considerably complex. The interface is divided into several layers for flexibility. Any configuration is performed using a file `/etc/kvmd/override.yaml` which uses the [YAML syntax](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html). We will look at each part of the configuration individually with an example for each. Sections should be combined under shared keys.

Wrong:
```yaml
kvmd:
    gpio:
        drivers: ...
kvmd:
    gpio:
        scheme: ...
```
Correct:
```yaml
kvmd:
    gpio:
        drivers: ...
        scheme: ...
```

### Drivers
The first part of the configuration refers to the hardware layer, which defines which IO channels are used (standard GPIO pins of the Raspberry Pi, an USB relay, and so on). If you just want to use GPIO with the default settings you can skip to the next section [Scheme](#Scheme).

Each hardware input/output requires a individual driver configuration entry. Each driver has a type (which refers to the plugin that handles the communication between Pi-KVM and the hardware) and a unique name. This allows you to either can add multiple drivers of the same type with different settings or connect multiple USB HID relays.

:exclamation: Each driver requires a unique name. Names surrounded by double underscore are system reserved and should not be used.

The only exception to this is the default GPIO driver with the name `__gpio__`, representing the physical GPIO interface of the Raspberry Pi. The configuration section for `__gpio__` is only required in your `/etc/kvmd/override.yaml` if you want to change the default settings. It can be omitted if you are fine with the defaults.

```yaml
kvmd:
    gpio:
        drivers:
            # This example shows how the default __gpio__ driver settings can be changed. It can be omitted if you are fine with the defaults.
            __gpio__:  # Names surrounded by double underscore are system reserved
                type: gpio  # Refers to the plugin name handling the communication

            # You can define another gpio driver for some reason
            my_gpio: 
                type: gpio  # Refers to the plugin name handling the communication
                    
            # Example for a USB HID relay connected to Pi-KVM
            relay:
                type: hidrelay  # Eefers to the plugin name handling the communication
                device: /dev/hidraw0  # The path to the linux device
```

### Scheme
The second part defines how the various driver channels are configured. Each channel has a unique name, a mode (`input` or `output`), a pin number, and a reference to the driver configured in the previous part.

:exclamation: Names that starts and ends with two underscores (like `__magic__`) are reserved.

Two interaction modes are available for outputs: `pulse` and `switch`. In pulse mode, the output quickly switches its state to logical 1 and back (just like pressing a button). In switch mode, it saves (toggles) the state that the user set. When Pi-KVM is started/rebooted (any time the KVMD daemon is started or stopped) all output channels are reset to 0. This can be changed using the `initial` parameter. For example, `initial=true` for logic 1 on startup.

If you don't specify a driver for the channel in the scheme the default driver, `__gpio__` will be used.

| Parameter                         | Type      | Allowed values           | Default |  Description                   |
|-----------------------------------|-----------|--------------------------|---------|-----------------------|
| `led1`, `button1`, `relay1`, etc. | `string`  | `a-Z`, numbers, `_`, `-` |         | A section for the named channel |
| `pin`       | `integer` | `X >= 0`            | | Refers to a GPIO pin or driver's pin/port |
| `mode`      | `enum`    | `input` or `output` | | Defines if a channel is used for input or output, may be limited by driver plugin |
| **Input only** | | | | |
| `debounce` | `float` | `x >= 0` | `0.1` | [Debounce](https://www.arduino.cc/en/Tutorial/Debounce) time in seconds. `0` for disable debounce |
| **Output only** | | | | |
| `switch`    | `bool`  | `true` or `false`   | `true` | Enables or disables the switch mode on the channel (enabled by default).  |
| `initial`   | `nullable bool` | `true`, `false` or `null` | `false` | Defines the initial state of the switch upon boot, `null` for don't make changes (the last one does not supported by generic GPIO) |
| `inverted` | `bool` | `true` or `false` | `false` | Inverts the active logical level |
| `pulse`     |         |            | | A section header to define switch pulse configuration |
| `delay`     | `float` | `X >= 0`   | `0.1` | Defines the pulse time in seconds, `0` for disable pulsing |
| `min_delay` | `float` | `X >= 0.1` | `0.1` |
| `max_delay` | `float` | `X >= 0.1` | `0.1` |

__Example configuration__
```yaml
kvmd:
    gpio:
        scheme:
            # A certain device sends signals to the RPi and we want the Pi-KVM to display this as an led
            led1:
                pin: 19 # GPIO pin number on the RPi
                mode: input 
            led2:
                pin: 16 # GPIO pin number on the RPi
                mode: input 

            # Two outputs of RPi's GPIO
            button1:
                pin: 26 # GPIO pin number on the RPi
                mode: output
                switch: false  # Disable switching, only pulse available
            button2:
                pin: 20 # GPIO pin number on the RPi
                mode: output
                switch: false # Disable switching, only pulse available

            relay1:  # Channel 1 of the relay /dev/hidraw0
                pin: 0  # Numerating starts from 0
                mode: output  # Relays can't be inputs
                initial: null  # Don't reset the state to 0 when initializing and terminating KVMD
            relay2:  # Channel 2
                pin: 1
                mode: output # Relays can't be inputs
                initial: null
                pulse:
                    delay: 2  # Default pulse value
                    max_delay: 2  # The pulse interval can be between min_delay=0.1 (by default) and max_delay=2
```

### View
This is the last part of the required configuration. It defines how the previous driver and channel configuration is rendered on the Web interface. Here's an example for the example configuration above:

```yaml
kvmd:
    gpio:
        view:
            header:
                title: Switches  # the menu title
            table:  # The menu items are rendered in the form of a table of text labels and controls
                - ["#Generic GPIO leds"]  # Text starting with the sharp symbol will be a label
                - []  # creates a horizontal separator and starts a new table
                - ["#Test 1:", led1, button1]  # Text label, one input, one button with text "Click"
                - ["#Test 2:", led2, button2]
                - []  # creates a horizontal separator and starts a new table
                - ["#HID Relays /dev/hidraw0"]
                - []  # creates a horizontal separator and starts a new table
                - ["#Relay #1:", "relay1|Boop 0.1"]  # Text label and button with alternative text
                - ["#Relay #2:", "relay2|Boop 2.0"]  # Text label and button with alternative text
```

This will be rendered as:

<img src="../img/gpio_menu.png" alt="drawing" />

Some rules and customization options:
- Text starting with the `#` symbol will be a label.
- To place a channel in a cell, use the name you defined in the scheme.
- Inputs are displayed as round LEDs.
- Outputs are displayed as a switch AND a button.
- If the switch mode is disabled, only a button will be displayed. If pulse is disabled, only a switch will be shown.
- To change the LED's color specify it after the channel name like `"led1|red"`. Available: `green`, `yellow` and `red`.
- To change title of the button, write some its name like `"relay1|My cool relay"`.
- Buttons and switches can request confirmation on acting. To do this write its name like `"relay1|confirm|My cool relay"`. The third argument with a title is required in this case.

# Hardware modules and pseudo-drivers

### Raspberry's GPIO
The driver `gpio` provides access to regular GPIO pins with input and output modes. It uses `/dev/gpiochip0` and the libgpiod library to communicate with the hardware. Does not support saving state between KVMD restarts (meaning `initial=null`).

You can use the [interactive scheme](https://pinout.xyz/) when selecting the pins to use. Please note that when selecting a pin for a channel, you need to use a logical number instead of a physical number. That is, if you want to use a physical pin with the number 40, the channel must have the number 21 corresponding to the logical GPIO21.

Channels should not use duplicate pins. You can also not use already used pins. To see which pins are currently used, run the command `gpioinfo`.

### USB HID Relay
The driver `hidrelay` provides access to cheap managed [USB HID relays](http://vusb.wikidot.com/project:driver-less-usb-relays-hid-interface) that can be found on AliExpress. This driver does not support input mode, only output. To use it, you need to specify the path to the device file (like `/dev/hidraw0`) using the `device` parameter.

Additionally, we recommend to configure access rights and static device name using [UDEV rules](https://wiki.archlinux.org/index.php/udev). For example, create `/etc/udev/rules.d/99-kvmd-extra.rules`:
```
KERNEL=="hidraw[0-9]*", SUBSYSTEMS=="usb", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", GROUP="kvmd"
```

Channels should not use duplicate physical numbers. The driver supports saving state between KVMD restarts (meaning `initial=null`).

### ezCoo KVM switch
You can use GPIO to control KVM port switching. This usually requires the use of relays and buttons, but for the [ezCoo switch](https://github.com/pikvm/pikvm/blob/master/pages/ezcoo.md) there is a special `ezcoo` driver that simulates GPIO by sending commands to the switch via serial port. So you can make a menu in Pi-KVM to control the multiport switch.

### IPMI
The driver `ipmi` provides the ability to send IPMI commands (on, off, reset) and show the power status of the remote host. In fact, this is not a hardware driver, but something like a pseudo-GPIO. Each "pin" is actually responsible for a specific IPMI operation of `ipmitool`:

| Pin | Type     | Command |
|-----|----------|---------|
| `0` | `input`  | `ipmitool ... power status`, can be used to draw the LED in the menu |
| `1` | `output` | `ipmitool ... power on`, sends the `on` command (and only this), so like all other outputs it should be a button |
| `2` | `output` | `ipmitool ... power off` |
| `3` | `output` | `ipmitool ... power cycle` |
| `4` | `output` | `ipmitool ... power reset` |
| `5` | `output` | `ipmitool ... power diag` |
| `6` | `output` | `ipmitool ... power soft` |

You are supposed to define one driver per host:
```yaml
kvmd:
    gpio:
        drivers:
            my_server:
                type: ipmi
                host: myserver.local
                user: admin
                passwd: admin
        scheme:
            my_server_status:
                driver: my_server
                pin: 0
                mode: input
            my_server_on:
                driver: my_server
                pin: 1
                mode: output
                switch: false
            my_server_off:
                driver: my_server
                pin: 2
                mode: output
                switch: false
        view:
            table:
                - [my_server_status, "my_server_on|On", "my_server_off|Off"]
```

### Wake-on-LAN
The driver `wol` provides a simple generator of Wake-on-LAN packages. One driver and one output are generated for one host if a [simplified configuration method](wol.md) is used. However, you can define multiple drivers if you want to manage different hosts. One driver controls one host, and can only be used as an output. Pin numbers are ignored.
```yaml
kvmd:
    gpio:
        drivers:
            wol_server1:
                type: wol
                mac: ff:ff:ff:ff:ff:f1
            wol_server2:
                type: wol
                mac: ff:ff:ff:ff:ff:f2
                ip: 192.168.0.100
                port: 9
        scheme:
            wol_server1:
                driver: wol_server1
                pin: 0
                mode: output
                switch: false
            wol_server2:
                driver: wol_server2
                pin: 0
                mode: output
                switch: false
        view:
            table:
                - ["#Server 1", "wol_server1|Send Wake-on-LAN"]
                - ["#Server 2", "wol_server2|Send Wake-on-LAN"]
```
