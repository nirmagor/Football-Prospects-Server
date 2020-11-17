const path = require(`path`);
const profiles_manager = require(path.join(__dirname ,`/profiles_manager`));
const prospects_manager = require(path.join(__dirname , `/prospects_manager`));
const board_manager = require(path.join(__dirname , `/board_manager`));
const logger = require(path.join(__dirname , `/logger`));

class DBManager {

    static isCreated = false;
    static singleton;


    constructor() {
        this.profiles = new profiles_manager();
        this.proespects = new prospects_manager();
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


    async end() {
        try {
            await this.proespects.end();
            return new Promise((res, rej) => {

                res(true);
            });
        } catch (err) {
            throw err;
        }
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


    create(identifier, data,errorHandler) {
        let db = this.setDb(identifier);
        db.create(data, errorHandler);
    }

    read(identifier, filter, errorHandler) {
        let db = this.setDb(identifier);
        db.read(filter, errorHandler);
    }

    update(identifier, filter, data, errorHandler) {
        let db = this.setDb(identifier);
        db.update(filter, data, errorHandler);
    }

    delete(identifier, filter, errorHandler) {
        let db = this.setDb(identifier);
        db.delete(filter, errorHandler);
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