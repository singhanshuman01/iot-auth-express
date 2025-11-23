CREATE TABLE admin(id SERIAL PRIMARY KEY, admin_name VARCHAR(50) UNIQUE NOT NULL, admin_password TEXT NOT NULL);

CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE NOT NULL, password TEXT NOT NULL );

CREATE TABLE logs(id SERIAL PRIMARY KEY, time_stamp DEFAULT NOW(), time_period INT NOT NULL, uid INT FOREIGN KEY REFERENCES users(id));

-- Since there is no way to create admins from the website you need to do it manually

-- Get or generate a password hash using bcrypt only and replace password with the hash
-- CAUTION: DON'T USE OR INSERT PLAIN TEXT PASSWORD, use bcrypt generated hash only
INSERT INTO admin(admin_name, admin_password) VALUES("<admin-name>", "<password>");