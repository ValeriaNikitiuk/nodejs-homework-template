const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/auth');
const validateBody = require('../../utils/validateBody');
const { schemas } = require('../../models/user');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');


router.post('/register', validateBody(schemas.registerShema), ctrl.register);
router.get('/auth/verify/:verificationToken', ctrl.verify);
router.post('/verify', validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate , ctrl.logOut);
router.patch('/avatars', authenticate, upload.single("avatar"), ctrl.updateAvatar);

module.exports = router;