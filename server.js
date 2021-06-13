const express = require(`express`);
const pathModule = require(`path`);
const dotenv = require(`dotenv`);
const envconfig = dotenv.config({ path: pathModule.join(__dirname, "") });
const app = express();

class Server{
    constructor(){
        this.routes = {
            login: require(pathModule.join(__dirname, `/src/routes/login`)),
            prospects: require(pathModule.join(__dirname, `/src/routes/prospects`)),
            addProspect: require(pathModule.join(__dirname, `/src/routes/add_prospect`)),
            removeProspect: require(pathModule.join(__dirname, `/src/routes/remove_prospect`)),
            editProspect: require(pathModule.join(__dirname, `/src/routes/edit_prospect`)),
            profile: require(pathModule.join(__dirname, `/src/routes/profile`)),
            bigBoard: require(pathModule.join(__dirname, `/src/routes/big_board`))
        };
        
    }




    doRouting() {
        //app.use(`/login`, routes.login.run);
        //app.use(`/prospects`, routes.prospects.run);
        app.use(`/add_prospect`, this.routes.addProspect);
        //app.use(`/remove_prospect`, routes.removeProspect.run);
        //app.use(`/edit_prospect`, routes.editProspect.run);
        //app.use(`/profile`, routes.profile.run);
        //app.use(`/big_board`, routes.bigBoard.run);
    }

    config() {

        this.doRouting();
        app.set(`view engine`, `ejs`);
        
    }


    run() {
        app.listen(process.env.SERVER_PORT);
        this.config();
    }

}






function main() {

    const server = new Server();
    server.run();
    
}

main();