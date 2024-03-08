const express = require('express')
const router = express.Router()
let fileFolderController = require('./filefolder.controller')


router.post('/getFilesFolder', fileFolderController.getFilesFromFolder)
router.post('/scanSystem', fileFolderController.scanSystem)
router.get('/getFileToPlay', fileFolderController.getFileToPlay)
router.get('/getFilesAndFilters', fileFolderController.getFilesAndFilters)


router.post('/', fileFolderController.createOne)
router.post('/many', fileFolderController.createMany)


router.get('/one', fileFolderController.getOneWhere)
router.get('/', fileFolderController.getMany)
router.get('/:id', fileFolderController.getOneById)

router.put('/find_update_or_create', fileFolderController.findUpdateOrCreate)
router.put('/find_where_and_update', fileFolderController.findUpdate)
router.put('/:id', fileFolderController.updateById)

router.delete('/:id', fileFolderController.findByIdAndDelete)

router.post('/datatable', fileFolderController.datatable_aggregate)
router.post('/aggregate', fileFolderController.aggregate)

module.exports = router


