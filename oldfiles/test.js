

const tasks = [{id : 1, title : "backend",completed : false}];


function findTaskInDatabase(id){
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            if(id === -1){
                reject(new Error("Geçersiz görev id"));
                return;
            }


            const task = tasks.find((task) => task.id === id);
            resolve(task);
        }, 1000);
    });
}


async function getTask(id){

    console.log("görev aranıyor ...");

    const task = await findTaskInDatabase(id);

    console.log("arama bitti ");
    return task;
}


async function getHandleTask(id){

    try {
        const task = await findTaskInDatabase(id);

        if (!task) {
            return {status : 404 ,body :{error: " dosya bulunamadı"}};
        }

        return {status: 200 , body:task};
        
    } catch (error) {
        return {status : 500,body: {error: "Görev alınamadı"}};
    }

}


console.log("görev aranıyor ...");

console.log(await getHandleTask(1));

console.log(await getHandleTask(-1));

console.log(await getHandleTask(999));








