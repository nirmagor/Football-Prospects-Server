

class InvalidInput {

    constructor(paramNames) {
        this.fields = paramNames;
    }


    static explanations() {

        return {
            fname: "The first name you've entered is illegal",
            sname: "The second name you've entered is illegal",
            position: "The position you've entered doesn't exist",
            dob: "The date of birth you've entered is incorrect or illegal. Players can be only 19 years old or more.",
            school: "The school name you've entered is illegal",
            height_feet: "The height you've entered is illegal(feet).",
            height_inches: "The height you've entered is illegal(inches).",
            vert_inches: "The vertical jump height is illegal(inches).",
            vert_feet: "The vertical jump height is illegal(feet).",
            weight: "The weight you've entered is illegal",
            forty: "The 40 yard dash time you've entered is illegal",
            benchpress:"The number of benchpresses you've entered is illegal"
        }

    } 
    explain() {
        let relevantExplanations = [];
        this.fields.forEach((field) => {
            relevantExplanations.push(InvalidInput.explanations()[field]);
        });

        return relevantExplanations;
    }

}

class ProspectsValidator {

    constructor() {

    }


    validateData() {

        throw "NOT IMPLEMENTED";
    }

    validateFilter() {

        throw "NOT IMPLEMENTED";
    }

}

class ProfileValidator {

    constructor(bodyParams) {
        this.fields = bodyParams;
        this.invalidInput = [];
    }

    static _dateIsOver19(date) {
        let gap = date.valueOf() - Date.now();
        let nineteenYearsInMS = 19 * 365.25 * 24 * 3600 * 1000;
        return gap >= nineteenYearsInMS; 
    }

    _validateFname() {
        let check = new RegExp(`^[A-Za-z][a-z]{24}$`);
        return this.fields.fname.match()
    }

    _validateSname() {
        let check = new RegExp(`^([A-Za-z][a-z]{1,24}\.\s)?[A-Za-z][a-z]{4,24}`);
        return this.fields.sname.match()
    }

    _validatePos() {
        let check = new RegExp(`(QB|RB|FB|TE|OT|G|C|WR|DT|IDL|EDGE|OLB|ILB|CB|S|K|P)`);
        return this.fields.position.match(check);
    }

    _validateDOB() {
        let check = new RegExp(`[1-2][0-9][0-9][0-9]\-[0-1][0-2]?\-[0-3][0-9]`); 
        let date = Date.parse(this.fields.dob);
        return this.fields.dob.match(check) && date !== NaN && ProfileValidator._dateIsOver19(date) ;
    }

    _validateSchool() {
        let check = new RegExp(`^([A-Z]\.\s)?([A-Z][a-z]{0,24}(\s)?)+(([A-Za-z][a-z])?\.(\s)?|[A-Z][a-z]{4,24})?$`);
        return this.fields.position.match(check);
    }

    _validateHeightFeet() {
        let check = new RegExp(`[4-8]`); 
        return this.fields.height_feet.match(check);
    }

    static _validateHeightInches() {
        let check = new RegExp(`([1][0-1]|[0-9])`);
        return this.fields.height_inches.match(check);
    }

    _validateVertJmpInches() {
        if (typeof this.fields.vert_inches === undefined) {
            return true;
        }
        let check = new RegExp(`([1][0-1]|[0-9])`);
        return this.fields.vert_inches.match(check);
    }

    _validateVertJmpFeet() {
        if (typeof this.fields.vert_feet === undefined) {
            return true;
        }
        let check = new RegExp(`([0-9]|[1-4][[0-9])`); 
        return this.fields.vert_feet.match(check);
    }

    _validateWeight() {
        let check = new RegExp(`^[1-3][1-9][0-9]$`); 
        return this.fields.weight.match(check);
    }

    _validate40YardsDash() {
        if (typeof this.fields.forty === undefined) {
            return true;
        }
        let check = new RegExp(`[3-7](\.[0-9]([0-9])?)?`); 
        return this.fields.forty.match(check);
    }

    _validateBenchpress() {
        if (typeof this.fields.benchpress === undefined) {
            return true;
        }
        let check = new RegExp(`([5][0])|([1-4][0-9])|([0-9]))`);
        return this.fields.benchpress.match(check);        

    }


    validate() {
        let invalidFields = [];
        if (!this._validateFname()) {
            invalidFields.push(`fname`);

        } else if (!this._validateSname()) {
            invalidFields.push(`sname`);
        } else if (!this._validatePos()) {
            invalidFields.push(`position`);
        } else if (!this._validateDOB()) {
            invalidFields.push(`dob`);
        } else if (!this._validateSchool()) {
            invalidFields.push(`school`);
        } else if (!this._validateHeight()) {
            invalidFields.push(`height`);
        } else if (!this._validateVertJmpInches()) {
            invalidFields.push(`vert_inches`);
        } else if (!this._validateVertJmpFeet()) {
            invalidFields.push(`vert_feet`);
        } else if (!this._validateWeight()) {
            invalidFields.push(`weight`);
        } else if (!this._validate40YardsDash()) {
            invalidFields.push(`forty`);
        } else if (!this._validateBenchpress()) {
            invalidFields.push(`benchpress`);
        } else {
            return true;
        }

        this.invalidInput = new InvalidInput(invalidFields).explain();
        return false;
    }


}



module.exports = { profileValidator: ProfileValidator, prospectsValidator: ProspectsValidator};