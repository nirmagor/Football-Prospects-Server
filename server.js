// const express = require(`express`);
const path = require(`path`);
const get_db_manager = require(path.join(__dirname, `/src/modules/db_manager`));

// const server = express();
let db_manager = get_db_manager();
let db_manager2 = get_db_manager();

db_manager.read(`profile`);
db_manager.update(`prospects`);
db_manager.delete(`board`);
db_manager2.read(`profile`);