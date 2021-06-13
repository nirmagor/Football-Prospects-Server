const mysql = require(`mysql`);


class MySqlConnector {

    /**
     * 
     * @param {any} basicSetting the settings of the MySQL connection
     */
    constructor(basicSetting) {
        this.basicSetting = basicSetting;
        this.connection;
    }


    /** Synchronously creates a pool of connections to the MySQL server. 
     Returns a Promise.
     */
    async createPool() {
        try{
            this.connection = await mysql.createPool(this.basicSetting);
            return true;
        }catch(err){
            throw err;
        }
        
    }

    shutdownConnections(cb) {
            this.connection.end(function (err) {
                cb(err);
            });
    }

    /**
     * Queries the server with the given query and the escaped values. Returns a promise. 
     * When the promise is resolved it will be called with the result and the fields in the form of an object as arguments, wehere 'result' and 'fields' 
     * are the fields of the object.
     * When the promise is rejected it will be called with the error as an argument
     * @param {any} query the query string to perform on the current db in the mysql server
     * @param {any} escapedValues escaped values matching the '?' in the given query string
     */
    createQuery(query, escapedValues) {
        return new Promise((res, rej) => {
            const cb = function (err, result, fields) {
                if (err) {
                    rej(err);
                } else {
                    res({ result: result, fields: fields });
                }
            }
            if (!escapedValues) {
                this.connection.query(query, cb);
            } else {
                this.connection.query(query, escapedValues, cb);
            }
        });

    }
}


module.exports = MySqlConnector;