const yup = require('yup');

exports.create = yup.object().shape({
  value: yup.mixed().oneOf(['ADMIN', 'INVESTMENT_DIRECTOR', 'ACCOUNTANTS', 'INVESTOR', 'EXPERT']),
});
