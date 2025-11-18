import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let pvt;
let pub;
try {
    pvt = fs.readFileSync(join(__dirname, '..','..','private.key'), 'utf-8');
    pub = fs.readFileSync(join(__dirname,'..','..','public.key'), 'utf-8');
} catch (e) {
    console.error("Error loading key files: ", e.message);
}

const createToken = function (payload) {
    try {
        if(!pvt) throw new Error('Private key not loaded');
        return jwt.sign(payload, pvt, { expiresIn: '7d', algorithm: 'RS256' });
    } catch (e) {
        console.error(e);
        return null;
    }
}

const verifyToken = function (token) {
    if(!token) return false;
    try {
        if(!pub) throw new Error('Public key not loaded');
        return jwt.verify(token, pub, { algorithms: ['RS256'] });
    } catch (e) {
        console.error(e);
        return false;
    }

}

async function decode(token){
    try{
        if(!token){
            return null;
        }
        return jwt.decode(token);
    } catch(e){
        console.error(e);
        return null;
    }
}

export default { createToken, verifyToken, decode };