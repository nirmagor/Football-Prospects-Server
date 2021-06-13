const path = require(`path`);
const profiles_manager = require(path.join(__dirname ,`/profiles_manager`));
coProspectsManager = require(path.join(__dirname , `/ProspectsManager`));
const board_manager = require(path.join(__dirname , `/board_manager`));
const logger = require(path.join(__dirname , `/logger`));

class DBManager {

    static isCreated = false;
    static singleton;


    constructor() {
        this.profiles = new profiles_manager();
        this.proespects = ProspectsManager();
        this.boards = new board_manager();
        this.logger = new logger();
        DBManager.isCreated = true;
        DBManager.singleton = this;
    }

    async init() {
        try {
            let prospectsInit = await this.proespects.init();
            return new Promise((res, rej) => {
                res(true);
            });

        } catch (err) {
            throw err;

        }
    }


    end() {
        this.proespects.end();
        this.profiles.end();
        this.boards.end();
    }

    setDb(identifier) {
        let db = this.profiles;
        if (identifier === `prospects`) {
            db = this.proespects;
        } else if (identifier === `board`) {
            db = this.boards;
        }
        return db;
    }


    async create(identifier, data) {
       
        let db = this.setDb(identifier);
        try{
            return await db.create(data);
        }catch(err){
            throw err;
        }         
    }

    async read(identifier, filter) {
        let db = this.setDb(identifier);
        try{
            return await db.read(filter);;
        }catch(err){
            throw err;
        } 
    }

    async update(identifier, filter, data) {
        let db = this.setDb(identifier);
        try{ 
            return await db.update(filter, data);
        }catch(err){
            throw err;
        }
    }

    async delete(identifier, filter) {
        let db = this.setDb(identifier);
        try{
            return await db.delete(filter);
        }catch(err){
            throw err;
        }
        
    }
    
    setProspectManagerBodyParametersMapping(mapping){
        this.proespects.setBodyParamertersMapping(mapping);
    }



}

function getDBManger(){
    if(DBManager.isCreated){
        return DBManager.singleton;   
    }
    return new DBManager();
}


module.exports = getDBManger;