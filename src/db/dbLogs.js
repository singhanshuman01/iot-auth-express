import db from '../config/dbConfig.js';

async function getLogs(uid = 0){
    try {
        if(uid===0) {
            const queryResult = await db.query("select * from logs");
            return queryResult.rows;
        }
        const queryResult = await db.query("select * from logs where uid=$1", [uid]);
        return queryResult.rows;
    } catch (e) {
        console.error("Error in getting logs", e);
        return null;
    }
}

async function createLog(uid, timePeriod){
    try {
        await db.query("insert into logs(time_stamp, time_period, uid) values(now(), $1, $2)", [timePeriod, uid]);
        return true;
    } catch (e) {
        console.error("Error in creating log: ", e);
        return false;
    }
}

export default {getLogs, createLog}