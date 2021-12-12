# Flashing the Arduino HID

## TTL Firmware (the default option)

This operation can be done using your RPi (except Pi Zero W). Here the common steps:

1. Disconnect the RESET wire from the Arduino board.

2. Connect the Arduino and RPi with a suitable USB cable.

3. Log in to the Raspberry Pi using SSH (`ssh root@<addr>` with password `root` by default) or using keyboard and monitor. The Raspberry Pi obtains the network address over DHCP.

4. Upload the firmware (USB keyboard & mouse is used by default, on this step [you can choose PS/2 keyboard](arduino_hid.md#ps2-keyboard)):

    ```shell
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl stop kvmd
    [root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
    [root@pikvm ~]# cd ~/hid
    [root@pikvm hid]# make
    [root@pikvm hid]# make install
    [root@pikvm hid]# reboot
    ```

5. Connect the RESET wire, disconnect the USB cable, and reboot the RPi.

With a Pi Zero W, you may consider building the firmware on a faster system and programming using USB or booting from another SD card and following the build steps using a clone of the [KVMD repo](https://github.com/pikvm/kvmd).


## SPI Firmware

This operation can be done using your Raspberry Pi without disconnecting any wires:

1. Connect the Arduino and RPi with a suitable USB cable.

2. Log in to the Raspberry Pi using SSH (`ssh root@<addr>` with password `root` by default) or using keyboard and monitor. The Raspberry Pi obtains the network address over DHCP.

3. Execute `rw`, add line `dtoverlay=spi0-1cs` to `/boot/config.txt` and perform `reboot`.

4. Build and upload the firmware (USB keyboard & mouse is used by default)

    ```shell
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl stop kvmd
    [root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
    [root@pikvm ~]# cd ~/hid
    [root@pikvm hid]# make spi
    [root@pikvm hid]# make install
    [root@pikvm hid]# reboot
    ```

## Common Errors

### Circuit Issues

#### Common - Reset Wire
Different pins are used for the reset wire but serve a similar function. For programming the TTL firmware over USB, the reset wire should be disconnected. When programming using SPI, the reset wire needs to be connected through a transistor circuit and connected to GPIO25 (pin 22 on the GPIO header)


#### SPI-specific Wiring
The 3v3, ground, Reset (GPIO25), MISO, MOSI, SCLK, and CS1 need to be connected appropriately. SPIO_CS0 and SPIO_CS1 can both be used but the default configuration uses SPIO_CS1 for the Arduino Microcontroller (CS0 is used for another device on the v3). These generally follow a block as follows:

```
Pin  0        2         4
      2        0         0
      .........GR.C.......
Row # 12345678901234567890
      ........3MMS........
Pin   0       1          3
       1       7          9
```

The most common error is an "off-by-one" error where pins are shifted by a row. Some cases have non-standard GPIO layouts so please be careful when following these instructions using a case that has a modified pinout.


### Library Compatibility

On `make install` you may encounter the following error:

```
/root/.platformio/packages/tool-avrdude/avrdude: error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory
```

Create a symlink for this library:

```
# ln -s /usr/lib/libtinfo.so.6 /usr/lib/libtinfo.so.5
```

... and run `make install` again.

If you have any problems or questions, contact us using [Discord](https://discord.gg/bpmXfz5).


## Example SPI build + Flash

??? note "Here's an end-to-end build and flash of the SPI HID firmware using the default options as described above"
    ```
    [root@pikvm ~]# rw
    [root@pikvm ~]# systemctl stop kvmd
    [root@pikvm ~]# cp -r /usr/share/kvmd/hid ~
    [root@pikvm ~]# cd ~/hid
    [root@pikvm hid]# make spi
    make _build E=spi
    make[1]: Entering directory '/root/hid'
    rm -f .current
    platformio run --environment spi
    ************************************************************************************************************************************
    If you like PlatformIO, please:
    - follow us on Twitter to stay up-to-date on the latest project news > https://twitter.com/PlatformIO_Org
    - star it on GitHub > https://github.com/platformio/platformio
    - try PlatformIO IDE for embedded development > https://platformio.org/platformio-ide
    ************************************************************************************************************************************

    Processing spi (platform: atmelavr; board: micro; framework: arduino)
    ------------------------------------------------------------------------------------------------------------------------------------
    Platform Manager: Installing atmelavr
    Unpacking  [####################################]  100%
    Platform Manager: atmelavr @ 3.1.0 has been installed!
    The platform 'atmelavr' has been successfully installed!
    The rest of the packages will be installed later depending on your build environment.
    Tool Manager: Installing platformio/toolchain-atmelavr @ ~1.50400.0
    Downloading  [####################################]  100%
    Unpacking  [####################################]  100%
    Tool Manager: toolchain-atmelavr @ 1.50400.190710 has been installed!
    Tool Manager: Installing platformio/framework-arduino-avr @ ~5.1.0
    Downloading  [####################################]  100%
    Unpacking  [####################################]  100%
    Tool Manager: framework-arduino-avr @ 5.1.0 has been installed!
    Tool Manager: Installing platformio/tool-avrdude @ *
    Tool Manager: tool-avrdude @ 1.60300.200527 has been installed!
    Tool Manager: Installing platformio/tool-scons @ ~4.40001.0
    Unpacking  [####################################]  100%
    Tool Manager: tool-scons @ 4.40001.0 has been installed!
    Verbose mode can be enabled via `-v, --verbose` option
    patch([], [])
    patch([], [])
    CONFIGURATION: https://docs.platformio.org/page/boards/atmelavr/micro.html
    PLATFORM: Atmel AVR (3.1.0) > Arduino Micro
    HARDWARE: ATMEGA32U4 16MHz, 2.50KB RAM, 28KB Flash
    DEBUG: Current (simavr) On-board (simavr)
    PACKAGES:
     - framework-arduino-avr 5.1.0
     - tool-avrdude 1.60300.200527 (6.3.0)
     - toolchain-atmelavr 1.50400.190710 (5.4.0)
    LDF: Library Dependency Finder -> http://bit.ly/configure-pio-ldf
    LDF Modes: Finder ~ chain, Compatibility ~ soft
    Library Manager: Installing HID-Project @ 2.6.1
    Library Manager: HID-Project @ 2.6.1 has been installed!
    Library Manager: Installing git+https://github.com/Harvie/ps2dev#v0.0.3
    git version 2.30.0
    Cloning into '/root/hid/.platformio/.cache/tmp/pkg-installing-84arveu0'...
    Note: switching to 'a043002178450772d72a58b0c42752a506fd4dea'.

    You are in 'detached HEAD' state. You can look around, make experimental
    changes and commit them, and you can discard any commits you make in this
    state without impacting any branches by switching back to a branch.

    If you want to create a new branch to retain commits you create, you may
    do so (now or later) by using -c with the switch command. Example:

      git switch -c <new-branch-name>

    Or undo this operation with:

      git switch -

    Turn off this advice by setting config variable advice.detachedHead to false

    Library Manager: ps2dev @ 0.0.3+sha.a043002 has been installed!
    Library Manager: Installing digitalWriteFast @ 1.0.0
    Library Manager: digitalWriteFast @ 1.0.0 has been installed!
    Found 8 compatible libraries
    Scanning dependencies...
    Dependency Graph
    |-- <HID-Project> 2.6.1
    |   |-- <HID> 1.0
    |-- <ps2dev> 0.0.3+sha.a043002
    |-- <digitalWriteFast> 1.0.0
    |-- <SPI> 1.0
    Building in release mode
    patch -p1 -d /root/hid/.platformio/packages/framework-arduino-avr < patches/no-main.patch
    patching file cores/arduino/main.cpp
    <lambda>([], [])
    patch -p1 -d /root/hid/.platformio/packages/framework-arduino-avr < patches/optional-usb-serial.patch
    patching file cores/arduino/PluggableUSB.cpp
    patching file cores/arduino/USBCore.cpp
    <lambda>([], [])
    patch -p1 -d /root/hid/.platformio/packages/framework-arduino-avr < patches/get-plugged-endpoint.patch
    patching file cores/arduino/PluggableUSB.h
    <lambda>([], [])
    patch -p1 -d /root/hid/.pio/libdeps/spi/HID-Project < patches/shut-up.patch
    patching file src/KeyboardLayouts/ImprovedKeylayouts.h
    <lambda>([], [])
    patch -p1 -d /root/hid/.pio/libdeps/spi/HID-Project < patches/no-hid-singletones.patch
    patching file src/SingleReport/BootKeyboard.cpp
    patching file src/SingleReport/BootKeyboard.h
    patching file src/SingleReport/BootMouse.cpp
    patching file src/SingleReport/BootMouse.h
    patching file src/SingleReport/SingleAbsoluteMouse.cpp
    patching file src/SingleReport/SingleAbsoluteMouse.h
    <lambda>([], [])
    patch -p1 -d /root/hid/.pio/libdeps/spi/HID-Project < patches/absmouse-win-fix.patch
    patching file src/SingleReport/SingleAbsoluteMouse.cpp
    <lambda>([], [])
    Compiling .pio/build/spi/src/main.cpp.o
    Compiling .pio/build/spi/src/spi.cpp.o
    Compiling .pio/build/spi/lib2d3/HID/HID.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/AbsoluteMouse.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/Consumer.cpp.o
    Archiving .pio/build/spi/lib2d3/libHID.a
    Indexing .pio/build/spi/lib2d3/libHID.a
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/Gamepad.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/ImprovedKeyboard.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/ImprovedMouse.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/NKROKeyboard.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/SurfaceDial.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/MultiReport/System.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/BootKeyboard.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/BootMouse.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/RawHID.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/SingleAbsoluteMouse.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/SingleConsumer.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/SingleGamepad.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/SingleNKROKeyboard.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/SingleReport/SingleSystem.cpp.o
    Compiling .pio/build/spi/libd81/HID-Project/port/samd.cpp.o
    Compiling .pio/build/spi/libeaf/ps2dev/ps2dev.cpp.o
    Archiving .pio/build/spi/lib822/libdigitalWriteFast.a
    Indexing .pio/build/spi/lib822/libdigitalWriteFast.a
    Compiling .pio/build/spi/lib519/SPI/SPI.cpp.o
    .pio/libdeps/spi/ps2dev/src/ps2dev.cpp: In member function 'int PS2dev::keyboard_reply(unsigned char, unsigned char*)':
    .pio/libdeps/spi/ps2dev/src/ps2dev.cpp:243:17: warning: variable 'enabled' set but not used [-Wunused-but-set-variable]
       unsigned char enabled;
                     ^
    Archiving .pio/build/spi/libd81/libHID-Project.a
    Archiving .pio/build/spi/libFrameworkArduinoVariant.a
    Indexing .pio/build/spi/libFrameworkArduinoVariant.a
    Indexing .pio/build/spi/libd81/libHID-Project.a
    Compiling .pio/build/spi/FrameworkArduino/CDC.cpp.o
    Archiving .pio/build/spi/lib519/libSPI.a
    Archiving .pio/build/spi/libeaf/libps2dev.a
    Indexing .pio/build/spi/lib519/libSPI.a
    Indexing .pio/build/spi/libeaf/libps2dev.a
    Compiling .pio/build/spi/FrameworkArduino/HardwareSerial.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/HardwareSerial0.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/HardwareSerial1.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/HardwareSerial2.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/HardwareSerial3.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/IPAddress.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/PluggableUSB.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/Print.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/Stream.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/Tone.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/USBCore.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/WInterrupts.c.o
    Compiling .pio/build/spi/FrameworkArduino/WMath.cpp.o
    .platformio/packages/framework-arduino-avr/cores/arduino/USBCore.cpp: In function 'bool ClassInterfaceRequest(USBSetup&)':
    .platformio/packages/framework-arduino-avr/cores/arduino/USBCore.cpp:378:5: warning: unused variable 'i' [-Wunused-variable]
      u8 i = setup.wIndex;
         ^
    Compiling .pio/build/spi/FrameworkArduino/WString.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/abi.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/hooks.c.o
    Compiling .pio/build/spi/FrameworkArduino/main.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/new.cpp.o
    Compiling .pio/build/spi/FrameworkArduino/wiring.c.o
    Compiling .pio/build/spi/FrameworkArduino/wiring_analog.c.o
    Compiling .pio/build/spi/FrameworkArduino/wiring_digital.c.o
    Compiling .pio/build/spi/FrameworkArduino/wiring_pulse.S.o
    Compiling .pio/build/spi/FrameworkArduino/wiring_pulse.c.o
    Compiling .pio/build/spi/FrameworkArduino/wiring_shift.c.o
    Archiving .pio/build/spi/libFrameworkArduino.a
    Indexing .pio/build/spi/libFrameworkArduino.a
    Linking .pio/build/spi/firmware.elf
    Building .pio/build/spi/firmware.hex
    Checking size .pio/build/spi/firmware.elf
    Advanced Memory Usage is available via "PlatformIO Home > Project Inspect"
    RAM:   [=         ]   9.9% (used 253 bytes from 2560 bytes)
    Flash: [===       ]  34.7% (used 9952 bytes from 28672 bytes)
    =================================================== [SUCCESS] Took 56.86 seconds ===================================================

    Environment    Status    Duration
    -------------  --------  ------------
    spi            SUCCESS   00:00:56.861
    =================================================== 1 succeeded in 00:00:56.861 ===================================================

    ************************************************************************************************************************************
    There is a new version 5.1.0 of PlatformIO available.
    Please upgrade it via `platformio upgrade` or `pip install -U platformio` command.
    Changes: https://docs.platformio.org/en/latest/history.html
    ************************************************************************************************************************************

    echo -n spi > .current
    make[1]: Leaving directory '/root/hid'
    [root@pikvm hid]# make install
    platformio run --environment spi --target upload
    Processing spi (platform: atmelavr; board: micro; framework: arduino)
    ------------------------------------------------------------------------------------------------------------------------------------
    Verbose mode can be enabled via `-v, --verbose` option
    CONFIGURATION: https://docs.platformio.org/page/boards/atmelavr/micro.html
    PLATFORM: Atmel AVR (3.1.0) > Arduino Micro
    HARDWARE: ATMEGA32U4 16MHz, 2.50KB RAM, 28KB Flash
    DEBUG: Current (simavr) On-board (simavr)
    PACKAGES:
     - framework-arduino-avr 5.1.0
     - tool-avrdude 1.60300.200527 (6.3.0)
     - toolchain-atmelavr 1.50400.190710 (5.4.0)
    LDF: Library Dependency Finder -> http://bit.ly/configure-pio-ldf
    LDF Modes: Finder ~ chain, Compatibility ~ soft
    Found 8 compatible libraries
    Scanning dependencies...
    Dependency Graph
    |-- <HID-Project> 2.6.1
    |   |-- <HID> 1.0
    |-- <ps2dev> 0.0.3+sha.a043002
    |-- <digitalWriteFast> 1.0.0
    |-- <SPI> 1.0
    Building in release mode
    Checking size .pio/build/spi/firmware.elf
    Advanced Memory Usage is available via "PlatformIO Home > Project Inspect"
    RAM:   [=         ]   9.9% (used 253 bytes from 2560 bytes)
    Flash: [===       ]  34.7% (used 9952 bytes from 28672 bytes)
    Configuring upload protocol...
    AVAILABLE: custom
    CURRENT: upload_protocol = custom
    Uploading .pio/build/spi/firmware.hex

    avrdude: AVR device initialized and ready to accept instructions

    Reading | ################################################## | 100% 0.00s

    avrdude: Device signature = 0x1e9587 (probably m32u4)
    avrdude: NOTE: "flash" memory has been specified, an erase cycle will be performed
             To disable this feature, specify the -D option.
    avrdude: erasing chip
    avrdude: reading input file ".pio/build/spi/firmware.hex"
    avrdude: writing flash (9952 bytes):

    Writing | ################################################## | 100% 2.78s

    avrdude: 9952 bytes of flash written
    avrdude: verifying flash memory against .pio/build/spi/firmware.hex:
    avrdude: load data flash data from input file .pio/build/spi/firmware.hex:
    avrdude: input file .pio/build/spi/firmware.hex contains 9952 bytes
    avrdude: reading on-chip flash data:

    Reading | ################################################## | 100% 2.33s

    avrdude: verifying ...
    avrdude: 9952 bytes of flash verified

    avrdude: safemode: Fuses OK (E:CB, H:D8, L:FF)

    avrdude done.  Thank you.

    =================================================== [SUCCESS] Took 7.54 seconds ===================================================

    Environment    Status    Duration
    -------------  --------  ------------
    spi            SUCCESS   00:00:07.536
    =================================================== 1 succeeded in 00:00:07.536 ===================================================
    [root@pikvm hid]# reboot
    ```
