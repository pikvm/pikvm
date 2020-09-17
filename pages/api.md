# API

## Authorization
All APIs are restricted to authorization. To make requests, you either need to authorize each request individually,
or get a token and pass it as a cookie with each request.

#### Single request auth
There are two options here:
* Using X-headers. Just pass `X-KVMD-User` and `X-KVMD-Passwd` with the request:
    ```
    $ curl -k -H X-KVMD-User:admin -H X-KVMD-Passwd:admin https://pikvm/api/auth/check
    ```
* Using HTTP Basic Auth. Please note: contrary to the standard, this method DOES NOT use the `WWW-Authenticate` header.
  HTTP Basic Auth in this implementation is intended only for compatibility with other systems, such as Prometheus.
    ```
    $ curl -k --user admin:admin https://pikvm/api/auth/check
    ```
#### Session-based (token) auth
1. Authorize and get token for the user using `POST /api/auth/login`:
    ```
    $ curl -k -vv -X POST --data user=admin --data passwd=admin https://pikvm/api/auth/login
    ...
    < Set-Cookie: auth_token=796cb83b11de4fcb749bc1bad14a91fb06dede84672b2f847fef1e988e6900de; Path=/
    ...
    ```
    On success the cookie `auth_token` will be recieved with `200 OK`. On invalid user or password you will get `403 Forbidden`.
2. The handle `GET /api/auth/check` can be used for check the auth status. If the user is logged in, you will see `200 OK`.
  If the token or any of the single-request auth methods are missing, `401 Unauthorized` will be returned.
  On incorrect credentials or token, `403 Forbidden` will be returned.
3. The handle `POST /api/auth/logout` can be used for invalidate session token. The response codes will be similar to the previous handle.
