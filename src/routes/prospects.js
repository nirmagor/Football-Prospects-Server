const path = require(`path`);
const express = require(`express`);
const router = express.Router();
const getDBManager = require(path.join(__dirname, `..//modules//db_manager`));


handleCustomFilter = function(customFilterString, filter){
    let conditionsKey = "conditions";
    let splittedCustomFilter = [];
    let buff = "";
    for(let i = 0; i < customFilterString.length; i++){
        if(customFilterString.charAt(i) === '^'){
            splittedCustomFilter.push(buff);
            buff = "";
        }else if(customFilterString.at(i) === ':'){
            let colName = splittedCustomFilter[0];
            let meaning = {"operator": splittedCustomFilter[1], "value":buff};
            if(colName in filter[conditionsKey]){
                filter[conditionsKey][colName].push(meaning);
            }else{
                filter[conditionsKey][colName] = [meaning];
            }
            splittedCustomFilter = [];
            buff = "";         
        }else{
            buff += customFilterString.at(i);
        }
    }

}

toFilter = function(query){
    let filter = {};
    let conditionsKey = "conditions";
    let columnNamesKey = "colNames";
    for(let fieldName in query){
        if(!fieldName.startsWith("show") ){
            if(! (conditionsKey in filter)){
                filter[conditionsKey] = {};
            }
            if(fieldName !== "cf"){
                let meaning = {"operator": "eq", "value": query[fieldName]};
                if(!(fieldName  in filter[conditionsKey])){
                    filter[conditionsKey][fieldName] = [meaning];
                }else{
                    filter[conditionsKey][fieldName].push(meaning)
                }
            }else{
                handleCustomFilter(query[fieldName], filter);                
            }
        }else{
            if(columnNamesKey in filter){
                filter[columnNamesKey].push(query[fieldName]);
            }else{
                filter[columnNamesKey] = [query[fieldName]];
            }
        }
    }
    return filter;    
};



router.get(`/`, async (req, res) => {    
        let filter = toFilter(req.query);
        let db_manager = getDBManager();
        try{
            let answer = await db_manager.read("prospects", filter);
            res.write(answer);
        }catch(err){    
            res.status(400);
        }
}
);






