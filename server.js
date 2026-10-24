import express from "express";
import pg from 'pg';


const app = express();
app.use(express.json());

const {Pool} = pg;

const pool = new Pool({
    host : "localhost",
    port : 5432,
    user : "mertcan",
    database : "task_app"
});

async function findTaskInDatabase(id){
   const result = await pool.query("SELECT * FROM tasks WHERE id = $1",[id]);

   return result.rows[0];
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

app.post("/tasks", async (req, res) => {

    const title = req.body?.title;

    if( typeof title !== "string" || title.trim() === ""){
        return res.status(400).json({error: "Geçersiz görev başlığı"});
    }

    try{
        const result = await pool.query('INSERT INTO tasks (title, completed) VALUES($1,$2) RETURNING *;',[title.trim(),false]);
        return res.status(201).json(result.rows[0]);
    }catch(error){
        console.error("görev bulunamadı",error);
        return res.status(500).json({
            error:"Görev eklenemedi"
        });
    }
});


app.get("/health", (req, res) => {
  res.status(200).json({ message : "Server is healthy" });
});

app.get("/tasks",async (req,res) => {
    try{
        const result = await pool.query("SELECT * FROM tasks ORDER BY id;");

        return res.status(200).json(result.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({
            error : "database bağlanılamadı"
        });
    }
});

app.patch("/tasks/:id",async (req,res) => {
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

    try{
        const result = await pool.query('UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *;',[comp,id]);
        const task = result.rows[0];

        if(!task){
            return res.status(404).json({
                error:"görev bulunamadı"
            });
        }
        return res.status(200).json(task);
    }catch(error){
        console.error(error);
        return res.status(500).json({
            error:"Görev güncellenemdi"
        });
    }
});

app.delete("/tasks/:id", async (req,res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            error : "id yanlış"
        })
    }

    try{
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
        if(result.rows.length === 0){
            return res.status(404).json({
                error: "Görev bulunamadı"
            });
        }
        return res.status(204).send();

    }catch(error){
        console.error("görev silinemedi :" ,error);
        return res.status(500).json({
            error:"görev silinemedi"
        });
    }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
