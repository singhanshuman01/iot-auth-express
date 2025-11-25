import qr from 'qr-image';
import os from 'os';
import fs from 'fs';

var localIp = os.networkInterfaces().wlp2s0[0].address || null;

function genQR(){
    if(!localIp) return;

    let url = `http://${localIp}:${process.env.PORT}/user/dashboard`;
    console.log(url);

    var qr_png = qr.image(url);
    qr_png.pipe(fs.createWriteStream('qrToStartCharging.png'));

    return;
}

export {genQR};