'use strict'
/**
 * V1.0 Erick Cruz
 * Helper / catálogo de respuestas de peticiones de la API estandarizadas
 * con soporte para la internacionalizacion i18n
 */

let RC = {
    "code_200": {
        "code": 200,
        "message": "Ok",
        "success": true,
        "data": [],
        "i18n": 'ok'
    },
    "code_201": {
        "code": 201,
        "message": "Created",
        "success": true,
        "data": [],
        "i18n": 'created'
    },
    "code_202": {
        "code": 202,
        "message": "Accepted",
        "success": true,
        "data": [],
        "i18n": 'accepted'
    },
    "code_301": {
        "code": 301,
        "message": "Moved Permanently",
        "success": true,
        "data": [],
        "new_url": '/v2/api',
        "info_url": '/docs/',
        "i18n": 'moved_permanently'
    },
    "code_302": {
        "code": 302,
        "message": "Redirection",
        "success": true,
        "data": [],
        "new_url": '/v2/api',
        "i18n": 'redirection'
    },
    "code_303": {
        "code": 302,
        "message": "See other",
        "success": true,
        "data": [],
        "info_url": '/docs',
        "i18n": 'see_other'
    },
    "code_400": {
        "code": 400,
        "message": "Bad request",
        "success": false,
        "error": [],
        "i18n": 'bad_request'
    },
    "code_401": {
        "code": 401,
        "message": "Unauthorized",
        "success": false,
        "error": [],
        "i18n": 'unauthorized'
    },
    "code_403": {
        "code": 403,
        "message": "Forbidden",
        "success": false,
        "error": [],
        "i18n": 'forbbiden'
    },
    "code_404": {
        "code": 404,
        "message": "Not found",
        "success": false,
        "error": [],
        "i18n": 'not_found'
    },
    "code_405": {
        "code": 405,
        "message": "Method not allowed",
        "success": false,
        "error": [],
        "allowed": [],
        "i18n": 'method_not_allowed'
    },
    "code_415": {
        "code": 415,
        "message": "Unsupported media type",
        "success": false,
        "error": [],
        "i18n": 'unsupported_media_type'
    },
    "code_429": {
        "code": 429,
        "message": "Too many request",
        "success": false,
        "error": [],
        "i18n": 'too_many_request'
    },

    "code_435": {
        "code": 435,
        "message": "Insuficient data in body",
        "success": false,
        "error": [],
        "i18n": 'insuficient_data_in_body'
    },

    "code_500": {
        "code": 500,
        "message": "Internal server error",
        "success": false,
        "error": [],
        "i18n": 'internal_server_error'
    },
    "code_501": {
        "code": 501,
        "message": "Not implemented",
        "success": false,
        "error": [],
        "i18n": 'not_implemented'
    },
    "code_502": {
        "code": 502,
        "message": "Bad gateway",
        "success": false,
        "error": [],
        "i18n": 'bad_gateway'
    },
    "code_503": {
        "code": 503,
        "message": "Service unavailable",
        "success": false,
        "error": [],
        "i18n": 'service_unavailable'
    },
    "code_504": {
        "code": 504,
        "message": "Timeout",
        "success": false,
        "error": [],
        "i18n": 'timeout'
    },
    "code_507": {
        "code": 507,
        "message": "Insufficient storage",
        "success": false,
        "error": [],
        "i18n": 'insuficient_storage'
    },
}


/**
 * La presente funcion regresa el objeto preconfigurado de respuesta por codigo,
 * junto con sus diferentes mensajes traducidos en varios idiomas de acuerdo a i18n
 *
 *
 * */

let getByCode = function (code) {
    if (!code) {
        code = 500;
    }
    let response = {...RC['code_' + code]};
    return response
}

module.exports = {codes: RC, getByCode};
