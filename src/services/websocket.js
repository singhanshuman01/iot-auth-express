import { Server } from "socket.io";
import {createServer} from 'http';

import app from "../index.js";
import jwt from "../utils/jwt.js";
import { getRelayNumByUID } from "../utils/chargingSessionInfo.js";

const server = createServer(app);
const io = new Server(server);

const ratemap = {};

io.use(async (socket,next)=>{
    try {
        const cookie = socket.handshake.headers.cookie;
        const cookies = cookie.split(';');
        const token = cookies.filter(cookie=>cookie.trim().startsWith('token=', 0))[0]?.split('=')[1] || null;
        const sessionId = cookies.filter(cookie=>cookie.trim().startsWith('connect.sid='))[0]?.split('=')[1] || null;
        if(token){

            const {uid} = await jwt.decode(token);
            socket.uid = uid || null;
            // console.log(socket.uid);
        }else if(sessionId){

            socket.sessionId = sessionId || null;
            // console.log(socket.sessionId);
        }
        
        next();
    } catch (e) {
        console.error("Error in socket middleware: ", e);
        next(new Error("Token auth failure"));
    }
});

io.on('connection', async (socket)=>{
    console.log(`A user connected with socket_id: ${socket.id}`);
    ratemap[socket.uid] = 0;
    // console.log(socket.uid);
    // console.log(socket.sessionId);

    // const usersRoom = `users`;
    if(socket.uid){
        const userRoom = `user_${socket.uid}`;
        socket.join(userRoom);
        // socket.join(users);
        console.log(`User_id ${socket.uid}, socket id: ${socket.id} has joined room ${userRoom}`);
    }

    if(socket.sessionId){
        const adminRoom = `admin`;
        socket.join(adminRoom);
        // socket.join(users);
        console.log(`An admin with socket_id: ${socket.id} has joined.`);
    }
    
    socket.on('start-charging', ()=>{
        const relnum = getRelayNumByUID(socket.uid);
        socket.relNum = relnum;
        io.to(`user_${socket.uid}`).emit('charge-started');
        io.to("admin").emit('charging-started', relnum );
    });

    socket.on('stop-charging', ()=>{
        io.to(`user_${socket.uid}`).emit('charge-stopped');
        io.to("admin").emit('charging-stopped', socket.relNum);
        socket.relNum = -1;
    });

    socket.on('disconnect', ()=>{
        console.log(`Socket: ${socket.id} disconnected`);
        delete ratemap[socket.uid];
    });
});

export { server, io }