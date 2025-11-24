import axios from 'axios';

async function turnRelayOn(relay, uid){
    try {
        let espResponse = await axios.post(`http://esp8266.local/relay_on?relay=${relay}&uid=${uid}`, {}, {
            headers: {
                "X-api-key": process.env.ESP_END_SECRET
            }
        });
        espResponse = JSON.parse(espResponse);
        console.log(espResponse);
        return;
    } catch (e) {
        console.error(e);
    }
}

async function turnRelayOff(relay){
    try {
        let espResponse = await axios.post(`http://esp8266.local/relay_on?relay=${relay}`, {}, {
            headers: {
                "X-api-key": process.env.ESP_END_SECRET
            }
        });

        espResponse = JSON.parse(espResponse);
        console.log(espResponse);
        return;
    } catch (e) {
        console.error(e);
    }
}

async function getStatus(){
    try {
        let espResponse = await axios.get(`http://esp8266.local/status`, {
            headers: {
                "X-api-key": process.env.ESP_END_SECRET
            }
        });
        espResponse = JSON.parse(espResponse);
        console.log(espResponse);
        return
    } catch (e) {
        console.error(e);
    }
}

export default {turnRelayOn, turnRelayOff, getStatus};