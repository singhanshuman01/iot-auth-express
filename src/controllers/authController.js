import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

async function handleSignup(req,res){
    const {username, password} = req.body;

    try {
        const userExists = await userModel.getUser(username);
        if(userExists){
            return res.render('login', {message: "User already exists"});
        }
        await userModel.createUser(username,password);
        res.render('login', {message: "Signup successful, login!"});
    } catch (err) {
        console.error(err);
    }
}

async function handleLogin(req,res){
    const {username, password} = req.body;
    try {
        const checkUser = await userModel.verifyUser(username, password);
        if(checkUser){
            res.redirect('/success');
        }else{
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
    }
}

export default {handleLogin, handleSignup};