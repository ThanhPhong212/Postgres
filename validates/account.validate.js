const yup = require('yup');
exports.create = yup.object().shape({
    accountName: yup.string().required(),
    accountNumber: yup.string().min(10).required(),
    surplus: yup.number().required(),
    stockPortfolio: yup.array().of(yup.object().shape({
        stockCode: yup.string().required(),
        amount: yup.number().required(),
        price: yup.number().required()
    })).nullable(true),
});