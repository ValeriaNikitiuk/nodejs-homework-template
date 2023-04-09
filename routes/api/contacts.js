const express = require('express');
const router = express.Router();
const controll = require('../../controllers/contacts');

const validateBody = require('../../utils/validateBody');
const {schemas } = require('../../models/contact');




router.get('/', controll.getContact);

router.get('/:id', controll.getContactId);
  


router.post('/', validateBody(schemas.addShema), controll.postContact);


router.delete('/:id', controll.delContact);

router.put('/:id', validateBody(schemas.updateShema), controll.updateContact);
router.patch('/:id/favorite', validateBody(schemas.updFavoriteSchema), controll.updateStatusContact);


module.exports = router;
