let baseUrl = '/cdn/dashboard/'
let baseUrl_site = '/cdn'

module.exports = function () {
    this.assets = {

        site: {
            logo: '/cdn/images/nucleusfull.png',
            scripts: [
                baseUrl_site + '/site/handsontable/dist/handsontable.full.js',

                baseUrl_site + '/site/jquery.js',
                baseUrl_site + '/site/popper.js',
                baseUrl_site + '/site/js/bootstrap.js',
                baseUrl_site + '/site/swal.js',
                baseUrl_site + '/site/holdon/holdon.js',
                baseUrl_site + '/site/start.js',


            ],
            styles: [
                baseUrl_site + '/site/handsontable/dist/handsontable.full.css',
                baseUrl_site + '/site/css/bootstrap.css',
                baseUrl_site + '/site/bootstrap.css',
                baseUrl_site + '/site/holdon/holdon.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',


            ],
        }
    }
    this.getAssetsAdmin = function () {
        return this.assets.dashboard
    }
    this.getAssetsSite = function () {
        return this.assets.site
    }
}

