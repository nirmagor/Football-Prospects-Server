const integer = new RegExp('^(0|[1-9]\\d*)$');
const float = new RegExp('^(0|[1-9]\\d*)(\\.\\d+)?$'); 
const feetAndInches = new RegExp('^(0|[1-9]\\d*)(\-([1][0-1]|\\d))?$');

function convertFromData(data){
    if(typeof data === "string"){
        if(integer.test(data)){
            return parseInt(data);
        }else if(float.test(data)){
            return parseFloat(data)
        }else{
            return data;
        }
    }else{
        throw new Error(`String expected. Got : ${typeof data}`);
    }
}

function feetToInches(data){
    if(typeof data === "string"){
        if(feetAndInches.test(data)){
            let parts = data.split('-');
            let feet = parts[0], inches = parts[1];
            return inches ? parseInt(feet)*12 + parseInt(inches): parseInt(feet)*12;
        }
        return data;
    }else{
        throw new Error(`String expected. Got : ${typeof data}`)
    }


}

const modFunctions = {
    "convertFromData" : convertFromData,
    "feetToInches" : feetToInches,
}

module.exports = modFunctions;