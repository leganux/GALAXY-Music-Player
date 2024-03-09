const path = require('path')
const fs = require('fs').promises
const fs_ = require('fs')
const moment = require('moment')
const os = require('os')
const ffmpeg = require('fluent-ffmpeg');
const nodeID3 = require('node-id3');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

const mime = require('mime-types');

const userFolder = os.homedir();

let ms = require('../../helpers/apiato.helper.js')
let { allowed_files } = require('../../config/general.config.js')

let validationObject = {}

let populationObject = false


let options = {}

let aggregate_pipeline_dt = []

let aggregate_pipeline = []

const filesModel = require('./filefolder.model.js');
const { existsSync } = require('fs');
const objectValidatorHelper = require("apiato/sql/validator");

let total = 0
let current = 0

async function scanFilesRecursive(folderPath, fileExtensions, depth = 0) {
    try {
        if (depth > 4) {
            return [];
        }

        const files = await fs.readdir(folderPath);
        const foundFiles = [];

        if (!fs_.existsSync(folderPath)) {
            return [];
        }
        if (folderPath.includes('node_modules') || folderPath.includes('/.')) {
            return [];
        }
        current = 0
        total = files.length
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = await fs.stat(filePath);
            current++
            let SaveFile = {
                title: '',
                path: '',
                gender: '',
                album: '',
                date: '',
                artist: '',
                description: '',
                tags: '',
                extension: '',
                full_meta: '',
                picture: '',
                track: '',
            }

            if (stats.isDirectory()) {
                const subFolderFiles = await scanFilesRecursive(filePath, fileExtensions, depth + 1);
                foundFiles.push(...subFolderFiles);
            } else {
                if (!fs_.existsSync(filePath)) {
                    continue;
                }
                const extension = path.extname(filePath).toLowerCase();
                if (fileExtensions?.includes(extension)) {
                    const metadata = await extractMetadata(filePath);
                    let fileName = path.basename(filePath);

                    let existss = await filesModel.findOne({
                        where: {
                            path: filePath
                        }
                    })

                    if (metadata) {
                        foundFiles.push({ filePath, metadata });
                        SaveFile = {
                            title: metadata.title || metadata.name || fileName,
                            path: filePath,
                            gender: metadata.genre || metadata.gender || 'Unclasified',
                            album: metadata.album || metadata.title || '',
                            date: metadata.originalYear || metadata.year || metadata.date || metadata.creation_time || 'Unclasified',
                            artist: metadata.artist || metadata.album_artist || 'Unclasified',
                            description: metadata.description || metadata.label || 'Unclasified',
                            tags: metadata.tags || 'Unclasified',
                            extension: extension,
                            //full_meta: JSON.stringify(metadata),
                            //picture: metadata.image ? JSON.stringify(metadata.image) : null,
                            track: metadata.trackNumber || metadata.track || 'Unclasified',
                            composer: metadata.composer || 'Unclasified',
                            publisher: metadata.publisher || 'Unclasified',
                        }

                    } else {

                        SaveFile = {
                            title: fileName,
                            path: filePath,
                            gender: 'Unclasified',
                            album: 'Unclasified',
                            date: 'Unclasified',
                            artist: 'Unclasified',

                            description: 'Unclasified',
                            tags: 'Unclasified',
                            extension: extension,


                            track: 'Unclasified',
                        }
                    }

                    if (!existss) {
                        await filesModel.create(SaveFile)
                    } else {
                        await filesModelupdate(
                            SaveFile,

                            {
                                where: {
                                    path: filePath
                                }
                            }
                        )
                    }
                }
            }
        }

        return foundFiles;
    } catch (error) {
        console.error('Error scanning folder:', error);
        return [];
    }
}


async function extractMetadata(filePath) {
    try {
        const extension = path.extname(filePath).toLowerCase();
        let metadata = {};

        if (extension === '.mp3' || extension === '.flac') {
            metadata = nodeID3.read(filePath);
        } else if (extension === '.mp4' || extension === '.webm' || extension === '.wma' || extension === '.wmv' || extension === '.wav') {
            metadata = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(filePath, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.format.tags);
                    }
                });
            });
        } else {
            // For unsupported file types, return empty metadata
            metadata = {};
        }

        console.log(' - Path:', filePath, current, total);
        return metadata;
    } catch (e) {
        console.log('Error en metadata', filePath);
        return false
    }
}


