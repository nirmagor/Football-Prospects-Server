const path = require(`path`);
const express = require(`express`);
const multer = require("multer");
const router = express.Router();
const getDBManager = require(path.join(__dirname, `..//modules//db_manager`));
const bodyParametersMapping = require(path.join(__dirname, `..//modules//body_parameters`));
const stoarge = multer.diskStorage({
    destination: function (req, file, cb){
    cb(null, path.join(__dirname, `..//..//uploaded_data/`));
}, filename: function(req, file, cb){
    cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
}
}) 
const upload = multer({storage: stoarge});

toFilter = function(query){
    const filter = {};
    const conditionsKey = "conditions";
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

router.get(`/`, async (req, res) => {    
}
);

const postMiddlewares = [ upload.single("avatar"), express.json(), express.urlencoded({extended:true})];

router.post(`/`, postMiddlewares, async (req, res) => {
    const filepath = req[`avatar`].file.path;
    const filter = toFilter(req.query);
    const db_manager = getDBManager();
    db_manager.setProspectManagerBodyParametersMapping(bodyParametersMapping);
    try{
        const answer = await db_manager.update("prospects", filter, req.body);
        res.write(answer)
    }catch(err){
        res.status(400);
    }

});


module.exports = router;
