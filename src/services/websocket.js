import { Server } from "socket.io";
import {createServer} from 'http';
import jwt from "../utils/jwt.js";

import app from "../index.js";


const server = createServer(app);
const io = new Server(server);

const ratemap = {};

io.use(async (socket,next)=>{
    try {
        const cookie = socket.handshake.headers.cookie;
        const cookies = cookie?.split(';');
        const token = cookies?.filter(cookie=>cookie.trim().startsWith('token=', 0))[0]?.split('=')[1] || null;
        const sessionId = cookies?.filter(cookie=>cookie.trim().startsWith('connect.sid='))[0]?.split('=')[1] || null;
        if(token){
            const {uid} = await jwt.decode(token);
            socket.uid = uid || null;
        }else if(sessionId){
            socket.sessionId = sessionId || null;
        }
        
        next();
    } catch (e) {
        console.error("Error in socket middleware: ", e);
        next(new Error("Token auth failure"));
    }
});

io.on('connection', async (socket)=>{
    console.log(`A user connected with socket_id: ${socket.id}`);
    ratemap[socket.id] = 0; //log attempts to apply rate limit

    if(socket.uid){
        socket.join("users");
        socket.join(`user_${socket.uid}`);
    }else if(socket.sessionId){
        socket.join("admins");
    }

    setInterval(()=>ratemap[socket.id]=0, 60*1000); //reset attempts every minute

    socket.on('disconnect', ()=>{
        console.log(`Socket: ${socket.id} disconnected`);
        delete ratemap[socket.id];
    });
});

export { server, io }