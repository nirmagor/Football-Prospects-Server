module.exports = class ProfilesManager{
    constructor(){
        this.db;
    }

    create(callback){
        console.log(`create`);
    }

    read(filter, callback){
        console.log(`**profiles manager** => read`);
    }

    update(filter, data, callback){
        console.log(`update`);
    }

    delete(filter, callback){
        console.log(`delete`);
    }
}