module.exports = {

    createOne: ms.createOne(filesModel, validationObject, populationObject, options),
    createMany: ms.createMany(filesModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(filesModel, validationObject, populationObject, options),
    getOneById: ms.getOneById(filesModel, validationObject, populationObject, options),
    getMany: ms.getMany(filesModel, validationObject, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(filesModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(filesModel, validationObject, populationObject, options),
    updateById: ms.updateById(filesModel, validationObject, populationObject, options),

    findByIdAndDelete: ms.findIdAndDelete(filesModel, options),

    datatable_aggregate: ms.datatable_aggregate(filesModel, aggregate_pipeline_dt, ''),
    aggregate: ms.updateById(filesModel, aggregate_pipeline, options),

    getFilesAndFilters: async function (req, res) {
        try {

            let response = {
                error: '',
                success: false,
                message: '',
                code: 0,
                data: {}
            };

            try {


                let {
                    find,
                    attributes,
                    limit,
                    offset,
                    liked,
                    banned,
                    sort,
                    gender,
                    artist,
                    album,
                    folder,
                    column,
                    music, videos
                } = req.query;

                if (column) {
                    let conditions_ = {
                        attributes: [[sequelize.literal('DISTINCT `' + column.data + '`'), 'distinct_column']], // Get distinct values from 'column_name'
                    };
                    let response_ = await filesModel.findAll(conditions_)
                    response.error = {}
                    response.success = true
                    response.message = 'ok'
                    response.code = 200
                    response.data = response_
                    res.status(200).json(response)
                    return
                }


                let conditions = {
                    where: {}
                };


                if (find) {
                    conditions.where = {
                        [Op.or]: [
                            { artist: { [Op.like]: '%' + find + '%' } },
                            { title: { [Op.like]: '%' + find + '%' } },
                            { composer: { [Op.like]: '%' + find + '%' } },
                            { gender: { [Op.like]: '%' + find + '%' } },
                            { album: { [Op.like]: '%' + find + '%' } },
                        ]
                    }
                }
                if (attributes) {
                    conditions.attributes = attributes.split(',')
                }
                if (limit) {
                    conditions.limit = limit
                }
                if (offset) {
                    conditions.offset = offset
                }
                if (liked) {
                    conditions.where.liked = true
                }
                if (banned) {
                    conditions.where.banned = true

                } else {
                    conditions.where.banned = false
                }
                if (sort) {
                    let order = []
                    for (let [key, val] of Object.entries(sort)) {
                        order.push([key, val])
                    }
                    conditions.order = order
                }
                if (gender) {
                    conditions.where.gender = gender
                }
                if (artist) {
                    conditions.where.artist = artist
                }
                if (album) {
                    conditions.where.album = album
                }
                if (folder) {
                    folder = decodeURIComponent(folder)
                    conditions.where.path = { [Op.like]: '%' + folder + '%' }
                }

                if (music) {
                    conditions.where.extension = {
                        [Op.in]: ['.mp3', '.flac', '.ogg', '.aac', '.m4a', '.wma', '.wav']
                    }
                }
                if (videos) {
                    conditions.where.extension = {
                        [Op.in]: ['.mp4', '.mkv', '.webm']
                    }
                }


                let newElement = await filesModel.findAll(conditions)

                response.error = {}
                response.success = true
                response.message = 'ok'
                response.code = 200
                response.data = newElement
                res.status(200).json(response)

            } catch (e) {
                response.error = e
                response.success = false
                response.message = e
                response.code = options && options.customErrorCode ? options.customErrorCode : 500
                response.data = {}
                res.status(options && options.customErrorCode ? options.customErrorCode : 500).json(response)
                throw e
            }

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: e
            })
        }
    },

    getFilesFromFolder: async function (req, res) {
        try {


        } catch (error) {
            console.error(e);
            res.status(200).json({
                success: false,
                error: e
            })
        }
    },
    getFileToPlay: async function (req, res) {
        try {
            let { uri } = req.query
            console.log('uri', uri);
            uri = decodeURIComponent(uri)
            console.log('uri', uri);
            const filePath = path.resolve(uri);

            // Check if the file exists
            fs_.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error('File not found:', err);
                    return res.status(404).send('File not found');
                }


                console.log('listo');

                // Create read stream from the file and pipe it to the response
                res.status(200).sendFile(filePath)
            });

        } catch (error) {
            console.error(e);
            res.status(200).json({
                success: false,
                error: e
            })
        }
    },
    scanSystem: async function (req, res) {
        try {

            let arrFiles = []
            let possibleFolders = ['Desktop', 'Music', 'Documents', 'Movies', 'Videos']

            for (let item of possibleFolders) {
                console.log('scan this folder', path.join(userFolder, item));

                arrFiles.push(...await scanFilesRecursive(path.join(userFolder, item), allowed_files))

            }


            res.status(200).json({
                success: true,
                error: null,
                data: arrFiles
            })


        } catch (error) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: e
            })
        }

    },

}
