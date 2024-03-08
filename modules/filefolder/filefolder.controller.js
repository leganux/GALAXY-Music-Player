const path = require('path')
const fs = require('fs').promises
const fs_ = require('fs')
const moment = require('moment')
const os = require('os')
const ffmpeg = require('fluent-ffmpeg');
const nodeID3 = require('node-id3');

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

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = await fs.stat(filePath);

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
                            description: metadata.description || metadata.comment || metadata.label || 'Unclasified',
                            tags: metadata.tags || 'Unclasified',
                            extension: extension,
                            full_meta: JSON.stringify(metadata),
                            picture: metadata.image ? JSON.stringify(metadata.image) : null,
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
                            full_meta: '',
                            picture: 'Unclasified',
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

        console.log('FILE metadata:', metadata, ' - Path:', filePath);
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

                arrFiles.push(... await scanFilesRecursive(path.join(userFolder, item), allowed_files))

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