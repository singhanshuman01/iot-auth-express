import axios from 'axios';
import userModel from '../models/userModel.js';

const nodemcuIP = process.argv[2];

let b = false;

const displayUserDashboard = async function(req,res){
    const user_id = req.id;
    // const isUsing = await axios.get(`http://${nodemcuIP}/status`, {
    //     headers: {'X-api-key': process.env.ESP_END_SECRET}
    // });
    const logs = await userModel.getUserLogs(req.id);
    // await Promise.all([logs, isUsing])
    res.render('success', {
        isUsing: b,
        logs: logs
    });
}

const startCharging = async function(req,res){
    try {
        console.log(`Going to ${nodemcuIP}`);
        b = true;
        // const l = await axios.get(`http://${nodemcuIP}/relay_on`, {
        //     headers: {'X-api-key': process.env.ESP_END_SECRET}
        // });
        // console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

const stopCharging = async function(req,res){
    try {
        b = false;
        // const l = await axios.get(`http://${nodemcuIP}/relay_off`, {
        //     headers: {'X-api-key': process.env.ESP_END_SECRET}
        // });
        // console.log(l);
        res.redirect('/success');
    } catch (err) {
        console.error("Error in stopping charging: ",err);
    }
}

export default {startCharging, stopCharging, displayUserDashboard};