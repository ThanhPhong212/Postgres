const { InvestFund, User, FundUser, StockPortfolio, InvestAccount, Role } = require('../models/index');
const { Op } = require('sequelize');
const { FUND_LOG } = require('../config/config.json').logs;
const { errorLogger, successLogger } = require('../config/logger');
const { decodeToken, convertDate } = require('../plugins');

// create invest fund
exports.createInvestFund = async (req, res) => {
  const time = new Date();
  const { investorId } = req.body;
  try {
    successLogger.info(FUND_LOG['CREATE_FUND'], { uid: null, params: req.body, time: time });
    // create invest fund
    const investFund = await InvestFund.create(req.body);
    if (investorId) {
      const investorList = [];
      await Promise.all(
        investorId.map((item) => {
          investorList.push({ InvestFundId: investFund.id, UserId: item });
        })
      );
      await FundUser.bulkCreate(investorList);
    }
    res.status(200).send({
      status: true,
      message: '',
      data: investFund,
    });
  } catch (error) {
    errorLogger.error(FUND_LOG['CREATE_FUND'], { uid: null, params: req.body, time: time, err_message: error.message });
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// get list invest fund
exports.getInvestFund = async (req, res) => {
  try {
    const { key_word } = req.query;
    const limit = req.query.limit ? req.query.limit : 10;
    const page = req.query.page ? req.query.page : 1;
    const keyWord = [];
    const query = [{ isDeleted: false }];
    const includeInvestor = [];

    // check user role
    const token = req.headers.authorization;
    const id = decodeToken(token);
    const user = await User.findByPk(id, {
      include: { model: Role },
    });

    const role = user.Role.value;
    if (user) {
      if (role === 'INVESTOR') {
        includeInvestor.push({
          model: User,
          where: { [Op.and]: [{ isDeleted: false }, { id: id }] },
          attributes: ['id', 'fullName'],
          through: { attributes: [] },
        })
      }
      if (role === 'EXPERT') {
        query.push({ expertId: id });
      }
    }

    //search fund name
    if (key_word) {
      keyWord.push({ investFundName: { [Op.iLike]: `%${key_word}%` } });
    }
    if (!key_word) keyWord.push({ isDeleted: false });

    const investFund = await InvestFund.findAndCountAll({
      where: {
        [Op.and]: [...query],
        [Op.or]: [...keyWord],
      },
      include: includeInvestor,
      limit: limit,
      offset: (page - 1) * limit,
      order: [['updatedAt', 'DESC']],
    });

    // get expert name
    for (let i = 0; i < investFund.rows.length; i++) {
      if (investFund.rows[i].expertId) {
        const expertName = await User.findOne({
          where: {
            id: investFund.rows[i].expertId,
            isDeleted: false,
          },
        });
        if (expertName) {
          investFund.rows[i].dataValues.expertName = expertName.fullName;
        }
      }
    }

    // total page
    const total_page = investFund.count % limit != 0 ? Math.floor(investFund.count / limit) + 1 : Math.floor(investFund.count / limit);

    res.status(200).send({
      status: true,
      message: '',
      last_updated: investFund.rows.length > 0 ? convertDate(investFund.rows[0].updatedAt) : null,
      page,
      total_page: total_page,
      limit,
      isNext: parseInt(page) < total_page ? true : false,
      data: investFund.rows,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// get info investFund
exports.getInfoInvestFund = async (req, res) => {
  try {
    const fundId = req.params.id;
    const infoFund = await InvestFund.findOne({
      where: { id: fundId, isDeleted: false },
      include: [
        {
          model: StockPortfolio,
          attributes: ['accountNumber'],
          include: [
            {
              model: InvestAccount,
              attributes: ['accountName', 'surplus'],
              include: [
                {
                  model: User,
                  attributes: ['id', 'fullName'],
                },
              ],
            },
          ],
        },
        // list of investors included in the fund (at the request of the FE)
        {
          model: User,
          attributes: ['id', 'fullName'],
          through: { attributes: [] },
        },
      ],
    });

    if (infoFund) {
      let totalFund = 0;
      infoFund.StockPortfolios.map((item) => {
        let surplus = item.InvestAccount.surplus;
        totalFund += surplus;
      });
      infoFund.StockPortfolios.map((item) => {
        // fund rate
        let surplus = parseInt(item.InvestAccount.surplus);
        item.InvestAccount.dataValues.fundRate = ((surplus * 100) / totalFund).toFixed(2);

        // format data
        item.InvestAccount.dataValues.investorName = item.InvestAccount.User.fullName;
        delete item.InvestAccount.dataValues.User;
        Object.keys(item.InvestAccount.dataValues).forEach((value) => {
          item.dataValues[value] = item.InvestAccount.dataValues[value];
        });
        delete item.dataValues.InvestAccount;
      });
      // get expert name
      if (infoFund.expertId) {
        const expertName = await User.findOne({
          where: {
            id: infoFund.expertId,
          },
        });
        infoFund.dataValues.expertName = expertName.fullName;
      }
    }
    res.status(200).send({
      status: true,
      message: '',
      data: infoFund,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// update invest fund by INVESTMENT_DIRECTOR
exports.updateFund = async (req, res) => {
  const time = new Date();
  const { investors, isDeleted } = req.body;
  const { id } = req.params;
  try {
    // log
    successLogger.info(FUND_LOG['UPDATE_FUND'], { uid: id, params: req.body, time: time });

    // remove expert from fund when fund is deleted
    if (isDeleted === true) req.body.expertId = null;

    // update info fund
    await InvestFund.update(req.body, { where: { id: id, isDeleted: false } });

    if (investors) {
      // find investors removed and remove investor's account from the fund
      const deleteFundUser = await FundUser.findAll({
        where: { UserId: { [Op.notIn]: investors }, InvestFundId: id },
      });

      if (deleteFundUser) {
        //put the deleted investor's id in fundUser array
        const fundUser = [];
        await Promise.all(
          deleteFundUser.map((item) => {
            fundUser.push(item.UserId);
          })
        );

        // find the investor's account that has been removed from the fund
        const account = await StockPortfolio.findAll({
          where: { investFundId: id },
          include: {
            where: { userId: fundUser, isDeleted: false },
            model: InvestAccount,
          },
        });

        // remove investor's account from the fund
        account.map((item) => {
          item.investFundId = null;
          item.save();
        });
      }

      //add investor
      await FundUser.destroy({ where: { InvestFundId: id } });
      const investorList = [];
      await Promise.all(
        investors.map((item) => {
          investorList.push({ InvestFundId: id, UserId: item });
        })
      );
      await FundUser.bulkCreate(investorList);
    }

    res.status(200).send({
      status: true,
      message: 'update success',
    });
  } catch (error) {
    // log error
    errorLogger.error(FUND_LOG['UPDATE_FUND'], { uid: id, params: req.body, time: time, err_message: error.message });
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
