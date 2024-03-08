let {Sequelize, DataTypes, sequelize} = require('../config/connection')

module.exports = {
    dt_constructor: async function ({model, actions}) {
        let schema = model.rawAttributes
        let name = model.name.toLowerCase()
        let columns = []

        console.log(name)
        console.table(schema)

        for (let [key, val] of Object.entries(schema)) {

            let myType = ''

            if (key != 'id' && key != '__v' && key != 'id') {
                let order = 0
                console.log('VALTYPE *** ', val.type.toString())
                if (typeof val == 'object') {

                    if (val.type.toString().toLowerCase().includes('string') || val.type.toString().toLowerCase().includes('varchar') || val.type.toString().toLowerCase().includes('text') || val.type.toString().toLowerCase().includes('longtext') || val.type.toString().toLowerCase().includes('citext') || val.type.toString().toLowerCase().includes('tsvector')) {
                        myType = 'string'
                        order = 1
                    } else if (val.type.toString().toLowerCase().includes('enum')) {
                        myType = 'string'
                        order = 1

                    } else if (val.type.toString().toLowerCase().includes('boolean') || val.type.toString().toLowerCase().includes('tinyint')) {
                        myType = 'boolean'
                        order = 4
                    } else if (val.type.toString().toLowerCase().includes('number') || val.type.toString().toLowerCase().includes('int') || val.type.toString().toLowerCase().includes('float') || val.type.toString().toLowerCase().includes('double') || val.type.toString().toLowerCase().includes('bgint') || val.type.toString().toLowerCase().includes('real') || val.type.toString().toLowerCase().includes('decimal')) {
                        myType = 'number'
                        order = 2
                    } else if (val.type.toString().toLowerCase().includes('date')) {
                        myType = 'date'
                        order = 3
                    } else if (val.type.toString().toLowerCase().includes('dateonly')) {
                        myType = 'date'
                        order = 3
                    } else if (val.type.toString().toLowerCase().includes('uuid')) {
                        myType = 'objectid'
                        order = 0
                    } else if (val.type.toString().toLowerCase().includes('object')) {
                        myType = 'mixed'
                        order = 5
                    } else {
                        myType = 'object'
                        order = 5
                    }

                    let required = !val.allowNull
                    if (key == 'createdAt' || key == 'updatedAt' || key == '_id') {
                        required = false
                    }


                    columns.push({
                        name: key,
                        type: myType,
                        default: val.defaultValue ? val.defaultValue : null,
                        required: required ? required : false,
                        order,
                        enum: val.values ? val.values : false,
                        customName: val.customName ? val.customName : false,
                        isPassword: val.isPassword ? val.isPassword : false,
                        isFile: val.isFile ? val.isFile : false,
                    })
                }


            }
        }

        columns = columns.sort((a, b) => {
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            // Si los números son iguales, entonces comparamos por cadena de texto
            return a.name.localeCompare(b.name);
        });

        let arrActions = []

        if (typeof actions == "string") {
            arrActions = actions.split(',')
        }
        if (Array.isArray(actions)) {
            arrActions = actions
        }
        arrActions = arrActions.map(item => item.toLowerCase())
        let ObjActions = {}
        for (let item of arrActions) {
            ObjActions[item] = true
        }
        columns.push({
            name: 'actions',
            type: '_ACTIONS_',
            default: arrActions,
            required: arrActions.length > 0,
            order: 6,
            enum: false
        })
        console.table(columns)
        return {columns, name, actions: ObjActions}
    }
}
