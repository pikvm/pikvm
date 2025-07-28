---
title: Persistent storage
description: How to use the 256MiB partition on your PiKVM to store data
---

!!! note
    This feature is available on images newer than 2022.06.20

Sometimes advanced use of PiKVM requires storing some data on disk like
API keys, config files, or something like that. For example, you want to
have a script that will update SSL certificates once a week. However,
the root file system is in a read-only state and does not involve
remounting automatically by user scripts.

To solve this problem, new versions of PiKVM have a small 256MiB storage
partition that can be used to store that data. A special `kvmd-pst`
daemon makes sure that this partition is mounted in read-only all the
time, and remounts it to RW only when some user script requires it. This
also solves the problems of simultaneous access, so the RW mode will be
kept as long as at least one client is working with the storage.


## Usage

Below is an example of a script `/root/test.sh` that wants to save a certain file in PST:

```bash
#!/bin/bash
echo `date` + $@ > $KVMD_PST_DATA/foo
cat $KVMD_PST_DATA/foo
```

To run it use:
```
# kvmd-pstrun -- /root/test.sh --some --script --args
--    INFO -- Opening PST session ...
--    INFO -- PST write is allowed: /var/lib/kvmd/pst/data
--    INFO -- Running the process ...
Mon Jun 20 04:23:14 MSK 2022 + --some --script --args
--    INFO -- Process finished: returncode=0
```

So, what's going on here:

1. `kvmd-pstrun` connects to the `kvmd-pst` daemon, which manages the mounting of the storage.

2. If everything is fine, the daemon will remount the storage to RW mode and report the data root to `kvmd-pstrun`.

3. `kvmd-pstrun` runs the script and pass the data root path using the environment variable `KVMD_PST_DATA` (`/var/lib/kvmd/pst/data`).

4. If the `kvmd-pst` daemon stops or any other daemon error occurs, the script will be killed.

5. After the script is finished, the daemon will remount the storage to RO mode.

To be able to write to the storage, the user must be a member of `kvmd-pst` group, or have to be `root`.

The return code will be equal to the script code if it was run, or 1 if a remount error occurred.
