import test from "node:test";
import assert from "node:assert";



test("Sayı başlık gönderilince 400 dönmeli ", async () => {
    const response =await fetch("http://localhost:3000/tasks",{
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({title : 123})
    });

    assert.equal(response.status,400);

    const body = await response.json();
    assert.equal(body.error, "Geçersiz görev başlığı");
});

test("String completed gönderdiğimizde 400 dönmeli ", async () => {

    const response = await fetch("http://localhost:3000/tasks/1",{
        method : "PATCH",
        headers : {
            "Content-Type": "applicaton/json"
        },
        body : JSON.stringify({completed : "false"})
    });

    assert.equal(response.status,400);

    const body = await response.json();
    assert.equal (body.error ,"completed hatalı");
});

test("Geçerli başlıkla görev oluşturunca 201 dönmeli ", async () => {
    const response = await fetch("http://localhost:3000/tasks/",{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({title : "Otomatik Test Görevi"})
    });

    const task = await response.json();

    try{
        assert.equal(response.status,201);
        assert.equal(task.title,"Otomatik Test Görevi");
        assert.equal(task.completed, false);
        assert.ok(Number.isInteger(task.id) && task.id > 0);
    }finally{

        if(Number.isInteger(task.id) && task.id > 0){
            const cleanup = await fetch(
                `http://localhost:3000/tasks/${task.id}`,
                { method: "DELETE" }
            ); 
            assert.equal(cleanup.status,204);
        }
    }
});