---
title: Reverse proxy
description: How to configure a reverse proxy on your PiKVM
---

A reverse proxy allows you to pass requests through your web server to
another site or program. The reverse proxy will make it look like PiKVM
Web UI is a page within your existing site.

This is especially useful if:

* You need to access the WebUI on port `80` or `443` but you already host a website on the same device.

* You want to share SSL certificates with an existing site.

* You want to share authentication with an existing setup.


-----
## PiKVM Configuration

PiKVM supports reverse proxying since KVMD 4.51. For older version, please update OS first:

{!_update_os.md!}

By default, PiKVM redirects all requests from HTTP port `80` to HTTPS port `443` with self-signed
certificate. For the simplest configuration, you can leave it as it is, and terminate
SSL traffic from PiKVM on your web server.

Alternatively, you can change the HTTP and HTTPS ports on PiKVM or disable HTTPS at all
to deliver HTTP-only traffic to your server.

In both cases you should take care of your own SSL certificate for your web server because
when using HTTP-only access to your website, you will lose the ability to use some features
such as [Direct H.264](video.md) streaming, because browser security policies will require
HTTPS for them.

??? example "Various examples with changing HTTP/HTTPS settings"

    PiKVM uses Nginx internally, so don't be confused by its own configuration,
    it has nothing to do with your reverse proxy if you're using Nginx too.

    * Changing HTTP and HTTPS ports. Place this config to `/etc/kvmd/override.yaml` on PiKVM:

        ```yaml
        nginx:
            https:
                port: 4430
            http:
                port: 8080
        ```

    * Disabling HTTPS. All requests will be handled via HTTP port `80`.

        ```yaml
        nginx:
            https:
                enabled: false
        ```

    Don't forget to run `systemctl restart kvmd-nginx` to apply your changes.

-----
## Server Configuration

If you have access to your web server’s configuration use the following examples
to pass the location `/pikvm` on the server to PiKVM Web UI hosted on `https://pikvm.local`
on HTTPS port `443`.


### Nginx

Nginx does not validate certificates by default and PiKVM's self-signed certificate is fine for it.

```nginx
location /pikvm {
    rewrite ^/pikvm$ / break;
    rewrite ^/pikvm\?(.*)$ ?$1 break;
    rewrite ^/pikvm/(.*)$ /$1 break;
    proxy_redirect ~^(/.*)$ /pikvm$1;
    proxy_pass https://pikvm.local;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Scheme $scheme;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # For some handles (like MJPEG) buffering should be disabled
    postpone_output 0;
    proxy_buffering off;
    proxy_ignore_headers X-Accel-Buffering;

    # Some handles (ends with /ws) are WebSockets
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_connect_timeout 7d;
    proxy_send_timeout 7d;
    proxy_read_timeout 7d;

    # Some other handles requires big POST payload
    client_max_body_size 0;
    proxy_request_buffering off;
}
```


### Caddy

Caddy doesn't like self-signed certificates, so we'll have to convince it that it's okay.

```nginx
handle_path /pikvm/* {
    reverse_proxy https://pikvm.local {
        transport http {
            tls_insecure_skip_verify  # Same behaviour as Nginx
        }
        header_up Host {upstream_hostport}
        header_down Location "^(/.*)$" "/pikvm$1"
    }
}
```
