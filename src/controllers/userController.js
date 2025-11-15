import axios from 'axios';

const startCharging = async function(req,res){
    try {
        const l = axios.get(`http://${nodemcuIP}/relay-on`);
    } catch (err) {
        console.error(err);
    }
}

const stopCharging = async function(req,res){
    try {
        const l = axios.get(`http://${nodemcuIP}/relay-off`);
    } catch (err) {
        console.error(err);
    }
}

export default {startCharging, stopCharging};