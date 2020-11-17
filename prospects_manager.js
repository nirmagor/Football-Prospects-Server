const dotenv = require(`dotenv`);
const path_module = require(`path`);
const res = dotenv.config({ path: path_module.join(__dirname, `..\\..\\.env`) });
const mysql = require(`mysql`);



class ProspectsManager{
    constructor() {
        this.db;
        this.basicSetting;
    }

    createPool(settings) {

        return new Promise((res) => {
            res(mysql.createPool(this.basicSetting));
        });
    }

    createConnection() {

        return new Promise((res, rej) => {
            this.db.getConnection((err, connection) => {
                if (err) {
                    rej(err);
                }
                res(connection);     
            })
        });
    }

    createQuery(connection ,query, queryOptions) {
        return new Promise((res, rej) => {

            connection.query(query, queryOptions, function (err, result, fields) {
                connection.release();
                if (err) {
                    rej(err);
                } else {

                    res({ result: result, fields: fields });
                }

            });


        });
        
    }


    killPool(pool) {
        return new Promise((res, rej) => {
            
            pool.end((err) => { rej(err); });
            res();

        });
        

        
    }

    
    async init() {
        try {
            this.basicSetting = {
                connectionLimit: 10,
                host: process.env.PROSPECTS_HOST,
                user: process.env.PROSPECTS_USER,
                password: process.env.PROSPECTS_PASSWORD
            }
            this.db = await this.createPool(this.basicSetting);
            let createDBInfo;
            let dbExists = await this.databaseExists();
            if (!dbExists.success) {
                createDBInfo = await this.createDatabase();
            }
            let connection = await this.createConnection();
            let useProspectsInfo = await this.createQuery(connection , `USE prospects_db;`, null)
            return new Promise(function (resolve, reject) {
                resolve({ success: true, createDatabase: createDBInfo, useProspects: useProspectsInfo  });
            });
        } catch (err) {

            throw err;
        }

    }


    async end() {
        try {
            await this.killPool(this.db);
            return new Promise((res, rej) => {

                res(true);
            });
        } catch (err) {
            throw err;
        }
       

    }

    async databaseExists() {
        try {
            let connection = await this.createConnection();
            let resultAndFields = await this.createQuery(connection, `SHOW DATABASES;`, null);
            let suc = false;
            for (const rowDataPacket of resultAndFields.result) {

                if (rowDataPacket.Database === `prospects_db`) {
                    suc = true;
                    break;
                }
            }
            return new Promise((resolve, reject) => {
                resolve({ success: suc, result: resultAndFields.result, fields: resultAndFields.fields });
            });
        } catch (err) {

            throw err;
        }


    }

    async createDatabase() {


        try {
            let connection = await this.createConnection();
            let resultAndFields = await this.createQuery(connection, `CREATE DATABASE prospects_db;`, null);
            return new Promise((resolve, reject) => {

                resolve({ result: resultAndFields.result, fields: resultAndFields.fields });

            });
        } catch (err) {

            throw err;
        }

    }


    createTable() {

        return new Promise((resolve, reject) => {
            this.db.getConnection((err, connection) => {
                if (err) throw err;
                const createQueryString = `CREATE TABLE prospects (fname VARCHAR(255), sname VARCHAR(255),pos VARCHAR(3), age INT UNSIGNED, school VARCHAR(255), vert );`
                connection.query(createQueryString, (error, result, fields) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {

                        resolve({ result: result, fields: fields });
                    }

                });

            });

        });

    }

    checkAndCreate() {
        


    }


    async create( data, errorHandler){
        console.log(`** prospects_manager => create`);
        return new Promise((resolve, reject) => {
            this.db.getConnection((err, connection) => {
                if (err) throw err;
                connection.query(`INSERT INTO prospects ;`, (error, result, fields) => {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ result: result, fields: fields });
                    }
                    

                })
            });
            
        });        
    }

    

    async read(filter, errorHandler) {
        try {
            let checkAndCreateResult = await this.checkAndCreate();
            if (checkAndCreateResult.success) {
                return new Promise((resolve, reject) => {
                    this.db.query(`SELECT * FROM prospects Where ;`, [],  (error, result, fields)=>{

                        if (error) {
                            reject(error);
                        } else {
                            resolve({ result: result, fields: fields, checkCreate: checkAndCreateResult });
                        }
                        
                    });
                });
            }
        } catch (err) {
            errorHandler(err);
        }        
    }

    async update(filter, data, errorHandler) {
        this.checkAndCreate(resolve, reject);
        console.log(`**prospects manager** => update`);
    }

    async delete(filter, errorHandler) {
        this.checkAndCreate()
        console.log(`delete`);
    }


}

module.exports = ProspectsManager;