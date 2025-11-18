import axios from "axios";

const nodemcuIP = process.argv[2];

var session = [
    {
        status: 'off',
        uid: null,
    },
    {
        status: 'off',
        uid: null
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

function updateSession(relayNum, uid, state){
    try {
        session[relayNum].status = state;
        session[relayNum].uid = uid;
        return;
    } catch (e) {
        console.error("Error in updating esp sessions",e);
    }
}

function getSession(){
    try {
        return session;
    } catch (e) {
        
    }
}

export {refreshSession, updateSession, getSession};