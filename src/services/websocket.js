import { Server } from "socket.io";
import {createServer} from 'http';

import app from "../index.js";
import jwt from "../utils/jwt.js";

const server = createServer(app);
const io = new Server(server);

const ratemap = {};

io.use(async (socket,next)=>{
    try {
        const {uid} = await jwt.decode(socket.handshake.headers.cookie.split('token=')[1].split(';')[0]);
        console.log(uid);
        if(!uid) return next(new Error("Missing token"));
        socket.uid = uid;
        next();
    } catch (e) {
        console.error("Error in socket middleware: ", e);
        next(new Error("Token auth failure"));
    }
});

io.on('connection', async (socket)=>{
    console.log(`A user connected with socket_id: ${socket.id}`);
    ratemap[socket.uid] = 0;

    if(socket.uid){
        const userRoom = `user_${socket.uid}`;
        socket.join(userRoom);
        console.log(`User_id ${socket.uid}, socket id: ${socket.id} has joined room ${userRoom}`);
    }

    socket.on('trigger-charge', ()=>{
        io.to(`user_${socket.uid}`).emit('charge-triggered', '/success');
    });

    socket.on('disconnect', ()=>{
        console.log(`Socket: ${socket.id} disconnected`);
        delete ratemap[socket.uid];
    });
});

export { server, io }