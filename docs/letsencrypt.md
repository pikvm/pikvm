# Let's Encrypt certificates

PiKVM uses self-signed SSL certificates out of the box. If you have a domain name, you can use Let's Encrypt certificates.

Usually Let's Encrypt certificates are issued and updated automatically using Certbot, however, since PiKVM uses a read-only
file system, special tools around Certbot are required to work with certificates. KVMD 3.117 provides them.

!!! note
    This feature is available on images as old as 2022.06.19 since it requires [PST storage partition on SD card](pst.md).
    Ports 80+443 need to be opened if you are port forwarding for this to work properly.


## Basic setup

1. Update the OS and make sure that you are using a new image with [PST storage](pst.md).
   ```
   # rw
   # pacman -Syu
   # reboot
   ...
   # kvmd-pstrun -- true
   ```
   If the storage is not available, you need to [reflash the OS image](flashing_os.md) to the latest one from our official website.

2. Switch filesystem to RW and obtain the certificate (for example, `pikvm.example.com`. The method depends on the network configuration. In the simplest case, if PiKVM is open for access from the Internet, it is recommended to use the webroot. Another examples will be described below.
   ```
   # rw
   # kvmd-certbot certonly_webroot --agree-tos -n --email user@example.com -d pikvm.example.com
   ```

3. Install the certificate for KVMD-Nginx and (optionally) [KVMD-VNC](vnc.md). Running services will be restarted/reloaded automatically. Switch filesystem to RO.
   ```
   # kvmd-certbot install_nginx pikvm.example.com
   # kvmd-certbot install_vnc pikvm.example.com
   # ro
   ```

4. Check the renewal immediately, just for testing:
   ```
   # kvmd-certbot renew --force-renewal
   ```

5. Enable automatic certificate renewal:
   ```
   # systemctl enable --now kvmd-certbot.timer
   ```

## Cloudflare DNS

This example shows that PiKVM may not be accessible from the internet, but you can still get a certificate if you use Cloudflare DNS.

1. Switch filesystem to RW and install the Cloudflare DNS plugin:
   ```
   # rw
   # pacman -S certbot-dns-cloudflare
   ```

2. Prepare the environment for the DNS plugin (place the auth data):
   ```
   # kvmd-pstrun -- mkdir -p /var/lib/kvmd/pst/data/certbot/runroot
   # kvmd-pstrun -- nano /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth
   # kvmd-pstrun -- chmod 600 /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth
   ```

3. Obtain the certificate:
   ```
   # kvmd-certbot certonly \
       --dns-cloudflare \
       --dns-cloudflare-propagation-seconds 60 \
       --dns-cloudflare-credentials /var/lib/kvmd/pst/data/certbot/runroot/.cloudflare.auth \
       --agree-tos \
       -n \
       --email user@example.com \
       -d pikvm.example.com
   ```

4. Next follow the basic guide.


## Route53 DNS

This example shows that PiKVM may not be accessible from the internet, but you can still get a certificate if you use AWS Route53 DNS. Make sure you are running an image newer than 2022.06.20 and kvmd version 3.119-1 or greater. 

1. Switch filesystem to RW and install the Route53 DNS plugin:
   ```
   # rw
   # pacman -S certbot-dns-route53
   ```

2. Configure Your AWS User
    For the certbot_dns_route53 plugin to work it needs to be able to connect to AWS using an access key with the correct permissions.

    To do this securely you’ll want to create a new AWS user that only has the necessary permissions it needs to work.

    You can find instructions for creating a user [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console). The basics of it is you’ll want a user with Programmatic access (not console), add it to a group (I created a new one just for this user and any future certbot users I might need).

    The user will need specific permissions that are required to allow the certbot plugin to create the necessary CNAME records. These can be added by manually selecting them from a very long list or you can use the json view to give it the following permissions.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "route53:ListHostedZones",
                    "route53:GetChange"
                ],
                "Resource": [
                    "*"
                ]
            },
            {
                "Effect" : "Allow",
                "Action" : [
                    "route53:ChangeResourceRecordSets"
                ],
                "Resource" : [
                    "arn:aws:route53:::hostedzone/YOURHOSTEDZONEID"
                ]
            }
        ]
    }
    ```
    Make sure you replace YOURHOSTEDZONEID with the instance ID of your hosted zone.

    Once the user is created don’t forget to download and save your access key and secret access key (somewhere secure, these are as sensitive as your passwords).

3. Setup credentials:

    We now need to put the AWS credentials on the PiKVM so the certbot can use them. 
    ```
    kvmd-pstrun -- mkdir -p /var/lib/kvmd/pst/data/certbot/runroot
    ```

    Copy and paste your AWS credentials into the nano editor and save the file. 
    ```
    # kvmd-pstrun -- nano /var/lib/kvmd/pst/data/certbot/runroot/.route53.auth
    ```
    Here is an example .route53.auth file. Replace the placeholders with the access key and secret access key that you just saved from AWS and fill them in.
    
    ```ini
    [default]
    aws_access_key_id=XXXXXX
    aws_secret_access_key=XXXX/XXXXX
    ```
    
    Update permissions:
    ```
    # kvmd-pstrun -- chmod 600 /var/lib/kvmd/pst/data/certbot/runroot/.route53.auth
    ```
    
4. Obtain the certificate:
   ```
   # export AWS_SHARED_CREDENTIALS_FILE="/var/lib/kvmd/pst/data/certbot/runroot/.route53.auth"
   # kvmd-certbot certonly \
       --dns-route53 \
       --agree-tos \
       -n \
       --email user@example.com \
       -d pikvm.example.com
   ```

4. Enable automatic certificate renewal:

   Create the file: `/etc/conf.d/kvmd-certbot` with the following contents so the renewall service can find the authentication file containing the AWS credentials:
   ```
   AWS_SHARED_CREDENTIALS_FILE="/var/lib/kvmd/pst/data/certbot/runroot/.route53.auth"
   ```
   
   Now enable the renewal service:
   ```
   # systemctl enable --now kvmd-certbot.timer
   ```
