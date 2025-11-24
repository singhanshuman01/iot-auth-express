import db from '../config/dbConfig.js';
import bcrypt from 'bcrypt';
import { relayOccupied } from '../utils/chargingSessionInfo.js';

let tId ={};

async function createUser(username, password) {
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query("insert into users(username, password) values($1,$2)", [username, hashed]);
        console.log(`user created`);
        
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function isUser(username) {
    try {
        const result = await db.query("select id from users where username=$1", [username]);
        return result.rowCount>0;
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
            else return 0;
        }else{
            return -1;
        }
    } catch (err) {
        console.error(err);
    }
}

async function stopChargingTimeout(timeFor, uid) {
    try {
        tId[uid] = setTimeout(() => {
            const relayNum = relayOccupied(uid);
            if (relayNum==0 || relayNum==1) {
                
                // const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
                //     headers: { 'X-api-key': process.env.ESP_END_SECRET },
                //     params: {
                //         "relay": relayNum
                //     }
                // });
                updateSession(relayNum, null, 'off');
                // console.log(JSON.parse(espResponse));
            }
            // delete timeoutId[uid];
        }, timeFor*60 * 1000);
    } catch (e) {
        console.error("Error in stopping charging: ",e);
    }
}

function cancelTimeout(uid){
    try {
        clearTimeout(tId[uid]);
    } catch (e) {
        console.error("Error in canceling timeout: ", e);
    }
}

export default {createUser, isUser, verifyUser, cancelTimeout, stopChargingTimeout };