const { Router } = require('express');
const router = Router();
const authorize = require('../middlewares/authorize');
const validation = require('../middlewares/validationMiddleware')
const AccountSchema = require('../validates/account.validate')
const {
    createInvestAccount,
    getInvestedAccount,
    getListAccounts,
    editInvestAccount,
    getListStockExchanges,
    getInvestFundByAccount
} = require('../controllers/investaccount.controller');

router.post('/account/create', authorize(['INVESTMENT_DIRECTOR']), validation(AccountSchema.create), createInvestAccount);

router.get('/account/:accountNumber', authorize(['INVESTMENT_DIRECTOR', 'INVESTOR']), getInvestedAccount);

router.get('/accounts/:code', authorize(['INVESTOR', 'INVESTMENT_DIRECTOR']), getListAccounts);

router.get('/stockexchangecodes', getListStockExchanges);

router.post('/account/:accountNumber', authorize(['INVESTMENT_DIRECTOR']), editInvestAccount);

router.get('/account/funds/:accountNumber', getInvestFundByAccount);

// export router
module.exports = router;