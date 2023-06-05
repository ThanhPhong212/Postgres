const { InvestAccount, StockExchange, StockPortfolio, User, InvestFund } = require("../models/index");
const Sequelize = require("sequelize");
const { numberFormatThousands, decodeToken, convertDate } = require("../plugins/index");
const { tinhNo, tinhGiaTriCoPhieu } = require("../helper/index");
const { errorLogger, successLogger } = require('../config/logger');
const { ACCOUNT_LOG } = require('../config/config.json').logs;

// create role
exports.createInvestAccount = async (req, res) => {
    const time = new Date();
    try {
        const { body } = req;
        const { stockPortfolio } = body;
        successLogger.info(ACCOUNT_LOG['CREATE_ACCOUNT'], { uid: null, params: body, time: time });

        const CreatedBy = decodeToken(req.headers.authorization);
        body.createdBy = CreatedBy;

        //create investaccount
        const investAccount = await InvestAccount.create(body);

        //create detail account 
        if (stockPortfolio && stockPortfolio.length > 0) {
            stockPortfolio.forEach(async (item) => {
                item.accountNumber = body.accountNumber,
                    item.priceCurrent = item.price,
                    await StockPortfolio.create(item)
            })
        }
        res.status(200).send({
            status: true,
            message: "",
            data: investAccount
        });
    } catch (error) {
        errorLogger.error(ACCOUNT_LOG['CREATE_ACCOUNT'], { uid: null, params: req.body, time: time, err_message: error.message });
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
};

exports.getInvestedAccount = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { fundId } = req.query;
        let sumOwe = 0, sumStock = 0, fundName = null, fund_Id;
        let array_include = [{ model: StockExchange }];
        let queryStockPortfolio = [];

        //Lấy thông tin mã chứng khoán theo quỹ
        if (fundId) {
            const fund = await InvestFund.findOne({
                where: { id: fundId, isDeleted: false, status: true }
            });

            fundName = fund.investFundName;
            fund_Id = fund.id;
            //push query where condition
            queryStockPortfolio.push({ investFundId: fundId });
            //push model include 
        };
        if (!fundId) queryStockPortfolio.push({ investFundId: { [Sequelize.Op.is]: null } });
        array_include.push({
            model: StockPortfolio,
            required: false,
            attributes: { exclude: ['createdAt', 'updatedAt', 'investFundId'] },
            where: [...queryStockPortfolio],
        })
        //Thông tin tài khoản giao dịch
        const investAccount = await InvestAccount.findOne({
            where: { accountNumber: accountNumber.toString(), isDeleted: false },
            include: array_include,
            attributes: { exclude: ['stockExchangeCode', 'updatedAt', 'createdBy', 'id'] }
        });

        if (investAccount) {
            investAccount.dataValues.fundName = fundName;
            investAccount.dataValues.fundId = fund_Id;
            //caculate Owe, Stock by invest account 
            if (investAccount.StockPortfolios) {
                investAccount.StockPortfolios.map((item) => {
                    //Sức mua * margin / (1 + margin)
                    sumOwe += tinhNo(item);
                    //giá hiện tại nhân khối lượng
                    sumStock += tinhGiaTriCoPhieu(item);
                })
            }
            const owe = Number((sumOwe / 1e9).toFixed(2));
            const stockValue = Number((sumStock / 1e9).toFixed(2));
            //Tiền ròng = giá trị cố phiếu + số dư - nợ
            const nestAsset = stockValue + investAccount.surplus / 1e9 - owe;
            //fortmat hàng ngàn
            investAccount.dataValues.formatTotalOwe = numberFormatThousands(owe);
            investAccount.dataValues.formatTotalStockValue = numberFormatThousands(stockValue);
            investAccount.dataValues.formatNetAsset = numberFormatThousands(Number((nestAsset).toFixed(2)));
        }
        res.status(200).send({
            status: true,
            message: "",
            data: investAccount
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
};

exports.getInvestFundByAccount = async (req, res, next) => {
    try {
        const { accountNumber } = req.params;
        //get detail account by investFundId not null and group by account number
        const stockPortfolios = await StockPortfolio.findAll({
            where: { accountNumber: accountNumber, investFundId: { [Sequelize.Op.ne]: null } },
            include: [{
                model: InvestFund,
                attributes: ['investFundName'],
                where: { isDeleted: false, status: true },
            }],
            attributes: ['investFundId'],
            raw: true,
            group: ['accountNumber', 'investFundId', 'InvestFund.id'],
            distinct: true
        });

        //change field  InvestFund.investFundName => investFundName
        stockPortfolios.map((item) => {
            item.investFundName = item['InvestFund.investFundName'];
            delete item['InvestFund.investFundName'];
        })
        res.status(200).send({
            status: true,
            message: "",
            data: stockPortfolios
        });
    }
    catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
}

exports.getListAccounts = async (req, res, next) => {
    try {
        const { code } = req.params;
        const data = await User.findOne({
            where: { code: code, isDeleted: false },
            attributes: ['id', 'code', 'fullName'],
            include: [{
                model: InvestAccount,
                required: false,
                where: { isDeleted: false },
                attributes: { exclude: ['createdBy', 'investFundId', 'userId', 'isDeleted'] },
                orderBy: ['updatedAt', 'DESC']
            }]
        })
        let last_updated = null;
        if (data)
            last_updated = data.InvestAccounts.length > 0 ? convertDate(data.InvestAccounts[0].updatedAt, '/') : null;

        return res.status(200).send({
            status: true,
            message: "",
            last_updated: last_updated,
            data: data
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
}

exports.getListStockExchanges = async (req, res) => {
    try {
        const stockExchanges = await StockExchange.findAll();
        if (!stockExchanges) {
            res.status(404).send({
                status: false,
                message: "not found",
                data: stockExchanges
            });
        }
        res.status(200).send({
            status: true,
            message: "",
            data: stockExchanges
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
}

exports.editInvestAccount = async (req, res, next) => {
    const { accountNumber } = req.params;
    const { accountName, status, isDeleted } = req.body;
    const time = new Date();
    try {
        successLogger.info(ACCOUNT_LOG['UPDATE_ACCOUNT'], { uid: null, params: req.body, time: time });
        const investAccount = await InvestAccount.findOne({
            where: { accountNumber: accountNumber }
        });

        //rename invest account
        if (accountName) investAccount.accountName = accountName;

        //edit status invest account
        investAccount.status = status;

        //delete invest account 
        if (isDeleted) {
            investAccount.isDeleted = true;
            investAccount.status = false;
            await StockPortfolio.update({ investFundId: null }, { where: { accountNumber: accountNumber } })
        }
        await investAccount.save();
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: investAccount
        })
    } catch (error) {
        errorLogger.error(ACCOUNT_LOG['UPDATE_ACCOUNT'], { uid: null, params: req.body, time: time, err_message: error.message });
        return res.status(400).send({
            status: false,
            message: error.message
        });
    }
}