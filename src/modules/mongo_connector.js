const MongoServer = require(`mongodb`).Server;
const MongoDb = require(`mongodb`).Db;
//const path = require(`path`);

class MongoConnector {

    constructor(basicSettings) {
        this.basicSettings = basicSettings; 
        this.db;
    }

    createDatabase() {
        this.db = new MongoDb(this.basicSettings.dbname, new Server(this.basicSettings.host, this.basicSettings.port));
        return new Promise((res, rej) => {

            this.db.open();
        });
        


    }




}
