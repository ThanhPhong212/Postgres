const yup = require('yup');
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


exports.create = yup.object().shape({
    email: yup.string().email().required(),
    password:yup.string().min(8).required(),
    fullName: yup.string().required(),
    gender: yup.mixed().oneOf(["0", "1", "2"]),
    birthday: yup.string().nullable(true),
    phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').nullable(true),
});

exports.updateUser = yup.object().shape({
    fullName: yup.string(),
    gender: yup.mixed().oneOf(["0", "1", "2"]),
    birthday: yup.string().nullable(true),
    phone: yup.string().matches(phoneRegExp, 'Phone number is not valid').nullable(true),
    status: yup.boolean(),
    isDeleted: yup.boolean(),
    password:yup.string().min(8).nullable(true)
});