const express = require('express')
const router = express.Router()
let assets = require('./../config/assets.config')


router.get('/', async function (req, res) {
    let myAssets = new assets()
    myAssets = myAssets.getAssetsSite()

    res.status(200).render('site/start', {
        ...myAssets,
        title: 'Welcome',

    })
})
/** Here routes*/

module.exports = router
