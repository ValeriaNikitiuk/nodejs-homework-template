const express = require('express');
const router = express.Router();
const controll = require('../../controllers/contacts');

const validateBody = require('../../utils/validateBody');
const { schemas } = require('../../models/contact');
const validateId = require('../../helpers/vaidateId');
const authenticate = require('../../middlewares/authenticate');




router.get('/', authenticate, controll.getContact);

router.get('/:id',  authenticate, validateId, controll.getContactId);
  


router.post('/', authenticate, validateBody(schemas.addShema), controll.postContact);


router.delete('/:id',  authenticate, validateId, controll.delContact);

router.put('/:id', authenticate, validateBody(schemas.updateShema), controll.updateContact);
router.patch('/:id/favorite',  authenticate, validateBody(schemas.updFavoriteSchema), controll.updateStatusContact);


module.exports = router;
