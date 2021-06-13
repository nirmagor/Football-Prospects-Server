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
    const newFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null,  newFileName);
}
}) 
const upload = multer({storage: stoarge});



router.get(`/`, async (req, res) => {
    res.send("add_prospect");    
}
);

const postMiddlewares = [upload.single("avatar"), express.json(), express.urlencoded({extended:true})];

router.post(`/`, postMiddlewares, async (req, res) => {
    const dbManager = getDBManager();
    dbManager.setProspectManagerBodyParametersMapping(bodyParametersMapping);
    try{
        res.write(req.body);
        const answer = await dbManager.update("prospects", req.body);
        res.write(answer);
        res.end();
    }catch(err){
        console.log(err);
        res.status(400);
    }

});


module.exports = router;
