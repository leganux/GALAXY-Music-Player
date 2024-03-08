let { Sequelize, DataTypes, sequelize } = require('../../config/connection')

const { UUIDV4 } = require('sequelize');
const moment = require('moment');


const Files = sequelize.define('Files', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
        field: '_id',
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'path',
        customName: 'path',
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'title',
        customName: 'title',
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'gender',
        customName: 'gender',
    },
    album: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'album',
        customName: 'album',
    }, date: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'date',
        customName: 'date',
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'album',
        customName: 'album',
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'description',
        customName: 'description',
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'tags',
        customName: 'tags',
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'extension',
        customName: 'extension',
    },
    composer: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'composer',
        customName: 'composer',
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'publisher',
        customName: 'publisher',
    },

    full_meta: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        field: 'full_meta',
        customName: 'full_meta',
    },


    picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false,
        field: 'picture',
        customName: 'Photo',
        isFile: true
    },

    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'active',
        customName: 'Active',
    },

    liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'liked',
        customName: 'liked',
    },
    track: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'track',
        customName: 'track',
    },
    banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'banned',
        customName: 'banned',
    },


}, {
    tableName: 'files',
    timestamps: true,
});


Files.sync({ alter: true });


module.exports = Files;
