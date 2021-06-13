const sql = require(`mysql`);


class BoardManager{
    constructor(){
        this.db; //sql.createConnection();//ToDo
    }

    create(callback){
        console.log(`create`);
    }

    read(filter, callback){
        console.log(`read`);
    }

    update(filter, data, callback){
        console.log(`update`);
    }

    delete(filter, callback){
        console.log(` ** board manager ** => delete`);
    }
}

module.exports = BoardManager;