const path = require(`path`);
const profiles_manager = require(path.join(__dirname ,`/profiles_manager`));
const prospects_manager = require(path.join(__dirname , `/prospects_manager`));
const board_manager = require(path.join(__dirname , `/board_manager`));
const logger = require(path.join(__dirname , `/logger`));

class DBManager{

    static isCreated = false;
    static singleton;


    constructor(){
        this.profiles = new profiles_manager(); 
        this.proespects = new prospects_manager(); 
        this.boards = new board_manager(); 
        this.logger = new logger();
        DBManager.isCreated = true; 
        DBManager.singleton = this;
    }

    setDb(identifier){
        let db = this.profiles;
        if(identifier === `prospects`){
            db = this.proespects;
        }else if(identifier === `board`){
            db = this.boards;
        }
        return db;
    }


    create(identifier, callback){
        let db = this.setDb(identifier);
        db.create(callback);
    }
    
    read(identifier, filter, callback){
        let db = this.setDb(identifier);
        db.read(filter, callback);
    }

    update(identifier, filter, data , callback){
        let db = this.setDb(identifier);
        db.update(filter, data, callback);
    }

    delete(identifier, filter, callback){
        let db = this.setDb(identifier);
        db.delete(filter, callback);
    }

}

function getDBManger(){
    if(DBManager.isCreated){
        console.log(`singleton`);
        return DBManager.singleton;   
    }
    return new DBManager();
}


module.exports = getDBManger;