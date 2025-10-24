# Advanced authentication methods

PiKVM provides flexible authentication options to integrate with your existing security infrastructure. By default, PiKVM uses a simple file-based authentication system (htpasswd), but it can be configured to authenticate users against external systems for enterprise environments.

This guide covers the configuration of PiKVM's authentication methods. All external authentication servers (LDAP, RADIUS, HTTP auth servers) are assumed to be already configured and accessible from your PiKVM device.

!!! warning
    This is advanced material. Before you try setting this up, we recommend (re)familirizing yourself with the documentation on [configuration](config.md) and taking another look at the [cheat sheet](cheatsheet.md).
    
    Whenever you customize authentication, restart kvmd:

    ```shell
    $ systemctl restart kvmd
    ```

## Overview

PiKVM supports the following authentication methods through its pluggable authentication system:

- **HTTP Authentication**: External HTTP-based authentication service integration. PiKVM forwards authentication requests to a custom HTTP API endpoint.
- **PAM (Pluggable Authentication Modules)**: Integration with Linux PAM system, allowing authentication against system users, LDAP, Active Directory, and other PAM-supported backends.
- **LDAP (Lightweight Directory Access Protocol)**: Direct LDAP authentication against directory servers like Active Directory, OpenLDAP, or other LDAP-compatible systems.
- **RADIUS (Remote Authentication Dial-In User Service)**: Authentication against RADIUS servers, commonly used in enterprise networks with support for multi-factor authentication.
- **Unix Socket Credentials**: Process-based authentication using Unix domain sockets with credential passing for local system integration.

## Authentication methods comparison

| Method | Best For | Complexity | External Dependencies |
|--------|----------|------------|----------------------|
| **HTTP Auth** | Custom authentication systems, microservices | Low | HTTP auth server |
| **PAM** | System integration, existing PAM setups | Medium | PAM modules | Via PAM modules |
| **LDAP** | Active Directory, directory services | Medium | LDAP server |
| **RADIUS** | Enterprise networks, centralized auth | Medium | RADIUS server |
| **Unix Socket Credentials** | Local process integration, containers | Low | Local processes |

