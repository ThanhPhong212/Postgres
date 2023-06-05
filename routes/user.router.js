const { Router } = require('express');
const router = Router();
const validation = require('../middlewares/validationMiddleware');
const authorize = require('../middlewares/authorize');
const userSchemaValidate = require('../validates/user.validate')
const {
    getUsers,
    createUser,
    loginUser,
    getUserById,
    updateUser,
    getProfile,
    refreshToken
} = require('../controllers/user.controller');

router.get('/users', authorize(['ADMIN','INVESTMENT_DIRECTOR']), getUsers);

router.post('/user/register', validation(userSchemaValidate.create), createUser);

router.post('/user/login', loginUser);

router.get('/user/:id', getUserById);

router.post('/user/:code', validation(userSchemaValidate.updateUser), updateUser);

router.post('/login', loginUser);

router.post('/refresh-token', refreshToken);

router.get('/profile',authorize([]), getProfile);

// export router
module.exports = router;