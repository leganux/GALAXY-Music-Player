const express = require('express')
const router = express.Router()

//router.use('/user', require('./user/user.router'))
router.use('/files', require('./filefolder/filefolder.router'))

/** Here routes*/

module.exports = router
