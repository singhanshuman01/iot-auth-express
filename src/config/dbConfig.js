import pg from "pg";

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('error',(err,client)=>{
    console.error(err);
    process.exit(-1);
});

pool.on('connect', (client)=>{
    console.log("connected to db");
});

export default {
    query: (text,params)=>pool.query(text,params),
    pool,
}