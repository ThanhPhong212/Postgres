const yup = require('yup');


exports.createFund = yup.object().shape({
    investFundName: yup.string().required(),
    expertId:yup.number().nullable(true),
    status: yup.boolean(),
    isDeleted: yup.boolean(),
    investorId:yup.array(),
});

exports.updateFund = yup.object().shape({
    investFundName: yup.string(),
    expertId:yup.number().nullable(true),
    status: yup.boolean(),
    isDeleted: yup.boolean(),
    investorId:yup.array(),
});