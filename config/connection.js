let dialect = process.env.DIALECT_DB || 'sqlite'

const {Sequelize, DataTypes} = require("sequelize");
let sequelize
if (dialect == 'sqlite') {
    sequelize = new Sequelize({
        dialect: dialect,
        storage: process.env.HOST_DB || './database.sqlite'
    });
} else {
    sequelize = new Sequelize(process.env.HOST_DB);
}


module.exports = {Sequelize, DataTypes, sequelize}



