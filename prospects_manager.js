const dotenv = require(`dotenv`);
const path_module = require(`path`);
const envconfig = dotenv.config({ path: path_module.join(__dirname, `..\\..\\.env`) });
const MySqlConnector = require(path_module.join(__dirname + "/mysql_connector"));
const validators = require(path_module.join(__dirname + "/validator"));

const defaultMap = {
    "fname": "fname",
    "sname": "sname",
    "pos": "pos", 
    "birthdate": "birthdate",
    "school": "school",
    "height": "height",
    "weight": "weight",
    "vertical_jump": "vertical_jump",
    "bench_press": "bench_press",
    "forty_yards_dash": "forty_yards_dash",
    "broad_jump": "broad_jump",
    "three_cone_drill": "three_cone_drill",
    "shuttle": "shuttle"
};

class ProspectsManager{
    static isCreated = false;
    static singletion;
    constructor() {
        this.basicSetting = {
            connectionLimit: 10,
            host: process.env.PROSPECTS_HOST,
            user: process.env.PROSPECTS_USER,
            password: process.env.PROSPECTS_PASSWORD
        };
        this.mysql_server = new MySqlConnector(this.basicSetting);
        this.tableHeadersDefinition = {
            "columns": ["fname", "sname", "pos", "birthdate", "school", "height", "weight", "vertical_jump",
                "bench_press", "forty_yards_dash", "broad_jump", "three_cone_drill", "shuttle"],
            "fname": `VARCHAR(255) NOT NULL`,
            "sname": `VARCHAR(255) NOT NULL`,
            "pos": `VARCHAR(4) NOT NULL`,
            "birthdate": `DATE NOT NULL`,
            "school": `VARCHAR(255) NOT NULL`,
            "height": `INT UNSIGNED NOT NULL`,
            "weight": `INT UNSIGNED NOT NULL`,
            "vertical_jump": `FLOAT`,
            "bench_press": `INT UNSIGNED`,
            "forty_yards_dash": `FLOAT`,
            "broad_jump": `INT UNSIGNED`,
            "three_cones_drill": `FLOAT`,
            "shuttle": `FLOAT`,
            "key": "PRIMARY KEY(fname(20), sname(20), pos, birthdate ,school(20))"
        }
        this.mapping = defaultMap;
        this.oppoMapping = this.mapping;
        this.tableCreated = false;
        this.dbCreated = false;
    }


    /**
     * 
     * @param {*} fieldName 
     * @returns 
     */
    toColumnName(fieldName) {
        return this.mapping[fieldName];
    }

    /**
     * Converts operator name to the operator
     * @param {*} operatorName name of an operator  
     * @returns the operator matching the name of the operator
     */
    toOperator(operatorName) {
        return {
            "eq": "<=>",
            "neq": "<>",
            "gte": ">=",
            "lte": "<=",
            "gt": ">",
            "lt": "<",
        }[operatorName];

    }

    /**
     * Prepares the "Where" part in the query. Assumes filter exists with the conditions key.
     * @param {*} filter the read,update,delete methods filter  
     * @returns a string of the form: "Where colName1 = ? AND colName2 = ?" and escaped values matching the order of the '?'
     */
    prepareWhere(filter) {
        let escapedValues = [];
        let whereQueryString = "";
        let first = true;
        let colNames = Object.keys(filter["conditions"]) 
        for (let j = 0; j < colNames.length ; j++) {
            let colName = colNames[j];
            if (first) {
                first = false;
                whereQueryString += "WHERE ";
            }
            for (let i = 0; i < filter["conditions"][colName].length; i++) {
                let condition = filter["conditions"][colName][i];
                if(i > 0){
                    whereQueryString += " AND ";
                }
                if(colName == "age"){
                    whereQueryString += "TIMESTAMPDIFF(YEAR,birthdate,CURDATE())" + " " + this.toOperator(condition["operator"]) + " ?"
                }else{
                    whereQueryString += this.toColumnName(colName) + " " + this.toOperator(condition["operator"]) + " ?";
                }
                escapedValues.push(condition["value"]);
            }
            if(j !== colNames.length-1){
                whereQueryString += " AND "
            }
        }
        return { whereString: whereQueryString, escaped: escapedValues };

    }

    setBodyParamertersMapping(mapping){
        this.mapping = mapping;
        let newOppoMapping = {};
        for(let colName in mapping){
            newOppoMapping[mapping[colName]] = colName;
        }
        this.oppoMapping = newOppoMapping;
    }


    /**
     * Initializes the connection to the db
     * */
    async init() {
        try {
            await this.mysql_server.createPool();
            await this.createDatabase();
            this.dbCreated = true;
        } catch (err) {
            throw err;
        }
    }

    /**
     * shutdown all connections to the db.
     * */
    async end() {
        try{
            await this.mysql_server.shutdownConnections((err)=>{});
        }catch(err){
            throw err;
        }
    }


    /**
     * Creates the database in the MySql server
     * */
    async createDatabase() {


        try {
            await this.mysql_server.createQuery(`CREATE DATABASE IF NOT EXISTS prospects_db;`, null);
            await this.mysql_server.createQuery('USE prospects_db;', null);
        } catch (err) {
            throw err;
        }

    }

