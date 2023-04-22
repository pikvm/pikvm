# Cloudflare Tunnels

[Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) can be used to access PiKVM over the internet securely using Cloudflare Zero Trust with the `cloudflared` daemon. This is a convenient and free (for private use) tool for allowing access to web services running on your internal network without port forwarding or IPv4/IPv6 compatability issues. This document is provided as an example for accessing your PiKVM over the internet but you can also use Zerotier/[Tailscale](tailscale.md)/*Insert XYZ VPN service here*. Basic support like whats shown below is provided as an example, any other setting or functionality needs to be redirected to the appropriate community.


## Prequisites
  
1. A domain utilizing Cloudflare for DNS

2. A Cloudflare tunnel configured with an application created and secured by an access policy


## Cloudflare Tunnel Steps

1. Login to Cloudflare and provision a tunnel using the steps [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/remote/). Save the tunnel token as we will need this later. In most cases the target will be https://localhost 

2. Create a self-hosted application with the URL matching one created in the previous step by following the steps [here](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/). 

   * You will need to check the http options to disable SSL certificate verification under `Tunnels -> Configure -> Public Hostname -> yourapplication.yourdomain -> Edit -> TLS Settings -> No TLS Verify` as the PiKVM uses self-signed certificates.

   * Don't skip the access policies as this important to preventing randoms from the internet from gaining access to your PiKVM. Cloudflare offers a variety of login options with the simplest being One-time PINs that are emailed to you. NOTE: This external authentication will not replace the username/password for the PiKVM but instead supplement it acting as a first line of defense from the internet.
  

## Installation

Unfortunately Cloudflare does not provide binaries for ARM so we need to compile from source to generate a working build. 


### On the PiKVM side

1. Use these commands:

    ```
    # rw
    # pacman -Syu go
    # curl -s https://api.github.com/repos/cloudflare/cloudflared/releases/latest | grep "tarball_url" | cut -d '"' -f 4 | xargs curl -LJo cloudflared-latest.tar.gz
    # tar -xzvf cloudflared-latest.tar.gz --transform 's|[^/]*/|cloudflared/|'
    # cd cloudflared/cmd/cloudflared/
    # go build
    # mv cloudflared /usr/bin/cloudflared
    # cloudflared version
    ```

2. Create the service configuration file
   
    ```
    # systemctl edit --full cloudflared.service
    ```

3. Insert the following configuration replacing TOKEN VALUE with your token from the Cloudflare tunnel step.

    ```ini
    [Unit]
    Description=Cloudflare Tunnel
    After=network.target

    [Service]
    TimeoutStartSec=0
    Type=notify
    ExecStart=/usr/bin/cloudflared --protocol quic tunnel run --token <TOKEN VALUE>
    Restart=on-failure
    RestartSec=5s
    ```

4. Afterwards verify service is started and stays running

    ```
    # systemctl enable --now cloudflared
    # systemctl status cloudflared
    ```

5. Open a web browser and attempt


## Updating cloudflared

Use these commands to update the ```cloudflared``` daemon:
  
```
# rw
# rm -rf cloudflared/
# curl -s https://api.github.com/repos/cloudflare/cloudflared/releases/latest | grep "tarball_url" | cut -d '"' -f 4 | xargs curl -LJo cloudflared-latest.tar.gz
# tar -xzvf cloudflared-latest.tar.gz --transform 's|[^/]*/|cloudflared/|'
# cd cloudflared/cmd/cloudflared/
# go build && mv cloudflared /usr/bin/cloudflared
# systemctl restart cloudflared
```
