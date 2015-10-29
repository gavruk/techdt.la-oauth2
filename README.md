#Bootstrapping

- Create a client entry in mongo:

```
db.client.insert({
  "name":"client_name",
  "clientId":"client_id",
  "clientSecret":"client_secret",
  "redirectURI":"http://localhost:8080/api/throw"
});
```

- Start the server:

```
npm start
```

- POST a new user:

```
curl \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --header "Authorization: Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=" \
  --data '{"username":"username","password":"password"}' \
  http://localhost:8081/api/user
```

- Login for an access token:

```
curl \
  --header "Accept: application/json" \
  --header "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=" \
  --data "response_type=token&client_id=client_id&redirect_uri=http://localhost:8080/api/throw" \
  http://localhost:8081/api/authenticate
```