import 'dotenv/config';
import { server } from './src/services/websocket.js';

const port = process.env.PORT || 3000;

server.listen(port, ()=>{
    console.log(`Server listening, PORT: ${port}`);
});