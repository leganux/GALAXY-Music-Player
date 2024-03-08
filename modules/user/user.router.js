const express = require('express')
const router = express.Router()

let userController = require('./user.controller')

router.post('/', userController.createOne)
router.post('/many', userController.createMany)


router.get('/one', userController.getOneWhere)
router.get('/many', userController.getMany)
router.get('/:id', userController.getOneById)

router.put('/find_update_or_create', userController.findUpdateOrCreate)
router.put('/find_where_and_update', userController.findUpdate)
router.put('/:id', userController.updateById)

router.delete('/:id', userController.findByIdAndDelete)

router.post('/datatable', userController.datatable_aggregate)
router.post('/aggregate', userController.aggregate)

module.exports = router
