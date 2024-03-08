const configModel = require('../modules/configuration/configuration.model');

module.exports = {
    setByKey: async function (key, val) {
        try {
            let config = await configModel.findOne({description: key});
            if (!config) {
                config = new configModel({description: key});
            }
            config.value = val;
            config = await config.save();

            return config;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    getByKey: async function (key) {
        try {
            let config = await configModel.findOne({description: key});
            if (config) {
                return config.value || false;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
};
