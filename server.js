import 'dotenv/config';
import { server } from './src/services/websocket.js';
import { genQR } from './src/utils/qrGenerator.js';

const port = process.env.PORT || 3000;

server.listen(port, '0.0.0.0', async ()=>{
    console.log(`Server listening, PORT: ${port}`);
    if(os.networkInterfaces().wlp2s0){
        console.log("Local IP address is: ", os.networkInterfaces().wlp2s0[0]?.address);
        genQR();
    }
});