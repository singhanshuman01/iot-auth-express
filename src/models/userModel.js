import db from '../config/dbConfig.js';
import bcrypt from 'bcrypt';
import { relayOccupied } from '../utils/chargingSessionInfo.js';
import espHandler from '../services/espHandler.js';

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

async function deleteUser(username){
    try {
        await db.query("delete from users where username=$1", [username]);
        return true;
    } catch (e) {
        console.error("Error deleting a user", e);
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

function stopChargingTimeout(timeFor, uid) {
    try {
        tId[uid] = setTimeout(async () => {
            const relayNum = relayOccupied(uid);
            if (relayNum==0 || relayNum==1) {
                
                await espHandler.turnRelayOff(relayNum);
                updateSession(relayNum, null, 'off');
            }
            delete tId[uid];
        }, timeFor*60 * 1000);
    } catch (e) {
        console.error("Error in stopping charging: ",e);
    }
}

function cancelTimeout(uid){
    try {
        clearTimeout(tId[uid]);
        delete tId[uid];
    } catch (e) {
        console.error("Error in canceling timeout: ", e);
    }
}

export default {createUser, deleteUser, isUser, verifyUser, cancelTimeout, stopChargingTimeout };