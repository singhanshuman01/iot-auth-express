import jwt from 'jsonwebtoken';
import fs from 'fs';

const pvt = fs.readFileSync('/home/asingh/exercise/Iot-access-express/' + 'private.key');
const pub = fs.readFileSync('/home/asingh/exercise/Iot-access-express/' + 'public.key');

const createToken = function (payload) {
    try {
        return jwt.sign(payload, pvt, { expiresIn: '7d', algorithm: 'RS256' });
    } catch (e) {
        console.error(e);
        return null;
    }
}

const verifyToken = function (token) {
    try {
        return jwt.verify(token, pub, { algorithms: ['RS256'] });
    } catch (e) {
        console.error(e);
        return false;
    }

}

export default { createToken, verifyToken };