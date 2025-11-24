# IOT Authentication with expressJS

## Overview
Use express app to authenticate multiple roles and users for esp8266 handled relays (currently two, can be increased as per needs) (can be used for anything from phone charging to appliance control).

## Details and Features
This project is built on a Model-View-Controller (MVC) architecture for clean, maintainable code. The core is an Express.js backend running on Node.js, which handles all business logic, authentication, and communication. Data persistence is managed by a PostgreSQL (pg) database, utilizing separate schemas to segregate user and admin data, and a dedicated logs table that references user IDs.

#### Security and Data Handling

Authentication & Authorization: JSON Web Tokens (JWT) secure regular user sessions (7-day validity), while the express-session package manages highly secure, short-lived (15-minute) admin sessions. Custom middlewares are implemented to authorize every incoming request, ensuring users only access permitted resources.

Password Security: All user and admin passwords are secured using the Bcrypt hashing algorithm before being stored in the database.

#### Real-Time Interaction and Control

The system uses WebSockets to enable real-time communication between the server and all connected clients. This pushes immediate status updates, such as a relay becoming busy or an admin terminating a session.

The server communicates with the ESP8266 microcontroller via Axios to send HTTP requests to turn relays ON/OFF or fetch their current status as a JSON object.

Relay Management: A server-side JavaScript mechanism tracks which user occupies which relay. For automated termination, a setTimeout function is initiated upon session start, stopping the charging/access automatically after the user-specified time, though users and admins can terminate sessions voluntarily before the timeout.

### Features

1. As a standard user, you can easily check if a port is free and immediately reserve it for your use.

2. You'll know instantly if a port becomes available or busy. If a port is occupied, the button to use it is automatically blocked on your screen, so you'll never try to access a busy port.

3. When you start a session (e.g., charging), you select how long you need it. The system will automatically turn off the relay after that time, or you can stop it manually anytime you're done.

4. Your account is protected with strong encryption, and you can only see the records of your own past usage (access logs).

Special Features for Administrators (Admins)

1. Admins get real-time alerts whenever any port becomes active or a user session ends.

2. An admin can immediately terminate any active user session from their interface if necessary.

3. Admins can view all access logs for every user and every session across the entire system.

4. Admins have the ability to create and manage new user accounts

## Dependencies
1. NodeJS - v22.*
2. Postgresql - v18.*
3. ArduinoIDE

## Setup
Clone the repo using 
```
git clone https://github.com/singhanshuman01/iot-auth-express
```

then install the packages,
```
npm i
```

Generate a pair of rsa keys
(If you use Linux you can do so by)
```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
```

Create the required schemas by opening psql shell (preferably from the same folder directory) and running
```
\i ./schema.sql
<!-- OR -->
\i /path/to/schema.sql
```

Create environment var file .env, it should look like
```
NODE_ENV=

PORT=

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_NAME=

SESSION_SECRET=

ESP_END_SECRET=
```
You should create random long string for secrets

## Running the project
You should flash the .ino script into esp8266, then run the express app
```
node server.js
<!-- or -->
npm start
```

## Credits
The code in 404 page (nopage.html, nopage.css and nopage.js) belongs to Ethan, you can find the original code here https://codepen.io/eroxburgh/pen/zYYyEPg