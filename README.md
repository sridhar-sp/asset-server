# Authentication

The asset server service, built using Express.js, currently relies on Firebase for storage. However, it has the capability to support other storage providers by implementing the `FileStorageProvider` interface. The specific storage provider utilized will be determined by the value of the `x-storage-provider` header in the request. Only authenticated users are granted access to the files, the specific authentication service used can be selected based on the value of the `x-auth-provider` header. Additional authentication services can be integrated by implementing the `AuthService` interface.

---

### Prerequisites

- To run this project locally, you must have Node.js, npm, yarn and Redis installed on your machine.

### Execution

This project is set up to use 'ts-node-dev', allowing for changes to take effect immediately without the need to restart the server.
Use the following command to start the application in development mode:

```
$ yarn dev
```

To run the app in production mode, use the following command:

```
$ yarn build && yarn start:prod
```

---

`GET /file `

```
curl --location --request GET 'http://localhost:3004/file?bucketPath=parent/child&fileName=img.png' \
--header 'x-storage-provider: firebase' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken' \
--data-raw '<file content>'
```

---

`PUT /file `

```
curl --location --request PUT 'http://localhost:3004/file' \
--header 'x-storage-provider: firebase' \
--header 'x-auth-provider: firebase' \
--header 'Authorization: Bearer authToken' \
--form 'file=@"/Users/sridharsubramani/Desktop/img.png"' \
--form 'fileName="img_some_hash_code.png"' \
--form 'bucketPath="parent/child"'
```

---
