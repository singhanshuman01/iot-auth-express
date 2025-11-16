import axios from 'axios';

const startCharging = async function(req,res){
    try {
        const l = await axios.get(`http://${nodemcuIP}/relay-on`);
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error(err);
    }
}

const stopCharging = async function(req,res){
    try {
        const l = await axios.get(`http://${nodemcuIP}/relay-off`);
        console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error(err);
    }
}

export default {startCharging, stopCharging};