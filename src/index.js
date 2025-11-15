import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.use('/', authRoutes);
app.use('/', userRoutes);

app.get('/health', (req,res)=>{
    res.json({"health": "OK"});
});

export default app;