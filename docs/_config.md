---
search:
    exclude: true
---


??? note "Configuring PiKVM OS"

    !!! tip "Need more info? We have it!"

        The following is a brief guide to configuring PiKVM.
        For more information (including the basics of YAML syntax and how to use a text editor in the Linux console),
        please refer to [this page](config.md).

    Most of the PiKVM configuration files are located in the `/etc/kvmd` directory.

    The `/usr/lib/kvmd/main.yaml` file defines the platform configuration, and **you should never edit it**.
    To redefine system parameters use the file `/etc/kvmd/override.yaml`.
    All other files that are also not recommended for editing have read-only permissions.

    For automated deployment, you can put `.*yaml` files into `/etc/kvmd/override.d` directory.
    The `override.yaml` file definitions takes precedence over the `override.d` directory
    and it is intended for local manual configuration.

    A complete list of all parameters can be viewed using the `kvmd -m` command.

    A list of your non-default overrides can be viewed using the `kvmd -M` command.

    Files with the `*.yaml` suffix uses the [YAML syntax](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)
    and describes a parameter tree with key-value pairs of different types.
    To define the parameters within one section, an indent of 4 spaces is used.
    Comments starts with the `#` symbol.

    !!! warning "Only 4 spaces should be used for indentation"
        Be careful when editing YAML and follow this rule.
        Invalid indentation or tabs instead of spaces will cause an error when starting the services.

    Sections under the same keys **should be merged**:

    * **Wrong:**

        ```yaml
        kvmd:
            gpio:
                drivers: ...
        kvmd:
            gpio:
                scheme: ...
        ```

    * **Correct:**

        ```yaml
        kvmd:
            gpio:
                drivers: ...
                scheme: ...
        ```

    For simple config overrides you don't need to use a text editor, you can do this with `kvmd-override` command.
    For example, [enabling the microphone audio on PiKVM V3/V4](audio.md#microphone-outgoing-audio):

    ```console
    [root@pikvm ~]# kvmd-override --set otg/devices/audio/enabled=true
    ```

    This puts a config override looks like this:

    ```yaml
    otg:
        devices:
            audio:
                enabled: true
    ```

    In the `/etc/kvmd/meta.yaml` file you can specify some information regarding this PiKVM installation in an almost free YAML format.
