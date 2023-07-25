# Cloudflare Tunnels

!!! warning
	This is unofficial instructions proposed by the community. We don't officially support this and don't know what problems may arise when using cloudflared.

[Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) can be used to access PiKVM over the internet securely using Cloudflare Zero Trust with Cloudflared. This is a convenient and free (for 50 users) tool for allowing access to web services running on your internal network without port forwarding or IPv4/IPv6 compatability issues. This document is provided as an example for accessing your PiKVM over the internet but you can also use Zerotier/[Tailscale](tailscale.md)/*Insert XYZ VPN service here*. Basic support like whats shown below is provided as an example, any other setting or functionality needs to be redirected to the appropriate community.

!!! note "If you get error 1033"
    You might need to add `127.0.0.1 localhost` into your /etc/hosts file

## Prequisites
  
1. A domain utilizing Cloudflare for DNS

2. A Cloudflare tunnel configured with an application created and secured by an access policy

3. Custom firewall rules configured in Cloudflare as needed


## Cloudflare Tunnel Steps

1. Login to Cloudflare and provision a tunnel using the steps [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/remote/). Save the tunnel token as we will need this later. In most cases the target will be https://localhost 

2. Create a self-hosted application with the URL matching one created in the previous step by following the steps [here](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/). 

   * You will need to check the http options to disable SSL certificate verification under `Tunnels -> Configure -> Public Hostname -> yourapplication.yourdomain -> Edit -> TLS Settings -> No TLS Verify` as the PiKVM uses self-signed certificates.

   * Don't skip the access policies as this important to preventing randoms from the internet from gaining access to your PiKVM. Cloudflare offers a variety of login options with the simplest being One-time PINs that are emailed to you. NOTE: This external authentication will not replace the username/password for the PiKVM but instead supplement it acting as a first line of defense from the internet.
  

## Installation on the PiKVM

1. Use these commands to install Cloudflared:

    ```
    # rw
    # curl -L -o /usr/local/bin/cloudflared "$(curl -s "https://api.github.com/repos/cloudflare/cloudflared/releases/latest" | grep -e 'browser_download_url.*/cloudflared-linux-armhf"' | sed -e 's/[\ \":]//g' -e 's/browser_download_url//g' -e 's/\/\//:\/\//g')"
    # chmod +x /usr/local/bin/cloudflared
    # cloudflared version
    ```
    
2. Install the Cloudflare tunnel service to Cloudflared:
   
    ```
    # sudo cloudflared service install SERVICE_TOKEN_HERE
    ```
    

3. Open a web browser and attempt to connect

4. Drop back in to read only mode
   
    ```
    # ro
    ```

## Updating Cloudflared

Use these commands to update Cloudflared:
  
```
# rw
# cloudflared update
# ro
```
