let user_model = require('../modules/user/user.model')
let {Crypt} = require('unpc')
let {SCryptHashingAdapter} = require('unpc/scrypt')
const crypt = new Crypt({
    default: "scrypt",
    adapters: [SCryptHashingAdapter],
    options: {encoding: 'hex'}
})

//VERIFY IF THERE ARE ADMINS
let check_admin = async function () {
    let check = await user_model.findOne({
        where:
            {
                type_user: "admin"
            }
    })

    //IF DON'T FIND ANY USER ADMIN, SO CREATE ONE BY DEFAULT
    if (!check) {

        //ENCRYPT DEFAULT PASSWORD
        let password = await crypt.hash('1234567890_abc')

        //CREATE THE NEW ADMIN
        let new_admin = await user_model.create({
            name: 'admin',
            lastname: 'admin',
            email: 'admin@mail.com',
            username: 'admin',
            password: password,
            type_user: 'admin',
            cellphone: '1111111111'
        })

    }
}

module.exports = check_admin()
