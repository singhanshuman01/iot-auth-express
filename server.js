import 'dotenv/config';
import { server } from './src/services/websocket.js';
import {refreshSession} from './src/utils/chargingSessionInfo.js'

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    // refreshSession();
    console.log(`Server listening, PORT: ${port}`);
});