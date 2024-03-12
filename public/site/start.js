let hot
let isPlay = false
let isPause = false
let isStop = true
let songActual = 0
let handSomeData = []
let shuffle = false
let repeat = false
let liked = false
let banned = false
let next = 1

let page = 1
let limit = 1000
let offset = (page * limit) - limit
let pageNumbers = 0
let query = ''

let calcule_page = function () {
    offset = (page * limit) - limit
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function convertirSegundos(segundos) {
    const dias = Math.floor(segundos / (3600 * 24));
    const horas = Math.floor((segundos % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return { dias, horas, minutos, segundos: segundosRestantes };
}

let formatDataData = function (data) {
    let newData = []

    let index = 0
    for (let item of data) {

        newData.push([
            item._id,
            item.path,
            '<span class="all_play" id="ActualPlayed_' + index + '" ><button id="' + index + '" class="song_details" style="border:none; background-color:transparent; " data-toggle="tooltip" data-placement="top" title="Song Details"  ><i class="fa-solid fa-music"></i> </button> ' +
            '<button id="' + index + '" class="song_download" style="border:none; background-color:transparent; " data-toggle="tooltip" data-placement="top" title="Song Download"  ><i class="fa-solid fa-download"></i> </button> ' +
            '<button id="' + index + '" class="song_play" style="border:none; background-color:transparent; " data-toggle="tooltip" data-placement="top" title="Play Song"  ><i class="fa-solid fa-play"></i> </button>' +
            '</span',
            item.title,
            item.gender,
            item.artist,
            item.album,
            item.description,
            item.tags,
            item.composer,
            item.track,
            item.publisher,
            item.liked,
            item.banned,
        ])
        index++



    }
    return newData
}

let getFilesStart = async function () {
    try {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        HoldOn.open()

        page = 1
        calcule_page()
        let response = await fetch("/api/files/getFilesAndFilters?offset=" + offset + '&limit=' + limit, requestOptions)
        let data = await response.json()
        HoldOn.close()
        $('#table_space').show()
        $('#player').hide()

        query = "?limit=LIMIT&offset=OFFSET"

        pageNumbers = data.total / limit

        $('#sp_buttons').html('')
        for (let i = 0; i < pageNumbers; i++) {
            $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
        }

        if (data.data.length == 0) {
            $('#btn_scan_music').click()
            return
        }

        let length = data.total
        let time = length * 220
        let times = convertirSegundos(time)
        $('#label_songs_count').text(length + ' tracks ~ ' + times.dias + ' days ' + times.horas + ' hours ' + times.minutos + ' minutes')

        handSomeData = formatDataData(data.data)


        var container = document.getElementById('hot');
        hot = new Handsontable(container, {
            licenseKey: 'non-commercial-and-evaluation',
            data: handSomeData,
            colHeaders: customColHeaders,
            hiddenColumns: {
                columns: [0, 1], // Índice de la columna que se oculta
                indicators: false // Mostrar el indicador de columna oculta
            },
            columns: [
                {},
                {},
                { readOnly: true },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                { type: 'checkbox' },
                { type: 'checkbox' }
            ],
            width: '100%',

            renderer: function (instance, td, row, col, prop, value, cellProperties) {
                Handsontable.renderers.HtmlRenderer.apply(this, arguments);
            },
            afterOnCellMouseDown: function (event, coords, TD) {
                if (event.detail === 2) { // Verificar si es un doble clic
                    var row = coords.row; // Obtener el índice de la fila
                    songActual = row
                    stop()
                    play()
                }
            },
            contextMenu: contextMenu,
            afterChange: async function (changes, source) {
                console.log(source);
                if (!changes) {
                    return
                }


                // Se ejecuta cuando se realiza un cambio en una celda
                console.log('Cambio realizado:', changes);

                changes.forEach(async ([row, prop, oldValue, newValue]) => {
                    if (hot) {
                        console.log('Fila cambiada:', hot.getSourceDataAtRow(row));
                        let data = hot.getSourceDataAtRow(row)
                        let changes = {
                            title: data[3],
                            gender: data[4],
                            artist: data[5],
                            album: data[6],
                            description: data[7],
                            tags: data[8],
                            composer: data[9],
                            track: data[10],
                            publisher: data[11],
                            liked: data[12],
                            banned: data[13],
                        }
                        let id = data[0]
                        const options = {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(changes)
                        };

                        await fetch('/api/files/' + id, options)


                    }

                });

            },
            afterCreateRow: function (index, amount) {
                // Se ejecuta después de que se crea una nueva fila
                console.log('Fila creada:', index, amount);
            },
            afterRemoveRow: function (index, amount) {
                // Se ejecuta después de que se elimina una fila
                console.log('Fila eliminada:', index, amount);
            }
        });


    } catch (e) {
        console.error(e);
    }


}

var customColHeaders = [
    "_id",
    "path",
    "Actions",
    'Title',
    'Genre',
    'Artist',
    'Album',
    'Description',
    'Tags',
    "Composer",
    "Track",
    "Publisher",
    "Liked",
    "Banned",
];


var contextMenu = {
    items: {
        "play": {
            name: 'Play Song',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "play_next": {
            name: 'Play as next song',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "play_row": {
            name: 'Add to current row',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "hsep0": "---------", // Separador horizontal
        "info": {
            name: 'Song Info',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "edit_info": {
            name: 'Edit and retag song info',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "hsep1": "---------", // Separador horizontal
        "playlist_add": {
            name: 'Add to playlist',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "playlist_remove": {
            name: 'Remove from playlist',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },

        "hsep2": "---------", // Separador horizontal

        "favorite": {
            name: 'Add to favourites',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "no_favorite": {
            name: 'Remove from favourites',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "hsep2s": "---------",
        "banned": {
            name: 'Ban song',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },
        "unbanned": {
            name: 'Unban song',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },

        "hsep3": "---------", // Separador horizontal
        "remove": {
            name: 'Remove from library',
            callback: function (key, selection, clickEvent) {
                alert('Has seleccionado la opción personalizada');
            }
        },

    }
};

let audio = document.getElementById('song_player')

function audioFormat(input) {
    let minutes = Math.floor(input / 60)
    let secs = Math.floor(input - (Number(minutes) * 60))
    minutes = minutes.toString()
    if (minutes.length == 1) {
        minutes = '0' + minutes
    }

    secs = secs.toString()
    if (secs.length == 1) {
        secs = '0' + secs
    }
    return (!isNaN(minutes) ? minutes : '00') + ':' + (!isNaN(secs) ? secs : '00')
}

function stop() {

    $('#btn_play').find('i').removeClass('fa-pause ')
    $('#btn_play').find('i').addClass('fa-play')
    audio.currentTime = 0
    $('#range_song').val(0);
    isStop = true
    isPause = false
    isPlay = false
}

function pause() {
    audio.pause()
    $('#btn_play').find('i').removeClass('fa-pause ')
    $('#btn_play').find('i').addClass('fa-play')
    isStop = false
    isPause = true
    isPlay = false
}

function play() {

    if (isPause) {
        $('#btn_play').find('i').removeClass('fa-play')
        $('#btn_play').find('i').addClass('fa-pause')
    } else if (isStop) {
        if (repeat) {
            next = songActual
        } else {
            if (!shuffle) {
                next = Number(songActual) + 1
            } else {
                let total = handSomeData.length - 1
                next = randomIntFromInterval(1, total)
            }
        }
        let data = hot.getSourceDataAtRow(songActual)
        console.log(next);

        if (!data) {
            isPlay = true
            isPause = false
            isStop = false
            $('#btn_play').find('i').removeClass('fa-pause')
            $('#btn_play').find('i').addClass('fa-play')
            return
        }
        $('#label_sing_playing').text(data[3] + ' - ' + data[4] + ' - ' + data[5])
        $('#label_song_path').text(data[1])
        $('#song_player').html('<source src="' + '/api/files/getFileToPlay?uri=' + encodeURIComponent(data[1]) + '" type="audio/ogg" id="audioSource_">')
        audio.load();
        audio.currentTime = 0;
        $('#btn_play').find('i').removeClass('fa-play')
        $('#btn_play').find('i').addClass('fa-pause')
        if (data[1]?.toLowerCase()?.endsWith('.mp4')) {
            $('#table_space').hide()
            $('#player').show()
        } else {
            $('#table_space').show()
            $('#player').hide()
        }

        let dataNext = hot.getSourceDataAtRow(next)
        if (!dataNext) {
            return
        }
        console.log(dataNext, 'dataNext');
        $('#text_nex_song').text(dataNext[3].length < 20 ? dataNext[3] : dataNext[3].substring(0, 20) + '...')

    }
    audio.play()
    higligthRow(songActual)
    isPlay = true
    isPause = false
    isStop = false

}

function higligthRow(row) {
    $('.all_play').removeClass('bg-success');
    $('.all_play').removeClass('text-white');

    // Añadir la clase de resaltado a la fila específica
    $('#ActualPlayed_' + row).addClass('bg-success');
    $('#ActualPlayed_' + row).addClass('text-white');
}

$(document).ready(async function () {


    audio.addEventListener('timeupdate', function () {
        var newPosition = audio.currentTime / audio.duration * 100;
        $('#range_song').val(newPosition);
        $('#label_current_time').text(audioFormat(audio.currentTime));
        $('#label_max_time').text(audioFormat(audio.duration));
    });


    audio.addEventListener('ended', function () {
        stop()
        songActual = next
        play()

    });


    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
    }, 1000)

    await getFilesStart()

    $('#btn_previous').click(function () {
        stop()
        songActual = next - 2
        play()
    })
    $('#btn_play').click(function () {

        if (!isPlay) {

            play()
        } else {
            pause()
        }

    })
    $('#btn_next').click(function () {
        stop()
        songActual = next
        play()
    })
    $('#btn_mute').click(function () {
        $('#range_volume').val(0);
        audio.volume = 0
    })
    $('#btn_max_volume').click(function () {
        $('#range_volume').val(100);
        audio.volume = 1
    })
    $('#range_volume').change(function () {

        let volume = $('#range_volume').val();
        console.log(volume / 100);
        audio.volume = volume / 100

    })
    $('#range_song').click(function () {
        var newPosition = $(this).val() / 100 * audio.duration;
        audio.currentTime = newPosition;

    })
    $('#btn_scan_music').click(async function () {
        try {
            const requestOptions = {
                method: "POST",
                redirect: "follow"
            };
            HoldOn.open()
            await fetch("/api/files/scanSystem", requestOptions)
            HoldOn.close()
            location.reload()
        } catch (e) {
            HoldOn.close()
            location.reload()
        }

    })
    $(document.body).on('click', '.song_play', function () {
        stop()
        songActual = $(this).attr('id')
        play()
    })
    $(document.body).on('click', '.song_download', function () {
        songActual = $(this).attr('id')
        let data = hot.getSourceDataAtRow(songActual)
        window.open('/api/files/getFileToPlay?uri=' + encodeURIComponent(data[1]))
    })

    $('#btn_repeat').click(function () {
        if (repeat) {
            $('#btn_repeat').removeClass('btn-info')
            $('#btn_repeat').addClass('btn-dark')
            next = songActual
        } else {
            $('#btn_repeat').removeClass('btn-dark')
            $('#btn_repeat').addClass('btn-info')
            next = Number(songActual) + 1
        }
        repeat = !repeat
    })
    $('#btn_shuffle').click(function () {
        if (shuffle) {
            $('#btn_shuffle').removeClass('btn-info')
            $('#btn_shuffle').addClass('btn-dark')
            let total = handSomeData.length - 1
            next = randomIntFromInterval(1, total)

        } else {
            $('#btn_shuffle').removeClass('btn-dark')
            $('#btn_shuffle').addClass('btn-info')
            next = Number(songActual) + 1

        }
        shuffle = !shuffle
    })
    $('#btn_search').click(async function () {
        HoldOn.open()
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        page = 1
        calcule_page()
        let response = await fetch("/api/files/getFilesAndFilters?find=" + $('#input_search').val() + '&limit=' + limit + '&offset=' + offset, requestOptions)
        let data = await response.json()
        query = "?find=" + $('#input_search').val() + "&limit=LIMIT&offset=OFFSET"
        $('#table_space').show()
        $('#player').hide()
        $('#sp_buttons').html('')

        pageNumbers = data.total / limit
        for (let i = 0; i < pageNumbers; i++) {
            $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
        }

        handSomeData = formatDataData(data.data)
        hot.updateSettings({
            data: handSomeData
        });
        HoldOn.close()
        $('#btn_ban').removeClass('text-info')
        $('#btn_favourite').removeClass('text-info')
    })
    $('#input_search').change(async function () {
        HoldOn.open()
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        page = 1
        calcule_page()
        let response = await fetch("/api/files/getFilesAndFilters?find=" + $('#input_search').val() + '&limit=' + limit + '&offset=' + offset, requestOptions)
        let data = await response.json()
        query = "?find=" + $('#input_search').val() + "&limit=LIMIT&offset=OFFSET"
        $('#sp_buttons').html('')
        $('#table_space').show()
        $('#player').hide()
        pageNumbers = data.total / limit
        for (let i = 0; i < pageNumbers; i++) {
            $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
        }

        handSomeData = formatDataData(data.data)
        hot.updateSettings({
            data: handSomeData
        });
        HoldOn.close()
        $('#btn_ban').removeClass('text-info')
        $('#btn_favourite').removeClass('text-info')
    })
    $('#btn_add_library').click(function () {
    })
    $('#btn_add_firend').click(function () {
    })
    $('#btn_share_library').click(function () {
    })
    $('#btn_add_playlist').click(function () {
    })
    $('#btn_add_folder').click(function () {
    })
    $('#btn_back').click(function () {
    })
    $('#btn_next_songs').click(function () {
    })
    $('#btn_view_list').click(function () {
    })
    $('#btn_view_icons').click(function () {
    })
    $('#btn_configure').click(function () {
    })

    $('#btn_ban').removeClass('text-info')
    $('#btn_favourite').removeClass('text-info')

    $('#btn_favourite').click(async function () {
        HoldOn.open()
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        page = 1
        calcule_page()
        if (liked) {
            uri = "/api/files/getFilesAndFilters?limit=" + limit + '&offset=' + offset
            $('#btn_favourite').removeClass('text-info')
            query = "?limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()
        } else {
            $('#btn_favourite').addClass('text-info')
            $('#btn_ban').removeClass('text-info')
            uri = "/api/files/getFilesAndFilters?liked=true&limit=" + limit + '&offset=' + offset
            query = "?liked=true&limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()
        }
        let response = await fetch(uri, requestOptions)
        let data = await response.json()

        pageNumbers = data.total / limit

        $('#sp_buttons').html('')
        for (let i = 0; i < pageNumbers; i++) {
            $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
        }

        handSomeData = formatDataData(data.data)
        hot.updateSettings({
            data: handSomeData
        });
        HoldOn.close()
        liked = !liked
    })
    $('#btn_ban').click(async function () {
        HoldOn.open()
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        let uri
        page = 1
        calcule_page()
        if (banned) {
            uri = "/api/files/getFilesAndFilters?limit=" + limit + '&offset=' + offset
            $('#btn_ban').removeClass('text-info')
            query = "?videos=true&limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()
        } else {
            $('#btn_ban').addClass('text-info')
            $('#btn_favourite').removeClass('text-info')
            uri = "/api/files/getFilesAndFilters?banned=true&limit=" + limit + '&offset=' + offset
            query = "?banned=true&limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()
        }

        let response = await fetch(uri, requestOptions)
        let data = await response.json()

        pageNumbers = data.total / limit

        $('#sp_buttons').html('')
        for (let i = 0; i < pageNumbers; i++) {
            $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
        }

        handSomeData = formatDataData(data.data)
        hot.updateSettings({
            data: handSomeData
        });
        HoldOn.close()
        banned = !banned
    })


    $(document.body).on('click', '.item_library', async function () {
        let value = $(this).attr('element')
        HoldOn.open()
        if (value == 'music') {

            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            page = 1
            calcule_page()

            let response = await fetch("/api/files/getFilesAndFilters?music=true&limit=" + limit + '&offset=' + offset, requestOptions)
            let data = await response.json()
            query = "?music=true&limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()

            pageNumbers = data.total / limit

            $('#sp_buttons').html('')
            for (let i = 0; i < pageNumbers; i++) {
                $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
            }

            handSomeData = formatDataData(data.data)
            hot.updateSettings({
                data: handSomeData
            });

        }

        if (value == 'videos') {

            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            page = 1
            calcule_page()

            let response = await fetch("/api/files/getFilesAndFilters?videos=true&limit=" + limit + '&offset=' + offset, requestOptions)
            let data = await response.json()
            query = "?videos=true&limit=LIMIT&offset=OFFSET"
            $('#table_space').show()
            $('#player').hide()

            pageNumbers = data.total / limit

            $('#sp_buttons').html('')
            for (let i = 0; i < pageNumbers; i++) {
                $('#sp_buttons').append('<button class="btn btn-sm btn-dark ActionPageNumber " value=' + (i + 1) + '>' + (i + 1) + '</button>')
            }


            console.log('* * * * ** * *', data)
            handSomeData = formatDataData(data.data)
            hot.updateSettings({
                data: handSomeData
            });

        }
        HoldOn.close()
    })


    $(document.body).on('click', '.item_friends', function () {
        let value = $(this).attr('element')
        let online = $(this).attr('online')
    })
    $(document.body).on('click', '.item_playlist', function () {
        let value = $(this).attr('element')
    })
    $(document.body).on('click', '.item_folder', function () {
        let value = $(this).attr('element')
    })


    $(document.body).on('click', '.ActionPageNumber', async function () {
        HoldOn.open()
        page = $(this).val()
        calcule_page()

        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        let nQuery = query.replaceAll('LIMIT', limit)
        nQuery = nQuery.replaceAll('OFFSET', offset)
        let response = await fetch("/api/files/getFilesAndFilters" + nQuery, requestOptions)
        $('#table_space').show()
        $('#player').hide()
        let data = await response.json()
        handSomeData = formatDataData(data.data)
        hot.updateSettings({
            data: handSomeData
        });
        HoldOn.close()
    })


})

