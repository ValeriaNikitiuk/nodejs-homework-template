const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/auth');
const validateBody = require('../../utils/validateBody');
const { schemas } = require('../../models/user');

router.post('/register', validateBody(schemas.registerShema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;