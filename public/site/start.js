

let hot
let isPlay = false
let isPause = false
let isStop = true
let songActual = 0

let getFilesStart = async function () {
    try {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        HoldOn.open()
        let response = await fetch("/api/files/?where=[banned]=false", requestOptions)
        let data = await response.json()
        HoldOn.close()
        let newData = []

        if (data.data.length == 0) {
            $('#btn_scan_music').click()
            return
        }

        let index = 0
        for (let item of data.data) {

            newData.push([
                item._id,
                item.path,
                '<button id="' + index + '" class="song_details" style="border:none; background-color:transparent; " data-toggle="tooltip" data-placement="top" title="Song Details"  ><i class="fa-solid fa-music"></i> </button> <button id="' + index + '" class="song_play" style="border:none; background-color:transparent; " data-toggle="tooltip" data-placement="top" title="Play Song"  ><i class="fa-solid fa-play"></i> </button>',
                item.title,
                item.gender,
                item.artist,
                item.album,
                item.description,
                item.tags,
                item.coposer,
                item.track,
                item.publisher,
                item.liked,
                item.banned,
            ])
            index++


        }

        var container = document.getElementById('hot');
        hot = new Handsontable(container, {
            licenseKey: 'non-commercial-and-evaluation',
            data: newData,
            colHeaders: customColHeaders,
            hiddenColumns: {
                columns: [0, 1], // Índice de la columna que se oculta
                indicators: false // Mostrar el indicador de columna oculta
            },
            columns: [
                {},
                {},
                {},
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
            afterChange: function (changes, source) {
                console.log(source);
                if (!changes) {
                    return
                }


                // Se ejecuta cuando se realiza un cambio en una celda
                console.log('Cambio realizado:', changes);

                changes.forEach(([row, prop, oldValue, newValue]) => {
                    if (hot) {
                        console.log('Fila cambiada:', hot.getSourceDataAtRow(row));
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
        let data = hot.getSourceDataAtRow(songActual)
        console.log(data);
        if (!data) {
            isPlay = true
            isPause = false
            isStop = false
            $('#btn_play').find('i').removeClass('fa-pause')
            $('#btn_play').find('i').addClass('fa-play')
            return
        }
        $('#label_sing_playing').text(data[3])
        $('#song_player').html('<source src="' + '/api/files/getFileToPlay?uri=' + encodeURIComponent(data[1]) + '" type="audio/ogg" id="audioSource_">')
        audio.load();
        audio.currentTime = 0;
        $('#btn_play').find('i').removeClass('fa-play')
        $('#btn_play').find('i').addClass('fa-pause')
    }
    audio.play()
    higligthRow(songActual)
    isPlay = true
    isPause = false
    isStop = false

}

function higligthRow(row) {
    $(hot.table).find('tbody tr td').removeClass('bg-dark');
    $(hot.table).find('tbody tr td').removeClass('text-white');

    // Añadir la clase de resaltado a la fila específica
    $(hot.table).find('tbody tr:eq(' + row + ') td').addClass('bg-dark');
    $(hot.table).find('tbody tr:eq(' + row + ') td').addClass('text-white');
}

$(document).ready(async function () {


    audio.addEventListener('timeupdate', function () {
        var newPosition = audio.currentTime / audio.duration * 100;
        $('#range_song').val(newPosition);
        $('#label_current_time').text(audioFormat(audio.currentTime));
        $('#label_max_time').text(audioFormat(audio.duration));
    });

    // Update position slider and stop audio when it ends
    audio.addEventListener('ended', function () {
        stop()
        songActual++
        play()

    });


    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
    }, 1000)

    await getFilesStart()

    $('#btn_previous').click(function () {
        stop()
        songActual--
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
        songActual++
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


    $('#btn_repeat').click(function () { })
    $('#btn_shuffle').click(function () { })
    $('#btn_search').click(function () { })
    $('#input_search').change(function () { })
    $('#btn_add_library').click(function () { })
    $('#btn_add_firend').click(function () { })
    $('#btn_share_library').click(function () { })
    $('#btn_add_playlist').click(function () { })
    $('#btn_add_folder').click(function () { })
    $('#btn_back').click(function () { })
    $('#btn_next_songs').click(function () { })
    $('#btn_view_list').click(function () { })
    $('#btn_view_icons').click(function () { })
    $('#btn_configure').click(function () { })
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
    $('#btn_favourite').click(function () { })
    $('#btn_ban').click(function () { })


    $(document.body).on('click', '.item_library', function () {
        let value = $(this).attr('element')
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

    $(document.body).on('click', '.song_play', function () {
        stop()
        songActual = $(this).attr('id')
        play()
    })




})

