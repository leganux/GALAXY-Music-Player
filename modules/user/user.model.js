let {Sequelize, DataTypes, sequelize} = require('../../config/connection')

const {UUIDV4} = require('sequelize');
const moment = require('moment');


const User = sequelize.define('User', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: '_id',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'password',
        customName: 'Password',
        isPassword: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
        field: 'username',
        customName: 'Username',


    },
    type_user: {
        type: DataTypes.ENUM('admin', 'client'),
        allowNull: false,
        defaultValue: 'client',
        field: 'type_user',
        customName: 'Type of user',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'name',
        customName: 'Name',
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'lastname',
        customName: 'Last name',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'email',
        customName: 'Email',
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false,
        field: 'picture',
        customName: 'Photo',
        isFile: true
    },
    cellphone: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'cellphone',
        customName: 'Cellphone',
    },
    birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'birthdate',
        get() {
            const rawValue = this.getDataValue('birthdate');
            return moment(rawValue).format('YYYY-MM-DD');
        }, customName: 'Date of birth',
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'active',
        customName: 'Active',
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'isBanned',
        customName: 'Is banned',
    },
}, {
    tableName: 'users',
    timestamps: true,
});


User.sync({alter: true});


module.exports = User;
