const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/auth');
const validateBody = require('../../utils/validateBody');
const { schemas } = require('../../models/user');
const authenticate = require('../../middlewares/authenticate');


router.post('/register', validateBody(schemas.registerShema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate , ctrl.logOut);

module.exports = router;