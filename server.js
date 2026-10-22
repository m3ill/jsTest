import express from "express";
import pg from 'pg';
import { error } from "node:console";

const app = express();
app.use(express.json());

const {Pool} = pg;

const pool = new Pool({
    host : "localhost",
    port : 5432,
    user : "mertcan",
    database : "task_app"
});

const tasks = [{id : 1, title : "backend",completed : false}];
let nextId = 2;

function findTaskInDatabase(id){
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if(id === -1){
                reject(new Error("Geçersiz görev id"));
                return;
            }

            try{
                const result = new pool("SELECT * FROM tasks where id = ($1);",[id]);
            }catch(error){
                console.error("veritabanı hatası : ",error);
            }

            resolve(result);
        }, 1000);
    });
}
async function getHandleTask(id){

    try {
        const task = await findTaskInDatabase(id);

        if (!task) {
            return {status : 404 ,body :{error: " görev bulunamadı"}};
        }

        return {status: 200 , body:task};
        
    } catch (error) {
        return {status : 500,body: {error: "Görev alınamadı"}};
    }

}

app.get("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({error: "Geçersiz görev id"});
    }

    const result = await getHandleTask(id);

    res.status(result.status).json(result.body);
});

app.post("/tasks", (req, res) => {

    const title = req.body?.title;

    if(title.trim() === "" || typeof title !== "string"){
        return res.status(400).json({error: "Geçersiz görev başlığı"});
    }

    const task = {
        id: nextId++,
        title: title,
        completed: false
    }
    tasks.push(task);
    return res.status(201).json(task);
});


app.get("/health", (req, res) => {
  res.status(200).json({ message : "Server is healthy" });
});

app.get("/tasks",async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM tasks ORDER BY id;");
        res.json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({
            error : "database bağlanılamadı"
        });
    }finally{
        pool.end();
    }

    return res.status(200).json(tasks);
});

app.patch("/tasks/:id",(req,res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            error : "id yanlış"
        })
    }

    const comp = req.body?.completed;

    if(typeof comp !== "boolean"){

        return res.status(400).json({
            error : "completed hatalı"
        })
    }

    const task = tasks.find((task) => task.id === id);

    if(!task){

        return res.status(404).json({
            error: "görev bulunamadı"
        });
    }

    task.completed = comp;
    return res.status(200).json(task);
});

app.delete("/tasks/:id", (req,res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            error : "id yanlış"
        })
    }

    const index = tasks.find((task) => task.id ===id);


    if (index === -1){
        return res.status(404).json({
            error: "görev bulunamadı"
        })
    }

    tasks.splice(index,1);
    return res.status(204).json();


});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
