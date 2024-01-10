export const formValidators = {
    notEmptyValidator: {
        validate: (value) => {
            console.log(value.toString());
            return value.toString().trim().length > 0;
        },
        message: "The field cannot be empty"
    },
    telephoneValidator: {
        validate: (value) => {
            return value.trim().length === 9 && /^\d+$/.test(value);
        },
        message: "The telephone number must be 9 digits long and contain only numbers"
    },
    notNoneTypeValidator: {
        validate: (value) => {
            return value !== "None";
        },
        message: "Please, select a type"
    },
    validPhoneNumberValidator: {
        validate: (value) => {
            return value.trim().length === 9 && /^\d+$/.test(value);
        },
        message: "The phone number must be 9 digits long and contain only numbers"
    },
    descriptionValidator: {
        validate: (value) => {
            console.log(value.toString().trim().length);
            return value.toString().trim().length <= 80 && value.toString().trim().length > 0;
        },
        message: "The profile description must be at most 80 characters long"
    },
    pictureValidator: {
        validate: (value) => {
            if(!value.toString().trim().length > 0) { 
                alert("Please, upload a picture");
            } else if (value.toString().trim().length > 54000) {
                alert("Picture size too big (max 40KB)");
            }
            return value.toString().trim().length > 0 && value.toString().trim().length <= 54000;
        },
        message: "Please, upload a picture"
    },
}