    /**
     * Creates the prospects table
     * */
    async createTable() {
        try {
            if(!this.dbCreated){
                await this.init();
            }
            const basicTableQueryString = `CREATE TABLE IF NOT EXISTS prospects`;

            let tableHeadersString = `(`;
            for (let column of this.tableHeadersDefinition["columns"]) {
                tableHeadersString += (column + ` ${this.tableHeadersDefinition[column]},`); 
            }
            tableHeadersString += (this.tableHeadersDefinition["key"] + ")");
            const tableQueryString = `${basicTableQueryString} ${tableHeadersString};`
            await this.mysql_server.createQuery(tableQueryString, null);
        } catch (err) {

            throw err;
        }
    }


    /**
     * 
     * @param {any} data
     */
    async create(data) {
        try{
            if(!this.tableCreated){
                await this.createTable();
            }
        }catch(err){
            throw err;
        }
        const queryInsertString = `INSERT IGNORE INTO prospects`
        let escapedValues = []
        let colsStrings = `(`;
        let argsString = `(`;
        for (let i = 0; i < this.tableHeadersDefinition["columns"].length; i++) {
            let colName = this.tableHeadersDefinition["columns"][i];
            if (this.oppoMapping[colName] in data) {
                colsStrings += `${colName}`;
                argsString += `?`;
                if (i !== this.tableHeadersDefinition["columns"].length - 1) {
                    colsStrings += `, `;
                    argsString += `, `;
                } else {
                    colsStrings += `)`;
                    argsString += `)`;
                }
                escapedValues.push(data[this.oppoMapping[colName]]);   
            }
        }
        const queryString = queryInsertString + colsStrings + " VALUES " + argsString +`;`;
        try {
            await this.mysql_server.createQuery(queryString, escapedValues);
        } catch (err) {
            throw err;
        }
    }


    
    /**
     * 
     *
     * @param {any} filter an object of structure 
     * {"colNames": [...], 
     *  "conditions": {<colName> : [{"operator": <operator>, "value": <value>}, ..., {"operator": <operatorName>, "value": <value>}]},
     * }
     */
    async read(filter) {
        let basicQueryString = "SELECT * FROM prospects ;";
        let escapedValues = null;
        if(filter){
            basicQueryString = "SELECT ";
            if ("colNames" in filter && filter["colNames"].length > 0) {
                for (let i = 0; i < filter["colNames"].length; i++) {
                    if(filter["colNames"][i] === 'age'){
                        basicQueryString += "TIMESTAMPDIFF(YEAR,birthdate, CURDATE()) as age"
                    }else{
                        basicQueryString += this.toColumnName(filter["colNames"][i]);
                    } 
                    if (i !== filter["colNames"].length - 1) {
                        basicQueryString += ", ";
                    } else {
                        basicQueryString += " ";
                    } 
                }
            } else {
                basicQueryString += "* ";
            }
            basicQueryString += "FROM prospects ";
            if("conditions" in filter){
                let whereObject = this.prepareWhere(filter);
                if (whereObject.whereString.length > 0) {
                    basicQueryString += whereObject.whereString;
                    escapedValues = whereObject.escaped;
                }
            } 
            basicQueryString += ";";
        }
        try {
            return await this.mysql_server.createQuery(basicQueryString, escapedValues);
        } catch (err) {

            throw err;
        }
    }

    /**
     * 
     * @param {any} filter an object of structure
     * {
     *  "conditions": {<colName> : [{"operator": <operator>, "value": <value>}, ..., {"operator": <operatorName>, "value": <value>}]},
     * }
     * @param {any} data a list of the form [{<columnName>:<value>},...,{<columnName>:<value>}]
     */
    async update(filter, data) {

        let basicQueryString = "UPDATE prospects SET ";
        let escapedValues = [];
        for (let i = 0; i < data.length; i++) {
            for (let colName in data[i]) {
                basicQueryString += `${this.toColumnName(colName)} = ?`;
                escapedValues.push(data[i][colName]);
            }
            if (i != data.length - 1) {
                basicQueryString += ", ";
            } else {
                basicQueryString += " ";
            }
        }
        console.log(`this is filter : \n`);
        console.log(filter);
        let whereObject = this.prepareWhere(filter);
        basicQueryString += whereObject.whereString;
        escapedValues = escapedValues.concat(whereObject.escaped);
        basicQueryString += ";"
        console.log(basicQueryString);
        console.log(escapedValues);
        try {
            return await this.mysql_server.createQuery(basicQueryString, escapedValues);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 
     * @param {any} filter an object of structure
     * {
     *  "conditions": {<colName> : [{"operator": <operator>, "value": <value>}, ..., {"operator": <operatorName>, "value": <value>}]},
     * }
     */
    async delete(filter) {

        let basicQueryString = "DELETE FROM prospects ";
        let whereObject = this.prepareWhere(filter);
        basicQueryString += whereObject.whereString;
        let escapedValues = whereObject.escaped;
        basicQueryString += ";"
        try {
            return await this.mysql_server.createQuery(basicQueryString, escapedValues);
        } catch (err) {
            throw err;
        }

    }




}


function getProspectsManager(){
    if(!ProspectsManager.isCreated){
        ProspectsManager.singletion = new ProspectsManager();
        ProspectsManager.isCreated = true;
    }
    return ProspectsManager.singletion;
}

module.exports = getProspectsManager;