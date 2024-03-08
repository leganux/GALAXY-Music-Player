let ms = require('../../helpers/apiato.helper.js')
const userModel = require('./user.model')


const {Crypt} = require('unpc')
const {SCryptHashingAdapter} = require('unpc/scrypt')
const crypt = new Crypt({
    default: 'scrypt',
    adapters: [SCryptHashingAdapter],
    options: {encoding: "hex"}
})


let validationObject = {}

let populationObject = false

let options = {}

let aggregate_pipeline_dt = []

let aggregate_pipeline = []

let fiIn_ = async function (req) {
    let {body} = req
    if (Array.isArray(body)) {
        for (let item of body) {
            if (item.password && item.password != '') {
                item.password = await crypt.hash(item.password)
            }
        }
    } else {
        if (body.password && body.password != '') {
            body.password = await crypt.hash(body.password)
        }
    }
    req.body = body
    return req
}

module.exports = {
    createOne: ms.createOne(userModel, validationObject, populationObject, options, fiIn_),
    createMany: ms.createMany(userModel, validationObject, populationObject, options, fiIn_),

    getOneWhere: ms.getOneWhere(userModel, validationObject, populationObject, options),
    getOneById: ms.getOneById(userModel, validationObject, populationObject, options),
    getMany: ms.getMany(userModel, validationObject, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(userModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(userModel, validationObject, populationObject, options, fiIn_),
    updateById: ms.updateById(userModel, validationObject, populationObject, options, fiIn_),

    findByIdAndDelete: ms.findIdAndDelete(userModel, options),

    datatable_aggregate: ms.datatable_aggregate(userModel, aggregate_pipeline_dt, ''),
    aggregate: ms.updateById(userModel, aggregate_pipeline, options),
}
