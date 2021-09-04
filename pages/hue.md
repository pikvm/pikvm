# Control Smartplugs over Philips Hue Bridge API in the Webinterface
* You can add a Button to switch the Power State of the SmartPlug
* And a Indicator LED to show the current State

# Tested Smart Plugs
* https://shop.ledvance.com/en/products/smart-plug-eu
* In general the plugin can switch any device on/off which is connected to the bridge

# Get Api Key (Username) for the Bridge
* Open http://[BridgeIP]/debug/clip.html
* In the URL: Field type /api/
* In the Message Body: Field type: {"devicetype":"pikvm"}
* Hit the Get Button
* As the Response you become the Username: { "success": { "username": "apiusername" }

# Get a list of all connectet Devices
* http://[BridgeIP]/api/[username]/lights
* Save the Device ID's for the Devices you will control

# override.yaml
* In the drivers section set username and device
```
gpio:
        drivers:
            ch1_plug:
               type: hue
               ip: 192.168.1.7
               username: ApiUsername
               device: 27
            ch2_plug:
               type: hue
               ip: 192.168.1.7
               username: ApiUsername
               device: 28
        scheme:
            ch1_plug_button:
                driver: ch1_plug
                pin: 1
                mode: output
                switch: false
            ch1_plug_led:
                driver: ch1_plug
                pin: 1
                mode: input
            ch2_plug_button:
                driver: ch2_plug
                pin: 2
                mode: output
                switch: false
            ch2_plug_led:
                driver: ch2_plug
                pin: 2
                mode: input
        view:
            table:
                - ["#Power:", ch1_plug_led, ch1_plug_button|confirm|Toggle]
                - ["#Power:", ch2_plug_led, ch2_plug_button|confirm|Toggle]
```