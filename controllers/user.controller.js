const { User, Role, InvestFund, FundUser } = require('../models/index');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const fsExtra = require('fs-extra');
const { convertDate } = require("../plugins/index");

const { errorLogger, successLogger } = require('../config/logger');
const { USER_LOG } = require('../config/config.json').logs;

// Create User
exports.createUser = async (req, res) => {
  const time = new Date();
  try {
    //save log
    successLogger.info(USER_LOG['CREATE_USER'], { uid: null, params: req.body, time: time });

    const { body } = req;

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);
    body.password = hashPassword;

    //save avatar name later
    const avatarName = body.avatar;
    delete body.avatar;

    //create user and save code
    const user = await User.create(req.body);
    const userId = `HBM${10000 + parseInt(user.id)}`;

    user.code = userId;
    user.save();

    //create user upload folder if not already
    const dir = __dirname.replace('controllers', `uploads/user/${userId}/avatar`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (avatarName) {
      //move avatar from tmp folder to upload
      const tmpPath = __dirname.replace('controllers', `tmp/${avatarName}`);
      const uploadPath = `${dir}/${avatarName}`;
      fs.rename(tmpPath, uploadPath, async function (err) {
        if (!err) {
          //if the file transfer is successful, save avatar name to the data
          user.avatar = avatarName;
          user.save();
        }
      });
    }
    res.status(200).send({
      status: true,
      message: '',
      data: user,
    });
  } catch (err) {
    //save log err
    errorLogger.error(USER_LOG['CREATE_USER'], { uid: null, params: req.body, time: time, err_message: err.message });
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

// Get all ->
exports.getUsers = async (req, res) => {
  try {
    const { role_id, status, key_word, orderBy } = req.query;
    const limit = req.query.limit ? req.query.limit : 10;
    const page = req.query.page ? req.query.page : 1;
    const query = [{ isDeleted: false }];
    const query_role = [];
    const keyWord = [];

    //setup sort order
    const order_default = {
      createdAt: ['createdAt', 'DESC'],
      roleId: ['roleId', 'DESC'],
    };
    const order = [];
    if (orderBy) {
      for (let i = 0; i < orderBy.split(',').length; i++) {
        if (order_default[orderBy.split(',')[i]]) {
          order_default[orderBy.split(',')[i]] = [orderBy.split(',')[i], 'ASC'];
        }
      }
    }
    Object.keys(order_default).forEach((keys) => {
      order.push(order_default[keys]);
    });

    //set up sort for query Or
    if (key_word)
      keyWord.push(
        {
          fullName: {
            [Op.iLike]: `%${key_word}%`,
          },
        },
        {
          code: {
            [Op.iLike]: `%${key_word}%`,
          },
        }
      );
    if (!key_word) keyWord.push({ isDeleted: false });

    //set up sort for query And
    if (status) query.push({ status: status });
    if (role_id) query_role.push({ id: role_id });
    const user = await User.findAndCountAll({
      where: {
        [Op.and]: [...query],
        [Op.or]: [...keyWord],
      },
      attributes: { exclude: ['password', 'roleId'] },
      include: [
        {
          where: {
            [Op.and]: [...query_role],
          },
          model: Role,
          attributes: ['id', 'text', 'value'],
        },
      ],
      limit: limit,
      offset: (page - 1) * limit,
      order: [...order],
    });
    const total_page = user.count % limit != 0 ? Math.floor(user.count / limit) + 1 : Math.floor(user.count / limit);

    for (let i = 0; i < user.rows.length; i++) {
      const fund = await InvestFund.findOne({
        where: {
          expertId: user.rows[i].id,
          isDeleted: false,
        },
      });
      if (fund) {
        user.rows[i].dataValues.fund = fund.investFundName;
      }
    }
    res.status(200).send({
      last_updated: user.rows.length > 0 ? convertDate(user.rows[0].updatedAt) : null,
      total_page: total_page,
      data: user.rows,
      page,
      limit,
      isNext: parseInt(page) < total_page ? true : false,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// login User
exports.loginUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({
      where: { userName: userName, isDeleted: false, status: true }
    })
    if (!user) return res.status(403).send({
      status: false,
      message: "User not exist!!!"
    });
    const check = await bcrypt.compare(password, user.password);
    if (!check) return res.status(403).send({
      status: false,
      message: "password wrong!!!"
    });
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_REFRESH_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
    res.status(200).send({
      status: true,
      message: 'login success',
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message
    })
  }
}

//get user by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const include = [{ model: Role, attributes: ['id', 'value', 'text'] }];
  if (!id)
    return res.status(400).send({
      status: false,
      message: 'Id is required',
    });
  try {
    const fund = await FundUser.findAll({ where: { UserId: id } });
    if (fund.length > 0) {
      include.push({
        model: InvestFund,
        where: { isDeleted: false },
        attributes: ['id', 'investFundName'],
        through: { attributes: [] },
      })
    }
    let user = await User.findOne({
      where: { id: id, isDeleted: false },
      attributes: { exclude: ['password', 'roleId'] },
      include: include
    });
    const fundExpert = await InvestFund.findOne({
      where: { expertId: id, isDeleted: false, },
      attributes: ['id', 'investFundName'],
    })
    if (fundExpert) {
      user = Object.assign({}, user.dataValues, { InvestFunds: [fundExpert.dataValues] });
    }
    if (!user) {
      return res.status(404).send({
        status: true,
        message: 'User not found',
      });
    }
    res.status(200).send({
      status: true,
      message: '',
      data: user
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

//Profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.headers.authorization) res.send(403);
    const bearer = req.headers.authorization.split(' ');
    const bearerToken = bearer[1];
    const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
    const id = verify.id;
    const user = await User.findByPk(id, {
      include: {
        model: Role
      },
      attributes: {
        exclude: ['password', 'token', 'roleId']
      }
    });
    if (user) {
      res.status(200).send({
        status: true,
        message: '',
        data: user,
      });
    } else {
      res.status(404).send({
        message: `Cannot find User with id=${id}.`
      });
    }
  }
  catch (err) {
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }

};

//update user by code
exports.updateUser = async (req, res) => {
  const { code } = req.params;
  const { body } = req;
  const time = new Date();
  try {
    successLogger.info(USER_LOG['UPDATE_USER'], { uid: code, params: req.body, time: time });
    //create user upload folder if not already
    const uploadPath = __dirname.replace('controllers', `uploads/user/${code}/avatar`);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    if (!code) {
      return res.status(400).send({
        status: false,
        message: 'Code is required',
      });
    }

    //save avatar name later
    const avatarName = body.avatar;
    delete body.avatar;

    //change password
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(body.password, salt);
      body.password = hashPassword
    }

    //update isDeleted
    if (body.isDeleted && body.isDeleted == true) body.status = false;
    await User.update(req.body, {
      where: { code: code },
    });


    // save avatar
    if (avatarName) {
      //delete old avatar picture in uploads folder
      fsExtra.emptyDirSync(uploadPath);

      //move avatar from tmp folder to upload
      const tmpPath = __dirname.replace('controllers', `tmp/${avatarName}`);
      const avatarPath = `${uploadPath}/${avatarName}`;
      fs.rename(tmpPath, avatarPath, async function (err) {
        if (!err) {
          //update avatar name
          const user = await User.findOne({ where: { code: code } });
          user.avatar = avatarName;
          user.save();
        }
      });
    }
    res.status(200).send({
      status: true,
      message: 'Update success',
    });
  } catch (error) {
    errorLogger.error(USER_LOG['UPDATE_USER'], { uid: code, params: req.body, time: time, err_message: error.message });
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(403).send({
      status: false,
      message: "Refresh token is required!!!"
    });
    const verify = jwt.verify(refresh_token, process.env.SECRET_REFRESH_KEY);
    const id = verify.id;
    const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(200).send({
      status: true,
      message: 'Refresh token success',
      token: token,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message
    })
  }
}