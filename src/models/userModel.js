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

async function getUserLogs(uid){
    try {
        const result = await db.query('select time_stamp, time_period from users where uid=$1', [uid]);
        return result.rows;
    } catch (e) {
        console.error("Error retrieving user logs: ", e);
    }
}

async function updateUserLogs(uid, timeperiod){
    try {
        await db.query(`insert into logs(time_stamp, time_period, uid) values(${(new Date()).toLocaleTimeString}, $1, $2)`, [timeperiod, uid]);
        return true
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function verifyUser(username, password) {
    try {
        const result = await db.query("select * from users where username=$1", [username]);
        const user = result.rows[0];
        if (user) {
            const verified = await bcrypt.compare(password, user.password);
            if (verified) return user.id;
            else return 0;
        }else{
            return -1;
        }
    } catch (err) {
        console.error(err);
    }
}

async function stopChargingAfterStarted(timeFor, uid) {
    try {
        setTimeout(async () => {
            const relayNum = getRelayNumByUID(uid);
            if (relayNum) {
                updateSession(relayNum, null, 'off');
                const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
                    headers: { 'X-api-key': process.env.ESP_END_SECRET },
                    params: {
                        "relay": relayNum
                    }
                });
                console.log(JSON.parse(espResponse));
            }
        }, timeFor * 60 * 1000)
    } catch (e) {
        console.error(e);
    }
}

export default { getUser, getUserLogs, verifyUser,stopChargingAfterStarted, updateUserLogs };