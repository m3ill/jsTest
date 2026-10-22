import pg from 'pg';

const {Pool} = pg;


const pool = new Pool({
    host : "localhost",
    port : 5432,
    user : "mertcan",
    database : "task_app"
});

try{

    const result = await pool.query("SELECT * FROM tasks;");
    console.log(result.rows);
}catch(error){
    console.error("veritabanı hatası : ", error);   
}finally{
    await pool.end();
}