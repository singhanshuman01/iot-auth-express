import { Server } from "socket.io";
import {createServer} from 'http';

import app from "../index.js";
import jwt from "../utils/jwt.js";

const server = createServer(app);
const io = Server(server);

const ratemap = {};

io.use((socket,next)=>{
    try {
        const {uid} = jwt.decode(socket.handshake.headers.cookie);
        if(!uid) return next(new Error("Missing token"));
        socket.uid = uid;
        next();
    } catch (e) {
        console.error("Error in socket middleware: ", e);
        next(new Error("Token auth failure"));
    }
});

io.on('connection', (socket)=>{
    console.log(`A user connected with socket_id: ${socket.id}`);
    ratemap[socket.uid] = 0;

    if(socket.uid){
        const userRoom = `user_${socket.uid}`;
        socket.join(userRoom);
        console.log(`User_id ${socket.uid}, ${socket.id} has joined ${userRoom}`);
    }

    

    socket.on('disconnect', ()=>{
        console.log(`Socket: ${socket.id} disconnected`);
        delete ratemap[socket.uid];
    });
});

export default { io, server }