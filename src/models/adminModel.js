import db from "../config/dbConfig.js";
import bcrypt from 'bcrypt';

async function verifyAdmin(admin_name, admin_password){
    try {
        const result = await db.query('select * from admin where admin_name=$1', [admin_name]);
        const hashedpass = result.rows[0].admin_password;
        const status = await bcrypt.compare(admin_password, hashedpass);
        return status;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getLogs() {
    try {
        const logs = await db.query("select * from logs");
        return logs.rows;
    } catch (e) {
        console.error(e);
    }
}

export default {verifyAdmin, getLogs};