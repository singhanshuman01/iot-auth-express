# IOT Authentication with expressJS

## Overview
Use express app to authenticate for nodemcu handled relays(can be used for anything from phone charging to appliance control)

## Dependencies
1. NodeJS - v22.*
2. Postgresql - v18.*
3. ArduinoIDE

## Setup
Clone the repo using 
```
git clone https://github.com/singhanshuman01/iot-auth-express
```

then to install the packages run 
```
npm i
```

Create a .env file and generate a pair of rsa keys
(If you use Linux you can do so by)
```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
```

Create the required table by opening psql shell (preferably from the same folder directory) and running
```
\i ./schema.sql
```

Your .env should look like
```
NODE_ENV=

PORT=

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_NAME=

PATH=
```

## Running the project
You should flash the .ino script into esp8266 first and note the local ip address, then 
```
node server.js <esp8266-ip-address>
```

## Credits
The code in 404 page (nopage.html, nopage.css and nopage.js) belongs to Ethan, you can find the original code here https://codepen.io/eroxburgh/pen/zYYyEPg