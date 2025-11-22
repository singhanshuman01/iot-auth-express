import axios from "axios";

const nodemcuIP = process.argv[2];

var session = [
    {
        status: 'off',
        uid: 0,
        time: 0
    },
    {
        status: 'off',
        uid: 0,
        time: 0
    }
];

async function refreshSession(){
    try {
        const espResponse = await axios.get(`http://${nodemcuIP}/status`, {
            headers: {
                'X-api-key': process.env.ESP_END_SECRET
            }
        });
        console.log(espResponse);
        return;
    } catch (e) {
        console.error("Error in refreshing esp session info: ",e);
    }
}

function updateSession(relayNum, uid, state, time=0){
    try {
        if(session[relayNum]==='on') return {"error":"relay busy"};
        session[relayNum].status = state;
        session[relayNum].uid = uid;
        session[relayNum].time = time;
        console.log('Update session was called. New session: ', session);
        return {"status":"ok"};
    } catch (e) {
        console.error("Error in updating esp sessions",e);
    }
}

function relayOccupied(uid=0){
    if(uid===0) return [session[0].status, session[1].status];
    return session.findIndex(relay=>relay.uid===uid);
}

export { refreshSession, updateSession, relayOccupied};