import db from '../config/dbConfig.js';
import bcrypt from 'bcrypt';

async function createUser(username, password) {
    try {
        bcrypt.hash(password, 10, async (err, hash)=>{
            if(err) {console.error("Error in create user: ", err);
                return;
            }
            await db.query("insert into users(username, password) values($1,$2)", [username, hash]);
            console.log(`user created`);
            return true;
        });
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

function stopChargingAfterStarted(timeFor, uid) {
    try {
        const timeoutId = setTimeout(async () => {
            const relayNum = relayOccupied(uid);
            if (relayNum==0 || relayNum==1) {
                updateSession(relayNum, null, 'off');
                // const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
                //     headers: { 'X-api-key': process.env.ESP_END_SECRET },
                //     params: {
                //         "relay": relayNum
                //     }
                // });
                // console.log(JSON.parse(espResponse));
            }
        }, timeFor*60 * 1000);
        return timeoutId;
    } catch (e) {
        console.error("Error in stopping charging: ",e);
    }
}

export default {createUser, isUser, verifyUser,stopChargingAfterStarted };