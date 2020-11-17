// const express = require(`express`);
const path = require(`path`);
const get_db_manager = require(path.join(__dirname, `/src/modules/db_manager`));

// const server = express();
let db_manager = get_db_manager();
let db_manager2 = get_db_manager();


async function main() {
    try {
        await db_manager.init();
        await db_manager.end();
    } catch (err) {
        throw err;
    }


    
    
}

main();