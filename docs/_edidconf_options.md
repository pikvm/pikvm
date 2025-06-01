---
search:
    exclude: true
---

!!! tip "Quick IDs changing on PiKVM V4 Plus"

    PiKVM V4 Plus has a simple way read and adopt display identifiers like model and serial number
    from your physical display. See [here](edid.md#adopt-real-display-indentifiers-on-v4-plus) for details.

Run `kvmd-edidconf` on PiKVM:

```console
[root@pikvm ~]# kvmd-edidconf
Manufacturer ID: LNX
Product ID:      0x7773 (30579)
Serial number:   0x01010101 (16843009)
Monitor name:    PiKVM V4 Plus
Monitor serial:  CAFEBABE
Audio:           yes
```

The fields have obvious names and purposes. Note the two similar fields `Serial number` and `Monitor serial`.
The first has a numeric value, and the second is ASCII. If you are using a custom EDID from some real display, some fields may be missing.

To change the values of the EDID fields, use the `kvmd-edidconf` with options, a complete list is available in `kvmd-edidconfi --help`.

Here the small example of changing all available fields from the previous listing:

```console
[root@pikvm ~]# rw
[root@pikvm ~]# kvmd-edidconf --set-mfc-id=TTP --set-product-id=0x5B81 --set-serial=0x8DE11B79 --set-monitor-name=TOSHIBA --set-monitor-serial=ABCD1234 --apply
Manufacturer ID: TTP
Product ID:      0x5B81 (23425)
Serial number:   0x8DE11B79 (2380340089)
Monitor name:    TOSHIBA
Monitor serial:  ABCD1234
Audio:           yes
...
[root@pikvm ~]# ro
```

The full list of manufacturer IDs is available [here](https://uefi.org/pnp_id_list).
