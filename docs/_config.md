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

    You can also create several files with the `.*yaml` suffix and put then into `/etc/kvmd/override.d` directory
    to split your customization into logical parts.
    The `override.yaml` file definitions takes precedence over the `override.d` directory.

    A complete list of all parameters can be viewed using the `kvmd -m` command.

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

    In the `/etc/kvmd/meta.yaml` file you can specify some information regarding this PiKVM installation in an almost free YAML format.
