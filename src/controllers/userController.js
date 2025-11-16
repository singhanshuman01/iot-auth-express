import axios from 'axios';

const nodemcuIP = process.argv[2];

const startCharging = async function(req,res){
    try {
        console.log(`Going to ${nodemcuIP}`);
        const l = await axios.get(`http://${nodemcuIP}/relay_on`);
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error(err);
    }
}

const stopCharging = async function(req,res){
    try {
        const l = await axios.get(`http://${nodemcuIP}/relay_off`);
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error(err);
    }
}

export default {startCharging, stopCharging};