2FA/TOTP is [always available](/auth/#two-factor-authentication) works locally and is compatible with all the methods listed here.

## Basic configuration

You can customize authentication and authorization with `/etc/kvmd/override.yaml`. If you want to keep the configuration modular, create and edit `/etc/kvmd/override.d/9999-auth.yaml` instead. You can use any 4-digit number prepending the filename.

Here are the keys you need to know about.

### `enabled`

This is a global authentication switch, enabled by default:

```yaml
kvmd:
    auth:
        enabled: true
```

Setting it to `false` will disable all authentication, regardless of the methods you configured.

### `expire`

This key sets the cookie expiration time measured in seconds. Please see [this part of the documentation](auth.md#session-expiration) for details.

In this example, the cookie will expire in 10 minutes:

```yaml
kvmd:
    auth:
        expire: 600
```

### `usc`

This group of keys is in charge for basic configuration of Unix Socket Credentials:

- `users`: this key is for listing valid usernames
- `groups`: this key is for listing valid user groups

Here is a configuration example:

```yaml
kvmd:
    auth:
        usc:
            users: [cyril,jane,mike,sheryl]
```

### `internal` and `external`

`internal` is the authentication method that is applied first, `external` is used for external services. Note that there is no fallback from `external` to `internal`.

`kvmd` defaults to using `htpasswd` as the internal method and doesn't set the external one:

```yaml
kvmd:
    auth:
        internal:
            type: htpasswd
            force_users: []
            file: /etc/kvmd/htpasswd

        external:
            type: ''
```

The recommended configuration is either `htpasswd` or `pam` as the internal authentication method and any other method as the external one. In that case, do the following:

1. Keep the default `admin` user.
2. [Change its password](auth.md#changing-the-kvm-password) to a random 30 characters long one (e.g., use `pwgen -y 30`).
3. Keep `htpasswd` as the internal method.
4. Use `ldap` or any other method as the external one, depending on your use case.

Here is a configuration example:

```yaml
kvmd:
    auth:
        internal:
            #type: htpasswd
            force_users: [admin]
            #file: /etc/kvmd/htpasswd

        external:
            type: ldap
            ...
```

Type and file are defaults in the above example.

However, if your LDAP server has a guaranteed high availability, you _can_ use `ldap` as an internal authentication method and discard the external authentication method entirely.

### `totp`

You can pass the secret file along with the password. The secret file location defaults to `/etc/kvmd/totp.secret`. [See here](auth.md#two-factor-authentication) for more information on 2FA authenticaion on PiKVM.

## HTTP authentication

The HTTP authentication plugin delegates credential validation to an external HTTP/HTTPS endpoint. This enables integration with custom authentication services and third-party identity providers.

The plugin sends authentication requests as JSON POST requests to a configurable URL and grants access when the endpoint returns `HTTP 200 OK`. This approach allows you to implement complex authentication logic without modifying PiKVM's core code.

For an example of using HTTP authentication, please see [this GitHub repository](https://github.com/pikvm/kvmd-auth-server).

### Parameters

#### `url`

The URL of the external HTTP authentication endpoint. PiKVM will send POST requests to this URL to authenticate users.

- **Type:** String (URL)
- **Default value:** `"http://localhost/auth"`
- **Examples:**
    - `http://localhost:8080/api/auth` - Local authentication service
    - `https://auth.example.com/validate` - Remote HTTPS endpoint
    - `http://10.0.0.100/auth` - Internal network service
- **Note:** The endpoint must accept POST requests with JSON payload.

#### `verify`

Controls SSL/TLS certificate verification when using HTTPS URLs.

- **Type:** Boolean
- **Default value:** `true`
- **Acceptable values:** `true` and `false`
- **Behavior:**
    - `true`: Verifies the server's SSL/TLS certificate (recommended for production)
    - `false`: Disables certificate verification (useful for self-signed certificates or testing)
- **Note:** Only applies when using `https://` URLs. When set to `false`, SSL is completely disabled.

#### `secret`

An optional shared secret token sent in the authentication request JSON payload. This can be used by the authentication endpoint to verify that requests are coming from an authorized PiKVM instance.

- **Type:** String
- **Default value:** `""` (empty string)
- **Use Case:** Provides an additional layer of security to prevent unauthorized services from using your authentication endpoint.
- **Note:** The secret is sent as part of the JSON body, not as a header.

#### `user`

Optional username for HTTP basic authentication to the authentication endpoint itself. Used when the authentication service requires its own authentication.

- **Type:** String
- **Default value:** `""` (empty string)
- **Note:** Works in combination with the `passwd` parameter. If `user` is empty, Basic Auth is not used.

#### `passwd`

Optional password for HTTP basic authentication to the authentication endpoint. Used in combination with the `user` parameter.

- **Type:** String
- **Default value:** `""` (empty string)
- **Note:** Only used when `user` is configured.

#### `timeout`

The total timeout for the HTTP authentication request. If the authentication endpoint doesn't respond within this time, the authentication attempt fails.

- **Type:** Float (≥ 0.1)
- **Default value:** `5.0`
- **Unit:** Seconds
- **Considerations:**
  - Network latency to the authentication endpoint
  - Processing time on the authentication server
  - Balance between security (shorter timeout) and reliability (longer timeout)

### Authentication flow

1. **Session Creation:** Create or reuse an HTTP client session configured with:
   - SSL verification settings (based on `verify` parameter)
   - Basic Authentication credentials (if `user` is configured)

2. **Request Construction:** Create a POST request to the configured `url` with:
    - **Method:** POST
    - **Content-Type:** application/json
    - **Headers:**
        - `User-Agent`: "KVMD" with version information
        - `X-KVMD-User`: The username being authenticated
    - **JSON Body:**
     ```json
        {
          "user": "username",
          "passwd": "password",
          "secret": "shared_secret"
        }
     ```

3. **Request Transmission:** Send the HTTP request to the authentication endpoint

4. **Response Processing:** Wait for response (up to timeout period)

5. **Authorization Decision:** Grant access if:
    - The response is received within the timeout
    - The HTTP status code is 200 (OK)
    - Any other status code (including 401, 403, 404, etc.) results in authentication failure

### Authentication endpoint requirements

1. **Accept POST requests** with JSON payload

2. **Parse the JSON body** containing:
    - `user`: The username attempting to authenticate
    - `passwd`: The password provided by the user
    - `secret`: The shared secret (if configured)
3. **Validate credentials** according to your authentication logic

4. **Return appropriate HTTP status codes:**
    - `200 OK`: Authentication successful
    - `401 Unauthorized`: Invalid credentials
    - `403 Forbidden`: User not authorized
    - Any other status code: Authentication failure

### Basic configuration example

```yaml
kvmd:
    auth:
        internal:
            type: http
            url: http://localhost:8080/api/auth
            verify: true
            secret: ""
            user: ""
            passwd: ""
            timeout: 5.0
```

## PAM plugin configuration

The PAM authentication plugin leverages Linux's [Pluggable Authentication Modules framework](https://github.com/linux-pam/linux-pam) to authenticate users against the same mechanisms used by the underlying operating system. 

This plugin supports any authentication backend configured through PAM, including local user accounts, SSSD for Active Directory, LDAP, Kerberos, or any other PAM-compatible service.

It also includes access control features such as username whitelists/blacklists and UID-based filtering to prevent system accounts from authenticating.

### Parameters

#### `service`

Specifies the PAM service name to use for authentication. This corresponds to a configuration file in `/etc/pam.d/` on the system. The default value `login` uses the standard PAM login service configuration.

- **Type:** String
- **Default:** `"login"`

#### `allow_users`

A whitelist of usernames that are explicitly allowed to authenticate. If the list is empty, this check is bypassed, all users are allowed and are subject to other checks.

- **Type:** List of strings
- **Default:** `[]` (empty list)
- **Behavior:** When a user attempts to authenticate:
    - If the list is not empty and the user is not in the list, authentication fails with an error message.

#### `deny_users`

A blacklist of usernames that are explicitly denied authentication. Users in this list cannot authenticate regardless of their credentials.

- **Type:** List of strings
- **Default:** `[]` (empty list)
- **Behavior:** When a user attempts to authenticate:
    - If the user is in the deny list, authentication fails with an error message.

#### `allow_uids_at`

Specifies a minimum UID (User ID) threshold for authentication. Only users with UIDs greater than or equal to this value are allowed to authenticate. A value of `0` disables this check.

- **Type:** Integer (≥ 0)
- **Default:** `0`
- **Behavior:** When set to a value greater than 0:
    - The plugin retrieves the UID of the authenticating user from the system
    - If the user's UID is less than the configured threshold, authentication fails
    - This is useful for preventing system users (typically UIDs < 1000) from authenticating
- **Use case:** Commonly used to restrict authentication to regular user accounts and prevent service accounts or system users from accessing the interface.

### Authentication flow

The authentication process follows the steps in the following order:

1. **Allow list check:** If `allow_users` is configured, verify the user is in the list
2. **Deny list check:** If `deny_users` is configured, verify the user is not in the list
3. **UID threshold check:** If `allow_uids_at` > 0, verify the user's UID meets the minimum threshold
4. **PAM authentication:** Finally, authenticate the user credentials against the specified PAM service

All checks must pass for authentication to succeed.

### Basic configuration example

```yaml
kvmd:
    auth:
        internal:
            type: pam
            service: login
            allow_users: [admin, operator, viewer]
            deny_users: [guest, test]
            allow_uids_at: 1000
```

This configuration would:

- Use the standard "login" PAM service
- Only allow users named `admin`, `operator`, or `viewer`
- Explicitly deny users named `guest` or `test`
- Only allow users with UID ≥ 1000 (excluding most system accounts)

### Advanced PAM configuration examples

- Multiple PAM modules (stacking)
- Time-based restrictions (pam_time)
- Access control lists (pam_access)
- Account lockout policies

---

## LDAP plugin configuration

The LDAP authentication plugin integrates with LDAP directories and Active Directory environments for centralized user management.

The plugin authenticates users through LDAP bind operations and validates group membership to enforce authorization policies, so that only users in specified security groups can access the KVM interface.

It supports both standard LDAP and secure LDAPS connections with configurable certificate verification, optional domain suffix auto-appending, and timeout settings.

### Parameters

#### `url`

The LDAP server URL, should be in either `ldap://hostname:port` or the `ldaps://hostname:port` format.

- **Type:** String (non-empty)
- **Default:** `""` (empty string, must be configured)
- **Required:** Yes
- **Examples:**
  - `ldap://dc.example.com:389` - Standard LDAP
  - `ldaps://dc.example.com:636` - LDAP over SSL/TLS
- **Note:** When using `ldaps://`, the plugin automatically configures TLS options.

#### `verify`

Controls SSL/TLS certificate verification when using LDAPS connections.

- **Type:** Boolean
- **Default:** `True`
- **Behavior:**
  - `true`: Verifies the server's SSL/TLS certificate (recommended for production)
  - `false`: Disables certificate verification (useful for self-signed certificates or testing)
- **Note:** Only applies when using `ldaps://` URLs.

#### `base`

The LDAP base DN (Distinguished Name) where user searches will start. This defines the starting point in the directory tree for user lookups.

- **Type:** String (non-empty)
- **Default:** `""` (empty string, must be configured)
- **Required:** Yes
- **Example:** `DC=example,DC=com` or `OU=Users,DC=example,DC=com`

#### `group`

The full DN of the LDAP/Active Directory group that users must be members of to authenticate successfully. Only users who are members of this group will be granted access.

- **Type:** String (non-empty)
- **Default:** `""` (empty string, must be configured)
- **Required:** Yes
- **Example:** `CN=PiKVM-Users,OU=Groups,DC=example,DC=com`
- **Note:** The plugin checks for exact group membership using the `memberOf` attribute.

#### `user_domain`

An optional domain suffix to append to usernames during authentication. When configured, the username will be transformed to `username@user_domain` format (User Principal Name format).

- **Type:** String
- **Default:** `""` (empty string)
- **Examples:**
  - If set to `example.com` and user enters `john`, the plugin authenticates as `john@example.com`
  - If empty, the username is used as-is
- **Use Case:** Simplifies login by allowing users to enter just their username instead of the full UPN.

#### `timeout`

Timeout value for LDAP operations (bind and search). If the LDAP server doesn't respond within this time, the operation fails.

- **Type:** Integer (≥ 1)
- **Default:** `5`
- **Unit:** Seconds
- **Recommendation:** Adjust based on network latency and LDAP server performance.

### Authentication flow

The authentication process works as follows:

1. **Username transformation:** If `user_domain` is configured, append it to the username (e.g., `user` > `user@example.com`).

2. **Connection initialization:** Connect to the LDAP server specified in `url`.

3. **TLS configuration:** If using `ldaps://`, configure TLS settings based on the `verify` parameter.

4. **Bind attempt:** Attempt to bind (authenticate) to the LDAP server using the username and password.

5. **Group membership search:** Search for the user in the directory and verify they are a member of the specified `group`.

6. **Authorization decision:** Grant access only if:
    - The bind (authentication) succeeds
    - The user is found in the directory under the specified `base`
    - The user is a member of the specified `group`

### Basic configuration example

```yaml
kvmd:
    auth:
        internal:
            type: ldap:
                url: ldaps://dc.example.com:636
                verify: true
                base: DC=example,DC=com
                group: CN=PiKVM-Admins,OU=Security Groups,DC=example,DC=com
                user_domain: example.com
                timeout: 5
```

### Configuration with a self-signed certificate

```yaml
kvmd:
    auth:
        internal:
            type: ldap:
            url: ldaps://dc.internal.local:636
            verify: false
            base: OU=Users,DC=internal,DC=local
            group: CN=KVM-Users,OU=Groups,DC=internal,DC=local
            user_domain: internal.local
            timeout: 10
```

### Configuration for standard LDAP (non-SSL)

```yaml
kvmd:
    auth:
        internal:
            type: ldap
            url: ldap://ldap.example.com:389
            verify: true
            base: DC=example,DC=com
            group: CN=RemoteAccess,DC=example,DC=com
            user_domain: ""
            timeout: 5
```

---

## RADIUS plugin configuration

This plugin enables authentication against RADIUS (Remote Authentication Dial-In User Service) servers. Supported features:

- Standard RADIUS Access-Request/Access-Accept protocol over UDP.
- Password encryption using the RADIUS shared secret mechanism.
- Supports any RFC 2865-compliant server (FreeRADIUS, Microsoft NPS, Cisco ISE).

### Parameters

#### `host`

The hostname or IP address of the RADIUS authentication server.

- **Type:** String (IP address or hostname)
- **Default:** `"localhost"`
- **Examples:**
    - `192.168.1.100` - IP address
    - `radius.example.com` - Hostname
    - `localhost` - Local RADIUS server

#### `port`

The UDP port number on which the RADIUS server is listening for authentication requests.

- **Type:** Integer (valid port number: 1-65535)
- **Default:** `1812`
- **Standard ports:**
    - `1812` - Standard RADIUS authentication port (recommended, RFC 2865)
    - `1645` - Legacy RADIUS authentication port (deprecated but sometimes still used)

#### `secret`

The shared secret (password) used to encrypt communication between the PiKVM client and the RADIUS server. This must match the shared secret configured on the RADIUS server for this client.

- **Type:** String
- **Default:** `""` (empty string, must be configured)
- **Required:** Yes
- **Security:** 
    - This value should be kept confidential and stored securely
    - Use a strong, random secret
    - The secret is used for encrypting user passwords in transit and authenticating packets
- **Note:** The secret is encoded as ASCII before use.

#### `timeout`

The timeout value for RADIUS authentication requests. If the RADIUS server doesn't respond within this time, the authentication attempt fails.

- **Type:** Integer (≥ 1)
- **Default:** `5`
- **Unit:** Seconds
- **Considerations:**
    - Network latency between PiKVM and RADIUS server
    - RADIUS server load and response time
    - Consider increasing for servers on slow or distant networks
  
### Authentication flow

The authentication process works as follows:

1. **Dictionary loading:** Load the RADIUS attribute dictionary (embedded FreeRADIUS dictionary format)

2. **Client creation:** Create a RADIUS client configured with:
    - Server hostname/IP
    - Authentication port
    - Shared secret (encrypted)
    - Timeout value

3. **Packet creation:** Create a RADIUS Access-Request packet containing:
    - Username (`User-Name` attribute)
    - Encrypted password (`User-Password` attribute, encrypted using the shared secret)

4. **Request transmission:** Send the authentication packet to the RADIUS server via UDP

5. **Response processing:** Wait for response (up to timeout period)

6. **Authorization decision:** Grant access if:
    - A response is received within the timeout
    - The response code is `AccessAccept` (code 2)

### Basic Configuration Example

```yaml
kvmd:
    auth:
        radius:
            host: radius.example.com
            port: 1812
            secret: "MySharedSecret123"
            timeout: 5
```

## Unix Socket Credentials configuration

USC is a built-in mehanism that is primarily used for authorizing local PiKVM microservices, such as [VNC](vnc.md) и [IPMI](ipmi.md). You can use this method to execute scripts that use the local [KVMD API](api.md). 

For example, the following command will authenticate a script with a unix socket and return PiKVM status:

```
[root@pikvm ~]# sudo -u monitoring curl --unix-socket /run/kvmd/kvmd.sock http://localhost/info
```

Note that there is no `api` prefix used when accessing the API. The prefix is added by KVMD-Nginx when exposing the socket on ports 80 and 443.

For scheduling the execution, you can use either [systemd-timers](https://wiki.archlinux.org/title/Systemd/Timers) (available by default and recommended) or cron (not installed by default).

Here are some best practices:

- Never add system users (start with `kvmd-*`) to any of the lists below, unless you are 100% sure you know what you are doing.
- Adding the `root` user to the `users` list is a really bad idea. We srongly recommed against doing that.
- `kvmd-webterm` is the only KVMD user we can recommend adding to the `users` list. Once you've done it, you can use `/run/kvmd/kvmd.sock` from the web terminal without authentication.
- It's best to create a per-script user, add it to the `users` list, and then schedule the script execution.

### Parameters

#### `users`

List of Unix usernames that are allowed to authenticate via Unix Socket Credentials. Any user in this list can connect to KVMD's Unix socket and be automatically authenticated.

- **Type:** List of strings
- **Default:** `[]` (empty list)

#### `groups`

List of Unix group names whose members are allowed to authenticate via Unix Socket Credentials. Any user who is a member of one of these groups can connect to KVMD's Unix socket and be automatically authenticated.

- **Type:** List of strings
- **Default:** `[]` (empty list)

#### `kvmd_users` and `kvmd_groups`

These two lists are reserved for system users and groups. They should **never** be customized. 

### Authentication flow

When a client connects to KVMD through its Unix socket (`/run/kvmd/kvmd.sock`), the following authentication process occurs:

1. **Connection establishment.** The client process opens a connection to the Unix socket: `/run/kvmd/kvmd.sock`

2. **Kernel credential passing**. The Linux kernel automatically attaches the connecting process's credentials to the socket connection:
    - UID (User ID) - The numeric user ID of the process
    - GID (Group ID) - The primary group ID of the process
    - Supplementary groups - Additional groups the user belongs to

    This happens transparently at the kernel level using the `SO_PEERCRED` socket option.

3. **Credential retrieval**.. KVMD receives the connection and extracts the peer credentials from the socket. It obtains:
    - The username (resolved from UID)
    - The primary group name (resolved from GID)
    - All supplementary group names the user is a member of
.
4. **Authorization check**. KVMD compares the credentials against the user whitelist and the group whitelist. If the connecting user is a member of ANY group in the groups list (primary or supplementary), authentication succeeds.

5. **Access decision**.
    - **Success**: If either the user check or group check passes, the connection is authenticated and the client gains full API access.
    - **Failure**: If neither check passes, the connection is rejected and must use standard HTTP authentication instead.

### Basic configuration example

In the following example, processes run from users `monitoring` and `backup-service` are allowed to authenticate:

```yaml
kvmd:
    auth:
        usc:
            users: ["monitoring", "backup-service"]
```

Both users should exist prior to listing them in configuration. You can use `useradd` to create these users.