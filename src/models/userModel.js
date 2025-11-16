import db from '../config/dbConfig.js';
import bcrypt from 'bcrypt';

async function getUser(username) {
    try {
        const result = await db.query("select id from users where username=$1", [username]);
        if (result.rowCount > 0) return true;
        return false;
    } catch (err) {
        console.error(err);
    }
}

async function createUser(username, password) {
    try {
        const hashedPass = bcrypt.hashSync(password, 10);
        const result = await db.query("insert into users(username, password) values($1,$2)", [username, hashedPass]);
        console.log(`user created`);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

async function verifyUser(username, password) {
    try {
        const result = await db.query("select * from users where username=$1", [username]);
        const user = result.rows[0];
        if (user) {
            const verified = await bcrypt.compare(password, user.password);
            if (verified) return user.id;
            else return false;
        }else{
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

export default { getUser, createUser, verifyUser };