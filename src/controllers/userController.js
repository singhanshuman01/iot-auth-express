import axios from 'axios';

const nodemcuIP = process.argv[2];

const startCharging = async function(req,res){
    try {
        console.log(`Going to ${nodemcuIP}`);
        const l = await axios.get(`http://${nodemcuIP}/relay_on`, {
            headers: {'X-api-key': process.env.ESP_END_SECRET}
        });
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

const stopCharging = async function(req,res){
    try {
        const l = await axios.get(`http://${nodemcuIP}/relay_off`, {
            headers: {'X-api-key': process.env.ESP_END_SECRET}
        });
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error("Error in stopping charging: ",err);
    }
}

export default {startCharging, stopCharging};