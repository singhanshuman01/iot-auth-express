import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import morgan from 'morgan';
import {fileURLToPath} from 'url';
import { dirname, join } from 'path';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import rateLimiter from './middlewares/rateLimiter.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionMiddleware = expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        sameSite: true,
        maxAge: 1000*60*15,
        httpOnly: true,
    }
});

app.set('view engine', 'ejs');
app.use(rateLimiter);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/auth/admin', sessionMiddleware);
app.use('/admin', sessionMiddleware);

app.get('/', (req,res)=>{ res.sendFile(join(__dirname,'..','views','lounge.html')); })

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);

app.get('/health', (req,res)=>{
    res.json({health: "OK"});
});

app.use('/', (req,res)=>{
    res.sendFile(join(__dirname,'..','views','nopage.html'));
})
export default app;