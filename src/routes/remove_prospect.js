const path = require(`path`);
const express = require(`express`);
const router = express.Router();
const getDBManager = require(path.join(__dirname, `..//modules//db_manager`));


toFilter = function(query){
    let filter = {};
    let conditionsKey = "conditions";
    for(let fieldName in query){
        if(! (conditionsKey in filter)){
            filter[conditionsKey] = {};
        }
        let meaning = {"operator": "eq", "value": query[fieldName]};
        if(!(fieldName  in filter[conditionsKey])){
            filter[conditionsKey][fieldName] = [meaning];
        }else{
            filter[conditionsKey][fieldName].push(meaning)
        }
    }
    return filter;
}

router.get(`/`, async (req, res)=>{});

router.post(`/`, async (req, res)=>{
    let filter = toFilter(req.query);
    let db_manager = getDBManager();
    try{
        let answer = await db_manager.delete("prospects", filter);
    }catch(err){
        res.status(400);
    }

})