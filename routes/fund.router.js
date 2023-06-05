const { Router } = require('express');
const router = Router();
const authorize = require('../middlewares/authorize');
const validation = require('../middlewares/validationMiddleware');
const fundSchemaValidate = require('../validates/fund.validate')


const { createInvestFund, getInvestFund, getInfoInvestFund, updateFund, getFundByUser } = require('../controllers/investfund.controller');

router.post('/fund/create', authorize(['INVESTMENT_DIRECTOR']), validation(fundSchemaValidate.createFund), createInvestFund);

router.get('/funds', authorize(['INVESTMENT_DIRECTOR', 'INVESTOR', 'EXPERT',]), getInvestFund);

router.get('/fund/:id', authorize(['INVESTMENT_DIRECTOR', 'INVESTOR', 'EXPERT',]), getInfoInvestFund);

router.post('/fund/:id', authorize(['INVESTMENT_DIRECTOR', 'INVESTOR']),validation(fundSchemaValidate.updateFund), updateFund);

// export router
module.exports = router;
