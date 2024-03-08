let {fakeRequestFunction, fakeResponseFunction} = require('ex-js-faker-request')

let api = async function (controllerFunction, req) {
    if (!controllerFunction) {
        throw 'Please add a function to execute'
    }

    if (typeof controllerFunction != 'function') {
        throw 'Controller function its not a function'
    }

    try {
        let fakeRes = new fakeResponseFunction()
        let fakeReq = new fakeRequestFunction(req)

        await controllerFunction(fakeReq, fakeRes)

        console.log('fakeRes', fakeRes)

        if ((fakeRes.status_ >= 200 && fakeRes.status_ < 300)) {
            return fakeRes?.json_
        } else {
            console.error('Error en fake request')
            throw fakeRes?.json_
        }

    } catch (e) {
        console.error('Error en fake, request')
        throw e
    }
}

class CodeRag {
    constructor() {
        this.token = 'Bearer NONE';
        this.resource = false;
        this.controller = false;
    }

    setResource(resource = false) {
        if (resource) {
            this.resource = resource;
            try {
                this.controller = require(`./../modules/${resource}/${resource}.controller.js`);
            } catch (e) {
                throw e;
            }
        }
        return this;
    }

    async createOne(body = {}, query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('createOne');
        const req = {body, query, headers};
        try {
            return await api(this.controller.createOne, req);
        } catch (e) {
            throw e;
        }
    }

    async createMany(body = [], query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('createMany');
        const req = {body, query, headers};
        try {
            return await api(this.controller.createMany, req);
        } catch (e) {
            throw e;
        }
    }

    async getMany(query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('getMany');
        const req = {query, headers};
        try {
            return await api(this.controller.getMany, req);
        } catch (e) {
            throw e;
        }
    }

    async getOneWhere(query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('getOneWhere');
        const req = {query, headers};
        try {
            return await api(this.controller.getOneWhere, req);
        } catch (e) {
            throw e;
        }
    }

    async getOneById(id = '', query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('getOneById');
        const req = {query, params: {id}, headers};
        try {
            return await api(this.controller.getOneById, req);
        } catch (e) {
            throw e;
        }
    }

    async findUpdateOrCreate(body = {}, query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('findUpdateOrCreate');
        const req = {query, body, headers};
        try {
            return await api(this.controller.findUpdateOrCreate, req);
        } catch (e) {
            throw e;
        }
    }

    async findUpdate(body = {}, query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('findUpdate');
        const req = {query, body, headers};
        try {
            return await api(this.controller.findUpdate, req);
        } catch (e) {
            throw e;
        }
    }

    async updateById(id = '', body = {}, query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('updateById');
        const req = {query, body, params: {id}, headers};
        try {
            return await api(this.controller.updateById, req);
        } catch (e) {
            throw e;
        }
    }

    async findIdAndDelete(id = '', body = {}, query = {}, headers = {}) {
        this.validateResource();
        this.validateControllerMethod('findIdAndDelete');
        const req = {query, body, params: {id}, headers};
        try {
            return await api(this.controller.findIdAndDelete, req);
        } catch (e) {
            throw e;
        }
    }

    validateResource() {
        if (!this.resource || !this.controller) {
            throw new Error('Resource not selected');
        }
    }

    validateControllerMethod(method) {
        if (!this.controller[method] || typeof this.controller[method] !== 'function') {
            throw new Error(`Resource has no access to ${method} function`);
        }
    }
}


module.exports = {
    api,
    CodeRag
}
