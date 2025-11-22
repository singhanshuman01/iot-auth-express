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
        const cookies = cookie?.split(';');
        const token = cookies?.filter(cookie=>cookie.trim().startsWith('token=', 0))[0]?.split('=')[1] || null;
        const sessionId = cookies?.filter(cookie=>cookie.trim().startsWith('connect.sid='))[0]?.split('=')[1] || null;
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
    ratemap[socket.uid] = 0; //log attempts to apply rate limit
    
    const allRoom = 'users';
    if(socket.uid){
        const userRoom = `user_${socket.uid}`;
        socket.join(userRoom);
        socket.join(allRoom);
        console.log(`User_id ${socket.uid}, socket id: ${socket.id} has joined room ${userRoom}`);
    }

    if(socket.sessionId){
        const adminRoom = `admin`;
        socket.join(adminRoom);
        console.log(`An admin with socket_id: ${socket.id} has joined.`);
    }
    
    socket.on('start-charging', (relay, time)=>{
        if(ratemap[socket.uid] > 6) {
            socket.emit('rate-exceeded');
            return;
        }
        ratemap[socket.uid]++;
        socket.time = Number(time);
        socket.relnum = (relay=="0")? 0 : (relay=="1")?1:-1;
        io.to(`user_${socket.uid}`).emit('charge-started', socket.time);
        io.to('users').except(`user_${socket.uid}`).emit('block-relay', socket.relnum);
        io.to("admin").emit('charging-started', socket.relnum, socket.uid, socket.time );
    });

    socket.on('stop-charging', ()=>{
        if(ratemap[socket.uid] > 6) {
            socket.emit('rate-exceeded');
            return;
        }
        ratemap[socket.uid]++;
        socket.relnum = getRelayNumByUID(socket.uid);
        io.to(`user_${socket.uid}`).emit('charge-stopped');
        io.to("admin").emit('charging-stopped', socket.relnum);
        socket.time = 0;
        socket.relnum = -1;
    });

    setInterval(()=>ratemap[socket.uid]=0, 60*1000); //reset attempts every minute

    socket.on('disconnect', ()=>{
        console.log(`Socket: ${socket.id} disconnected`);
        delete ratemap[socket.uid];
    });
});

export { server, io }